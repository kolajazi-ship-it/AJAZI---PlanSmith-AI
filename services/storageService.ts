const DB_NAME = 'PlanSmithDB';
const STORE_NAME = 'templates'; // Keeping store name for backward compatibility
const DB_VERSION = 3;

export type LibraryItemType = 'template' | 'resource';

export interface LibraryItemMetadata {
  id: string;
  name: string;
  type: LibraryItemType;
  createdAt: Date;
}

// Internal interface for what we actually store in IDB
interface IDBStoredRecord {
    id: string;
    name: string;
    type?: LibraryItemType; // Optional for backward compat (undefined = template)
    dataUrl?: string; // For files
    content?: string; // For text resources
    createdAt: Date;
}

// Event Bus for Data Synchronization
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToUpdates = (listener: Listener): () => void => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyUpdates = () => {
  listeners.forEach(l => l());
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
        reject("Your browser does not support saving data.");
        return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
        console.error("IDB Open Error:", (event.target as any).error);
        reject("Failed to open database");
    };
    
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Helper to convert File to Data URL string
const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Helper to convert Data URL string back to File
const dataUrlToFile = (dataUrl: string, filename: string): File => {
    try {
        const arr = dataUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'text/plain';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    } catch (e) {
        console.error("Error reconstructing file from storage:", e);
        return new File([""], filename, {type: 'text/plain'});
    }
};

export const saveTemplate = async (file: File): Promise<LibraryItemMetadata> => {
  try {
    const db = await openDB();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const dataUrl = await fileToDataUrl(file);

    const record: IDBStoredRecord = {
      id,
      name: file.name,
      type: 'template',
      dataUrl: dataUrl,
      createdAt: new Date()
    };

    return saveRecordToDB(db, record);
  } catch (error) {
    console.error("Storage Service Error:", error);
    throw error;
  }
};

export const saveResource = async (name: string, content: string): Promise<LibraryItemMetadata> => {
    try {
      const db = await openDB();
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
      const record: IDBStoredRecord = {
        id,
        name,
        type: 'resource',
        content: content,
        createdAt: new Date()
      };
  
      return saveRecordToDB(db, record);
    } catch (error) {
      console.error("Storage Service Error:", error);
      throw error;
    }
};

const saveRecordToDB = (db: IDBDatabase, record: IDBStoredRecord): Promise<LibraryItemMetadata> => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        
        const request = store.put(record);
        
        request.onsuccess = () => {
          notifyUpdates(); 
          resolve({
              id: record.id,
              name: record.name,
              type: record.type || 'template',
              createdAt: record.createdAt
          });
        };
        
        request.onerror = (e) => {
            const error = (e.target as any).error;
            if (error.name === 'QuotaExceededError') {
                reject("Storage limit reached. Please delete old items.");
            } else {
                reject("Failed to save to database.");
            }
        };
      });
}

/**
 * Returns metadata for the list view.
 */
export const getLibraryItems = async (type: LibraryItemType): Promise<LibraryItemMetadata[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.openCursor();
      
      const results: LibraryItemMetadata[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
            const record = cursor.value as IDBStoredRecord;
            // Handle backward compatibility where type might be undefined (assume template)
            const recordType = record.type || 'template';
            
            if (recordType === type) {
                results.push({
                    id: record.id,
                    name: record.name,
                    type: recordType,
                    createdAt: record.createdAt
                });
            }
            cursor.continue();
        } else {
            results.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
            resolve(results);
        }
      };
      
      request.onerror = () => reject("Failed to fetch items");
    });
  } catch (error) {
    console.error("Storage Error:", error);
    return [];
  }
};

/**
 * Fetches the full content (File for templates, string for resources)
 */
export const getLibraryItemContent = async (id: string): Promise<File | string> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            const record = request.result as IDBStoredRecord;
            if (record) {
                if (record.type === 'resource' || (!record.type && !record.dataUrl && (record as any).content)) {
                    resolve(record.content || '');
                } else {
                    // It's a file/template
                    if (record.dataUrl) {
                        resolve(dataUrlToFile(record.dataUrl, record.name));
                    } else if ((record as any).file) {
                        resolve((record as any).file);
                    } else {
                        reject(new Error("File data corrupted"));
                    }
                }
            } else {
                reject(new Error("Item not found"));
            }
        };
        request.onerror = () => reject(new Error("Failed to load item"));
    });
};

export const deleteItem = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        notifyUpdates();
        resolve();
      };
      request.onerror = () => reject("Failed to delete item");
    });
  } catch (error) {
    console.error("Storage Error:", error);
    throw error;
  }
};

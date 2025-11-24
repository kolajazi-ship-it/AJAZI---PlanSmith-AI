import React, { useEffect, useState } from 'react';
import { X, BookOpen, Trash2, FileText, FileType, File, Loader2, Quote, Scroll } from 'lucide-react';
import { getLibraryItems, deleteItem, subscribeToUpdates, LibraryItemMetadata, getLibraryItemContent, LibraryItemType } from '../services/storageService';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: any) => void; // Can be File or string
  category: LibraryItemType; // 'template' or 'resource'
}

export const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, onSelect, category }) => {
  const [items, setItems] = useState<LibraryItemMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        loadLibrary();
    }
    const unsubscribe = subscribeToUpdates(() => {
        if (isOpen) loadLibrary();
    });
    return () => unsubscribe();
  }, [isOpen, category]);

  const loadLibrary = async () => {
    setLoading(true);
    try {
        const data = await getLibraryItems(category);
        setItems(data);
    } catch (e) {
        console.error("Failed to load library", e);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const itemType = category === 'template' ? 'document' : 'resource';
    if (confirm(`Are you sure you wish to remove this ${itemType} from your library?`)) {
      await deleteItem(id);
      if (loadingId === id) setLoadingId(null);
      // Manually trigger reload if not handled by subscription for immediate UI feedback in some browsers
      loadLibrary();
    }
  };

  const handleSelect = async (id: string) => {
    setLoadingId(id);
    try {
        const content = await getLibraryItemContent(id);
        onSelect(content);
        onClose();
    } catch (error) {
        alert("Failed to load item. It may be corrupted.");
        console.error(error);
    } finally {
        setLoadingId(null);
    }
  };

  const getIcon = (fileName: string) => {
    if (category === 'resource') return <Quote className="w-5 h-5 text-[#5d4037]" />;
    
    if (fileName.endsWith('.pdf')) return <FileType className="w-5 h-5 text-[#8d6e63]" />;
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return <FileText className="w-5 h-5 text-[#5d4037]" />;
    return <File className="w-5 h-5 text-[#a1887f]" />;
  };

  const formatDate = (date: Date) => {
    if (!date || isNaN(new Date(date).getTime())) return '';
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!isOpen) return null;

  const title = category === 'template' ? 'My Library' : 'Saved Resources';
  const subTitle = category === 'template' ? 'Select a saved template' : 'Select saved resources';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3e2723]/70 backdrop-blur-sm animate-fade-in font-serif">
      <div className="bg-[#f9f7f1] w-full max-w-3xl rounded-lg shadow-2xl border-4 border-[#8d6e63] relative flex flex-col max-h-[85vh] animate-slide-up">
        
        {/* Header */}
        <div className="bg-[#efebe9] border-b-2 border-[#d7ccc8] p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-[#5d4037] rounded border border-[#d4af37] shadow-inner">
                {category === 'template' ? <BookOpen className="w-6 h-6 text-[#fff8e1]" /> : <Scroll className="w-6 h-6 text-[#fff8e1]" />}
             </div>
             <div>
                <h2 className="text-xl font-bold text-[#3e2723] tracking-wide">{title}</h2>
                <p className="text-xs text-[#8d6e63] italic">{subTitle}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8d6e63] hover:text-[#5d4037] hover:bg-[#d7ccc8] p-2 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 bg-[#fffbf5] custom-scrollbar">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-40 text-[#a1887f]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4037] mb-2"></div>
                    <p className="italic">Loading library...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-[#d7ccc8] rounded-lg bg-[#fdfbf7] p-8">
                    <div className="p-4 bg-[#efebe9] rounded-full mb-4">
                        {category === 'template' ? <BookOpen className="w-8 h-8 text-[#d7ccc8]" /> : <Scroll className="w-8 h-8 text-[#d7ccc8]" />}
                    </div>
                    <h3 className="text-lg font-bold text-[#5d4037] mb-1">Your Library is Empty</h3>
                    <p className="text-[#8d6e63] text-sm max-w-md italic">
                        {category === 'template' 
                            ? 'Upload a document and click "Archive" to save it here.' 
                            : 'Type your resources in the lesson form and click "Archive" to save them here.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {items.map((item) => (
                        <div 
                            key={item.id}
                            className="group flex items-center justify-between p-4 bg-[#fff] border border-[#e0d8c8] rounded hover:border-[#8d6e63] hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => handleSelect(item.id)}
                        >
                            <div className="flex items-center space-x-4 min-w-0">
                                <div className="flex-shrink-0 p-3 bg-[#efebe9] group-hover:bg-[#d7ccc8] rounded transition-colors border border-[#d7ccc8]">
                                    {loadingId === item.id ? (
                                        <Loader2 className="w-5 h-5 text-[#5d4037] animate-spin" />
                                    ) : (
                                        getIcon(item.name)
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-base font-bold text-[#3e2723] truncate group-hover:text-[#1b110e] transition-colors">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-[#8d6e63] italic">
                                        Saved on {formatDate(item.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pl-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleSelect(item.id); }}
                                    disabled={loadingId !== null}
                                    className="px-3 py-1.5 bg-[#efebe9] text-[#5d4037] text-xs font-bold uppercase tracking-wider rounded border border-[#d7ccc8] hover:bg-[#8d6e63] hover:text-white hover:border-[#5d4037] transition-colors disabled:opacity-50"
                                >
                                    Load
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(e, item.id)}
                                    disabled={loadingId !== null}
                                    className="p-2 text-[#a1887f] hover:text-[#b71c1c] hover:bg-[#ffcdd2] rounded transition-colors disabled:opacity-50"
                                    title="Remove from Library"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-[#efebe9] p-4 rounded-b-lg border-t border-[#d7ccc8] flex justify-between items-center text-xs text-[#8d6e63] italic">
            <span>{items.length} {category === 'template' ? 'template' : 'item'}{items.length !== 1 ? 's' : ''} saved</span>
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-[#5d4037] text-[#fff8e1] rounded font-bold hover:bg-[#3e2723] transition-colors shadow-sm not-italic"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
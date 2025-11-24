import React, { useState, useEffect } from 'react';
import { BookOpen, Save, X, Quote } from 'lucide-react';
import { saveResource, getLibraryItems, getLibraryItemContent } from '../services/storageService';
import { LibraryModal } from './LibraryModal';

interface ResourcesInputProps {
  value: string;
  onChange: (value: string) => void;
  // Optional subject/topic to auto-suggest names for archiving
  contextLabel?: string; 
}

export const ResourcesInput: React.FC<ResourcesInputProps> = ({ value, onChange, contextLabel }) => {
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [resourceName, setResourceName] = useState('');
  const [showResourceLibrary, setShowResourceLibrary] = useState(false);

  // Auto-load most recent resource if input is empty
  useEffect(() => {
    const initLoad = async () => {
        if (value) return; // Do not overwrite if parent already provided value (e.g. from a reset or different state)
        
        try {
            const items = await getLibraryItems('resource');
            if (items.length > 0) {
                const content = await getLibraryItemContent(items[0].id);
                if (typeof content === 'string' && content.trim().length > 0) {
                    onChange(content);
                }
            }
        } catch (e) {
            console.error("Failed to auto-load resources", e);
        }
    };
    initLoad();
  }, []); // Run only on mount

  const handleSaveResourceClick = () => {
    if (!value.trim()) {
        alert("Please enter some resources before archiving.");
        return;
    }
    setShowSaveInput(true);
    // Auto-generate a name if provided
    if (!resourceName && contextLabel) {
        setResourceName(contextLabel);
    } else if (!resourceName) {
        setResourceName("Untitled Resources");
    }
  };

  const confirmSaveResource = async () => {
    if (!resourceName.trim()) return;
    try {
        await saveResource(resourceName, value);
        setShowSaveInput(false);
        alert("Manuscript archived successfully.");
    } catch (e) {
        alert("Failed to archive: " + e);
    }
  };

  const handleLoadResource = (content: string) => {
      onChange(content);
  };

  const inputClasses = "w-full px-4 py-3 rounded bg-[#fdfbf7] border border-[#d7ccc8] focus:bg-[#fff] focus:border-[#8d6e63] focus:ring-1 focus:ring-[#8d6e63] outline-none transition-all placeholder:text-[#bcaaa4] text-sm font-serif text-[#3e2723] shadow-sm";

  return (
    <div className="font-serif">
        <div className="flex justify-between items-end mb-2">
            <label className="text-xs font-bold text-[#5d4037] uppercase tracking-widest flex items-center font-serif">
                <Quote className="w-3 h-3 mr-2" />
                Resources & Manuscripts
            </label>
            <div className="flex space-x-2">
                 <button 
                    type="button"
                    onClick={() => setShowResourceLibrary(true)}
                    className="flex items-center text-[10px] font-bold bg-[#efebe9] text-[#5d4037] px-2 py-1 rounded border border-[#d7ccc8] hover:bg-[#8d6e63] hover:text-[#fff8e1] transition-colors"
                 >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Load
                 </button>
                 <button 
                    type="button"
                    onClick={handleSaveResourceClick}
                    className="flex items-center text-[10px] font-bold bg-[#efebe9] text-[#5d4037] px-2 py-1 rounded border border-[#d7ccc8] hover:bg-[#8d6e63] hover:text-[#fff8e1] transition-colors"
                 >
                    <Save className="w-3 h-3 mr-1" />
                    Archive
                 </button>
            </div>
        </div>

        {/* Save Naming Input */}
        {showSaveInput && (
            <div className="mb-3 p-2 bg-[#fff8e1] border border-[#d4af37] rounded flex items-center space-x-2 animate-fade-in">
                <input 
                    type="text" 
                    value={resourceName} 
                    onChange={(e) => setResourceName(e.target.value)}
                    placeholder="Name this manuscript..." 
                    className="flex-grow px-2 py-1 text-sm border border-[#d7ccc8] rounded focus:outline-none focus:border-[#8d6e63]"
                    autoFocus
                />
                <button 
                    type="button" 
                    onClick={confirmSaveResource}
                    className="bg-[#5d4037] text-[#fff8e1] text-xs px-3 py-1.5 rounded font-bold hover:bg-[#3e2723]"
                >
                    Save
                </button>
                <button 
                    type="button" 
                    onClick={() => setShowSaveInput(false)}
                    className="p-1 text-[#8d6e63] hover:bg-[#d7ccc8] rounded"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}

        <textarea
          rows={6}
          placeholder="Paste URL scrolls or text content here to source your lesson..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} resize-none`}
        />

        <LibraryModal 
            isOpen={showResourceLibrary} 
            onClose={() => setShowResourceLibrary(false)} 
            category="resource"
            onSelect={(content: any) => {
                if (typeof content === 'string') {
                    handleLoadResource(content);
                }
            }}
        />
    </div>
  );
};

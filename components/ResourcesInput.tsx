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
        if (value) return; 
        
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
  }, []); 

  const handleSaveResourceClick = () => {
    if (!value.trim()) {
        alert("Please enter some resources before archiving.");
        return;
    }
    setShowSaveInput(true);
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

  const inputClasses = "w-full px-4 py-3 rounded bg-[#f1f5f9] border border-[#cbd5e1] focus:bg-[#ffffff] focus:border-[#475569] focus:ring-1 focus:ring-[#475569] outline-none transition-all placeholder:text-[#94a3b8] text-sm font-serif text-[#0f172a] shadow-sm";

  return (
    <div className="font-serif">
        <div className="flex justify-between items-end mb-2">
            <label className="text-xs font-bold text-[#334155] uppercase tracking-widest flex items-center font-serif">
                <Quote className="w-3 h-3 mr-2" />
                Resources & Manuscripts
            </label>
            <div className="flex space-x-2">
                 <button 
                    type="button"
                    onClick={() => setShowResourceLibrary(true)}
                    className="flex items-center text-[10px] font-bold bg-[#e2e8f0] text-[#334155] px-2 py-1 rounded border border-[#cbd5e1] hover:bg-[#334155] hover:text-[#f1f5f9] transition-colors"
                 >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Load
                 </button>
                 <button 
                    type="button"
                    onClick={handleSaveResourceClick}
                    className="flex items-center text-[10px] font-bold bg-[#e2e8f0] text-[#334155] px-2 py-1 rounded border border-[#cbd5e1] hover:bg-[#334155] hover:text-[#f1f5f9] transition-colors"
                 >
                    <Save className="w-3 h-3 mr-1" />
                    Archive
                 </button>
            </div>
        </div>

        {/* Save Naming Input */}
        {showSaveInput && (
            <div className="mb-3 p-2 bg-[#e0f2fe] border border-[#0ea5e9] rounded flex items-center space-x-2 animate-fade-in">
                <input 
                    type="text" 
                    value={resourceName} 
                    onChange={(e) => setResourceName(e.target.value)}
                    placeholder="Name this manuscript..." 
                    className="flex-grow px-2 py-1 text-sm border border-[#cbd5e1] rounded focus:outline-none focus:border-[#475569]"
                    autoFocus
                />
                <button 
                    type="button" 
                    onClick={confirmSaveResource}
                    className="bg-[#1e40af] text-[#f1f5f9] text-xs px-3 py-1.5 rounded font-bold hover:bg-[#1e3a8a]"
                >
                    Save
                </button>
                <button 
                    type="button" 
                    onClick={() => setShowSaveInput(false)}
                    className="p-1 text-[#64748b] hover:bg-[#cbd5e1] rounded"
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
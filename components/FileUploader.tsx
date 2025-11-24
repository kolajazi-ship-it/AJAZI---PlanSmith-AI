import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FileText, X, FileType, Save, CheckCircle, File, FileCode, RefreshCw, BookOpen } from 'lucide-react';
import { saveTemplate, getLibraryItems, getLibraryItemContent } from '../services/storageService';
import { LibraryModal } from './LibraryModal';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ selectedFile, onFileSelect, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  
  // Track if we have performed the initial auto-load
  const hasAutoLoaded = useRef(false);

  // Load templates on mount ONLY for auto-loading the latest one
  useEffect(() => {
    const initLoad = async () => {
        const templates = await getLibraryItems('template');

        // Auto-load logic: if no file selected and templates exist, load the most recent one
        if (!hasAutoLoaded.current && templates.length > 0 && !selectedFile) {
            hasAutoLoaded.current = true;
            handleAutoLoad(templates[0].id);
        }
    };

    initLoad();
  }, []); // Run once on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
      setJustSaved(false); // Reset saved state for new file
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSaveToLibrary = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    try {
      await saveTemplate(selectedFile);
      setJustSaved(true);
    } catch (error) {
      console.error("Failed to save", error);
      alert("Could not save template. " + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoLoad = async (id: string) => {
    try {
        const file = await getLibraryItemContent(id);
        // Relaxed check: Accept if it looks like a file (has name) or is a File instance
        if (file && typeof file !== 'string') {
            onFileSelect(file as File);
            setJustSaved(true); 
        }
    } catch (error) {
        console.error("Error auto-loading template", error);
    }
  };

  const handleLibrarySelect = (file: any) => {
    // Relaxed check to ensure we accept the file object from storage
    if (file && typeof file !== 'string') {
        onFileSelect(file as File);
        setJustSaved(true);
    }
  };

  const getFileIcon = (fileName: string) => {
      if (fileName.endsWith('.pdf')) return <FileType className="w-8 h-8 text-[#8d6e63]" />;
      if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return <FileText className="w-8 h-8 text-[#5d4037]" />;
      if (fileName.endsWith('.html') || fileName.endsWith('.htm')) return <FileCode className="w-8 h-8 text-[#5d4037]" />;
      return <File className="w-8 h-8 text-[#a1887f]" />;
  };

  return (
    <div className="w-full space-y-6 font-serif">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.txt,.html,.htm"
        className="hidden"
      />

      {/* Main Upload / Selected State */}
      {!selectedFile ? (
        <div 
          className="relative border-2 border-dashed border-[#a1887f] bg-[#fdfbf7] rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all group overflow-hidden hover:border-[#5d4037] hover:bg-[#f9fbe7]"
        >
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#a1887f]"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#a1887f]"></div>

            {/* Clickable Area for File Selection */}
            <div onClick={triggerSelect} className="cursor-pointer w-full flex flex-col items-center relative z-10">
                <div className="relative z-10 p-4 bg-[#efebe9] rounded-full shadow-inner mb-4 group-hover:scale-105 transition-transform duration-300 border border-[#d7ccc8]">
                    <UploadCloud className="w-8 h-8 text-[#5d4037]" />
                </div>
                <h3 className="relative z-10 text-[#3e2723] font-bold text-lg mb-1 group-hover:text-[#1b110e]">Tap to Select Document</h3>
                <p className="relative z-10 text-[#8d6e63] text-xs italic">
                    Accepts .docx, .pdf, .txt, .html
                </p>
            </div>

            {/* Divider and Library Button */}
            <div className="relative z-10 w-full max-w-xs my-4 flex items-center gap-3">
               <div className="h-px bg-[#d7ccc8] flex-1"></div>
               <span className="text-[#a1887f] text-xs italic font-serif">or</span>
               <div className="h-px bg-[#d7ccc8] flex-1"></div>
            </div>

            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowLibrary(true);
                }}
                className="relative z-10 flex items-center px-5 py-2.5 bg-[#fffbf5] border border-[#d7ccc8] rounded-full text-[#5d4037] text-sm font-bold shadow-sm hover:bg-[#8d6e63] hover:text-[#fff8e1] hover:border-[#5d4037] transition-all active:scale-95 group/btn"
            >
                <BookOpen className="w-4 h-4 mr-2 group-hover/btn:text-[#fff8e1] text-[#a1887f] transition-colors" />
                Add from My Library
            </button>
        </div>
      ) : (
        <div className="bg-[#fdfbf7] border border-[#d7ccc8] rounded-lg p-5 shadow-md relative animate-fade-in">
             <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start space-x-4 overflow-hidden">
                    <div className="flex-shrink-0 p-2 bg-[#efebe9] rounded border border-[#d7ccc8] shadow-sm">
                        {getFileIcon(selectedFile.name)}
                    </div>
                    <div className="min-w-0 pt-1">
                        <p className="text-sm font-bold text-[#3e2723] truncate font-serif">{selectedFile.name}</p>
                        <p className="text-xs text-[#8d6e63] mb-2 font-serif italic">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        
                        <div className="flex space-x-3">
                            {justSaved ? (
                                <span className="inline-flex items-center text-[10px] font-bold text-[#33691e] bg-[#dcedc8] px-2 py-1 rounded border border-[#aed581]">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    ARCHIVED
                                </span>
                            ) : (
                                <button 
                                    onClick={handleSaveToLibrary}
                                    disabled={isSaving}
                                    className="inline-flex items-center text-[11px] font-bold text-[#5d4037] hover:text-[#3e2723] hover:underline decoration-[#a1887f] underline-offset-2 transition-all"
                                >
                                    <Save className="w-3 h-3 mr-1" />
                                    {isSaving ? 'Archiving...' : 'Archive to Library'}
                                </button>
                            )}

                            {/* Option to replace file easily */}
                            <button 
                                onClick={triggerSelect}
                                className="inline-flex items-center text-[11px] font-bold text-[#5d4037] hover:text-[#3e2723] hover:underline decoration-[#a1887f] underline-offset-2 transition-all"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Replace
                            </button>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClear}
                    className="p-1.5 hover:bg-[#efebe9] rounded text-[#a1887f] hover:text-[#d32f2f] transition-all border border-transparent hover:border-[#d7ccc8]"
                    title="Remove file"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}

      <LibraryModal 
        isOpen={showLibrary} 
        onClose={() => setShowLibrary(false)} 
        onSelect={handleLibrarySelect}
        category="template"
      />
    </div>
  );
};
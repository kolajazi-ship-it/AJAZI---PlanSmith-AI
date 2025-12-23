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
  
  const hasAutoLoaded = useRef(false);

  useEffect(() => {
    const initLoad = async () => {
        const templates = await getLibraryItems('template');

        if (!hasAutoLoaded.current && templates.length > 0 && !selectedFile) {
            hasAutoLoaded.current = true;
            handleAutoLoad(templates[0].id);
        }
    };

    initLoad();
  }, []); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
      setJustSaved(false); 
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
        if (file && typeof file !== 'string') {
            onFileSelect(file as File);
            setJustSaved(true); 
        }
    } catch (error) {
        console.error("Error auto-loading template", error);
    }
  };

  const handleLibrarySelect = (file: any) => {
    if (file && typeof file !== 'string') {
        onFileSelect(file as File);
        setJustSaved(true);
    }
  };

  const getFileIcon = (fileName: string) => {
      if (fileName.endsWith('.pdf')) return <FileType className="w-8 h-8 text-[#475569]" />;
      if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return <FileText className="w-8 h-8 text-[#1e293b]" />;
      if (fileName.endsWith('.html') || fileName.endsWith('.htm')) return <FileCode className="w-8 h-8 text-[#1e293b]" />;
      return <File className="w-8 h-8 text-[#64748b]" />;
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
          className="relative border-2 border-dashed border-[#94a3b8] bg-[#f8fafc] rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all group overflow-hidden hover:border-[#1e293b] hover:bg-[#f1f5f9]"
        >
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#94a3b8]"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#94a3b8]"></div>

            {/* Clickable Area for File Selection */}
            <div onClick={triggerSelect} className="cursor-pointer w-full flex flex-col items-center relative z-10">
                <div className="relative z-10 p-4 bg-[#e2e8f0] rounded-full shadow-inner mb-4 group-hover:scale-105 transition-transform duration-300 border border-[#cbd5e1]">
                    <UploadCloud className="w-8 h-8 text-[#334155]" />
                </div>
                <h3 className="relative z-10 text-[#0f172a] font-bold text-lg mb-1 group-hover:text-[#0f172a]">Tap to Select Document</h3>
                <p className="relative z-10 text-[#64748b] text-xs italic">
                    Accepts .docx, .pdf, .txt, .html
                </p>
            </div>

            {/* Divider and Library Button */}
            <div className="relative z-10 w-full max-w-xs my-4 flex items-center gap-3">
               <div className="h-px bg-[#cbd5e1] flex-1"></div>
               <span className="text-[#64748b] text-xs italic font-serif">or</span>
               <div className="h-px bg-[#cbd5e1] flex-1"></div>
            </div>

            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setShowLibrary(true);
                }}
                className="relative z-10 flex items-center px-5 py-2.5 bg-white border border-[#cbd5e1] rounded-full text-[#334155] text-sm font-bold shadow-sm hover:bg-[#1e293b] hover:text-white hover:border-[#1e293b] transition-all active:scale-95 group/btn"
            >
                <BookOpen className="w-4 h-4 mr-2 group-hover/btn:text-white text-[#64748b] transition-colors" />
                Add from My Library
            </button>
        </div>
      ) : (
        <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-5 shadow-md relative animate-fade-in">
             {/* Subtle texture for marine feel */}
             <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start space-x-4 overflow-hidden">
                    <div className="flex-shrink-0 p-2 bg-[#e2e8f0] rounded border border-[#cbd5e1] shadow-sm">
                        {getFileIcon(selectedFile.name)}
                    </div>
                    <div className="min-w-0 pt-1">
                        <p className="text-sm font-bold text-[#0f172a] truncate font-serif">{selectedFile.name}</p>
                        <p className="text-xs text-[#64748b] mb-2 font-serif italic">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        
                        <div className="flex space-x-3">
                            {justSaved ? (
                                <span className="inline-flex items-center text-[10px] font-bold text-[#166534] bg-[#dcfce7] px-2 py-1 rounded border border-[#86efac]">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    ARCHIVED
                                </span>
                            ) : (
                                <button 
                                    onClick={handleSaveToLibrary}
                                    disabled={isSaving}
                                    className="inline-flex items-center text-[11px] font-bold text-[#334155] hover:text-[#0f172a] hover:underline decoration-[#64748b] underline-offset-2 transition-all"
                                >
                                    <Save className="w-3 h-3 mr-1" />
                                    {isSaving ? 'Archiving...' : 'Archive to Library'}
                                </button>
                            )}

                            {/* Option to replace file easily */}
                            <button 
                                onClick={triggerSelect}
                                className="inline-flex items-center text-[11px] font-bold text-[#334155] hover:text-[#0f172a] hover:underline decoration-[#64748b] underline-offset-2 transition-all"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Replace
                            </button>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClear}
                    className="p-1.5 hover:bg-[#e2e8f0] rounded text-[#64748b] hover:text-[#ef4444] transition-all border border-transparent hover:border-[#cbd5e1]"
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
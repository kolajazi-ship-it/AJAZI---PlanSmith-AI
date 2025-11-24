import React from 'react';
import { X, BookOpen, UploadCloud, PenTool, Download } from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3e2723]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#f9f7f1] w-full max-w-2xl rounded-lg shadow-2xl border-4 border-[#8d6e63] relative flex flex-col max-h-[90vh] animate-slide-up">
        
        {/* Header */}
        <div className="bg-[#efebe9] border-b-2 border-[#d7ccc8] p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-[#3e2723] rounded border border-[#d4af37]">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-[#3e2723] font-serif tracking-wide">Guide for the Educator</h2>
                <p className="text-xs text-[#8d6e63] font-serif italic">How to utilize the PlanSmith AI</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8d6e63] hover:text-[#5d4037] hover:bg-[#d7ccc8] p-2 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Scroll */}
        <div className="overflow-y-auto p-6 md:p-8 font-serif custom-scrollbar space-y-8">
            <div className="p-4 bg-[#fff8e1] border-l-4 border-[#d4af37] text-[#5d4037] italic text-sm mb-6 rounded-r">
                "To teach is to learn twice. Let this tool assist you in preparing the materials for your students."
            </div>

            <div className="space-y-8 relative">
                {/* Vertical Line Connector */}
                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-[#d7ccc8] z-0"></div>

                {/* Step 1 */}
                <section className="relative z-10 pl-2">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5d4037] border-2 border-[#efebe9] text-[#fff8e1] flex items-center justify-center font-bold text-lg shadow-sm">
                            I
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[#3e2723] mb-2 flex items-center">
                                Upload Your Template
                                <UploadCloud className="w-4 h-4 ml-2 text-[#a1887f]" />
                            </h3>
                            <div className="text-[#4e342e] text-sm leading-relaxed space-y-2">
                                <p>Begin by providing the document required by your district. This ensures the output matches your official format.</p>
                                <ul className="list-disc list-inside bg-[#fffbf5] p-3 rounded border border-[#e0d8c8] text-[#5d4037]">
                                    <li><strong>Word Documents (.docx):</strong> Best for preserving complex tables and formatting.</li>
                                    <li><strong>PDF & Text:</strong> Supported for simpler layouts.</li>
                                </ul>
                                <p className="text-xs italic text-[#8d6e63] pt-1">
                                    <span className="font-bold">Tip:</span> Use the "Archive to Library" button to save frequently used templates for quick access later.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 2 */}
                <section className="relative z-10 pl-2">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5d4037] border-2 border-[#efebe9] text-[#fff8e1] flex items-center justify-center font-bold text-lg shadow-sm">
                            II
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[#3e2723] mb-2 flex items-center">
                                Provide Lesson Details
                                <PenTool className="w-4 h-4 ml-2 text-[#a1887f]" />
                            </h3>
                            <div className="text-[#4e342e] text-sm leading-relaxed space-y-2">
                                <p>Fill in the essential fields to guide the AI generation:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="p-2 bg-[#fffbf5] border border-[#e0d8c8] rounded">
                                        <span className="font-bold text-[#3e2723]">Topic & Grade:</span>
                                        <p className="text-xs text-[#5d4037]">Sets the context and difficulty.</p>
                                    </div>
                                    <div className="p-2 bg-[#fffbf5] border border-[#e0d8c8] rounded">
                                        <span className="font-bold text-[#3e2723]">Resources:</span>
                                        <p className="text-xs text-[#5d4037]">Paste URLs or text. The AI uses this as the source of truth.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section className="relative z-10 pl-2">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5d4037] border-2 border-[#efebe9] text-[#fff8e1] flex items-center justify-center font-bold text-lg shadow-sm">
                            III
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[#3e2723] mb-2 flex items-center">
                                Generate & Export
                                <Download className="w-4 h-4 ml-2 text-[#a1887f]" />
                            </h3>
                            <div className="text-[#4e342e] text-sm leading-relaxed space-y-2">
                                <p>Click <strong>"Compose Lesson Plan"</strong>. The AI will read your template's structure and fill it with content derived from your resources.</p>
                                <p>Once complete, review the "Generated Manuscript" and click <strong>"Export to DOCX"</strong> to download a file ready for editing in Microsoft Word or Google Docs.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        {/* Footer decoration */}
        <div className="bg-[#efebe9] p-4 rounded-b-lg border-t border-[#d7ccc8] flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-[#5d4037] text-[#fff8e1] rounded font-bold hover:bg-[#3e2723] transition-colors shadow-sm text-sm"
            >
                Close Guide
            </button>
        </div>
      </div>
    </div>
  );
};
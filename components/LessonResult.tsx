import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

interface LessonResultProps {
  content: string;
  topic?: string;
  subject?: string;
  unit?: string;
}

export const LessonResult: React.FC<LessonResultProps> = ({ content, topic, subject, unit }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const blob = new Blob([content], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];
    
    navigator.clipboard.write(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadDoc = () => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Lesson Plan</title></head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    // Construct filename: Subject + Unit + Topic
    // e.g., "Algebra 2 Unit 3 Lesson 1 Properties of Exponents.doc"
    const safeSubject = (subject || '').trim();
    const safeUnit = (unit || '').trim();
    const safeTopic = (topic || 'Lesson_Plan').trim();
    
    let baseFilename = `${safeSubject} ${safeUnit} ${safeTopic}`.trim();
    if (!baseFilename) baseFilename = "PlanSmith_Lesson_Plan";

    // Sanitize filename to remove characters invalid in filesystems
    const sanitizedFilename = baseFilename.replace(/[^a-z0-9 \-_]/gi, '').replace(/\s+/g, ' ');

    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizedFilename}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#fdfbf7] rounded shadow-2xl border border-[#d7ccc8] overflow-hidden mb-12">
      {/* Action Toolbar - Classic Header */}
      <div className="bg-[#efebe9] border-b border-[#d7ccc8] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
            <div className="h-8 w-1 bg-[#5d4037] mr-3"></div>
            <h3 className="text-[#3e2723] font-bold text-lg font-serif">The Generated Manuscript</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 font-serif justify-center sm:justify-end">
          <button
            onClick={handleDownloadDoc}
            className="flex items-center px-4 py-2 bg-[#5d4037] text-[#fff8e1] rounded text-sm font-semibold hover:bg-[#4e342e] hover:shadow-md transition-all active:scale-95 border border-[#3e2723]"
          >
            <Download className="w-4 h-4 mr-2" />
            Save as DOCX
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center px-4 py-2 border rounded text-sm font-semibold transition-all duration-200 active:scale-95 ${
              copied 
                ? 'bg-[#dcedc8] border-[#aed581] text-[#33691e]' 
                : 'bg-[#fff] border-[#d7ccc8] text-[#5d4037] hover:bg-[#fff8e1] hover:text-[#3e2723] hover:border-[#8d6e63]'
            }`}
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>

      {/* Document View - Simulated Paper */}
      <div className="bg-[#d7ccc8] p-4 md:p-8 lg:p-10 overflow-x-auto bg-opacity-30">
        <div className="bg-[#fffbf5] shadow-lg border border-[#e0e0e0] mx-auto max-w-[210mm] min-h-[297mm] p-[15mm] md:p-[20mm]">
            <div 
                className="lesson-plan-output"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
      </div>
    </div>
  );
};
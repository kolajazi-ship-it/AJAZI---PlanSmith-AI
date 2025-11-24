import React, { useState } from 'react';
import { BookOpen, Feather } from 'lucide-react';
import { HelpGuide } from './HelpGuide';
import { LibraryModal } from './LibraryModal';
import { LegalModal } from './LegalModal';

interface LayoutProps {
  children: React.ReactNode;
  onTemplateSelect?: (file: File) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onTemplateSelect }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);

  const handleLibrarySelect = (file: any) => {
    if (onTemplateSelect && file instanceof File) {
      onTemplateSelect(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f1] relative">
      
      {/* Decorative Background Header - Light Brown with Gold Touch */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-[#8d6e63] to-[#c5a059] z-0 overflow-hidden border-b-4 border-[#d4af37]">
        {/* Abstract texture/noise */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff8e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Classical curve decoration - darker gold/brown */}
        <div className="absolute bottom-0 left-0 w-full h-16 opacity-20">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0 100 C 30 20 70 20 100 100 Z" fill="#3e2723" />
            </svg>
        </div>
      </div>

      <header className="relative z-10 px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-[#3e2723] rounded-lg border border-[#d4af37] shadow-lg">
            <BookOpen className="w-7 h-7 text-[#d4af37]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[#fff8e1] tracking-wide block leading-none font-serif text-shadow-sm">AJAZI - PlanSmith AI</span>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-px w-8 bg-[#d4af37]"></span>
               <span className="text-[11px] text-[#3e2723] uppercase tracking-widest font-bold bg-[#d4af37]/20 px-1 rounded">Teacher's Edition</span>
            </div>
          </div>
        </div>
        <nav className="flex space-x-6">
          <button 
            onClick={() => setShowHelp(true)}
            className="text-[#3e2723] hover:text-[#fff8e1] text-sm font-medium transition-colors font-serif italic focus:outline-none"
          >
            Help Guide
          </button>
          <button 
            onClick={() => setShowLibrary(true)}
            className="text-[#3e2723] hover:text-[#fff8e1] text-sm font-medium transition-colors font-serif italic flex items-center focus:outline-none"
          >
            <Feather className="w-3 h-3 mr-1" />
            My Library
          </button>
        </nav>
      </header>

      <main className="relative z-10 flex-grow w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <footer className="relative z-10 bg-[#efebe9] border-t border-[#d7ccc8] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center text-[#5d4037] text-sm font-serif">
          <p>&copy; {new Date().getFullYear()} AJAZI - PlanSmith AI. Est. 2025.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 italic">
             <button 
                onClick={() => setLegalType('privacy')}
                className="hover:text-[#3e2723] cursor-pointer transition-colors focus:outline-none"
             >
                Privacy
             </button>
             <button 
                onClick={() => setLegalType('terms')}
                className="hover:text-[#3e2723] cursor-pointer transition-colors focus:outline-none"
             >
                Terms
             </button>
          </div>
        </div>
      </footer>

      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <LibraryModal 
        isOpen={showLibrary} 
        onClose={() => setShowLibrary(false)} 
        onSelect={handleLibrarySelect}
        category="template"
      />
      <LegalModal 
        isOpen={!!legalType} 
        type={legalType || 'privacy'} 
        onClose={() => setLegalType(null)} 
      />
    </div>
  );
};

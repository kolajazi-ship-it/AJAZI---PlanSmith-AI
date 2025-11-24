import React from 'react';
import { X, Shield, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const Icon = isPrivacy ? Shield : Scale;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3e2723]/60 backdrop-blur-sm animate-fade-in font-serif">
      <div className="bg-[#f9f7f1] w-full max-w-2xl rounded-lg shadow-2xl border-4 border-[#8d6e63] relative flex flex-col max-h-[85vh] animate-slide-up">
        
        {/* Header */}
        <div className="bg-[#efebe9] border-b-2 border-[#d7ccc8] p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-[#5d4037] rounded border border-[#d4af37] shadow-inner">
                <Icon className="w-6 h-6 text-[#fff8e1]" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-[#3e2723] tracking-wide">{title}</h2>
                <p className="text-xs text-[#8d6e63] italic">AJAZI - PlanSmith AI Legal Documents</p>
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
        <div className="flex-grow overflow-y-auto p-8 bg-[#fffbf5] custom-scrollbar text-[#3e2723] text-sm leading-relaxed">
            {isPrivacy ? (
                <div className="space-y-6">
                    <p className="font-bold text-[#5d4037]">Last Updated: {new Date().getFullYear()}</p>
                    
                    <section>
                        <h3 className="text-lg font-bold border-b border-[#d7ccc8] pb-1 mb-2 text-[#3e2723]">1. Information Collection</h3>
                        <p>We do not require account registration to use the core features of AJAZI - PlanSmith AI. When you upload lesson plan templates or provide text input:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1 text-[#4e342e]">
                            <li><strong>Temporary Processing:</strong> Your files and inputs are sent securely to Google's Gemini AI for the sole purpose of generating your lesson plan. They are not permanently stored on our servers.</li>
                            <li><strong>Local Storage:</strong> Any templates you save to "My Library" are stored locally on your own device using browser technologies (IndexedDB). We do not have access to these files.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#d7ccc8] pb-1 mb-2 text-[#3e2723]">2. AI Service Providers</h3>
                        <p>This application utilizes Google Gemini API for content generation. By using this service, you acknowledge that your inputs are processed by Google in accordance with their <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[#a1887f] underline hover:text-[#5d4037]">Privacy Policy</a>.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#d7ccc8] pb-1 mb-2 text-[#3e2723]">3. Data Security</h3>
                        <p>We prioritize the security of your data. All transmission between your browser and the AI service is encrypted via HTTPS. However, please do not upload documents containing sensitive Personally Identifiable Information (PII) of students.</p>
                    </section>
                </div>
            ) : (
                 <div className="space-y-6">
                    <p className="font-bold text-[#5d4037]">Effective Date: {new Date().getFullYear()}</p>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#d7ccc8] pb-1 mb-2 text-[#3e2723]">1. Acceptance of Terms</h3>
                        <p>By accessing and using AJAZI - PlanSmith AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#d7ccc8] pb-1 mb-2 text-[#3e2723]">2. Educational Use</h3>
                        <p>This tool is intended to assist educators in drafting lesson plans. It is a support tool, not a replacement for professional judgment.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#d7ccc8] pb-1 mb-2 text-[#3e2723]">3. AI Content Disclaimer</h3>
                        <div className="bg-[#fff8e1] border-l-4 border-[#d4af37] p-3 italic text-[#5d4037]">
                            <p><strong>Important:</strong> The content generated by this application is created by Artificial Intelligence. It may contain inaccuracies, biases, or outdated information.</p>
                        </div>
                        <p className="mt-2">You explicitly agree to review, verify, and edit all generated lesson plans for accuracy, appropriateness, and safety before using them in a classroom setting. AJAZI is not liable for any consequences resulting from the use of unverified AI-generated content.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#d7ccc8] pb-1 mb-2 text-[#3e2723]">4. Limitation of Liability</h3>
                        <p>In no event shall AJAZI or its contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages arising in any way out of the use of this software.</p>
                    </section>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-[#efebe9] p-4 rounded-b-lg border-t border-[#d7ccc8] flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-[#5d4037] text-[#fff8e1] rounded font-bold hover:bg-[#3e2723] transition-colors shadow-sm text-sm border border-[#3e2723]"
            >
                Acknowledge & Close
            </button>
        </div>
      </div>
    </div>
  );
};
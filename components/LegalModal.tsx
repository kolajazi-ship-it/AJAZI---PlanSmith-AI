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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-sm animate-fade-in font-serif">
      <div className="bg-[#f0f4f8] w-full max-w-2xl rounded-lg shadow-2xl border-4 border-[#334155] relative flex flex-col max-h-[85vh] animate-slide-up">
        
        {/* Header */}
        <div className="bg-[#f1f5f9] border-b-2 border-[#cbd5e1] p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-[#1e293b] rounded border border-[#0ea5e9] shadow-inner">
                <Icon className="w-6 h-6 text-[#f1f5f9]" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-[#0f172a] tracking-wide">{title}</h2>
                <p className="text-xs text-[#64748b] italic">AJAZI - PlanSmith AI Legal Documents</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] p-2 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-white custom-scrollbar text-[#0f172a] text-sm leading-relaxed">
            {isPrivacy ? (
                <div className="space-y-6">
                    <p className="font-bold text-[#1e293b]">Last Updated: {new Date().getFullYear()}</p>
                    
                    <section>
                        <h3 className="text-lg font-bold border-b border-[#cbd5e1] pb-1 mb-2 text-[#0f172a]">1. Information Collection</h3>
                        <p>We do not require account registration to use the core features of AJAZI - PlanSmith AI. When you upload lesson plan templates or provide text input:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1 text-[#334155]">
                            <li><strong>Temporary Processing:</strong> Your files and inputs are sent securely to Google's Gemini AI for the sole purpose of generating your lesson plan. They are not permanently stored on our servers.</li>
                            <li><strong>Local Storage:</strong> Any templates you save to "My Library" are stored locally on your own device using browser technologies (IndexedDB). We do not have access to these files.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#cbd5e1] pb-1 mb-2 text-[#0f172a]">2. AI Service Providers</h3>
                        <p>This application utilizes Google Gemini API for content generation. By using this service, you acknowledge that your inputs are processed by Google in accordance with their <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[#64748b] underline hover:text-[#1e293b]">Privacy Policy</a>.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#cbd5e1] pb-1 mb-2 text-[#0f172a]">3. Data Security</h3>
                        <p>We prioritize the security of your data. All transmission between your browser and the AI service is encrypted via HTTPS. However, please do not upload documents containing sensitive Personally Identifiable Information (PII) of students.</p>
                    </section>
                </div>
            ) : (
                 <div className="space-y-6">
                    <p className="font-bold text-[#1e293b]">Effective Date: {new Date().getFullYear()}</p>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#cbd5e1] pb-1 mb-2 text-[#0f172a]">1. Acceptance of Terms</h3>
                        <p>By accessing and using AJAZI - PlanSmith AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#cbd5e1] pb-1 mb-2 text-[#0f172a]">2. Educational Use</h3>
                        <p>This tool is intended to assist educators in drafting lesson plans. It is a support tool, not a replacement for professional judgment.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#cbd5e1] pb-1 mb-2 text-[#0f172a]">3. AI Content Disclaimer</h3>
                        <div className="bg-[#e0f2fe] border-l-4 border-[#0ea5e9] p-3 italic text-[#1e293b]">
                            <p><strong>Important:</strong> The content generated by this application is created by Artificial Intelligence. It may contain inaccuracies, biases, or outdated information.</p>
                        </div>
                        <p className="mt-2">You explicitly agree to review, verify, and edit all generated lesson plans for accuracy, appropriateness, and safety before using them in a classroom setting. AJAZI is not liable for any consequences resulting from the use of unverified AI-generated content.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold border-b border-[#cbd5e1] pb-1 mb-2 text-[#0f172a]">4. Limitation of Liability</h3>
                        <p>In no event shall AJAZI or its contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages arising in any way out of the use of this software.</p>
                    </section>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-[#f1f5f9] p-4 rounded-b-lg border-t border-[#cbd5e1] flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-[#1e293b] text-[#f1f5f9] rounded font-bold hover:bg-[#0f172a] transition-colors shadow-sm text-sm border border-[#0f172a]"
            >
                Acknowledge & Close
            </button>
        </div>
      </div>
    </div>
  );
};
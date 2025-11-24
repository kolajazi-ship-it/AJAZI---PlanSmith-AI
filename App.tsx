import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { FileUploader } from './components/FileUploader';
import { LessonForm } from './components/LessonForm';
import { ResourcesInput } from './components/ResourcesInput';
import { LessonResult } from './components/LessonResult';
import { generateLessonPlan } from './services/geminiService';
import { LessonRequest, LoadingState } from './types';
import { AlertCircle, Scroll, Settings, ArrowRight, Feather } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resources, setResources] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  
  // Track metadata for filename generation
  const [lessonMeta, setLessonMeta] = useState<{ topic: string; subject: string; unit: string }>({ 
    topic: '', 
    subject: '', 
    unit: '' 
  });

  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (request: LessonRequest) => {
    if (!file) {
      setError("Please upload a lesson plan template first.");
      return;
    }

    setLoadingState('loading');
    setError(null);
    setGeneratedContent(null);
    
    // Save details for filename
    setLessonMeta({
        topic: request.topic,
        subject: request.subject,
        unit: request.unit || ''
    });

    try {
      const result = await generateLessonPlan(file, request);
      setGeneratedContent(result);
      setLoadingState('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while generating the plan.");
      setLoadingState('error');
    }
  };

  const reset = () => {
    setFile(null);
    setResources('');
    setGeneratedContent(null);
    setLessonMeta({ topic: '', subject: '', unit: '' });
    setLoadingState('idle');
    setError(null);
  };

  const handleTemplateSelect = (selectedFile: File) => {
    // Reset state and select the new file
    setGeneratedContent(null);
    setError(null);
    setLoadingState('idle');
    setFile(selectedFile);
  };

  // Helper to generate a label for archiving resources based on current form context
  // We can construct this from lessonMeta if available, or pass it dynamically if we lifted all state.
  // For now, simple context or manual naming is fine.
  const resourceContextLabel = lessonMeta.subject && lessonMeta.topic ? `${lessonMeta.subject} - ${lessonMeta.topic}` : '';

  return (
    <Layout onTemplateSelect={handleTemplateSelect}>
      <div className="max-w-6xl mx-auto font-serif">
        
        {/* Hero Text */}
        <div className="text-center mb-12 pt-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[#efebe9] tracking-tight mb-5 drop-shadow-md font-serif">
            Craft the Perfect Lesson Plan
          </h1>
          <div className="flex justify-center mb-6">
            <div className="h-1 w-32 bg-[#8d6e63] rounded-full opacity-60"></div>
          </div>
          <p className="text-xl text-[#d7ccc8] max-w-2xl mx-auto font-serif italic leading-relaxed">
            "Education is the kindling of a flame."<br/>
            <span className="text-base not-italic opacity-90 mt-2 block text-[#efebe9]">Upload your template, provide resources, and let us scribe the details.</span>
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-700 rounded-r-xl p-4 mb-8 flex items-start shadow-sm animate-fade-in">
            <div className="p-2 bg-red-100 rounded-full mr-4 text-red-800">
                <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-900 font-serif">Unable to scribe plan</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Main Workflow */}
        {!generatedContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Step 1: District Info (Template + Resources) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#fffbf5] rounded-tr-3xl rounded-bl-3xl rounded-tl-sm rounded-br-sm shadow-xl border-2 border-[#e0d8c8] overflow-hidden h-full flex flex-col relative">
                {/* Corner decoration */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8d6e63]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8d6e63]"></div>

                <div className="p-6 border-b border-[#e0d8c8] bg-[#f9f5eb] flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3e2723] text-[#ffecb3] font-bold text-xl shadow-md border border-[#5d4037] font-serif">I</div>
                     <h2 className="text-xl font-bold text-[#3e2723] font-serif">District Info</h2>
                   </div>
                   <Scroll className="w-6 h-6 text-[#8d6e63]" />
                </div>
                
                <div className="p-8 flex-grow flex flex-col gap-8">
                  <div>
                    <p className="text-[#5d4037] text-sm mb-4 leading-relaxed italic border-l-2 border-[#d7ccc8] pl-4">
                      Select the parchment (DOCX or PDF) required by your district.
                    </p>
                    <FileUploader 
                        selectedFile={file} 
                        onFileSelect={setFile} 
                        onClear={() => setFile(null)}
                    />
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#d7ccc8] to-transparent w-full"></div>

                  <div>
                     <ResourcesInput 
                        value={resources} 
                        onChange={setResources} 
                        contextLabel={resourceContextLabel}
                     />
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow for Desktop */}
            <div className="hidden lg:flex items-center justify-center lg:col-span-1">
                <div className="p-2 bg-[#3e2723]/40 rounded-full backdrop-blur-sm border border-[#d7ccc8]/30">
                    <ArrowRight className="w-6 h-6 text-[#efebe9]" />
                </div>
            </div>

            {/* Step 2: Details */}
            <div className="lg:col-span-6 flex flex-col">
               <div className="bg-[#fffbf5] rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm shadow-xl border-2 border-[#e0d8c8] overflow-hidden h-full flex flex-col relative">
                 {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8d6e63]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8d6e63]"></div>

                <div className="p-6 border-b border-[#e0d8c8] bg-[#f9f5eb] flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3e2723] text-[#ffecb3] font-bold text-xl shadow-md border border-[#5d4037] font-serif">II</div>
                     <h2 className="text-xl font-bold text-[#3e2723] font-serif">Lesson Details</h2>
                   </div>
                   <Settings className="w-6 h-6 text-[#8d6e63]" />
                </div>

                <div className="p-8 flex-grow">
                   <LessonForm 
                    onSubmit={handleGenerate} 
                    isLoading={loadingState === 'loading'}
                    hasFile={!!file}
                    resources={resources}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="animate-fade-in space-y-6">
             <div className="flex justify-between items-end text-[#efebe9] border-b border-[#8d6e63]/50 pb-4">
                <div>
                    <h2 className="text-3xl font-bold flex items-center font-serif text-[#fff8e1]">
                    <Feather className="w-7 h-7 text-[#d4af37] mr-3" />
                    The Plan is Prepared
                    </h2>
                    <p className="text-[#d7ccc8] text-sm italic mt-1 ml-10">Ready for your review and export.</p>
                </div>
                <button 
                  onClick={reset}
                  className="px-5 py-2 bg-[#5d4037] hover:bg-[#4e342e] rounded border border-[#8d6e63] text-[#efebe9] font-serif text-sm transition-all hover:shadow-lg shadow-md"
                >
                  Create Another
                </button>
             </div>
             <LessonResult 
                content={generatedContent} 
                topic={lessonMeta.topic} 
                subject={lessonMeta.subject}
                unit={lessonMeta.unit}
             />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
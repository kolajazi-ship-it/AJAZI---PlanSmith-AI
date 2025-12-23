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

  const resourceContextLabel = lessonMeta.subject && lessonMeta.topic ? `${lessonMeta.subject} - ${lessonMeta.topic}` : '';

  return (
    <Layout onTemplateSelect={handleTemplateSelect}>
      <div className="max-w-6xl mx-auto font-serif">
        
        {/* Hero Text */}
        <div className="text-center mb-10 pt-2">
          <h1 className="text-4xl md:text-6xl font-bold text-[#f1f5f9] tracking-tight mb-3 drop-shadow-md font-serif">
            Craft the Perfect Lesson Plan
          </h1>
          <div className="flex justify-center mb-4">
            <div className="h-1 w-32 bg-[#38bdf8] rounded-full opacity-60"></div>
          </div>
          <p className="text-2xl text-[#e0f2fe] max-w-3xl mx-auto font-serif italic leading-relaxed drop-shadow-sm font-medium">
            "Education is the kindling of a flame."<br/>
            <span className="text-base not-italic opacity-90 mt-8 block text-[#f8fafc] font-normal">Upload your template, provide resources, and let us scribe the details.</span>
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
              <div className="bg-white rounded-tr-3xl rounded-bl-3xl rounded-tl-sm rounded-br-sm shadow-xl border-2 border-[#cbd5e1] overflow-hidden h-full flex flex-col relative">
                {/* Corner decoration */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#334155]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#334155]"></div>

                <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b] text-[#e0f2fe] font-bold text-xl shadow-md border border-[#475569] font-serif">I</div>
                     <h2 className="text-xl font-bold text-[#0f172a] font-serif">District Info</h2>
                   </div>
                   <Scroll className="w-6 h-6 text-[#475569]" />
                </div>
                
                <div className="p-8 flex-grow flex flex-col gap-8">
                  <div>
                    <p className="text-[#334155] text-sm mb-4 leading-relaxed italic border-l-2 border-[#94a3b8] pl-4">
                      Select the parchment (DOCX or PDF) required by your district.
                    </p>
                    <FileUploader 
                        selectedFile={file} 
                        onFileSelect={setFile} 
                        onClear={() => setFile(null)}
                    />
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#cbd5e1] to-transparent w-full"></div>

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
                <div className="p-2 bg-[#1e293b]/40 rounded-full backdrop-blur-sm border border-[#94a3b8]/30">
                    <ArrowRight className="w-6 h-6 text-[#e0f2fe]" />
                </div>
            </div>

            {/* Step 2: Details */}
            <div className="lg:col-span-6 flex flex-col">
               <div className="bg-white rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm shadow-xl border-2 border-[#cbd5e1] overflow-hidden h-full flex flex-col relative">
                 {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#334155]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#334155]"></div>

                <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b] text-[#e0f2fe] font-bold text-xl shadow-md border border-[#475569] font-serif">II</div>
                     <h2 className="text-xl font-bold text-[#0f172a] font-serif">Lesson Details</h2>
                   </div>
                   <Settings className="w-6 h-6 text-[#475569]" />
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
             <div className="flex justify-between items-end text-[#f1f5f9] border-b border-[#334155]/50 pb-4">
                <div>
                    <h2 className="text-3xl font-bold flex items-center font-serif text-[#f1f5f9]">
                    <Feather className="w-7 h-7 text-[#0ea5e9] mr-3" />
                    The Plan is Prepared
                    </h2>
                    <p className="text-[#e2e8f0] text-sm italic mt-1 ml-10">Ready for your review and export.</p>
                </div>
                <button 
                  onClick={reset}
                  className="px-5 py-2 bg-[#1e293b] hover:bg-[#0f172a] rounded border border-[#475569] text-[#f1f5f9] font-serif text-sm transition-all hover:shadow-lg shadow-md"
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
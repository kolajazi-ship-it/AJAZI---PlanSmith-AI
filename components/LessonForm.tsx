import React, { useState } from 'react';
import { LessonRequest } from '../types';
import { Book, Loader2, PenTool, Hash } from 'lucide-react';

interface LessonFormProps {
  onSubmit: (data: LessonRequest) => void;
  isLoading: boolean;
  hasFile: boolean;
  resources: string;
}

export const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, isLoading, hasFile, resources }) => {
  const [formData, setFormData] = useState<Omit<LessonRequest, 'resources'>>({
    topic: '',
    gradeLevel: '',
    subject: '',
    unit: '',
    additionalInstructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine local form data with the passed-in resources prop
    onSubmit({
        ...formData,
        resources: resources
    });
  };

  const inputClasses = "w-full px-4 py-3 rounded bg-[#fdfbf7] border border-[#d7ccc8] focus:bg-[#fff] focus:border-[#8d6e63] focus:ring-1 focus:ring-[#8d6e63] outline-none transition-all placeholder:text-[#bcaaa4] text-sm font-serif text-[#3e2723] shadow-sm";
  const labelClasses = "text-xs font-bold text-[#5d4037] uppercase tracking-widest mb-2 flex items-center font-serif";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-serif">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>
            Subject
          </label>
          <input
            type="text"
            name="subject"
            required
            placeholder="e.g. Algebra 2"
            value={formData.subject}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>
            Grade Level
          </label>
          <input
            type="text"
            name="gradeLevel"
            required
            placeholder="e.g. 10th Grade"
            value={formData.gradeLevel}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
          <label className={labelClasses}>
            Unit / Module <span className="text-[#a1887f] ml-1 normal-case italic">(Optional)</span>
          </label>
          <div className="relative">
             <Hash className="absolute top-3.5 left-4 w-4 h-4 text-[#a1887f]" />
             <input
                type="text"
                name="unit"
                placeholder="e.g. Unit 3 Lesson 1"
                value={formData.unit}
                onChange={handleChange}
                className={`${inputClasses} pl-12`}
             />
          </div>
      </div>

      <div>
        <label className={labelClasses}>
          Lesson Topic
        </label>
        <div className="relative">
            <Book className="absolute top-3.5 left-4 w-5 h-5 text-[#a1887f]" />
            <input
            type="text"
            name="topic"
            required
            placeholder="e.g. Properties of Exponents"
            value={formData.topic}
            onChange={handleChange}
            className={`${inputClasses} pl-12`}
            />
        </div>
      </div>

      <div>
         <label className={labelClasses}>
          Scribe's Instructions <span className="text-[#a1887f] ml-1 normal-case italic">(Optional)</span>
        </label>
        <textarea
          name="additionalInstructions"
          rows={3}
          placeholder="Any specific requirements, standards, or rubrics to follow..."
          value={formData.additionalInstructions}
          onChange={handleChange}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="pt-2">
        <button
            type="submit"
            disabled={isLoading || !hasFile}
            className={`w-full py-4 px-6 rounded font-bold text-[#fff8e1] shadow-md border border-[#3e2723] flex items-center justify-center transition-all duration-300
            ${isLoading || !hasFile 
                ? 'bg-[#d7ccc8] cursor-not-allowed shadow-none border-transparent text-[#efebe9]' 
                : 'bg-gradient-to-b from-[#5d4037] to-[#3e2723] hover:from-[#6d4c41] hover:to-[#4e342e] hover:shadow-lg active:translate-y-0.5'
            }`}
        >
            {isLoading ? (
            <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                <span className="tracking-wide">Consulting the Archives...</span>
            </>
            ) : (
            <>
                <PenTool className="w-5 h-5 mr-3" />
                <span className="tracking-wide uppercase">Compose Lesson Plan</span>
            </>
            )}
        </button>
        {!hasFile && (
            <p className="text-center text-xs text-[#b71c1c] font-semibold mt-3 font-sans bg-[#ffcdd2]/30 py-1 rounded">
            * A template must be selected in Part I.
            </p>
        )}
      </div>
    </form>
  );
};
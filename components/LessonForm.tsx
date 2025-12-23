import React, { useState } from 'react';
import { LessonRequest } from '../types';
import { Book, Loader2, PenTool, Hash, Layers, GraduationCap, ChevronDown } from 'lucide-react';

interface LessonFormProps {
  onSubmit: (data: LessonRequest) => void;
  isLoading: boolean;
  hasFile: boolean;
  resources: string;
}

// Data definitions
const DEPARTMENTS: Record<string, string[]> = {
  "Mathematics": [
    "Algebra 1", "Algebra 2", "Geometry", "Pre-Algebra", 
    "Pre-Calculus", "Calculus", "Statistics", "Trigonometry", 
    "Integrated Math I", "Integrated Math II", "Integrated Math III",
    "6th Grade Math", "7th Grade Math", "8th Grade Math", "Financial Literacy"
  ],
  "Science": [
    "Biology", "Chemistry", "Physics", "Earth Science", 
    "Environmental Science", "Astronomy", "Anatomy & Physiology", 
    "Physical Science", "Life Science", "Forensic Science"
  ],
  "English Language Arts": [
    "English 1", "English 2", "English 3", "English 4", 
    "American Literature", "British Literature", "World Literature", 
    "Creative Writing", "Journalism", "AP English Language", "AP English Literature"
  ],
  "Social Studies": [
    "World History", "US History", "European History", 
    "Civics / Government", "Economics", "Geography", 
    "Psychology", "Sociology", "Anthropology"
  ],
  "World Languages": [
    "Spanish", "French", "German", "Mandarin Chinese", 
    "Latin", "Japanese", "American Sign Language (ASL)", "Italian"
  ],
  "Fine Arts": [
    "Art History", "Studio Art", "Band", "Choir", 
    "Orchestra", "Theater / Drama", "Music Theory", "Digital Arts"
  ],
  "CTE (Career & Tech)": [
    "Business Management", "Computer Science", "Engineering", 
    "Health Science", "Marketing", "Family & Consumer Science", 
    "Agriculture", "Automotive Technology"
  ],
  "PE & Health": [
    "Physical Education", "Health", "Nutrition", "Sports Medicine"
  ],
  "Special Education": [
    "Life Skills", "Resource Room", "Inclusion Support", "Social Skills"
  ],
  "Other": [
    "General Education", "Library / Media", "Study Skills", "Advisory"
  ]
};

const GRADES = [
  "Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", 
  "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", 
  "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Higher Ed / Adult"
];

const UNITS = Array.from({ length: 20 }, (_, i) => `Unit ${i + 1}`)
  .concat(Array.from({ length: 10 }, (_, i) => `Module ${i + 1}`))
  .concat(["Semester 1", "Semester 2", "Summer Session", "Final Review"]);

export const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, isLoading, hasFile, resources }) => {
  // Initialize state from localStorage if available
  const [department, setDepartment] = useState<string>(() => localStorage.getItem('lastDepartment') || '');
  
  const [formData, setFormData] = useState<Omit<LessonRequest, 'resources'>>(() => ({
    topic: '',
    gradeLevel: localStorage.getItem('lastGradeLevel') || '',
    subject: localStorage.getItem('lastSubject') || '',
    unit: localStorage.getItem('lastUnit') || '',
    additionalInstructions: ''
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Persist selections to localStorage
    if (name === 'gradeLevel') localStorage.setItem('lastGradeLevel', value);
    if (name === 'subject') localStorage.setItem('lastSubject', value);
    if (name === 'unit') localStorage.setItem('lastUnit', value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDept = e.target.value;
    setDepartment(newDept);
    localStorage.setItem('lastDepartment', newDept);
    
    // Reset subject when department changes
    setFormData(prev => ({ ...prev, subject: '' }));
    localStorage.removeItem('lastSubject');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        resources: resources
    });
  };

  const inputClasses = "w-full px-4 py-3 rounded bg-[#f1f5f9] border border-[#cbd5e1] focus:bg-[#ffffff] focus:border-[#475569] focus:ring-1 focus:ring-[#475569] outline-none transition-all placeholder:text-[#94a3b8] text-sm font-serif text-[#0f172a] shadow-sm appearance-none";
  const labelClasses = "text-xs font-bold text-[#334155] uppercase tracking-widest mb-2 flex items-center font-serif";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-serif">
      
      {/* Department & Subject Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>
            Department
          </label>
          <div className="relative">
            <Layers className="absolute top-3.5 left-4 w-4 h-4 text-[#64748b]" />
            <select
                value={department}
                onChange={handleDepartmentChange}
                className={`${inputClasses} pl-12`}
            >
                <option value="" disabled>Select Department</option>
                {Object.keys(DEPARTMENTS).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                ))}
            </select>
            <ChevronDown className="absolute top-3.5 right-4 w-4 h-4 text-[#64748b] pointer-events-none" />
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            Subject
          </label>
          <div className="relative">
             <Book className="absolute top-3.5 left-4 w-4 h-4 text-[#64748b]" />
             <select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                disabled={!department}
                className={`${inputClasses} pl-12 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <option value="" disabled>Select Subject</option>
                {department && DEPARTMENTS[department]?.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                ))}
            </select>
            <ChevronDown className="absolute top-3.5 right-4 w-4 h-4 text-[#64748b] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grade & Unit Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>
            Grade Level
          </label>
          <div className="relative">
             <GraduationCap className="absolute top-3.5 left-4 w-5 h-5 text-[#64748b]" />
             <select
                name="gradeLevel"
                required
                value={formData.gradeLevel}
                onChange={handleChange}
                className={`${inputClasses} pl-12`}
            >
                <option value="" disabled>Select Grade</option>
                {GRADES.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                ))}
            </select>
            <ChevronDown className="absolute top-3.5 right-4 w-4 h-4 text-[#64748b] pointer-events-none" />
          </div>
        </div>

        <div>
            <label className={labelClasses}>
                Unit / Module <span className="text-[#64748b] ml-1 normal-case italic">(Optional)</span>
            </label>
            <div className="relative">
                <Hash className="absolute top-3.5 left-4 w-4 h-4 text-[#64748b]" />
                <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className={`${inputClasses} pl-12`}
                >
                    <option value="">Select Unit (Optional)</option>
                    {UNITS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                    ))}
                </select>
                <ChevronDown className="absolute top-3.5 right-4 w-4 h-4 text-[#64748b] pointer-events-none" />
            </div>
        </div>
      </div>

      {/* Topic Input (Kept as text) */}
      <div>
        <label className={labelClasses}>
          Lesson Topic
        </label>
        <div className="relative">
            <PenTool className="absolute top-3.5 left-4 w-5 h-5 text-[#64748b]" />
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

      {/* Additional Instructions */}
      <div>
         <label className={labelClasses}>
          Scribe's Instructions <span className="text-[#64748b] ml-1 normal-case italic">(Optional)</span>
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

      {/* Submit Button */}
      <div className="pt-2">
        <button
            type="submit"
            disabled={isLoading || !hasFile}
            className={`w-full py-4 px-6 rounded font-bold text-[#f1f5f9] shadow-md border border-[#1e293b] flex items-center justify-center transition-all duration-300
            ${isLoading || !hasFile 
                ? 'bg-[#94a3b8] cursor-not-allowed shadow-none border-transparent text-[#e2e8f0]' 
                : 'bg-gradient-to-b from-[#1e40af] to-[#1e3a8a] hover:from-[#2563eb] hover:to-[#1e40af] hover:shadow-lg active:translate-y-0.5'
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
            <p className="text-center text-xs text-[#b91c1c] font-semibold mt-3 font-sans bg-[#fecaca]/30 py-1 rounded">
            * A template must be selected in Part I.
            </p>
        )}
      </div>
    </form>
  );
};
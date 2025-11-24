export interface LessonRequest {
  topic: string;
  gradeLevel: string;
  subject: string;
  unit?: string; // Added for better filename organization
  resources: string; // URL or text content
  additionalInstructions?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface FileData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}
import { GoogleGenAI } from "@google/genai";
import { LessonRequest } from "../types";

// Define types for the parts we send to Gemini
type Part = 
  | { text: string }
  | { inlineData: { data: string; mimeType: string } };

// Helper to convert File to a Part compatible with Gemini
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const ext = file.name.split('.').pop()?.toLowerCase();

  // Handle DOCX files: Extract HTML structure using Mammoth.js
  if (ext === 'docx') {
    if (!(window as any).mammoth) {
      throw new Error("Document parser is not ready. Please refresh and try again.");
    }
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Using convertToHtml to keep table formatting cues for the AI
      const result = await (window as any).mammoth.convertToHtml({ arrayBuffer });
      
      if (!result.value) {
        throw new Error("Could not extract content from this Word document.");
      }

      return {
        text: `[TEMPLATE STRUCTURE (HTML)]\n${result.value}\n[TEMPLATE STRUCTURE END]\n\n(Note to AI: The text above is the HTML structure of the user's template. Use this to understand the tables and sections.)`
      };
    } catch (e) {
      console.error("DOCX Parsing Error:", e);
      throw new Error("Failed to read the Word document. Please try converting it to PDF.");
    }
  }

  // Handle Plain Text and HTML files
  if (ext === 'txt' || ext === 'html' || ext === 'htm') {
    const text = await file.text();
    return { text: `[TEMPLATE CONTENT (${ext?.toUpperCase()})]\n${text}` };
  }

  // Handle PDF and Images: Send as inlineData (Binary)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      
      let mimeType = file.type;
      if (!mimeType) {
        if (ext === 'pdf') mimeType = 'application/pdf';
        else if (['jpg', 'jpeg'].includes(ext || '')) mimeType = 'image/jpeg';
        else if (ext === 'png') mimeType = 'image/png';
      }

      resolve({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || 'application/pdf',
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateLessonPlan = async (
  templateFile: File,
  request: LessonRequest
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const filePart = await fileToGenerativePart(templateFile);

  // We request HTML output now to support tables and easy Google Doc import
  const prompt = `
    You are an expert curriculum developer and teacher.
    
    TASK:
    Create a comprehensive lesson plan by filling out the provided Lesson Plan Template.
    
    DETAILS:
    - Subject: ${request.subject}
    - Unit/Module: ${request.unit || "N/A"}
    - Lesson Topic: ${request.topic}
    - Grade Level: ${request.gradeLevel}
    - Resources to Use: ${request.resources}
    - Additional Instructions: ${request.additionalInstructions || "None"}

    INSTRUCTIONS:
    1. ANALYZE the structure of the provided template (tables, headers, sections).
    2. RECREATE that exact structure in your output. If the template uses a table, you MUST use an HTML <table>.
    3. FILL IN every section with high-quality, pedagogical content based on the Topic/Resources.
    4. OUTPUT FORMAT: **HTML**. 
       - Do not use Markdown. 
       - Use <h2>, <h3> for headers.
       - Use <table border="1" cellspacing="0" cellpadding="5"> for tables.
       - Use <ul>/<ol> for lists.
       - Do not include <html>, <head>, or <body> tags, just the content.
       - Style the table with standard HTML attributes (border="1") so it pastes well into Google Docs/Word.
    5. Do not include introductory filler text. Start directly with the lesson plan content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            filePart, 
            { text: prompt }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("No content generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
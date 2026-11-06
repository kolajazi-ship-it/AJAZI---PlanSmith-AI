import { LessonRequest } from "../types";

// Convert the selected template into a payload for the server-side Gemini API.
// The Gemini credential is never read or bundled by browser code.
const fileToGenerativePart = async (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "docx") {
    if (!(window as any).mammoth) {
      throw new Error("Document parser is not ready. Please refresh and try again.");
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await (window as any).mammoth.convertToHtml({ arrayBuffer });
      if (!result.value) {
        throw new Error("Could not extract content from this Word document.");
      }
      return {
        text: `[TEMPLATE STRUCTURE (HTML)]\n${result.value}\n[TEMPLATE STRUCTURE END]\n\n(Note to AI: The text above is the HTML structure of the user's template. Use this to understand the tables and sections.)`,
      };
    } catch (error) {
      console.error("DOCX Parsing Error:", error);
      throw new Error("Failed to read the Word document. Please try converting it to PDF.");
    }
  }

  if (ext === "txt" || ext === "html" || ext === "htm") {
    const text = await file.text();
    return { text: `[TEMPLATE CONTENT (${ext.toUpperCase()})]\n${text}` };
  }

  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      let mimeType = file.type;
      if (!mimeType) {
        if (ext === "pdf") mimeType = "application/pdf";
        else if (["jpg", "jpeg"].includes(ext || "")) mimeType = "image/jpeg";
        else if (ext === "png") mimeType = "image/png";
      }
      if (!base64Data) {
        reject(new Error("Could not read the selected template file."));
        return;
      }
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || "application/pdf",
        },
      });
    };
    reader.onerror = () => reject(new Error("Could not read the selected template file."));
    reader.readAsDataURL(file);
  });
};

export const generateLessonPlan = async (
  templateFile: File,
  request: LessonRequest
): Promise<string> => {
  const filePart = await fileToGenerativePart(templateFile);

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePart, request }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Lesson generation failed (HTTP ${response.status}).`);
  }
  if (typeof result.text !== "string" || !result.text.trim()) {
    throw new Error("The AI service returned no lesson plan. Please try again.");
  }
  return result.text;
};

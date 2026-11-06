import { GoogleGenAI } from "@google/genai";

declare const process: { env: { GEMINI_API_KEY?: string } };

// Vercel runs this endpoint on the server. Keep GEMINI_API_KEY out of the
// browser bundle and never return it to the client.
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "The AI service is not configured on the server. Add GEMINI_API_KEY to the Vercel project environment variables.",
    });
  }

  try {
    const body = req.body ?? {};
    const filePart = body.filePart;
    const request = body.request;

    const hasText = typeof filePart?.text === "string";
    const hasInlineData =
      typeof filePart?.inlineData?.data === "string" &&
      typeof filePart?.inlineData?.mimeType === "string";

    if ((!hasText && !hasInlineData) || !request || typeof request.topic !== "string") {
      return res.status(400).json({ error: "The uploaded template or lesson details are missing." });
    }

    const ai = new GoogleGenAI({ apiKey });
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
      4. OUTPUT FORMAT: HTML.
         - Do not use Markdown.
         - Use <h2>, <h3> for headers.
         - Use <table border="1" cellspacing="0" cellpadding="5"> for tables.
         - Use <ul>/<ol> for lists.
         - Do not include <html>, <head>, or <body> tags, just the content.
         - Style the table with standard HTML attributes (border="1") so it pastes well into Google Docs/Word.
      5. Do not include introductory filler text. Start directly with the lesson plan content.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts: [filePart, { text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    if (!response.text) {
      return res.status(502).json({ error: "The AI service returned no lesson plan. Please try again." });
    }

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: error?.message || "The AI service could not generate the lesson plan.",
    });
  }
}

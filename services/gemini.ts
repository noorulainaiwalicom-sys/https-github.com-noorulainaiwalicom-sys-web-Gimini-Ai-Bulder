import { GoogleGenAI } from "@google/genai";

// Initialize the client
// The API key is guaranteed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Frontend React & Web Developer. 
Your task is to generate a COMPLETE, SINGLE-FILE HTML solution based on the user's prompt.

RULES:
1. Output ONLY valid HTML code. 
2. Do NOT wrap the code in Markdown blocks (like \`\`\`html ... \`\`\`). Just return the raw code string.
3. The HTML must include:
   - \`<!DOCTYPE html>\`
   - \`<html>\`, \`<head>\`, \`<body>\` tags.
   - Tailwind CSS via CDN: \`<script src="https://cdn.tailwindcss.com"></script>\`
   - FontAwesome via CDN (optional, if icons are needed): \`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\`
   - Google Fonts (Inter or Poppins) for nice typography.
4. The design must be "World Class": Modern, clean, responsive, and visually stunning.
5. Use \`https://picsum.photos/width/height\` for any placeholder images. 
6. If the user asks for interactivity, use vanilla JavaScript inside a \`<script>\` tag within the body.
7. If the user provides PREVIOUS CODE, you must update that code to satisfy the new request while keeping the existing functionality intact unless asked to remove it.
8. Do not output any explanation, strictly just the HTML code.
`;

export const generateWebsiteCode = async (
  prompt: string, 
  previousCode?: string
): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview'; // Using the coding-optimized model
    
    let fullPrompt = "";
    
    if (previousCode) {
      fullPrompt = `
      HERE IS THE EXISTING CODE:
      ${previousCode}
      
      USER REQUEST:
      ${prompt}
      
      INSTRUCTIONS:
      Refactor the existing code to fulfill the user request. Return the FULL updated HTML file.
      `;
    } else {
      fullPrompt = `
      Create a new website based on this request:
      "${prompt}"
      `;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // High budget for complex coding tasks if needed, but usually 0 or default is fine for speed unless specified.
        // Since we want high quality, let's leave default thinking budget but ensure maxOutputTokens is high if needed (default is usually sufficient for single file).
      },
    });

    let code = response.text || "";

    // Cleanup: Remove markdown backticks if the model accidentally adds them despite instructions
    if (code.startsWith("```html")) {
      code = code.replace(/^```html/, "").replace(/```$/, "");
    } else if (code.startsWith("```")) {
      code = code.replace(/^```/, "").replace(/```$/, "");
    }

    return code.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate website code.");
  }
};
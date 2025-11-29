import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL = "gemini-2.5-flash";

export const generateMcq = async (topic: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `Generate one multiple-choice question about "${topic}" suitable for a civil service exam in Nepal.
Return strict JSON with this shape:
{
  "question": "string",
  "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
  "correctAnswer": "A"|"B"|"C"|"D",
  "explanation": "string"
}`;

    const result = await model.generateContent(prompt);
    const text = (await result.response.text()).trim();

    // Gemini may wrap JSON in code fences; strip them if present.
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error generating MCQ:", error);
    throw new Error("Failed to generate MCQ from AI service.");
  }
};

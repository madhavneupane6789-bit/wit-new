import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateMcq = async (topic: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a multiple-choice question about ${topic} for a civil service exam in Nepal. Provide four options (A, B, C, D), indicate the correct answer, and give a brief explanation. Format the output as a JSON object with keys: "question", "options" (an array of strings), "correctAnswer" (the letter 'A', 'B', 'C', or 'D'), and "explanation".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Attempt to parse the JSON from the response text
    const jsonResponse = JSON.parse(text);
    return jsonResponse;
  } catch (error) {
    console.error("Error generating MCQ:", error);
    throw new Error("Failed to generate MCQ from AI service.");
  }
};

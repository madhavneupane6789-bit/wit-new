import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Default to a currently listed model; allow override via env.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const promptFor = (topic?: string) => {
  const scope = topic && topic.trim().length
    ? `Focus on the topic "${topic}".`
    : 'Cover the NEA (Nepal Electricity Authority) Loksewa Level 4/5 syllabus broadly: Samanya Gyan (general knowledge), electrical/technical, management, quantitative aptitude, and current affairs.';

  return `Generate one concise multiple-choice question for NEA Loksewa preparation in Nepal. ${scope}
Keep the stem short and clear.
Return strict JSON with this shape:
{
  "question": "string",
  "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
  "correctAnswer": "A"|"B"|"C"|"D",
  "explanation": "string"
}`;
};

function parseJsonResponse(text: string) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
  return JSON.parse(cleaned);
}

async function generateWithGemini(topic?: string) {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(promptFor(topic));
  const text = (await result.response.text()).trim();
  return parseJsonResponse(text);
}

async function generateWithDeepseek(topic?: string) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is missing");
  }

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: DEEPSEEK_MODEL,
        messages: [{ role: "user", content: promptFor(topic) }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from Deepseek");
    }
    return parseJsonResponse(content);
  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.error?.message || err?.message || "Deepseek request failed";
    throw new Error(`Deepseek error (${status || "unknown"}): ${msg}`);
  }
}

export const generateMcq = async (topic?: string, provider: "gemini" | "deepseek" = "gemini") => {
  try {
    if (provider === "deepseek") {
      return await generateWithDeepseek(topic);
    }
    return await generateWithGemini(topic);
  } catch (error) {
    console.error("Error generating MCQ:", error);
    // Surface provider-specific message when available
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate MCQ from AI service.");
  }
};

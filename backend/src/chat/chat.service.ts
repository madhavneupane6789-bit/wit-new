import { GoogleGenerativeAI } from '@google/generative-ai';

const chatApiKey = process.env.CHAT_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(chatApiKey);
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function chatWithAi(message: string, history: ChatMessage[] = []) {
  if (!chatApiKey) {
    throw new Error('CHAT_GEMINI_API_KEY is missing');
  }

  const systemPrompt =
    'You are a helpful tutor for NEA Loksewa preparation (Level 4/5), but can also answer general questions. Keep replies concise and clear.';

  const convo = [
    { role: 'user', content: systemPrompt },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent({
    contents: convo.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  });

  return result.response.text();
}

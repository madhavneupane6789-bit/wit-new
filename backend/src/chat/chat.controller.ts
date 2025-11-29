import { Request, Response, NextFunction } from 'express';
import { chatWithAi, ChatMessage } from './chat.service';

export async function chatHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const message = (req.body?.message as string | undefined)?.trim();
    const history = (req.body?.history as ChatMessage[] | undefined) || [];
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const reply = await chatWithAi(message, history);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}

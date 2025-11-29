import { Request, Response, NextFunction } from "express";
import * as McqAiService from "./mcq-ai.service";

export const generateMcqHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawTopic = (req.body?.topic as string | undefined) || (req.query?.topic as string | undefined);
    const topic = rawTopic && rawTopic.trim().length ? rawTopic.trim() : undefined;
    const provider = ((req.body?.model as string | undefined) || (req.query?.model as string | undefined) || "gemini") as
      | "gemini"
      | "deepseek";
    const mcq = await McqAiService.generateMcq(topic, provider);
    res.status(200).json(mcq);
  } catch (error) {
    next(error);
  }
};

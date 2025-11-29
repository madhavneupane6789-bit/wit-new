import { Request, Response, NextFunction } from "express";
import * as McqAiService from "./mcq-ai.service";

export const generateMcqHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }
    const mcq = await McqAiService.generateMcq(topic);
    res.status(200).json(mcq);
  } catch (error) {
    next(error);
  }
};

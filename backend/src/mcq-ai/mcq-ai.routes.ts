import express from "express";
import * as McqAiController from "./mcq-ai.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post(
  "/generate",
  requireAuth,
  McqAiController.generateMcqHandler
);

export default router;
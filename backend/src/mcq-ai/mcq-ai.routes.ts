import express from "express";
import * as McqAiController from "./mcq-ai.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireApproved } from "../middleware/requireApproved";
import { requireActive } from "../middleware/requireActive";

const router = express.Router();

router.get("/generate", requireAuth, requireApproved, requireActive, McqAiController.generateMcqHandler);
router.post("/generate", requireAuth, requireApproved, requireActive, McqAiController.generateMcqHandler);

export default router;

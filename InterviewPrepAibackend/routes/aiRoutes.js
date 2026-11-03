import express from "express";
import { generateInterviewQuestions, generateConceptExplanation, evaluateAnswer } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-questions", protect, generateInterviewQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);
router.post("/evaluate-answer", protect, evaluateAnswer);

export default router;

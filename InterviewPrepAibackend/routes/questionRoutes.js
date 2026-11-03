import express from "express";
import { togglePinQuestion, updateQuestionNote, addQuestionsToSession, getExplanation } from "../controllers/questionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/explain", protect, getExplanation);
router.put("/:id/pin", protect, togglePinQuestion);
router.put("/:id/note", protect, updateQuestionNote);

export default router;
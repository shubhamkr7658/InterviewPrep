import Question from "../models/Question.js";
import Session from "../models/Session.js";
import OpenAI from "openai";
import { conceptExplainPrompt } from "../utils/prompts.js";

let groqClient;
const MODELS = [
  process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b"
];

const getGroqClient = () => {
  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return groqClient;
};

const cleanJsonText = (text) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;
    const session = await Session.findById(sessionId);

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(404).json({ message: "Invalid input data" });
    }

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty || "medium",
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();
    res.status(201).json(createdQuestions);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err: err.message });
  }
};

export const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    question.isPinned = !question.isPinned;
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err: err.message });
  }
};

export const updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    question.note = note || "";
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err: err.message });
  }
};

export const getExplanation = async (req, res) => {
  try {
    const { questionId } = req.body;
    if (!questionId) {
      return res.status(400).json({ message: "Missing questionId" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.explanation) {
      return res.status(200).json({
        title: question.explanationTitle || "",
        explanation: question.explanation,
        cached: true,
      });
    }

    const groq = getGroqClient();
    const prompt = conceptExplainPrompt(question.question);

    let title = "";
    let explanation = "";
    let rawText = "";

    for (const model of MODELS) {
      try {
        console.log(`Generating explanation for "${question.question}" using ${model}...`);
        const response = await groq.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          response_format: { type: "json_object" },
        });

        rawText = response.choices[0].message.content;
        break;
      } catch (err) {
        console.error(`Model ${model} failed for explanation:`, err.message);
      }
    }

    if (!rawText) {
      return res.status(500).json({ message: "Failed to generate explanation across all models" });
    }

    try {
      const cleaned = cleanJsonText(rawText);
      const parsed = JSON.parse(cleaned);
      title = parsed.title || "";
      explanation = parsed.explanation || "";
    } catch {
      const titleMatch = rawText.match(/"title"\s*:\s*"([^"]+)"/);
      let explMatch = rawText.match(/"explanation"\s*:\s*"([\s\S]*)"\s*}/);
      if (!explMatch) {
        explMatch = rawText.match(/"explanation"\s*:\s*"([\s\S]*?)"\s*[,}]/);
      }
      if (explMatch) {
        title = titleMatch ? titleMatch[1] : "Explanation";
        explanation = explMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
      } else {
        title = "Explanation";
        explanation = rawText;
      }
    }

    question.explanation = explanation;
    question.explanationTitle = title;
    await question.save();

    res.status(200).json({ title, explanation, cached: false });
  } catch (err) {
    console.error("Error getting explanation:", err);
    res.status(500).json({ message: "Failed to generate explanation", error: err.message });
  }
};
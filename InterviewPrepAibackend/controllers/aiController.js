import OpenAI from "openai";
import {
  questionAnswerPrompt,
  conceptExplainPrompt,
  evaluateAnswerPrompt,
} from "../utils/prompts.js";

let client;

const MODELS = [
  process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b"
];

const getClient = () => {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from environment variables");
    }
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return client;
};

const cleanJsonText = (text) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

const callWithModelFallback = async (groq, messages, jsonMode = false) => {
  let lastError;
  for (const model of MODELS) {
    try {
      const params = {
        model,
        messages,
        temperature: 0.7,
      };
      if (jsonMode) {
        params.response_format = { type: "json_object" };
      }
      const response = await groq.chat.completions.create(params);
      return response.choices[0].message.content;
    } catch (err) {
      lastError = err;
      console.warn(`Groq model ${model} failed: ${err.message}. Trying next fallback...`);
    }
  }
  throw lastError || new Error("All Groq models failed");
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const groq = getClient();
    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const rawText = await callWithModelFallback(
      groq,
      [{ role: "user", content: prompt }],
      true
    );

    const cleanedText = cleanJsonText(rawText);
    const parsed = JSON.parse(cleanedText);
    const data = parsed.questions || parsed;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};

const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing question field" });
    }

    const groq = getClient();
    const prompt = conceptExplainPrompt(question);

    const rawText = await callWithModelFallback(
      groq,
      [{ role: "user", content: prompt }],
      true
    );

    const cleanedText = cleanJsonText(rawText);
    const parsed = JSON.parse(cleanedText);

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Error generating concept explanation:", error);
    res.status(500).json({
      message: "Failed to generate concept explanation",
      error: error.message,
    });
  }
};

const evaluateAnswer = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;
    if (!question || !userAnswer) {
      return res
        .status(400)
        .json({ message: "Missing required fields: question and userAnswer" });
    }

    const groq = getClient();
    const prompt = evaluateAnswerPrompt(question, userAnswer);

    const rawText = await callWithModelFallback(
      groq,
      [{ role: "user", content: prompt }],
      true
    );

    const cleanedText = cleanJsonText(rawText);
    const parsed = JSON.parse(cleanedText);

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    res.status(500).json({
      message: "Failed to evaluate answer",
      error: error.message,
    });
  }
};

export { generateInterviewQuestions, generateConceptExplanation, evaluateAnswer };

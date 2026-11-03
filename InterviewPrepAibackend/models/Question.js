import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session"
  },
  question: String,
  answer: String,
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  },
  note: String,
  isPinned: {
    type: Boolean,
    default: false
  },
  explanation: {
    type: String,
    default: ""
  },
  explanationTitle: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
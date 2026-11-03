import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../../components/Layouts/Navbar";
import QuestionCard from "./components/QuestionCard";
import RealTimeClock from "../../components/RealTimeClock";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/userContext";
import {
  LuArrowLeft,
  LuLoader,
  LuSparkles,
  LuX,
  LuPin,
  LuBrainCircuit,
  LuPlus,
  LuChartSpline,
} from "react-icons/lu";

// ────────────────────────────────────────────────────────────────────────────
// AI Explanation Side Panel (non-blocking — sits beside questions)
// ────────────────────────────────────────────────────────────────────────────
const ExplanationPanel = ({ questionObj, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchExplanation = useCallback(async (qObj) => {
    if (!qObj) return;
    setData(null);
    setError("");
    setLoading(true);

    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await axiosInstance.post(API_PATHS.QUESTION.EXPLAIN, { questionId: qObj._id });
        setData(res.data);
        setLoading(false);
        return;
      } catch {
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }
    setError("Failed to generate explanation.");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExplanation(questionObj);
  }, [questionObj, fetchExplanation]);

  if (!questionObj) return null;

  return (
    <>
      {/* Mobile Backdrop (only visible on mobile when panel is open) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      <div className="bg-[#12121a] border border-[#1e1e2e] overflow-hidden flex flex-col z-50 fixed inset-x-0 bottom-0 h-[85vh] rounded-t-2xl lg:relative lg:inset-auto lg:h-fit lg:max-h-[calc(100vh-120px)] lg:sticky lg:top-20 lg:rounded-2xl transition-transform duration-300 transform translate-y-0 shadow-2xl lg:shadow-none">
        {/* Header */}
        <div className="flex items-start gap-3 px-4 py-3 border-b border-[#1e1e2e] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
            <LuSparkles size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
              AI Explanation
            </p>
            <p className="text-sm font-semibold text-white truncate leading-snug mt-0.5">
              {questionObj.question}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b8b9e] hover:text-white hover:bg-[#1e1e2e] transition-colors cursor-pointer shrink-0"
          >
            <LuX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <LuLoader size={24} className="animate-spin text-purple-400" />
              <p className="text-sm text-[#8b8b9e]">Generating explanation…</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-red-400 text-sm text-center">{error}</p>
              <button
                onClick={() => fetchExplanation(questionObj)}
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <LuSparkles size={14} /> Retry
              </button>
            </div>
          )}

          {data && (
            <div>
              {data.title && (
                <h3 className="text-base font-bold text-white mb-3">{data.title}</h3>
              )}
              <div className="prose prose-sm prose-invert max-w-none text-[#c0c0c0] leading-relaxed [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_strong]:text-white [&_code]:bg-[#1e1e2e] [&_code]:text-purple-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-[#0a0a0f] [&_pre]:border [&_pre]:border-[#1e1e2e] [&_pre]:rounded-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.explanation}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// InterviewPrep main page — side-by-side layout
// ────────────────────────────────────────────────────────────────────────────
const InterviewPrep = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const { user } = useUser();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [explanationQuestion, setExplanationQuestion] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const fetchSession = useCallback(async (isInitial = false) => {
    if (!sessionId) return;
    if (isInitial) setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      setSession(data.session);
      setQuestions((prev) => {
        const incoming = data.session.questions || [];
        // Prevent race condition: if we just added questions locally, incoming from a background poll might be shorter
        if (incoming.length < prev.length) {
          return prev;
        }
        return incoming;
      });
    } catch {
      if (isInitial) toast.error("Failed to load session.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch and set interval for realtime-like polling
  useEffect(() => {
    fetchSession(true);

    const interval = setInterval(() => {
      fetchSession(false);
    }, 5000); // sync every 5 seconds

    return () => clearInterval(interval);
  }, [fetchSession]);

  const handlePin = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId ? { ...q, isPinned: !q.isPinned } : q
      )
    );
  };

  const handleNoteUpdate = (questionId, note) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === questionId ? { ...q, note } : q))
    );
  };

  const handleGetMoreQuestions = async (retryCount = 0) => {
    if (!session) return;
    setLoadingMore(true);
    try {
      const aiRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: session.role,
        experience: session.experience,
        topicsToFocus: session.topicsToFocus,
        numberOfQuestions: 5,
      });
      const newQuestions = aiRes.data;
      const { data: savedQuestions } = await axiosInstance.post(API_PATHS.QUESTION.ADD, {
        sessionId: session._id,
        questions: newQuestions,
      });
      setQuestions((prev) => [...prev, ...savedQuestions]);
      toast.success("5 more questions added! 🎉");
      setLoadingMore(false);
    } catch (err) {
      if (retryCount < 2) {
        console.log(`Generate more failed, retrying (${retryCount + 1}/2)...`);
        setTimeout(() => handleGetMoreQuestions(retryCount + 1), 1500);
      } else {
        toast.error("Failed to generate more questions. Please try again.");
        setLoadingMore(false);
      }
    }
  };

  const displayed = questions
    .filter((q) => (filter === "pinned" ? q.isPinned : true))
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const pinnedCount = questions.filter((q) => q.isPinned).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <LuLoader size={36} className="animate-spin text-[#d4a853]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <p className="text-[#8b8b9e]">Session not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-[#d4a853] hover:underline cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="container mx-auto px-3 sm:px-6 py-6 max-w-7xl">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-[#8b8b9e] hover:text-white mb-5 cursor-pointer transition-colors"
        >
          <LuArrowLeft size={16} />
          Dashboard
        </button>

        {/* Session info */}
        <div className="bg-[#12121a] rounded-2xl border border-[#1e1e2e] px-4 sm:px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden">
          <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a853] to-[#e8c87a] flex items-center justify-center shadow-sm shrink-0">
              <LuBrainCircuit size={20} className="text-black" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-white break-words whitespace-normal">
                {session.role}
              </h1>
              <p className="text-sm text-[#8b8b9e] break-words whitespace-normal">
                {session.experience} yrs exp &middot;{" "}
                <span className="text-[#d4a853] font-medium">{session.topicsToFocus}</span>
              </p>
              {session.description && (
                <p className="text-xs text-[#c0c0c0] mt-1 break-words whitespace-normal">
                  {session.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 shrink-0 justify-start sm:justify-end mt-2 sm:mt-0 w-full sm:w-auto">
            <span className="bg-[#d4a853]/10 border border-[#d4a853]/20 text-[#d4a853] text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
              {questions.length} Q&amp;A
            </span>
            {pinnedCount > 0 && (
              <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                <LuPin size={11} /> {pinnedCount} pinned
              </span>
            )}
            <button
              onClick={() => navigate(`/session-analysis?session=${sessionId}`)}
              className="bg-[#1e1e2e] hover:bg-[#d4a853]/20 border border-[#d4a853]/30 text-white text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer sm:ml-2 whitespace-nowrap shadow-sm"
            >
              <LuChartSpline size={14} className="text-[#d4a853]" />
              Analysis
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5">
          {[
            { key: "all", label: "All Questions" },
            { key: "pinned", label: "📌 Pinned" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all cursor-pointer ${filter === tab.key
                ? "bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-black border-transparent shadow-sm"
                : "bg-[#12121a] text-[#8b8b9e] border-[#1e1e2e] hover:border-[#d4a853]/30"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Side-by-side layout: Questions + Explanation Panel */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Questions list — shrinks when panel is open */}
          <div className={`${explanationQuestion ? "lg:w-[55%]" : "w-full"} transition-all duration-300`}>
            <div className="space-y-3">
              {displayed.length === 0 ? (
                <div className="text-center py-12 text-[#8b8b9e] text-sm">
                  {filter === "pinned"
                    ? "No pinned questions yet. Click the pin icon on any question!"
                    : "No questions found."}
                </div>
              ) : (
                displayed.map((q) => (
                  <QuestionCard
                    key={q._id}
                    question={q}
                    onPin={handlePin}
                    onNoteUpdate={handleNoteUpdate}
                    onExplanation={(qObj) => setExplanationQuestion(qObj)}
                    isExplaining={explanationQuestion?._id === q._id}
                  />
                ))
              )}
            </div>

            {/* Get More Questions button */}
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={() => handleGetMoreQuestions()}
                disabled={loadingMore}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-sm font-semibold text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 cursor-pointer shadow-md disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <LuLoader size={16} className="animate-spin" />
                    Generating more questions…
                  </>
                ) : (
                  <>
                    <LuPlus size={16} />
                    Get More Questions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Explanation Panel — appears on the right on desktop, below on mobile */}
          {explanationQuestion && (
            <div className="lg:w-[45%] w-full">
              <ExplanationPanel
                questionObj={explanationQuestion}
                onClose={() => setExplanationQuestion(null)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewPrep;

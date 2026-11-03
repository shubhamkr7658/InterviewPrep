import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Layouts/Navbar";
import SessionCard from "../../components/Cards/SessionCard";
import CreateSessionModal from "../../components/Cards/CreateSessionModal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/userContext";
import toast from "react-hot-toast";
import { LuPlus, LuBrainCircuit, LuLoader, LuSearch, LuX } from "react-icons/lu";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const fetchSessions = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(data.sessions || []);
    } catch {
      if (isInitial) toast.error("Failed to load sessions.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions(true);

    const interval = setInterval(() => {
      fetchSessions(false);
    }, 5000); // Poll every 5 seconds for background updates (e.g. from mobile)

    return () => clearInterval(interval);
  }, [fetchSessions]);

  const handleCreate = async ({ role, experience, topicsToFocus, description, numberOfQuestions }) => {
    const aiRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
      role, experience, topicsToFocus, numberOfQuestions,
    });
    const questions = aiRes.data;
    const sessionRes = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
      role, experience, topicsToFocus, description, questions,
    });
    toast.success("Session created! 🎉");
    navigate(`/interviewprep?session=${sessionRes.data.session._id}`);
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionId));
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      toast.success("Session deleted.");
    } catch {
      toast.error("Failed to delete session.");
    }
  };

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => {
      const haystack = [s.role, s.topicsToFocus, s.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      // Split query into words — ALL words must match somewhere
      const words = q.split(/\s+/).filter(Boolean);
      return words.every((word) => haystack.includes(word));
    });
  }, [sessions, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-8 py-8 max-w-6xl">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              My Interview Sessions
            </h1>
            <p className="text-sm text-[#8b8b9e] mt-1">
              Review, continue, or create new AI-powered prep sessions.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-sm font-semibold text-black px-5 py-2.5 rounded-xl hover:opacity-90 transition-all duration-300 cursor-pointer self-start sm:self-auto"
          >
            <LuPlus size={16} />
            New Session
          </button>
        </div>

        {/* Search bar */}
        {sessions.length > 0 && (
          <div className="relative mb-6">
            <LuSearch
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b8b9e]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, topics, or description…"
              className="w-full sm:max-w-md bg-[#12121a] border border-[#1e1e2e] rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-[#8b8b9e] outline-none focus:ring-2 focus:ring-[#d4a853]/30 focus:border-[#d4a853]/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b8b9e] hover:text-white cursor-pointer"
              >
                <LuX size={14} />
              </button>
            )}
          </div>
        )}

        {/* Sessions grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#d4a853]">
            <LuLoader size={30} className="animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#d4a853]/10 flex items-center justify-center">
              <LuBrainCircuit size={32} className="text-[#d4a853]" />
            </div>
            <p className="text-[#8b8b9e] text-sm text-center max-w-xs">
              No sessions yet. Create your first AI-powered interview prep session!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-sm font-semibold text-black px-6 py-2.5 rounded-xl hover:opacity-90 transition-all cursor-pointer"
            >
              <LuPlus size={15} />
              Create Session
            </button>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-16 text-[#8b8b9e] text-sm">
            No sessions match "<span className="font-medium text-white">{searchQuery}</span>"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSessions.map((session, i) => (
              <motion.div
                key={session._id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
              >
                <SessionCard
                  session={session}
                  onDelete={handleDelete}
                  onClick={() => navigate(`/interviewprep?session=${session._id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CreateSessionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default Dashboard;

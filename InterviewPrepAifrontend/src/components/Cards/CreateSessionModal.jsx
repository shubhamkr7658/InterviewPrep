import { useState } from "react";
import { LuBrainCircuit, LuX, LuSparkles, LuLoader } from "react-icons/lu";

const CreateSessionModal = ({ isOpen, onClose, onCreate }) => {
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [topicsToFocus, setTopicsToFocus] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!role.trim() || !experience.trim() || !topicsToFocus.trim()) {
            setError("Role, experience and topics are required.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await onCreate({ role, experience, topicsToFocus, description, numberOfQuestions });
            handleClose();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create session.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRole("");
        setExperience("");
        setTopicsToFocus("");
        setDescription("");
        setNumberOfQuestions(10);
        setError("");
        onClose();
    };

    const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#8b8b9e] outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all";

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="relative w-full max-w-lg bg-[#12121a] border border-[#1e1e2e] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-start gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-[#1e1e2e]">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a853] to-[#e8c87a] shrink-0 mt-0.5">
                        <LuBrainCircuit size={18} className="text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white leading-tight break-words">
                            Create Interview Session
                        </h3>
                        <p className="text-xs text-[#8b8b9e] mt-1 pr-2 break-words">
                            AI will generate personalized Q&amp;A for you
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-[#8b8b9e] hover:text-white p-1.5 rounded-lg hover:bg-[#1e1e2e] transition-colors cursor-pointer shrink-0"
                    >
                        <LuX size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[75vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#c0c0c0] mb-1">
                                Job Role <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Frontend Developer"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#c0c0c0] mb-1">
                                Experience (years) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="e.g. 2"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#c0c0c0] mb-1">
                            Topics to Focus <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={topicsToFocus}
                            onChange={(e) => setTopicsToFocus(e.target.value)}
                            placeholder="e.g. React hooks, TypeScript, REST APIs"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#c0c0c0] mb-1">
                            Description (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Any extra context about the role or company..."
                            rows={2}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#c0c0c0] mb-2">
                            Number of Questions: <span className="text-[#d4a853] font-bold">{numberOfQuestions}</span>
                        </label>
                        <input
                            type="range"
                            min={5}
                            max={20}
                            step={1}
                            value={numberOfQuestions}
                            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                            className="w-full accent-[#d4a853]"
                        />
                        <div className="flex justify-between text-xs text-[#8b8b9e] mt-1">
                            <span>5</span>
                            <span>20</span>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs flex items-center gap-1">
                            <span>⚠</span> {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-sm font-semibold text-black py-2.5 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <LuLoader size={15} className="animate-spin" />
                                Generating with AI…
                            </>
                        ) : (
                            <>
                                <LuSparkles size={15} />
                                Generate Questions
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateSessionModal;

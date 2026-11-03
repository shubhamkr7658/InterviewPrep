import { useState, useRef, useEffect } from "react";
import { LuPin, LuSparkles, LuCopy, LuCheck, LuChevronDown, LuPen, LuTrash } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";

const difficultyConfig = {
    easy: { label: "Easy", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "🟢" },
    medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "🟡" },
    hard: { label: "Hard", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "🔴" },
};

const QuestionCard = ({ question, onPin, onNoteUpdate, onExplanation, isExplaining }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [note, setNote] = useState(question.note || "");
    const [showNote, setShowNote] = useState(false);
    const noteTimer = useRef(null);

    const diff = difficultyConfig[question.difficulty] || difficultyConfig.medium;

    const handleCopy = () => {
        const textToCopy = `${question.question}\n\n${question.answer}`;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            Object.assign(textArea.style, {
                position: 'fixed',
                top: '-9999px',
                left: '-9999px',
            });
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleTogglePin = async () => {
        try {
            await axiosInstance.put(API_PATHS.QUESTION.PIN(question._id));
            onPin(question._id);
        } catch {
            toast.error("Failed to pin question.");
        }
    };

    const handleNoteChange = (val) => {
        setNote(val);
        if (noteTimer.current) clearTimeout(noteTimer.current);
        noteTimer.current = setTimeout(async () => {
            try {
                await axiosInstance.put(API_PATHS.QUESTION.UPDATE_NOTE(question._id), { note: val });
                onNoteUpdate(question._id, val);
            } catch {
                toast.error("Failed to save note.");
            }
        }, 600);
    };

    useEffect(() => () => clearTimeout(noteTimer.current), []);

    return (
        <div
            className={`group bg-[#12121a] rounded-xl border transition-all duration-200 overflow-hidden ${isExplaining
                ? "border-purple-500/40 shadow-lg shadow-purple-500/5"
                : question.isPinned
                    ? "border-[#d4a853]/30"
                    : "border-[#1e1e2e] hover:border-[#d4a853]/20"
                }`}
        >
            {/* Header — always visible */}
            <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 cursor-pointer select-none"
                onClick={() => setExpanded((p) => !p)}
            >
                <div className="flex w-full sm:w-auto items-start gap-3 flex-1 min-w-0 pr-2">
                    {/* Question number */}
                    <div className="w-7 h-7 rounded-lg bg-[#1e1e2e] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#8b8b9e]">#</span>
                    </div>

                    {/* Question text */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-white leading-relaxed break-words whitespace-normal">
                            {question.question}
                        </p>
                    </div>
                </div>

                {/* Badges + actions (right side / bottom row on mobile) */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-3 sm:mt-0 gap-1.5 shrink-0 pl-10 sm:pl-0 flex-wrap">
                    {/* Difficulty badge - Always visible now */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color} inline-flex items-center gap-1 mr-auto sm:mr-2 shrink-0`}>
                        {diff.dot} {diff.label}
                    </span>

                    <div className="flex items-center gap-1">
                        {/* Pin */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleTogglePin(); }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${question.isPinned
                                ? "text-[#d4a853] bg-[#d4a853]/10"
                                : "text-[#8b8b9e] hover:text-[#d4a853] hover:bg-[#d4a853]/10"
                                }`}
                            title={question.isPinned ? "Unpin" : "Pin"}
                        >
                            <LuPin size={14} />
                        </button>

                        {/* AI Explain */}
                        <button
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onExplanation(question);
                                setExpanded(true);
                            }}
                            title="AI Explain"
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isExplaining
                                ? "text-purple-400 bg-purple-500/10"
                                : "text-[#8b8b9e] hover:text-purple-400 hover:bg-purple-500/10"
                                }`}
                        >
                            <LuSparkles size={14} />
                        </button>

                        {/* Copy */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                            className="p-1.5 rounded-lg text-[#8b8b9e] hover:text-white hover:bg-[#1e1e2e] transition-colors cursor-pointer"
                            title="Copy"
                        >
                            {copied ? <LuCheck size={14} className="text-emerald-400" /> : <LuCopy size={14} />}
                        </button>

                        {/* Expand chevron */}
                        <LuChevronDown
                            size={16}
                            className={`text-[#8b8b9e] transition-transform duration-200 ml-1 ${expanded ? "rotate-180" : ""}`}
                        />
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-[#1e1e2e]">
                    {/* Answer */}
                    <div className="mt-3 prose prose-sm prose-invert max-w-none text-[#c0c0c0] leading-relaxed [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_strong]:text-white [&_code]:bg-[#1e1e2e] [&_code]:text-[#d4a853] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-[#0a0a0f] [&_pre]:border [&_pre]:border-[#1e1e2e] [&_pre]:rounded-xl [&_li]:text-[#c0c0c0]">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    if (!inline && match) {
                                        return (
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        );
                                    }
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {question.answer}
                        </ReactMarkdown>
                    </div>

                    {/* Note */}
                    <div className="mt-4 pt-3 border-t border-[#1e1e2e]/50">
                        {!showNote && !question.note ? (
                            <button
                                onClick={() => {
                                    setShowNote(true);
                                    setNote("");
                                }}
                                className="text-xs font-semibold text-[#8b8b9e] hover:text-[#d4a853] transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                + Add a personal note
                            </button>
                        ) : (
                            <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-[#d4a853] uppercase tracking-wide">
                                        Personal Note
                                    </span>
                                    {question.note && !showNote && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setNote(question.note);
                                                    setShowNote(true);
                                                }}
                                                className="p-1.5 rounded-lg text-[#8b8b9e] hover:text-white hover:bg-[#1e1e2e] transition-colors cursor-pointer"
                                                title="Edit note"
                                            >
                                                <LuPen size={14} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!window.confirm("Delete this note?")) return;
                                                    try {
                                                        await axiosInstance.put(API_PATHS.QUESTION.UPDATE_NOTE(question._id), { note: "" });
                                                        onNoteUpdate(question._id, "");
                                                        setNote("");
                                                        setShowNote(false);
                                                        toast.success("Note deleted");
                                                    } catch {
                                                        toast.error("Failed to delete note");
                                                    }
                                                }}
                                                className="p-1.5 rounded-lg text-[#8b8b9e] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                                title="Delete note"
                                            >
                                                <LuTrash size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {showNote ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Write what you learned or any thoughts here…"
                                            rows={2}
                                            autoFocus
                                            className="w-full bg-transparent text-sm text-white placeholder:text-[#8b8b9e] outline-none resize-none"
                                        />
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e1e2e]">
                                            <button
                                                onClick={() => {
                                                    setShowNote(false);
                                                    setNote(question.note || "");
                                                }}
                                                className="text-xs font-medium text-[#8b8b9e] hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!note.trim()) return;
                                                    try {
                                                        await axiosInstance.put(API_PATHS.QUESTION.UPDATE_NOTE(question._id), { note: note.trim() });
                                                        onNoteUpdate(question._id, note.trim());
                                                        setShowNote(false);
                                                        toast.success("Note saved");
                                                    } catch {
                                                        toast.error("Failed to save note");
                                                    }
                                                }}
                                                className="text-xs font-semibold text-black bg-[#d4a853] hover:bg-[#e8c87a] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                            >
                                                Save Note
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-[#c0c0c0] whitespace-pre-wrap leading-relaxed">
                                        {question.note}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;

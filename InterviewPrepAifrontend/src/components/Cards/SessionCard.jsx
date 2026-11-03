import moment from "moment";
import { LuTrash2, LuArrowRight, LuBrainCircuit } from "react-icons/lu";

const SessionCard = ({ session, onDelete, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-[#12121a] rounded-2xl border border-[#1e1e2e] hover:border-[#d4a853]/30 transition-all duration-300 cursor-pointer p-5 flex flex-col gap-3 overflow-hidden"
        >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a853] to-[#e8c87a] shadow-sm shrink-0">
                        <LuBrainCircuit size={18} className="text-black" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate leading-tight">
                            {session.role}
                        </h3>
                        <p className="text-xs text-[#d4a853] font-medium mt-0.5">
                            {session.experience} yrs exp
                        </p>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(session._id);
                    }}
                    className="p-1.5 rounded-lg text-[#8b8b9e] hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                    title="Delete session"
                >
                    <LuTrash2 size={15} />
                </button>
            </div>

            {/* Topics */}
            {session.topicsToFocus && (
                <p className="relative z-10 text-xs text-[#8b8b9e] leading-relaxed break-words whitespace-normal">
                    <span className="font-medium text-[#c0c0c0]">Topics:</span>{" "}
                    {session.topicsToFocus}
                </p>
            )}

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between mt-auto pt-1">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-[#d4a853]/10 border border-[#d4a853]/20 text-[#d4a853] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {session.questions?.length || 0} Q&amp;A
                    </span>
                    <span className="text-xs text-[#8b8b9e]">
                        {moment(session.createdAt).fromNow()}
                    </span>
                </div>
                <span className="text-[#d4a853] group-hover:translate-x-1 transition-transform duration-200">
                    <LuArrowRight size={16} />
                </span>
            </div>
        </div>
    );
};

export default SessionCard;

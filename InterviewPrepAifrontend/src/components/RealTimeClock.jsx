import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuClock, LuCalendarDays, LuX } from "react-icons/lu";

const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = time.toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
    });
    const formattedDate = time.toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });

    // Clean, borderless layout for perfect integration into headers
    const desktopClock = (
        <div className="flex flex-col items-end justify-center gap-0.5 min-w-[120px]">
            <div className="flex items-center gap-2">
                <LuClock className="text-[#d4a853] w-4 h-4" />
                <span className="text-white font-mono text-[15px] sm:text-base font-bold tracking-tight">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5 pr-0.5">
                <LuCalendarDays className="text-[#8b8b9e] w-3.5 h-3.5" />
                <span className="text-[#8b8b9e] text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">{formattedDate}</span>
            </div>
        </div>
    );

    // Boxed layout for the mobile dropdown
    const mobileDropdown = (
        <div className="bg-[#12121a]/95 backdrop-blur-xl border border-[#1e1e2e] shadow-lg shadow-black/50 rounded-b-xl p-3 flex flex-col items-end gap-1.5 relative overflow-hidden pointer-events-auto">
            <div className="flex justify-between w-full items-center mb-1 border-b border-[#1e1e2e] pb-1.5">
                <span className="text-[10px] text-[#8b8b9e] font-semibold uppercase tracking-wider">Current Time</span>
                <button onClick={() => setIsExpanded(false)} className="text-[#8b8b9e] hover:text-[#white] transition-colors cursor-pointer p-0.5">
                    <LuX size={14} />
                </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/5 to-transparent pointer-events-none opacity-100" />

            <div className="relative z-10 flex items-center gap-2">
                <LuClock className="text-[#d4a853] w-4 h-4" />
                <span className="text-white font-mono text-[15px] font-bold tracking-tight">{formattedTime}</span>
            </div>
            <div className="relative z-10 flex items-center gap-1.5 pr-0.5">
                <LuCalendarDays className="text-[#8b8b9e] w-3.5 h-3.5" />
                <span className="text-[#8b8b9e] text-[10px] font-medium uppercase tracking-wider">{formattedDate}</span>
            </div>
        </div>
    );

    return (
        <div className="relative flex-shrink-0 z-50">
            {/* Desktop Full Clock (Borderless Text) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="hidden sm:block"
            >
                {desktopClock}
            </motion.div>

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="sm:hidden w-8 h-8 rounded-lg bg-[#12121a] border border-[#1e1e2e] flex items-center justify-center text-[#8b8b9e] hover:text-[#d4a853] hover:border-[#d4a853]/50 transition-colors cursor-pointer shrink-0"
            >
                <LuClock size={16} />
            </button>

            {/* Mobile Expanded Overlay Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[120%] right-0 sm:hidden min-w-[170px]"
                    >
                        {mobileDropdown}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RealTimeClock;

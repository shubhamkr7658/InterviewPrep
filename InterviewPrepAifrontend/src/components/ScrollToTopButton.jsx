import { useState, useEffect } from "react";
import { LuArrowUp } from "react-icons/lu";

/**
 * ScrollToTopButton
 * - Appears (fade in) after the user scrolls > 300px
 * - Fixed bottom-right corner — sits above all other content
 * - Smooth scroll to top on click
 */
const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            title="Back to top"
            aria-label="Scroll to top"
            style={{
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.85)",
                transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
            className="
        fixed bottom-5 right-4
        sm:bottom-6 sm:right-6
        z-[999]
        w-10 h-10
        rounded-full
        bg-gradient-to-br from-[#d4a853] to-[#e8c87a]
        shadow-lg shadow-[#d4a853]/30
        flex items-center justify-center
        cursor-pointer
        hover:scale-110
        hover:shadow-[#d4a853]/50
        active:scale-95
        focus:outline-none
        focus:ring-2 focus:ring-[#d4a853]/60
        focus:ring-offset-2 focus:ring-offset-[#0a0a0f]
      "
        >
            <LuArrowUp size={18} className="text-black" strokeWidth={2.5} />
        </button>
    );
};

export default ScrollToTopButton;

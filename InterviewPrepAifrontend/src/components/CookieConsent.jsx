import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already consented
        const hasConsented = document.cookie
            .split('; ')
            .find((row) => row.startsWith('cookie_consent='));

        if (!hasConsented) {
            // Small delay before showing the banner
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        // Set a cookie that expires in 1 year
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 365);
        document.cookie = `cookie_consent=true; expires=${expirationDate.toUTCString()}; path=/`;
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-6 md:px-0 pointer-events-none"
                >
                    {/* Main Cookie Banner Container */}
                    <div className="pointer-events-auto relative w-full max-w-[500px] bg-[#12121a]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-[#1e1e2e] hover:border-[#d4a853]/30 transition-colors duration-300">

                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#d4a853]/5 to-transparent rounded-2xl pointer-events-none" />

                        {/* Cookie Icon Box */}
                        <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center bg-[#d4a853]/10 rounded-xl mr-4 sm:mr-5 border border-[#d4a853]/20">
                            <span className="text-2xl sm:text-3xl drop-shadow-[0_2px_8px_rgba(212,168,83,0.4)]">🍪</span>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 mr-4">
                            <h4 className="text-[#d4a853] text-[13px] sm:text-[14px] font-semibold tracking-wider uppercase mb-0.5">We Use Cookies</h4>
                            <p className="text-[#8b8b9e] text-[12px] sm:text-[13px] leading-snug">
                                To enhance your experience and provide personalized content.
                            </p>
                        </div>

                        {/* Accept Button */}
                        <button
                            onClick={handleAccept}
                            className="relative z-10 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] hover:opacity-90 active:scale-95 text-black font-semibold py-2 sm:py-2.5 px-5 sm:px-6 rounded-xl transition-all whitespace-nowrap text-[13px] sm:text-[14px] shadow-[0_4px_15px_rgba(212,168,83,0.2)] cursor-pointer"
                        >
                            Accept
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;

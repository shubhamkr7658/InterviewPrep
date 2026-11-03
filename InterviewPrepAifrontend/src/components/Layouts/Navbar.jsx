import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { LuLogOut, LuUser, LuBrainCircuit } from "react-icons/lu";
import RealTimeClock from "../RealTimeClock";
import ProfileUpdateModal from "../Cards/ProfileUpdateModal";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1e1e2e] px-3 sm:px-8 py-3 flex items-center justify-between">
                {/* Logo */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
                >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#e8c87a] flex items-center justify-center">
                        <LuBrainCircuit className="text-black w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="text-[14px] sm:text-lg font-bold text-white tracking-tight whitespace-nowrap">
                        Interview Prep{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] to-[#e8c87a]">
                            AI
                        </span>
                    </span>
                </button>

                {/* Right side */}
                <div className="flex items-center gap-1.5 sm:gap-4 shrink-0 ml-2">
                    <RealTimeClock />

                    <div className="flex items-center gap-1.5 sm:gap-3 border-l border-[#1e1e2e] pl-1.5 sm:pl-4">
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
                        >
                            {user?.profileImageUrl ? (
                                <img
                                    src={user.profileImageUrl}
                                    alt={user.name}
                                    className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full object-cover border-2 border-[#d4a853]/30 group-hover:border-[#d4a853]"
                                />
                            ) : (
                                <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-[#d4a853]/10 flex items-center justify-center group-hover:bg-[#d4a853]/20">
                                    <LuUser className="text-[#d4a853] w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-[#c0c0c0] hidden lg:block group-hover:text-white transition-colors">
                                {user?.name}
                            </span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-xs font-semibold text-[#8b8b9e] hover:text-red-400 transition-colors cursor-pointer px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-red-500/10 shrink-0"
                        >
                            <LuLogOut size={15} />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <ProfileUpdateModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </>
    );
};

export default Navbar;

import { useState, useEffect, useRef } from "react";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import Signup from "./Auth/SignUp";
import { useUser } from "../context/userContext";
import {
  LuBrainCircuit,
  LuSparkles,
  LuArrowRight,
  LuZap,
  LuShield,
  LuTarget,
} from "react-icons/lu";

// Floating particles background
const Particles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 12,
    size: 1 + Math.random() * 3,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d4a853]"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Huge background text tracking mouse
const MouseTrackText = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Buttery smooth GSAP-like spring config
  const springConfig = { damping: 30, stiffness: 100, mass: 0.5, restDelta: 0.001 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Increased range of motion slightly for better feel
      x.set((e.clientX - centerX) * -0.2);
      y.set((e.clientY - centerY) * -0.2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <div className="absolute top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none flex items-center justify-center z-0 opacity-[0.03]">
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="flex flex-col items-center justify-center whitespace-nowrap select-none"
      >
        <h1 className="text-[6rem] sm:text-[10rem] md:text-[16rem] lg:text-[24rem] font-bold text-[#d4a853] leading-[0.85] tracking-tighter">
          MORE.
        </h1>
        <h1 className="text-[6rem] sm:text-[10rem] md:text-[16rem] lg:text-[24rem] font-bold text-[#d4a853] leading-[0.85] tracking-tighter ml-16 sm:ml-32 md:ml-48">
          FAST.
        </h1>
      </motion.div>
    </div>
  );
};

// Mouse tracking spotlight
const MouseGlow = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouse = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-10"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background:
          "radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
        transition: "left 0.15s ease-out, top 0.15s ease-out",
      }}
    />
  );
};

const featureIcons = [LuTarget, LuSparkles, LuShield, LuBrainCircuit, LuZap];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const NumberCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // easeOutExpo
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(ease * value));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatNumber = (num) => {
    if (num >= 10000) return "10K+";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return <>{formatNumber(count)}</>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const featuresRef = useRef(null);

  const handleCTA = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setOpenAuthModel(true);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-[#0a0a0f] overflow-x-hidden relative">
        <Particles />
        <MouseGlow />
        <MouseTrackText />

        {/* Ambient glow orbs */}
        <div className="pointer-events-none fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-150 max-h-150 bg-[#d4a853]/5 rounded-full blur-[120px] z-0" />
        <div className="pointer-events-none fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] max-w-125 max-h-125 bg-purple-500/5 rounded-full blur-[120px] z-0" />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1e1e2e]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-[#d4a853] to-[#e8c87a] flex items-center justify-center shrink-0">
                <LuBrainCircuit size={16} className="text-black" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight">
                Interview Prep{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d4a853] to-[#e8c87a] block sm:inline">
                  AI
                </span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              {user ? (
                <button
                  className="bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-[10px] sm:text-sm font-semibold text-black px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              ) : (
                <button
                  className="bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-[10px] sm:text-sm font-semibold text-black px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
                  onClick={() => setOpenAuthModel(true)}
                >
                  Login / Sign Up
                </button>
              )}
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 lg:pt-40 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#d4a853] font-medium bg-[#d4a853]/10 border border-[#d4a853]/20 px-4 py-1.5 rounded-full mb-6"
            >
              <LuSparkles size={13} />
              AI-Powered Interview Preparation
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] sm:leading-[1.1] tracking-tight"
            >
              Ace Interviews with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] via-[#e8c87a] to-[#d4a853] bg-[length:200%_200%] animate-text-shine block sm:inline mt-2 sm:mt-0">
                AI-Powered
              </span>{" "}
              Learning
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#8b8b9e] mb-10 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Get role-specific questions, expand answers when you need them,
              dive deeper into concepts, and organize everything your way.
              From preparation to mastery — your ultimate interview toolkit.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={handleCTA}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-sm sm:text-base font-semibold text-black px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                Start Preparing Now
                <LuArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() =>
                  featuresRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto text-sm text-[#8b8b9e] hover:text-white border border-[#1e1e2e] hover:border-[#d4a853]/30 px-8 py-3 rounded-full transition-all duration-300 cursor-pointer"
              >
                Learn More
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-16 pt-8 border-t border-[#1e1e2e]"
            >
              {[
                { value: "10K+", label: "Questions Generated", isNumber: true, end: 10000 },
                { value: "AI", label: "Powered Explanations", isNumber: false },
                { value: "∞", label: "Practice Sessions", isNumber: false },
              ].map((stat, i) => (
                <div key={i} className="text-center flex-1 sm:flex-none min-w-[120px]">
                  <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] to-[#e8c87a]">
                    {stat.isNumber ? <NumberCounter value={stat.end} duration={3500} /> : stat.value}
                  </p>
                  <p className="text-[10px] sm:text-sm text-[#8b8b9e] mt-1 max-w-[100px] sm:max-w-none mx-auto leading-tight sm:leading-normal">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm text-[#d4a853] font-medium tracking-wider uppercase mb-3"
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            >
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] to-[#e8c87a]">
                Succeed
              </span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {APP_FEATURES.map((feature, index) => {
              const Icon = featureIcons[index] || LuSparkles;
              return (
                <motion.div
                  key={feature.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={index}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group bg-[#12121a] rounded-2xl p-6 border border-[#1e1e2e] hover:border-[#d4a853]/30 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="w-11 h-11 flex items-center justify-center bg-[#d4a853]/10 rounded-xl mb-4 group-hover:bg-[#d4a853]/20 transition-colors">
                      <Icon size={20} className="text-[#d4a853]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#8b8b9e] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 pb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-gradient-to-br from-[#12121a] to-[#1a1a28] rounded-3xl border border-[#1e1e2e] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4a853]/5 via-transparent to-[#d4a853]/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] to-[#e8c87a]">
                  Level Up
                </span>{" "}
                Your Interviews?
              </h2>
              <p className="text-[#8b8b9e] mb-8 max-w-lg mx-auto">
                Join thousands of professionals who ace their interviews with
                AI-powered preparation.
              </p>
              <button
                onClick={handleCTA}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-sm sm:text-base font-semibold text-black px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
                <LuArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 text-center py-8 px-4 text-xs text-[#8b8b9e] border-t border-[#1e1e2e] flex flex-col items-center gap-2">
          <p className="max-w-md">
            © {new Date().getFullYear()} Interview Prep AI. Built with ✦ for
            ambitious professionals.
          </p>
          <p>SAHITYA GHOSH</p>
        </footer>
      </div>

      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}
      </Modal>
    </>
  );
};

export default LandingPage;

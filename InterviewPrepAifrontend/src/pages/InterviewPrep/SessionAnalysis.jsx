import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuLoader, LuChartSpline, LuLightbulb, LuTarget } from "react-icons/lu";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line
} from 'recharts';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import RealTimeClock from "../../components/RealTimeClock";

export default function SessionAnalysis() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session");

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            navigate("/dashboard");
            return;
        }
        const fetchSession = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
                if (res.data.success) {
                    setSession(res.data.session);
                }
            } catch (error) {
                console.error("Failed to fetch session:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId, navigate]);

    // Derived Data
    const stats = useMemo(() => {
        if (!session || !session.questions) return null;
        const q = session.questions;
        const total = q.length;
        if (total === 0) return null;

        const pinned = q.filter(x => x.isPinned).length;
        const noted = q.filter(x => x.note).length;
        const aiExplained = q.filter(x => x.explanation).length;

        // Difficulty breakdown
        const diffCounts = { easy: 0, medium: 0, hard: 0 };
        q.forEach(x => {
            const level = x.difficulty?.toLowerCase() || 'medium';
            if (diffCounts[level] !== undefined) diffCounts[level]++;
        });

        // Basic fake keyword extraction for concept density
        // (Since we don't have predefined tags, we'll do a simple frequency count of words > 4 chars in questions)
        const wordFreq = {};
        const stopWords = new Set(["about", "which", "would", "could", "should", "there", "their", "where", "what", "when", "why", "how", "this", "that", "these", "those"]);

        q.forEach(x => {
            const words = x.question.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
            words.forEach(w => {
                if (w.length > 4 && !stopWords.has(w)) {
                    wordFreq[w] = (wordFreq[w] || 0) + 1;
                }
            });
        });

        // Sort and take top 6 concepts for the bar chart
        const topConcepts = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }));

        // Radar data mapping different metrics
        const radarData = [
            { subject: 'Completion', A: Math.round((aiExplained / total) * 100), fullMark: 100 },
            { subject: 'Engagement', A: Math.round(((pinned + noted) / (total * 2)) * 100), fullMark: 100 },
            { subject: 'Complexity', A: Math.round(((diffCounts.hard * 3 + diffCounts.medium * 2 + diffCounts.easy) / (total * 3)) * 100), fullMark: 100 },
            { subject: 'Exploration', A: Math.round((topConcepts.length * 15) > 100 ? 100 : topConcepts.length * 15), fullMark: 100 },
            { subject: 'Focus', A: 85, fullMark: 100 },
        ];

        // Line graph mock timeline (just based on distribution of questions over indices)
        const lineData = q.map((_, i) => ({
            name: `Q${i + 1}`,
            difficultyScore: q[i].difficulty === 'hard' ? 3 : q[i].difficulty === 'medium' ? 2 : 1
        }));

        return {
            total,
            pinned,
            noted,
            aiExplained,
            diffData: [
                { name: 'Easy', value: diffCounts.easy, color: '#34d399' },
                { name: 'Medium', value: diffCounts.medium, color: '#fbbf24' },
                { name: 'Hard', value: diffCounts.hard, color: '#f87171' }
            ].filter(d => d.value > 0),
            topConcepts,
            radarData,
            lineData
        };
    }, [session]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <LuLoader size={32} className="animate-spin text-[#d4a853]" />
            </div>
        );
    }

    if (!session || !stats) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center">
                <p>No analysis data available for this session.</p>
                <button onClick={() => navigate("/dashboard")} className="mt-4 text-[#d4a853] hover:underline">Return to Dashboard</button>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#12121a] border border-[#1e1e2e] p-3 rounded-lg shadow-xl shadow-black/50">
                    <p className="text-white text-sm font-semibold mb-1">{payload[0].name || payload[0].payload.name}</p>
                    <p className="text-[#c0c0c0] text-xs">
                        Value: <span className="font-bold text-[#d4a853]">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-[100dvh] bg-[#0a0a0f] text-white font-sans selection:bg-[#d4a853]/30">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1e1e2e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/interviewprep?session=${sessionId}`)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-none bg-[#12121a] border border-[#1e1e2e] text-[#8b8b9e] hover:text-white hover:border-[#d4a853]/50 transition-colors cursor-pointer shrink-0"
                        >
                            <LuArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-sm sm:text-base font-bold text-white leading-tight">Session Analysis</h1>
                            <p className="text-xs text-[#8b8b9e] truncate max-w-[150px] sm:max-w-md">{session.role}</p>
                        </div>
                    </div>

                    {/* Clock on the Right */}
                    <div className="flex items-center ml-2">
                        <RealTimeClock />
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Top Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    {[
                        { label: "Total Questions", value: stats.total, icon: LuChartSpline, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Pinned", value: stats.pinned, icon: LuTarget, color: "text-[#d4a853]", bg: "bg-[#d4a853]/10" },
                        { label: "Notes Taken", value: stats.noted, icon: LuChartSpline, color: "text-purple-400", bg: "bg-purple-500/10" },
                        { label: "AI Explanations", value: stats.aiExplained, icon: LuLightbulb, color: "text-emerald-400", bg: "bg-emerald-500/10" }
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#12121a] border border-[#1e1e2e] p-3 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                        >
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg flex items-center justify-center ${s.bg}`}>
                                <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-white leading-none mb-1 sm:mb-1.5">{s.value}</p>
                                <p className="text-[10px] sm:text-xs font-semibold text-[#8b8b9e] uppercase tracking-wider leading-tight">{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Difficulty Distribution (Pie) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-4 sm:p-6 lg:col-span-1 flex flex-col items-center"
                    >
                        <h3 className="text-[11px] sm:text-sm font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider self-start w-full border-b border-[#1e1e2e] pb-2 sm:pb-3">Difficulty Level</h3>
                        <div className="h-48 sm:h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.diffData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.diffData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                            {stats.diffData.map((d, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                    <span className="text-[10px] sm:text-xs text-[#c0c0c0]">{d.name} ({d.value})</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Target Concepts (Bar) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-4 sm:p-6 lg:col-span-2"
                    >
                        <h3 className="text-[11px] sm:text-sm font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider border-b border-[#1e1e2e] pb-2 sm:pb-3">Concept Density</h3>
                        <div className="h-56 sm:h-72 w-full">
                            {stats.topConcepts.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.topConcepts} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                                        <XAxis dataKey="name" stroke="#8b8b9e" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#8b8b9e" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#1e1e2e' }} />
                                        <Bar dataKey="count" fill="url(#colorGold)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                        <defs>
                                            <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#d4a853" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#8c6c31" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-[#8b8b9e] text-sm">Not enough data to calculate concepts.</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Performance Radar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-4 sm:p-6 lg:col-span-1 flex flex-col items-center"
                    >
                        <h3 className="text-[11px] sm:text-sm font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider self-start w-full border-b border-[#1e1e2e] pb-2 sm:pb-3">Session Footprint</h3>
                        <div className="h-48 sm:h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.radarData}>
                                    <PolarGrid stroke="#1e1e2e" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b8b9e', fontSize: 10 }} />
                                    <Radar name="Session" dataKey="A" stroke="#d4a853" fill="#d4a853" fillOpacity={0.3} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Question Difficulty Trend (Line) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-4 sm:p-6 lg:col-span-2"
                    >
                        <h3 className="text-[11px] sm:text-sm font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider border-b border-[#1e1e2e] pb-2 sm:pb-3">Difficulty Progression</h3>
                        <div className="h-48 sm:h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                                    <XAxis dataKey="name" stroke="#8b8b9e" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        stroke="#8b8b9e"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 4]}
                                        ticks={[1, 2, 3]}
                                        tickFormatter={(val) => val === 1 ? 'Easy' : val === 2 ? 'Medium' : val === 3 ? 'Hard' : ''}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#12121a', borderColor: '#1e1e2e', borderRadius: '8px' }}
                                        itemStyle={{ color: '#c0c0c0' }}
                                        labelStyle={{ display: 'none' }}
                                        formatter={(val) => [val === 1 ? 'Easy' : val === 2 ? 'Medium' : 'Hard', 'Difficulty']}
                                    />
                                    <Line type="monotone" dataKey="difficultyScore" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#d4a853', stroke: 'none' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}

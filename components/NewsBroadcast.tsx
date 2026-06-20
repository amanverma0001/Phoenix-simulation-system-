"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Zap, TrendingUp, Radio, Flame, ShieldAlert, X } from "lucide-react"

import { hiddenNews } from "@/lib/HiddenNewsData"

interface NewsItem {
    id: string
    text: string
    severity: "low" | "medium" | "high" | "critical" | "revealed"
    type: string
    timestamp: number
}

interface NewsBroadcastProps {
    events: any[]
    isCollapsed: boolean
    stability: number
}

export default function NewsBroadcast({ events, isCollapsed, stability }: NewsBroadcastProps) {
    const [news, setNews] = useState<NewsItem[]>([])
    const [breakingNews, setBreakingNews] = useState<NewsItem | null>(null)
    const processedEventIdsRef = useRef<Set<string>>(new Set())
    const hiddenNewsIndexRef = useRef(0)

    useEffect(() => {
        // Filter out events we've already processed
        const newEvents = events.filter(e => !processedEventIdsRef.current.has(e.id));

        if (newEvents.length > 0) {
            const items: NewsItem[] = newEvents.map(e => ({
                id: e.id,
                text: e.description,
                severity: e.severity,
                type: e.type,
                timestamp: Date.now()
            }));

            // Mark as processed
            newEvents.forEach(e => processedEventIdsRef.current.add(e.id));

            // Deduplicate news array by ID when updating state
            setNews(prev => {
                const existingIds = new Set(prev.map(n => n.id));
                const uniqueItems = items.filter(item => !existingIds.has(item.id));
                return [...uniqueItems, ...prev].slice(0, 5);
            });

            // Trigger Breaking News for critical/high events
            const critical = items.find(i => i.severity === 'critical' || i.severity === 'high');
            if (critical) {
                setBreakingNews(critical);
                setTimeout(() => setBreakingNews(null), 8000);
            }
        }
    }, [events]);

    // Shadow Signals: Inject hidden truths when stability is < 30%
    useEffect(() => {
        if (stability >= 30) return;

        const interval = setInterval(() => {
            const hiddenText = hiddenNews[hiddenNewsIndexRef.current % hiddenNews.length];
            hiddenNewsIndexRef.current++;

            const shadowSignal: NewsItem = {
                id: `shadow-${Date.now()}`,
                text: hiddenText,
                severity: 'revealed',
                type: 'SHADOW_INTEL',
                timestamp: Date.now()
            };

            setNews(prev => [shadowSignal, ...prev].slice(0, 5));
        }, 5000);

        return () => clearInterval(interval);
    }, [stability]);

    // Dismiss a single news item
    const dismissNews = (id: string) => {
        setNews(prev => prev.filter(item => item.id !== id));
    };

    // Dismiss breaking news
    const dismissBreakingNews = () => {
        setBreakingNews(null);
    };

    // Dismiss all news
    const dismissAllNews = () => {
        setNews([]);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical": return "text-red-500";
            case "high": return "text-orange-500";
            case "medium": return "text-yellow-500";
            case "revealed": return "text-purple-400";
            default: return "text-cyan-400";
        }
    };

    const getStatusInfo = (val: number) => {
        if (val >= 90) return { label: 'OPTIMAL', color: 'text-cyan-400' };
        if (val >= 70) return { label: 'DEGRADED', color: 'text-yellow-400' };
        if (val >= 50) return { label: 'CRITICAL', color: 'text-orange-500' };
        return { label: 'COLLAPSE', color: 'text-red-500' };
    };

    const status = getStatusInfo(stability);

    if (news.length === 0 && !isCollapsed) return null;

    return (
        <div className="fixed bottom-24 right-8 z-40 flex flex-col items-end gap-3 pointer-events-none">
            {/* Breaking News Cinematic Overlay */}
            <AnimatePresence>
                {breakingNews && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="w-[400px] glass-premium border-l-4 border-red-600 p-6 shadow-[0_0_50px_rgba(255,0,0,0.2)] overflow-hidden relative pointer-events-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={dismissBreakingNews}
                            className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all hover:scale-110 active:scale-95 z-10"
                            title="Dismiss"
                        >
                            <X size={14} />
                        </button>

                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Flame size={80} />
                        </div>
                        {/* Scanline Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 2px' }} />

                        <div className="flex items-center gap-2 mb-2">
                            <ShieldAlert className="text-red-500 animate-pulse" size={20} />
                            <span className="text-red-500 font-black font-mono text-xs tracking-[0.4em] uppercase">Emergency Broadcast</span>
                        </div>
                        <h2 className="text-2xl font-black text-white leading-tight uppercase font-orbitron mb-2 pr-8">
                            {breakingNews.text}
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="h-1 flex-1 bg-red-600/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-red-600"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 8, ease: "linear" }}
                                />
                            </div>
                            <span className="text-[10px] font-mono text-red-500 font-bold">LIVE REPORT</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Event Feed */}
            <div className="w-80 space-y-2">
                {/* Clear All Button - Only show when there are news items */}
                {news.length > 1 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={dismissAllNews}
                        className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all text-[9px] font-mono uppercase tracking-wider pointer-events-auto"
                    >
                        <X size={10} />
                        Clear All
                    </motion.button>
                )}

                <AnimatePresence mode="popLayout">
                    {news.slice(0, 3).map((item, index) => (
                        <motion.div
                            key={`${item.id}_${index}`}
                            layout
                            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                            animate={{
                                opacity: [0, 1, 0.5, 1, 1 - index * 0.2],
                                x: 0,
                                filter: 'blur(0px)'
                            }}
                            exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                            transition={{
                                opacity: { duration: 0.4, times: [0, 0.1, 0.2, 0.3, 1] },
                                default: { duration: 0.3 }
                            }}
                            className={`p-3 rounded-xl glass-premium-accent border-l-4 relative group pointer-events-auto ${item.severity === 'critical' ? 'border-red-500' :
                                item.severity === 'high' ? 'border-orange-500' :
                                    item.severity === 'revealed' ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-cyan-500'
                                }`}
                        >
                            {/* Close Button - Appears on hover */}
                            <button
                                onClick={() => dismissNews(item.id)}
                                className="absolute top-2 right-2 p-1 rounded-md bg-white/10 border border-white/20 text-white/50 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                                title="Dismiss"
                            >
                                <X size={10} />
                            </button>

                            <p className="text-[11px] font-bold text-white leading-snug line-clamp-2 uppercase tracking-wide pr-6">
                                {item.text}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className={`text-[9px] font-mono font-black ${getSeverityColor(item.severity)}`}>
                                    {item.type.toUpperCase()}
                                </span>
                                <span className="text-[8px] font-mono text-white/30">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Global Status Bar */}
            <motion.div
                className="w-80 glass-premium p-3 flex items-center justify-between pointer-events-auto"
                animate={isCollapsed ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${stability < 50 ? 'bg-red-500 animate-ping' : 'bg-toxic'}`} />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Global Coherence</span>
                        <span className={`text-xs font-mono font-black ${status.color}`}>
                            {stability.toFixed(1)}% {status.label}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-[10px] font-orbitron font-black ${isCollapsed ? 'text-red-500' : 'text-cyan-400'}`}>
                        {isCollapsed ? 'SYSTEM_FRACTURED' : 'SYSTEM_STABLE'}
                    </span>
                </div>
            </motion.div>
        </div>
    )
}


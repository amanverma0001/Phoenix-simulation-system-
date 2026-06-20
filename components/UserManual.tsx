"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Zap, Clock, Users, Shield, Target, Globe, MousePointer2, Command } from "lucide-react"

interface UserManualProps {
    isVisible: boolean
    onClose: () => void
}

const GUIDE_SECTIONS = [
    {
        title: "Strategic Foundation",
        icon: Globe,
        items: [
            { icon: Target, text: "Geopolitical Anchor", sub: "Click any country to set your primary stake. This tracks your 'Home Stability'." },
            { icon: MousePointer2, text: "Direct Action", sub: "Click any nation to view detailed stats or impose direct sanctions." },
        ]
    },
    {
        title: "Simulation Controls",
        icon: Zap,
        items: [
            { icon: BookOpen, text: "Crisis Scenarios", sub: "Choose from predefined historical fractures to trigger massive chains." },
            { icon: Shield, text: "Coherence Meter", sub: "Tracks world order. Below 50% triggers a global system collapse." },
        ]
    },
    {
        title: "Legendary Shortcuts",
        icon: Command,
        items: [
            { icon: Clock, text: "[T] Temporal Scrubber", sub: "Available after collapse. Rewind time to analyze the chain of failure." },
            { icon: Users, text: "[D] Diplomatic Council", sub: "Secure chat with AI superpowers to negotiate for global stability." },
            { icon: Zap, text: "[G] Scenario Gen", sub: "Infinite AI-powered scenarios based on your custom tactical prompts." },
        ]
    }
]

export default function UserManual({ isVisible, onClose }: UserManualProps) {
    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-4xl max-h-[85vh] glass-premium rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col shadow-[0_0_150px_rgba(0,255,255,0.1)]"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
                            <BookOpen className="text-cyan-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black font-orbitron text-white tracking-[0.3em] uppercase">Control Manual v1.0</h2>
                            <p className="text-xs font-mono text-cyan-500/60 uppercase tracking-widest">Tactical Operation Guidelines & Feature Index</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <span className="text-white/40 group-hover:text-white transition-colors text-xl">✕</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar">
                    {GUIDE_SECTIONS.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <section.icon className="text-cyan-400/40" size={16} />
                                <h3 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.5em]">{section.title}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {section.items.map((item, iIdx) => (
                                    <div key={iIdx} className="flex gap-4 group">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 transition-all">
                                            <item.icon size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{item.text}</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Tips */}
                <div className="p-6 bg-cyan-400/5 border-t border-white/10 flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-black text-[8px] font-black font-mono">PRO</span>
                        <span className="text-[10px] font-mono text-cyan-500/60 uppercase">Use <span className="text-cyan-400">[H]</span> to toggle HUD Visibility</span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-yellow-500 text-black text-[8px] font-black font-mono">TIP</span>
                        <span className="text-[10px] font-mono text-yellow-500/60 uppercase">Triple-click the Title for Matrix Mode</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

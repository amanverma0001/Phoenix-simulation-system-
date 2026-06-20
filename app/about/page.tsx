"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Github, Linkedin, Code, Zap, Globe, Shield,
    ArrowLeft, Heart, Star, ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    const features = [
        { icon: Globe, title: "Geopolitical Simulation", description: "Real-time cascade modeling of global instability" },
        { icon: Zap, title: "Emergence Detection", description: "AI-powered identification of winners and losers" },
        { icon: Shield, title: "Strategic Analysis", description: "Executive-level decision support system" },
        { icon: Code, title: "Open Architecture", description: "Built with Next.js, React, and D3.js" },
    ]

    const techStack = [
        "Next.js 14", "React 18", "TypeScript", "Tailwind CSS",
        "Framer Motion", "D3.js", "Web Audio API", "Lucide Icons"
    ]

    return (
        <div className="min-h-screen bg-black text-white overflow-auto">
            {/* Animated background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                            >
                                <ArrowLeft className="text-purple-400" size={20} />
                            </motion.button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black font-orbitron text-white tracking-wider uppercase">
                                About
                            </h1>
                            <p className="text-xs font-mono text-purple-500/60 uppercase tracking-widest">
                                Phoenix Simulator
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-black font-orbitron text-white uppercase tracking-tight mb-6">
                        PHOE<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">NIX</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        An interactive geopolitical collapse simulator that models cascading instability,
                        emergence patterns, and strategic decision-making in a world on the brink.
                    </p>
                </motion.div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all group"
                        >
                            <feature.icon className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 mb-16"
                >
                    <h3 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider mb-6">
                        Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {techStack.map((tech, index) => (
                            <motion.span
                                key={tech}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-purple-400"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Built for System Collapse Hackathon */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 mb-16"
                >
                    <Star className="text-yellow-400 mx-auto mb-4" size={40} />
                    <h3 className="text-2xl font-black font-orbitron text-white uppercase tracking-wider mb-4">
                        System Collapse Hackathon
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Built for the System Collapse hackathon — exploring systems where
                        rules drift, chaos emerges, and order collapses in beautiful ways.
                    </p>
                    <a
                        href="https://systemcollapse.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <span className="font-mono text-sm">systemcollapse.dev</span>
                        <ExternalLink size={14} />
                    </a>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-6"
                >
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.1 }}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                    >
                        <Github className="text-gray-400 hover:text-white transition-colors" size={24} />
                    </motion.a>
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.1 }}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                    >
                        <Linkedin className="text-gray-400 hover:text-white transition-colors" size={24} />
                    </motion.a>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-16 pt-8 border-t border-white/10"
                >
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                        Built with <Heart className="text-red-500 animate-pulse" size={14} /> for the future of simulation
                    </p>
                </motion.div>
            </main>
        </div>
    )
}

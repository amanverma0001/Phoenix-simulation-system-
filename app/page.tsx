"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import {
    Globe, Zap, BarChart3, Info, ChevronRight,
    Play, AlertTriangle, Sparkles, Shield, Users,
    TrendingDown, Activity, ChevronDown, Star, Cpu, Target
} from "lucide-react"
import Link from "next/link"

// Animated Counter Component
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0
    const isNumeric = /^\d+$/.test(value.replace('+', ''))

    const springValue = useSpring(0, { stiffness: 100, damping: 30 })
    const [displayValue, setDisplayValue] = useState("0")

    useEffect(() => {
        if (isInView && isNumeric) {
            springValue.set(numericValue)
        }
    }, [isInView, numericValue, isNumeric, springValue])

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest).toString())
        })
    }, [springValue])

    if (!isNumeric) {
        return <span ref={ref}>{value}</span>
    }

    return (
        <span ref={ref} className="counter-number">
            {displayValue}{value.includes('+') ? '+' : ''}{suffix}
        </span>
    )
}

export default function LandingPage() {
    const [mounted, setMounted] = useState(false)
    const [glitchText, setGlitchText] = useState("PHOENIX")
    const { scrollYProgress } = useScroll()
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100])

    // Magnetic button effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        mouseX.set(x * 0.15)
        mouseY.set(y * 0.15)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    useEffect(() => {
        setMounted(true)

        const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        const originalText = "PHOENIX"

        const interval = setInterval(() => {
            if (Math.random() > 0.85) {
                let glitched = ""
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() > 0.7) {
                        glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)]
                    } else {
                        glitched += originalText[i]
                    }
                }
                setGlitchText(glitched)
                setTimeout(() => setGlitchText(originalText), 100)
            }
        }, 1500)

        return () => clearInterval(interval)
    }, [])

    const features = [
        {
            icon: Zap,
            title: "Cascade Engine",
            description: "Watch instability propagate through interconnected systems in real-time",
            color: "from-yellow-500 to-orange-500",
            glowColor: "rgba(251, 191, 36, 0.3)"
        },
        {
            icon: Sparkles,
            title: "Emergence AI",
            description: "AI-powered detection of winners, losers, and surprising outcomes",
            color: "from-purple-500 to-pink-500",
            glowColor: "rgba(168, 85, 247, 0.3)"
        },
        {
            icon: Globe,
            title: "Global Simulation",
            description: "Interactive 3D globe with real geopolitical data and relationships",
            color: "from-cyan-500 to-blue-500",
            glowColor: "rgba(6, 182, 212, 0.3)"
        },
        {
            icon: Shield,
            title: "Executive Control",
            description: "Issue presidential directives and witness their cascading effects",
            color: "from-red-500 to-rose-500",
            glowColor: "rgba(239, 68, 68, 0.3)"
        },
    ]

    const stats = [
        { value: "15+", label: "Countries Modeled" },
        { value: "50+", label: "Cascade Scenarios" },
        { value: "Real-time", label: "Data Integration" },
        { value: "AI", label: "Emergence Detection" },
    ]

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Fixed background with enhanced gradient */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
                {/* Ambient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* ===== HERO SECTION ===== */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10"
            >
                {/* Enhanced floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-red-500/50' : i % 3 === 1 ? 'bg-orange-500/40' : 'bg-cyan-500/30'}`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${2 + Math.random() * 3}px`,
                                height: `${2 + Math.random() * 3}px`,
                            }}
                            animate={{
                                y: [0, -150 - Math.random() * 150],
                                x: [0, (Math.random() - 0.5) * 100],
                                opacity: [0, 0.8, 0],
                                scale: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </div>

                {/* Warning badge with glow */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 mb-10 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                >
                    <AlertTriangle className="text-red-400 animate-pulse" size={16} />
                    <span className="text-xs font-mono text-red-400 uppercase tracking-[0.2em]">
                        System Collapse Simulation
                    </span>
                </motion.div>

                {/* Main title with enhanced glow */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-orbitron text-center mb-8"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                        {glitchText}
                    </span>
                    {/* Glow layer */}
                    <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-500 blur-2xl opacity-50">
                        {glitchText}
                    </span>
                </motion.h1>

                {/* Subtitle with fade in */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-base sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-12 leading-relaxed px-4"
                >
                    An interactive <span className="text-red-400 font-semibold">geopolitical collapse simulator</span> where
                    cascading instability reveals emergent winners and losers in a world on the brink.
                </motion.p>

                {/* CTA Button with magnetic effect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Link href="/simulator">
                        <motion.button
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{ x: mouseX, y: mouseY }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold font-orbitron uppercase tracking-widest shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all overflow-hidden group"
                        >
                            {/* Shine sweep effect */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <Play size={22} className="relative z-10" />
                            <span className="relative z-10">Enter Simulation</span>
                            {/* Glow ring on hover */}
                            <span className="absolute inset-0 rounded-2xl border-2 border-red-400/50 scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2 text-gray-500"
                    >
                        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll to explore</span>
                        <ChevronDown size={20} className="animate-bounce" />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="relative py-32 px-6 z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-4xl font-black font-orbitron text-white uppercase tracking-wider mb-4">
                            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Systems</span>
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Experience the most advanced geopolitical simulation engine ever built
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
                                whileHover={{ scale: 1.02, y: -8 }}
                                className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden card-shine"
                                style={{ boxShadow: `0 0 0 0 ${feature.glowColor}` }}
                            >
                                {/* Gradient orb - enhanced */}
                                <motion.div
                                    className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${feature.color} rounded-full blur-3xl`}
                                    initial={{ opacity: 0.05 }}
                                    whileHover={{ opacity: 0.2, scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                />

                                <div className="relative">
                                    <motion.div
                                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}
                                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <feature.icon className="text-white" size={28} />
                                    </motion.div>
                                    <h3 className="text-xl font-bold font-orbitron text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Bottom shine line */}
                                <motion.div
                                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.color}`}
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    whileHover={{ scaleX: 1, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ transformOrigin: 'left' }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section className="relative py-24 px-6 z-10 border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                whileHover={{ scale: 1.05 }}
                                className="text-center group"
                            >
                                <p className="text-4xl md:text-5xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2 group-hover:from-orange-400 group-hover:to-red-400 transition-all">
                                    <AnimatedCounter value={stat.value} />
                                </p>
                                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NAVIGATION SECTION ===== */}
            <section className="relative py-32 px-6 z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-black font-orbitron text-white uppercase tracking-wider mb-4">
                            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Experience</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            { href: "/simulator", icon: Globe, label: "Launch Simulator", description: "Enter the geopolitical collapse experience and witness cascading instability", primary: true },
                            { href: "/analysis", icon: BarChart3, label: "Deep Analysis", description: "Explore post-simulation intelligence reports and emergence patterns" },
                            { href: "/about", icon: Info, label: "About Project", description: "Learn about the technology and the team behind the simulation" },
                        ].map((link, index) => (
                            <Link key={link.href} href={link.href}>
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                    whileHover={{ x: 10, scale: 1.01 }}
                                    className={`
                                        relative flex items-center gap-6 p-6 rounded-2xl border transition-all cursor-pointer group overflow-hidden
                                        ${link.primary
                                            ? 'bg-gradient-to-r from-red-500/10 to-transparent border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]'
                                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                                        }
                                    `}
                                >
                                    {/* Shine sweep */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                    <motion.div
                                        className={`p-4 rounded-xl ${link.primary ? 'bg-red-500/20' : 'bg-white/5'}`}
                                        whileHover={{ rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <link.icon className={link.primary ? 'text-red-400' : 'text-gray-500'} size={24} />
                                    </motion.div>
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-bold font-orbitron ${link.primary ? 'text-red-400' : 'text-white'} mb-1`}>
                                            {link.label}
                                        </h3>
                                        <p className="text-sm text-gray-500">{link.description}</p>
                                    </div>
                                    <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" size={24} />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HACKATHON SECTION ===== */}
            <section className="relative py-32 px-6 z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="p-12 rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent border border-red-500/20 relative overflow-hidden group"
                    >
                        {/* Animated background glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10"
                            animate={{ opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />

                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Star className="text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" size={48} />
                        </motion.div>
                        <h3 className="text-2xl md:text-3xl font-black font-orbitron text-white uppercase tracking-wider mb-4 relative z-10">
                            System Collapse Hackathon
                        </h3>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto relative z-10">
                            Built for the System Collapse hackathon — exploring systems where
                            rules drift, chaos emerges, and order collapses in beautiful ways.
                        </p>
                        <Link href="/simulator">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="relative px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-bold font-orbitron uppercase tracking-widest hover:bg-white/10 transition-all overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                                <span className="relative z-10">Experience the Collapse</span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="relative py-12 px-6 border-t border-white/5 z-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm font-mono text-gray-600">
                        © 2026 Phoenix Simulator
                    </p>
                    <div className="flex items-center gap-6 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                        <span>System Collapse Hackathon</span>
                        <span>•</span>
                        <span className="hover:text-cyan-400 transition-colors cursor-pointer">Press [?] for shortcuts</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}


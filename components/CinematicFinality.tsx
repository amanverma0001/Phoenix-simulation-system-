"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertOctagon, Zap, ShieldAlert, WifiOff } from "lucide-react"

interface CinematicFinalityProps {
    isActive: boolean
    stability: number
    onRestart: () => void
}

export default function CinematicFinality({ isActive, stability, onRestart }: CinematicFinalityProps) {
    const [glitchIntensity, setGlitchIntensity] = useState(0)

    useEffect(() => {
        if (!isActive) return

        const interval = setInterval(() => {
            setGlitchIntensity(Math.random())
        }, 100)

        return () => clearInterval(interval)
    }, [isActive])

    if (!isActive) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
        >
            {/* Glitch Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uWU6EB_v2/giphy.gif')] bg-cover bg-center grayscale mix-blend-screen" />
            </div>

            {/* Scanning Lines */}
            <div className="absolute inset-0 scanline-overlay opacity-50 pointer-events-none" />

            <div className="relative z-10 text-center space-y-12 p-8 max-w-4xl">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 1, -1, 0]
                    }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    className="flex justify-center"
                >
                    <div className="p-8 rounded-full bg-red-500/10 border-4 border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.5)]">
                        <AlertOctagon size={120} className="text-red-500" />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-7xl font-black font-orbitron text-red-500 tracking-[0.2em] uppercase leading-tight">
                        Global Coherence <br /> Lost
                    </h1>
                    <p className="text-2xl font-mono text-white/40 uppercase tracking-[0.5em]">The Order has Dissolved</p>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <StatCard icon={Zap} label="Energy Grid" value="OFFLINE" color="text-orange-500" />
                    <StatCard icon={ShieldAlert} label="Security" value="NULLIFIED" color="text-red-500" />
                    <StatCard icon={WifiOff} label="Comm Net" value="FRAGMENTED" color="text-gray-500" />
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRestart}
                    className="px-12 py-4 rounded-full border-2 border-white/20 text-white font-black font-orbitron uppercase tracking-widest hover:border-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                    Initialize New Reality
                </motion.button>
            </div>

            {/* Glitch Overlay Text */}
            <AnimatePresence>
                {glitchIntensity > 0.8 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none text-red-500/20 text-9xl font-black font-mono text-center select-none"
                    >
                        ERR_ORDER_NULL
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-xl">
            <Icon className={`${color} mx-auto`} size={24} />
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">{label}</p>
            <p className={`text-sm font-black font-orbitron ${color}`}>{value}</p>
        </div>
    )
}

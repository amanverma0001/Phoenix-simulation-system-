"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, Rewind, FastForward, Play, Pause, Clock } from "lucide-react"

interface TemporalScrubberProps {
    historyLength: number
    onScrub: (percentage: number) => void
    onExit: () => void
    isVisible: boolean
}

export default function TemporalScrubber({
    historyLength,
    onScrub,
    onExit,
    isVisible
}: TemporalScrubberProps) {
    const [percentage, setPercentage] = useState(100)
    const [isAutoPlaying, setIsAutoPlaying] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setPercentage(prev => {
                    if (prev >= 100) {
                        setIsAutoPlaying(false)
                        return 100
                    }
                    return prev + 1
                })
            }, 100)
        }
        return () => clearInterval(interval)
    }, [isAutoPlaying])

    useEffect(() => {
        onScrub(percentage)
    }, [percentage, onScrub])

    if (!isVisible || historyLength < 2) return null

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
            <div className="glass-premium p-4 flex flex-col gap-4 shadow-[0_0_50px_rgba(0,255,255,0.1)] border border-cyan-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="text-cyan-400 animate-pulse" size={18} />
                        <h3 className="text-xs font-black font-orbitron text-white tracking-[0.2em] uppercase">Temporal Analysis Mode</h3>
                    </div>
                    <button
                        onClick={onExit}
                        className="text-[10px] font-mono text-cyan-400 hover:text-white transition-colors"
                    >
                        [ EXIT_SCRIB_MODE ]
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-lg border border-white/5">
                        <button
                            onClick={() => setPercentage(0)}
                            className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                            <Rewind size={14} />
                        </button>
                        <button
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            className="p-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded-md transition-colors"
                        >
                            {isAutoPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                        </button>
                        <button
                            onClick={() => setPercentage(100)}
                            className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                            <FastForward size={14} />
                        </button>
                    </div>

                    <div className="flex-1 relative h-8 flex items-center">
                        {/* Background track */}
                        <div className="absolute inset-0 h-1.5 bg-white/5 my-auto rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500/20 w-full" />
                        </div>

                        {/* Active track */}
                        <div
                            className="absolute left-0 h-1.5 bg-cyan-500 my-auto rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all"
                            style={{ width: `${percentage}%` }}
                        />

                        {/* Actual input slider */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage}
                            onChange={(e) => {
                                setPercentage(parseInt(e.target.value))
                                setIsAutoPlaying(false)
                            }}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />

                        {/* Floating percentage label */}
                        <div
                            className="absolute -top-6 px-2 py-0.5 bg-cyan-500 text-black text-[10px] font-black rounded pointer-events-none -translate-x-1/2 shadow-lg"
                            style={{ left: `${percentage}%` }}
                        >
                            {percentage}%
                        </div>
                    </div>

                    <div className="text-right min-w-[60px]">
                        <div className="text-[10px] font-mono text-white tracking-widest leading-none">SNAPSHOT</div>
                        <div className="text-lg font-black font-orbitron text-cyan-400">
                            {Math.floor((percentage / 100) * historyLength)}/{historyLength}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

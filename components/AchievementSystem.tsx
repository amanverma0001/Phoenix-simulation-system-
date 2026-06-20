"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Shield, Zap, Target, Binary, X } from 'lucide-react'
import type { SoundType } from '@/hooks/useSound'

export interface Achievement {
    id: string
    title: string
    description: string
    icon: typeof Trophy
    color: string
    points: number
    unlocked: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_shatter',
        title: 'The Great Filter',
        description: 'Triggered your first reality fracture sequence.',
        icon: Zap,
        color: '#06b6d4',
        points: 100,
        unlocked: false
    },
    {
        id: 'chaos_architect',
        title: 'Chaos Architect',
        description: 'Maintained global instability for over 60 seconds.',
        icon: Target,
        color: '#ef4444',
        points: 250,
        unlocked: false
    },
    {
        id: 'diplomat',
        title: 'The Kissinger',
        description: 'Averted a complete system collapse from a critical state.',
        icon: Shield,
        color: '#10b981',
        points: 300,
        unlocked: false
    },
    {
        id: 'black_swan',
        title: 'Black Swan Hunter',
        description: 'Discovered a hidden entity with a surprise score of 9.0+.',
        icon: Binary,
        color: '#8b5cf6',
        points: 500,
        unlocked: false
    },
    {
        id: 'god_mode',
        title: 'Reality Bender',
        description: 'Used 5+ different high-level actions in a single session.',
        icon: Star,
        color: '#f59e0b',
        points: 400,
        unlocked: false
    }
]

interface AchievementSystemProps {
    onUnlock?: (achievement: Achievement) => void
    playSound?: (sound: SoundType) => void
}

export default function AchievementSystem({ onUnlock, playSound }: AchievementSystemProps) {
    const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null)
    const [queue, setQueue] = useState<Achievement[]>([])

    // Global access for simulation engine to trigger achievements
    useEffect(() => {
        (window as any).triggerAchievement = (id: string) => {
            const achievement = ACHIEVEMENTS.find(a => a.id === id)
            const hasUnlocked = localStorage.getItem(`ach_${id}`)

            if (achievement && !hasUnlocked) {
                localStorage.setItem(`ach_${id}`, 'true')
                setQueue(prev => [...prev, achievement])
                onUnlock?.(achievement)
            }
        }

        return () => {
            delete (window as any).triggerAchievement
        }
    }, [onUnlock])

    // Handle achievement queue
    useEffect(() => {
        if (queue.length > 0 && !activeAchievement) {
            const next = queue[0]
            setActiveAchievement(next)
            setQueue(prev => prev.slice(1))

            // Play success sound
            playSound?.('success' as any)

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setActiveAchievement(null)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [queue, activeAchievement, playSound])

    return (
        <AnimatePresence>
            {activeAchievement && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8, filter: 'blur(10px)' }}
                    className="fixed top-24 right-8 z-[10000] w-80"
                >
                    <div className="relative group">
                        {/* Manual Close Button */}
                        <button
                            onClick={() => setActiveAchievement(null)}
                            className="absolute -top-2 -right-2 z-50 p-1.5 bg-slate-900 border border-white/10 rounded-full text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={12} />
                        </button>

                        {/* Background Glow */}
                        <div
                            className="absolute -inset-0.5 rounded-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"
                            style={{ background: `linear-gradient(to right, ${activeAchievement.color}, #00ffff)` }}
                        />

                        {/* Notification Content */}
                        <div className="relative flex items-center gap-4 bg-slate-900 border border-white/10 rounded-xl p-5 overflow-hidden">
                            {/* Icon Container */}
                            <div
                                className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${activeAchievement.color}20`, border: `1px solid ${activeAchievement.color}40` }}
                            >
                                <activeAchievement.icon
                                    size={32}
                                    style={{ color: activeAchievement.color }}
                                    className="animate-pulse"
                                />
                            </div>

                            {/* Text */}
                            <div className="flex-1">
                                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                                    Achievement Unlocked
                                </div>
                                <div className="text-white font-black text-lg leading-tight">
                                    {activeAchievement.title}
                                </div>
                                <div className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    {activeAchievement.description}
                                </div>
                            </div>

                            {/* Reward Points */}
                            <div className="mt-2 absolute bottom-2 right-4 text-[10px] font-mono text-cyan-400 opacity-50">
                                +{activeAchievement.points} PTS
                            </div>

                            {/* Shine Effect Animation */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[200%]"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                style={{ pointerEvents: 'none' }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

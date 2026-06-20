"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, AlertCircle, Zap, TrendingDown, Network, Activity } from 'lucide-react'

interface ForecastData {
    title: string
    probability: number
    rippleCount: number
    primaryVector: string
    fallout: string
    severity: 'low' | 'medium' | 'high' | 'critical'
}

interface AIForecastPanelProps {
    isVisible: boolean
    activeScenario: string | null
    actionTarget: string | null
}

export default function AIForecastPanel({ isVisible, activeScenario, actionTarget }: AIForecastPanelProps) {
    const [forecast, setForecast] = useState<ForecastData | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    useEffect(() => {
        if (!isVisible || !activeScenario) {
            setForecast(null)
            return
        }

        setIsAnalyzing(true)
        const timer = setTimeout(() => {
            setForecast(generateForecast(activeScenario, actionTarget))
            setIsAnalyzing(false)
        }, 1200)

        return () => clearTimeout(timer)
    }, [isVisible, activeScenario, actionTarget])

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            className="fixed top-24 right-4 z-40 w-80"
        >
            <div className="bg-slate-900/90 backdrop-blur-3xl border-2 border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20">
                {/* Header */}
                <div className="bg-cyan-500/10 px-4 py-3 flex items-center justify-between border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                        <Bot size={18} className="text-cyan-400" />
                        <span className="text-xs font-black uppercase tracking-tighter text-cyan-400">
                            AI Forecast Engine v4.0
                        </span>
                    </div>
                    {isAnalyzing ? (
                        <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    className="w-1 h-1 bg-cyan-400 rounded-full"
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-[10px] font-mono text-cyan-600">IDLE</div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    <AnimatePresence mode="wait">
                        {isAnalyzing ? (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                            >
                                <div className="relative">
                                    <Activity size={32} className="text-cyan-500/20" />
                                    <motion.div
                                        className="absolute inset-0"
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <Activity size={32} className="text-cyan-400" />
                                    </motion.div>
                                </div>
                                <div className="text-xs text-slate-500 font-mono tracking-widest animate-pulse">
                                    CALCULATING FRAGMENTATION VECTORS...
                                </div>
                            </motion.div>
                        ) : forecast ? (
                            <motion.div
                                key="forecast"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Score Cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    <MetricCard
                                        label="Fracture Risk"
                                        value={`${forecast.probability}%`}
                                        icon={AlertCircle}
                                        color={forecast.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}
                                    />
                                    <MetricCard
                                        label="Ripple Impact"
                                        value={forecast.rippleCount}
                                        icon={Network}
                                        color="text-cyan-400"
                                    />
                                </div>

                                {/* Narrative */}
                                <div className="space-y-1.5">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Predicted Fallout</div>
                                    <div className="text-sm font-bold text-white leading-snug">
                                        {forecast.title}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed italic">
                                        "{forecast.fallout}"
                                    </p>
                                </div>

                                {/* Primary Vector */}
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingDown size={14} className="text-purple-400" />
                                        <span className="text-[10px] text-purple-300 uppercase font-black">Primary Vector</span>
                                    </div>
                                    <div className="text-xs text-slate-200">
                                        {forecast.primaryVector}
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                                    <Zap size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-[10px] text-yellow-100/60 leading-tight">
                                        Critical warning: This action may permanently lower the global coherence floor.
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="py-12 text-center text-xs text-slate-600 italic">
                                Select a target to initialize AI fragmentation analysis.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

function MetricCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
    return (
        <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1 opacity-50">
                <Icon size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
            </div>
            <div className={`text-2xl font-black font-mono tracking-tighter ${color}`}>
                {value}
            </div>
        </div>
    )
}

function generateForecast(scenario: string, target: string | null): ForecastData {
    const targetName = target?.toUpperCase() || 'SYSTEM'

    const templates: Record<string, ForecastData> = {
        'SANCTION': {
            title: 'European Energy Cascades',
            probability: 78,
            rippleCount: 14,
            primaryVector: 'Supply Chain Asymmetry',
            fallout: `Sanctioning Russia will trigger an immediate trade deficit in Central Europe, potentially forcing a 30% industrial scaleback in Germany.`,
            severity: 'high'
        },
        'SANCTION_CHINA': {
            title: 'Supply Chain Decoupling',
            probability: 85,
            rippleCount: 31,
            primaryVector: 'Manufacturing Entropy',
            fallout: `Severe disruption to semiconductor and rare-earth flows. Global hardware inflation index predicted to rise by 45%.`,
            severity: 'critical'
        },
        'SANCTION_USA': {
            title: 'Financial Hegemony Shock',
            probability: 55,
            rippleCount: 19,
            primaryVector: 'Capital Flight',
            fallout: `Swift network alternatives will likely activate. Regional currencies expected to undergo violent re-pegging cycles.`,
            severity: 'high'
        },
        'ALLIANCE': {
            title: 'Bloc Realignment Pulse',
            probability: 32,
            rippleCount: 6,
            primaryVector: 'Geopolitical Consolidation',
            fallout: `System coherence temporary floor raised. Paradoxically, opposing blocs may accelerate re-armament in response.`,
            severity: 'low'
        },
        'BLOCKADE': {
            title: 'Resource Starvation Event',
            probability: 92,
            rippleCount: 22,
            primaryVector: 'Maritime Chokepoint Pulse',
            fallout: `3M barrels of daily transit halted; global energy prices undergo violent spot-market volatility. Dark Sea protocol active.`,
            severity: 'critical'
        }
    }

    return templates[scenario] || {
        title: 'Generic Reality Fracture',
        probability: 50,
        rippleCount: 10,
        primaryVector: 'Entropy Acceleration',
        fallout: `The selected action against ${targetName} increases chaotic noise in the simulation by 1.25x. System coherence will likely fluctuate.`,
        severity: 'medium'
    }
}

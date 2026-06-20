"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Shield, Zap, Globe, Lock, DollarSign, AlertTriangle,
    Play, Terminal, Cpu, Activity, TrendingUp, TrendingDown,
    Radio, AlertOctagon, ChevronRight
} from "lucide-react"

interface Directive {
    id: string
    title: string
    description: string
    icon: any
    cost: number
    impact: string
    stabilityBoost: number
    coherenceBoost: number
    type: 'economic' | 'security' | 'diplomatic'
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    executionTime: string
}

const DIRECTIVES: Directive[] = [
    {
        id: 'stimulus',
        title: 'Emergency Stimulus',
        description: 'Inject massive liquidity into global markets to prevent institutional collapse. Central banks coordinate unprecedented asset purchases.',
        icon: DollarSign,
        cost: 40,
        impact: 'High Economic Stability, Low Coherence',
        stabilityBoost: 15,
        coherenceBoost: 5,
        type: 'economic',
        riskLevel: 'MEDIUM',
        executionTime: '72 HOURS'
    },
    {
        id: 'lockdown',
        title: 'Border Lockdown',
        description: 'Secure all major trade chokepoints and national borders. Deploy military assets to contain social contagion and prevent mass migration.',
        icon: Lock,
        cost: 30,
        impact: 'Medium Security, High Fracture Risk',
        stabilityBoost: 5,
        coherenceBoost: -10,
        type: 'security',
        riskLevel: 'HIGH',
        executionTime: '24 HOURS'
    },
    {
        id: 'accord',
        title: 'Global Accord',
        description: 'Initiate an emergency G20+ Summit to restore international cooperation. Propose unified response protocols and resource sharing agreements.',
        icon: Globe,
        cost: 50,
        impact: 'High Global Coherence, Medium Stability',
        stabilityBoost: 10,
        coherenceBoost: 20,
        type: 'diplomatic',
        riskLevel: 'LOW',
        executionTime: '7 DAYS'
    },
    {
        id: 'nationalize',
        title: 'Resource Control',
        description: 'Nationalize critical energy and food assets to ensure domestic survival. Seize strategic reserves and implement rationing protocols.',
        icon: Zap,
        cost: 25,
        impact: 'Instant Local Stability, Severe Global Tension',
        stabilityBoost: 20,
        coherenceBoost: -25,
        type: 'security',
        riskLevel: 'CRITICAL',
        executionTime: 'IMMEDIATE'
    }
]

interface ExecutiveDirectivesProps {
    isVisible: boolean
    onClose: () => void
    onExecute: (directive: Directive) => void
    globalStability: number
}

export default function ExecutiveDirectives({ isVisible, onClose, onExecute, globalStability }: ExecutiveDirectivesProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isExecuting, setIsExecuting] = useState(false)
    const [countdown, setCountdown] = useState(3)
    const [systemTime, setSystemTime] = useState('')
    const selectedDirective = DIRECTIVES.find(d => d.id === selectedId)

    // Update system time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setSystemTime(now.toISOString().slice(0, 19).replace('T', ' '))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    // Handle execution countdown
    const handleExecute = () => {
        if (!selectedDirective) return
        setIsExecuting(true)
        setCountdown(3)

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setTimeout(() => {
                        onExecute(selectedDirective)
                        setIsExecuting(false)
                        setSelectedId(null)
                    }, 500)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/30'
            case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
            case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
            case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/30'
            default: return 'text-gray-400'
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'economic': return 'from-emerald-500/20 to-green-500/5'
            case 'security': return 'from-red-500/20 to-orange-500/5'
            case 'diplomatic': return 'from-blue-500/20 to-cyan-500/5'
            default: return 'from-gray-500/20 to-gray-500/5'
        }
    }

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            {/* Animated grid background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            </div>

            <motion.div
                className="relative w-full max-w-6xl h-[85vh] rounded-3xl overflow-hidden"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Holographic border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-red-500/30 via-transparent to-red-500/10 p-[1px]">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse" />
                </div>

                {/* Main container */}
                <div className="relative h-full bg-black/90 backdrop-blur-3xl rounded-3xl border border-red-500/20 flex flex-col overflow-hidden">

                    {/* Scan line effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent h-32 pointer-events-none"
                        animate={{ y: [-128, 800] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* === HEADER === */}
                    <div className="relative p-6 border-b border-red-500/20 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                {/* Animated shield icon */}
                                <motion.div
                                    className="relative p-4 bg-red-500/10 rounded-2xl border border-red-500/30"
                                    animate={{
                                        boxShadow: [
                                            '0 0 20px rgba(239,68,68,0.2)',
                                            '0 0 40px rgba(239,68,68,0.4)',
                                            '0 0 20px rgba(239,68,68,0.2)'
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Shield className="text-red-400" size={28} />
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                </motion.div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black font-orbitron text-white tracking-wider uppercase">
                                            Presidential Command Terminal
                                        </h2>
                                        <span className="px-3 py-1 text-[10px] font-mono font-bold bg-green-500/20 text-green-400 rounded-full border border-green-500/30 uppercase tracking-widest">
                                            ONLINE
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] font-mono text-red-500/60 uppercase tracking-[0.3em]">
                                            Level S-1 Clearance
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-600">•</span>
                                        <span className="text-[10px] font-mono text-gray-500">
                                            Session: {systemTime} UTC
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* System status indicators */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                    <Cpu className="text-cyan-400" size={16} />
                                    <div>
                                        <p className="text-[9px] font-mono text-gray-500 uppercase">System Load</p>
                                        <p className="text-sm font-bold font-orbitron text-white">{100 - globalStability}%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                    <Radio className="text-green-400 animate-pulse" size={16} />
                                    <div>
                                        <p className="text-[9px] font-mono text-gray-500 uppercase">Uplink</p>
                                        <p className="text-sm font-bold font-orbitron text-green-400">Active</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-red-500/10 rounded-xl text-gray-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* === MAIN CONTENT === */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* Directive Cards */}
                        <div className="w-[400px] border-r border-white/10 p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-white/[0.02] to-transparent">
                            <div className="flex items-center gap-2 mb-6">
                                <Terminal className="text-gray-500" size={16} />
                                <h3 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    Available Directives
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {DIRECTIVES.map((d, index) => (
                                    <motion.button
                                        key={d.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setSelectedId(d.id)}
                                        className={`
                                            relative w-full p-5 rounded-2xl border transition-all duration-300
                                            text-left group overflow-hidden
                                            ${selectedId === d.id
                                                ? 'bg-gradient-to-r from-red-500/15 to-transparent border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
                                                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                                            }
                                        `}
                                    >
                                        {/* Type gradient background */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(d.type)} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                        <div className="relative flex items-start gap-4">
                                            <motion.div
                                                className={`
                                                    p-3 rounded-xl transition-all duration-300
                                                    ${selectedId === d.id
                                                        ? 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                                        : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white'
                                                    }
                                                `}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            >
                                                <d.icon size={22} />
                                            </motion.div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className={`text-sm font-bold font-orbitron tracking-wide ${selectedId === d.id ? 'text-red-400' : 'text-white'}`}>
                                                        {d.title}
                                                    </p>
                                                    <ChevronRight className={`w-4 h-4 transition-all ${selectedId === d.id ? 'text-red-400 translate-x-0' : 'text-gray-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                                </div>

                                                {/* Cost bar */}
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[9px] font-mono text-gray-500 uppercase">Resource Cost</span>
                                                        <span className={`text-[10px] font-mono font-bold ${selectedId === d.id ? 'text-red-400' : 'text-white'}`}>{d.cost}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full rounded-full ${selectedId === d.id ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${d.cost}%` }}
                                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Risk badge */}
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md border ${getRiskColor(d.riskLevel)}`}>
                                                        {d.riskLevel}
                                                    </span>
                                                    <span className="text-[9px] font-mono text-gray-600">{d.executionTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Impact Analysis Panel */}
                        <div className="flex-1 p-8 bg-gradient-to-br from-black/50 to-transparent flex flex-col">
                            <AnimatePresence mode="wait">
                                {selectedDirective ? (
                                    <motion.div
                                        key={selectedDirective.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex-1 flex flex-col"
                                    >
                                        {/* Directive header */}
                                        <div className="mb-8">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Activity className="text-red-400" size={20} />
                                                <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.3em]">Impact Analysis</span>
                                            </div>
                                            <h4 className="text-4xl font-black font-orbitron text-white uppercase tracking-tight mb-4">
                                                {selectedDirective.title}
                                            </h4>
                                            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-2xl">
                                                {selectedDirective.description}
                                            </p>
                                        </div>

                                        {/* Impact metrics */}
                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <motion.div
                                                className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
                                                <div className="relative">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TrendingUp className="text-green-400" size={18} />
                                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Stability Impact</p>
                                                    </div>
                                                    <p className={`text-5xl font-black font-orbitron ${selectedDirective.stabilityBoost > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {selectedDirective.stabilityBoost > 0 ? '+' : ''}{selectedDirective.stabilityBoost}%
                                                    </p>
                                                    {/* Animated bar */}
                                                    <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full rounded-full ${selectedDirective.stabilityBoost > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.abs(selectedDirective.stabilityBoost) * 3}%` }}
                                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
                                                <div className="relative">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TrendingDown className="text-cyan-400" size={18} />
                                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global Coherence</p>
                                                    </div>
                                                    <p className={`text-5xl font-black font-orbitron ${selectedDirective.coherenceBoost > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                                        {selectedDirective.coherenceBoost > 0 ? '+' : ''}{selectedDirective.coherenceBoost}%
                                                    </p>
                                                    {/* Animated bar */}
                                                    <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full rounded-full ${selectedDirective.coherenceBoost > 0 ? 'bg-gradient-to-r from-cyan-500 to-blue-400' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.abs(selectedDirective.coherenceBoost) * 2}%` }}
                                                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Warning box */}
                                        <motion.div
                                            className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/5 border border-red-500/20 flex items-center gap-5 mb-8"
                                            animate={{
                                                borderColor: ['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.4)', 'rgba(239,68,68,0.2)']
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <AlertOctagon className="text-red-400 flex-shrink-0" size={24} />
                                            <div>
                                                <p className="text-[10px] font-mono text-red-400/60 uppercase tracking-widest mb-1">Projected Outcome</p>
                                                <p className="text-sm font-bold text-red-400">{selectedDirective.impact}</p>
                                            </div>
                                        </motion.div>

                                        {/* Execute button */}
                                        <div className="mt-auto">
                                            {isExecuting ? (
                                                <motion.div
                                                    className="w-full py-8 rounded-2xl bg-red-500/20 border-2 border-red-500 flex flex-col items-center justify-center"
                                                    animate={{ boxShadow: ['0 0 30px rgba(239,68,68,0.3)', '0 0 60px rgba(239,68,68,0.5)', '0 0 30px rgba(239,68,68,0.3)'] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                >
                                                    <p className="text-[10px] font-mono text-red-400 uppercase tracking-[0.5em] mb-2">Executing Directive</p>
                                                    <motion.p
                                                        className="text-6xl font-black font-orbitron text-red-500"
                                                        key={countdown}
                                                        initial={{ scale: 1.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                    >
                                                        {countdown}
                                                    </motion.p>
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleExecute}
                                                    className="relative w-full py-6 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/10 border-2 border-red-500 overflow-hidden group"
                                                >
                                                    {/* Animated gradient overlay */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0"
                                                        animate={{ x: ['-100%', '100%'] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <span className="relative text-xl font-black font-orbitron text-red-500 uppercase tracking-[0.3em] group-hover:text-red-400 transition-colors">
                                                        Execute Directive
                                                    </span>
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex-1 flex flex-col items-center justify-center text-center"
                                    >
                                        <motion.div
                                            animate={{
                                                y: [0, -10, 0],
                                                opacity: [0.3, 0.5, 0.3]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <Play className="w-20 h-20 text-gray-700 mb-6" />
                                        </motion.div>
                                        <p className="text-lg font-orbitron text-gray-600 uppercase tracking-widest mb-2">Select a Directive</p>
                                        <p className="text-sm text-gray-700 font-mono">Choose an action to view impact analysis</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* === FOOTER STATUS BAR === */}
                    <div className="relative p-4 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 border-t border-red-500/20">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-green-500"
                                        animate={{ boxShadow: ['0 0 5px #22c55e', '0 0 15px #22c55e', '0 0 5px #22c55e'] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Secure Channel</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${globalStability < 30 ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`} />
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                        Threat Level: <span className={globalStability < 30 ? 'text-red-400' : 'text-cyan-400'}>{globalStability < 30 ? 'SEVERE' : globalStability < 60 ? 'ELEVATED' : 'NORMAL'}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-gray-600">Latency: 12ms</span>
                                </div>
                            </div>
                            <motion.span
                                className="text-[10px] font-mono text-red-500/60 uppercase tracking-[0.2em] font-bold"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ⚠ All actions are final and irreversible
                            </motion.span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

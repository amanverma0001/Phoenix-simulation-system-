"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Sparkles, Terminal, Activity, ChevronRight, TrendingUp, TrendingDown, Building2, DollarSign, BarChart3, Gem, LineChart, Boxes, Zap, Target, X } from 'lucide-react'
import { AIWhatIf, SimulationConfig } from '@/lib/AIServices'

interface AIWhatIfInputProps {
    onExecute: (config: SimulationConfig) => void
    onClose?: () => void
}

export default function AIWhatIfInput({ onExecute, onClose }: AIWhatIfInputProps) {
    const [query, setQuery] = useState("")
    const [isInterpreting, setIsInterpreting] = useState(false)
    const [interpretedConfig, setInterpretedConfig] = useState<SimulationConfig | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleInterpret = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query || isInterpreting) return

        setIsInterpreting(true)
        setInterpretedConfig(null)
        setError(null)
        try {
            const config = await AIWhatIf.interpret(query)
            if (config && config.scenario) {
                setInterpretedConfig(config)
            } else {
                setError("AI returned invalid response. Try rephrasing your query.")
            }
        } catch (e: any) {
            console.error("Interpretation failed:", e)
            setError(e?.message || "Failed to interpret scenario. Check your API key.")
        } finally {
            setIsInterpreting(false)
        }
    }

    const handleExecute = () => {
        if (interpretedConfig) {
            onExecute(interpretedConfig)
            setQuery("")
            setInterpretedConfig(null)
        }
    }

    return (
        <div className="w-full max-h-[70vh] flex flex-col bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/5">
            {/* Header */}
            <div className="shrink-0 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-pink-500/10 via-transparent to-purple-500/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-500/20">
                        <MessageSquare size={16} className="text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                            Natural Language "What-If"
                            <span className="px-1.5 py-0.5 text-[7px] bg-pink-500/20 text-pink-300 rounded-full font-bold">AI</span>
                        </h4>
                        <p className="text-[9px] text-slate-500 font-mono">AI-POWERED SCENARIO TRANSLATOR</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                            title="Close"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <form onSubmit={handleInterpret} className="space-y-3">
                    {/* Input Field */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g. 'if India form alliance with Afghanistan'"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 transition-all duration-300 pr-12"
                            />
                            <button
                                type="submit"
                                disabled={!query || isInterpreting}
                                className="absolute right-1.5 p-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-md hover:from-pink-500 hover:to-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isInterpreting ? <Activity size={12} className="animate-spin" /> : <Send size={12} />}
                            </button>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <AnimatePresence>
                        {interpretedConfig && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="overflow-hidden"
                            >
                                {/* Scrollable Container - Fixed max height */}
                                <div
                                    className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-pink-500/20 rounded-xl overflow-hidden max-h-[320px]"
                                >
                                    <div
                                        className="overflow-y-auto p-3 space-y-3 max-h-[320px] scrollbar-thin"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgba(236, 72, 153, 0.4) rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {/* Scenario Header Card - Compact */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent p-3 rounded-lg border border-purple-500/20"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-yellow-500/10 rounded-md border border-yellow-500/20 shrink-0">
                                                    <Sparkles size={14} className="text-yellow-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[9px] uppercase font-black text-slate-500 tracking-wider mb-1 flex items-center gap-1">
                                                        <Target size={8} />
                                                        Proposed Scenario
                                                    </div>
                                                    <div className="text-xs font-bold text-white leading-snug mb-2">{interpretedConfig.scenario}</div>
                                                    <div className="text-[10px] text-slate-400 italic bg-black/20 px-2 py-1.5 rounded-md flex items-start gap-1.5">
                                                        <Zap size={10} className="text-yellow-400 mt-0.5 shrink-0" />
                                                        <span>"{interpretedConfig.expectedOutcome}"</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Financial Impact Section - Compact */}
                                        {(interpretedConfig as any).financialImpact && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.15 }}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center gap-1.5 px-1">
                                                    <DollarSign size={12} className="text-cyan-400" />
                                                    <span className="text-[9px] uppercase font-black text-cyan-400 tracking-widest">Financial Impact</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <CompactImpactCard
                                                        icon={<LineChart size={10} />}
                                                        label="Currencies"
                                                        value={(interpretedConfig as any).financialImpact.currencies}
                                                        color="cyan"
                                                    />
                                                    <CompactImpactCard
                                                        icon={<BarChart3 size={10} />}
                                                        label="Stock Markets"
                                                        value={(interpretedConfig as any).financialImpact.stockMarkets}
                                                        color="cyan"
                                                    />
                                                    <CompactImpactCard
                                                        icon={<Gem size={10} />}
                                                        label="Commodities"
                                                        value={(interpretedConfig as any).financialImpact.commodities}
                                                        color="cyan"
                                                    />
                                                    <CompactImpactCard
                                                        icon={<Building2 size={10} />}
                                                        label="Bonds"
                                                        value={(interpretedConfig as any).financialImpact.bonds}
                                                        color="cyan"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Corporate Impact Section - Compact */}
                                        {(interpretedConfig as any).corporateImpact && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center gap-1.5 px-1">
                                                    <Building2 size={12} className="text-emerald-400" />
                                                    <span className="text-[9px] uppercase font-black text-emerald-400 tracking-widest">Corporate Impact</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <CompactImpactCard
                                                        icon={<TrendingUp size={10} />}
                                                        label="Winners"
                                                        value={(interpretedConfig as any).corporateImpact.winners}
                                                        color="green"
                                                    />
                                                    <CompactImpactCard
                                                        icon={<TrendingDown size={10} />}
                                                        label="Losers"
                                                        value={(interpretedConfig as any).corporateImpact.losers}
                                                        color="red"
                                                    />
                                                    <CompactImpactCard
                                                        icon={<Boxes size={10} />}
                                                        label="Supply Chain"
                                                        value={(interpretedConfig as any).corporateImpact.supplyChain}
                                                        color="yellow"
                                                    />
                                                    <CompactImpactCard
                                                        icon={<BarChart3 size={10} />}
                                                        label="Investment"
                                                        value={(interpretedConfig as any).corporateImpact.investmentShifts}
                                                        color="purple"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Footer - Always visible outside scroll */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="mt-3 flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-3 rounded-xl border border-white/5"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-slate-600 uppercase font-bold tracking-wider">Complexity</span>
                                            <span className="text-xs font-mono text-pink-400 uppercase font-bold">{interpretedConfig.complexity}</span>
                                        </div>
                                        <div className="w-px h-6 bg-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-slate-600 uppercase font-bold tracking-wider">Actions</span>
                                            <span className="text-xs font-mono text-cyan-400 font-bold">{interpretedConfig.actions.length} Vectors</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleExecute}
                                        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-black uppercase rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-1.5 group shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-105 active:scale-95"
                                    >
                                        Execute Simulation
                                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                className="p-3 rounded-lg border border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/5"
                            >
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-red-400" />
                                    <span className="text-[10px] text-red-400 font-mono">{error}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="shrink-0 px-4 py-3 border-t border-white/5 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[8px] text-slate-600 font-mono">
                    <Terminal size={8} />
                    <span>GEMINI 2.5 FLASH</span>
                </div>
                <div className="flex items-center gap-3">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-600/50 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 transition-all text-[10px] font-mono font-bold uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                    )}
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-[8px] text-green-400/70 font-mono">ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Compact Impact Card Component
function CompactImpactCard({ icon, label, value, color }: {
    icon: React.ReactNode
    label: string
    value: string
    color: 'cyan' | 'green' | 'red' | 'yellow' | 'purple'
}) {
    const colorClasses = {
        cyan: 'border-cyan-500/20 text-cyan-400',
        green: 'border-emerald-500/20 text-emerald-400',
        red: 'border-red-500/20 text-red-400',
        yellow: 'border-yellow-500/20 text-yellow-400',
        purple: 'border-purple-500/20 text-purple-400'
    }

    return (
        <div className={`p-2.5 rounded-lg border bg-black/30 backdrop-blur-sm ${colorClasses[color]} hover:border-opacity-50 transition-colors`}>
            <div className={`flex items-center gap-1.5 mb-1.5 ${colorClasses[color]}`}>
                {icon}
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">{label}</span>
            </div>
            <div className="text-[10px] text-slate-300 leading-relaxed">{value}</div>
        </div>
    )
}

"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Zap, TrendingUp, TrendingDown, Clock, ShieldAlert, BrainCircuit, X, Minimize2, Maximize2 } from 'lucide-react'
import { AIOracle, PredictionResult } from '@/lib/AIServices'

const DecryptionText = ({ text, speed = 30, className = "" }: { text: string, speed?: number, className?: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(prev => {
                if (i >= text.length) {
                    clearInterval(timer);
                    return text;
                }
                i++;
                return text.slice(0, i) + Array(Math.max(0, text.length - i)).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("").slice(0, 5);
            });
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return <span className={`font-mono ${className}`}>{displayedText}</span>;
};

export default function AIOraclePanel({
    isVisible,
    currentState,
    onClose,
    defaultExpanded = true
}: {
    isVisible: boolean,
    currentState: any,
    onClose?: () => void,
    defaultExpanded?: boolean
}) {
    const [prediction, setPrediction] = useState<PredictionResult | null>(null)
    const [isThinking, setIsThinking] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Chat State
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
    const [input, setInput] = useState("")
    const [isChatting, setIsChatting] = useState(false)

    // Scroll to bottom helper
    const scrollToBottom = () => {
        const viewport = document.getElementById('oracle-chat-viewport');
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, prediction]);

    // Debounced prediction fetch - only after 30s of no activity change
    // Tracks last stability to prevent re-fetching on minor fluctuations
    useEffect(() => {
        if (!isVisible) return

        // Skip if we already have a prediction and stability hasn't changed significantly
        if (prediction && Math.abs(prediction.confidence - currentState.globalStability) < 10) {
            return;
        }

        const getPrediction = async () => {
            setIsThinking(true)
            setError(null)
            try {
                const result = await AIOracle.predict({
                    stability: currentState.globalStability,
                    countries: currentState.countries,
                    recentActions: currentState.events.slice(-5),
                    dataDrift: currentState.dataDrift, // [Refinement]
                    timestamp: Date.now(),
                    isCollapsed: currentState.isCollapsed
                })
                setPrediction(result)

                // Add prediction as initial system message if empty
                if (messages.length === 0 && result) {
                    const message = currentState.isCollapsed
                        ? `AFTERMATH ANALYSIS: System collapsed at ${currentState.globalStability.toFixed(1)}% stability. ${result.reasoning}`
                        : `Current stability is ${currentState.globalStability.toFixed(1)}%. I project a ${result.confidence}% chance of ${result.trigger} triggering a cascade.`
                    setMessages([{
                        role: 'assistant',
                        content: message
                    }])
                }
            } catch (e: any) {
                console.error("Oracle Error:", e)
                setError(e.message === "Missing Gemini API Key" ? "API KEY REQUIRED" : "ANALYSIS FAILED")
            } finally {
                setIsThinking(false)
            }
        }

        // Increased debounce to 30 seconds to conserve quota
        const timer = setTimeout(getPrediction, currentState.isCollapsed ? 5000 : 30000)
        return () => clearTimeout(timer)
    }, [isVisible, currentState.isCollapsed]) // Removed globalStability from deps to prevent rapid re-fetches

    const handleSend = async (manualMsg?: string) => {
        const messageToSend = manualMsg || input.trim();
        if (!messageToSend || isChatting) return;

        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setIsChatting(true);

        try {
            // Import dynamically to avoid circular dependencies if any
            const { AIChat } = await import('@/lib/AIServices');
            const response = await AIChat.chat(
                messageToSend,
                messages,
                {
                    stability: currentState.globalStability,
                    phase: currentState.phase,
                    coherence: currentState.coherence,
                    dataDrift: currentState.dataDrift,
                    collapsedCount: currentState.countries.filter((c: any) => c.phase === 'COLLAPSED').length,
                    activeConflicts: currentState.events.length,
                    keyCountries: currentState.countries.slice(0, 5)
                }
            );

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: "Construct failure. Data stream interrupted." }]);
        } finally {
            setIsChatting(false);
        }
    };

    const suggestions = [
        "Identify weakest link",
        "Predict cascade path",
        "Who benefits from chaos?",
        "Explain systemic risk"
    ];

    if (!isVisible) return null

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="expanded-oracle"
                    layoutId="oracle-panel"
                    className="fixed bottom-6 right-4 z-50 w-[calc(100vw-32px)] md:w-[400px]"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-3xl border-2 border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30 relative flex flex-col h-[75vh] md:h-[65vh]">

                        {/* Header */}
                        <div className="bg-purple-600/20 px-6 py-4 flex items-center justify-between border-b border-purple-500/20 shrink-0">
                            <div className="flex items-center gap-3">
                                <BrainCircuit size={20} className="text-purple-400" />
                                <div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 block leading-none">AI ORACLE</span>
                                    <span className="text-[9px] font-mono text-purple-500/70">CONVERSATIONAL MATRIX</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                                    className="p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                    title="Close Oracle"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div id="oracle-chat-viewport" className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">

                            {/* Live Metadata */}
                            <div className="flex items-center gap-4 px-2 mb-2">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${currentState.globalStability > 60 ? 'bg-cyan-400' : currentState.globalStability > 30 ? 'bg-yellow-400' : 'bg-red-500'}`} />
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Coherence: {currentState.coherence.toFixed(1)}%</span>
                                </div>
                                {currentState.dataDrift > 0.1 && (
                                    <div className="flex items-center gap-1.5">
                                        <ShieldAlert size={10} className="text-red-500 animate-pulse" />
                                        <span className="text-[10px] font-mono text-red-500 uppercase">Drift: {(currentState.dataDrift * 100).toFixed(0)}%</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Clock size={10} className="text-slate-500" />
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Sync: Active</span>
                                </div>
                            </div>

                            {/* Automatic Live Prediction Card */}
                            <AnimatePresence>
                                {prediction && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-6 p-4 bg-purple-500/5 rounded-xl border border-purple-500/20 space-y-3 relative group overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-scan" />
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-3 bg-purple-500 rounded-full" />
                                                <span className="text-[10px] uppercase font-black text-purple-300 tracking-[0.2em]">Live Analysis</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 border-glow-purple">
                                                {prediction.confidence}% PROBABILITY
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-200 font-medium leading-relaxed italic">
                                            {prediction.reasoning.includes("analysis temporarily paused") ? (
                                                <span className="text-purple-400/70 animate-pulse">Initializing strategic core... analysis incoming.</span>
                                            ) : (
                                                <p className="text-cyan-100/80 text-sm leading-relaxed font-mono">
                                                    <DecryptionText text={prediction.reasoning} speed={10} />
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {prediction.unexpectedLosers[0] && (
                                                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 group-hover:bg-red-500/20 transition-colors">
                                                    <TrendingDown size={12} className="text-red-400" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] uppercase text-red-400/50 font-bold">Weakening</span>
                                                        <span className="text-[10px] font-bold text-red-200 truncate">{prediction.unexpectedLosers[0]?.country}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {prediction.unexpectedWinners[0] && (
                                                <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center gap-2 group-hover:bg-cyan-500/20 transition-colors">
                                                    <TrendingUp size={12} className="text-cyan-400" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] uppercase text-cyan-400/50 font-bold">Opportunist</span>
                                                        <span className="text-[10px] font-bold text-cyan-200 truncate">{prediction.unexpectedWinners[0]?.country}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-black/40 p-3 rounded border border-white/10">
                                            <div className="text-[10px] uppercase text-slate-500 mb-1">Projected Trigger</div>
                                            <div className="text-white font-mono text-sm border-l-2 border-red-500 pl-2">
                                                <DecryptionText text={prediction.trigger} speed={20} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Initial Message if no history */}
                            {messages.length === 0 && !isThinking && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 font-mono leading-relaxed"
                                >
                                    <span className="text-purple-400 mr-2">system@oracle:~$</span>
                                    Geopolitical analysis engine online. I am monitoring 200+ global entities in real-time. Interrogate the matrix for strategic projections.
                                </motion.div>
                            )}

                            {/* Chat History */}
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 text-xs leading-relaxed rounded-2xl relative ${msg.role === 'user'
                                        ? 'bg-purple-600/20 border-2 border-purple-500/30 text-purple-100 rounded-tr-none shadow-[0_0_20px_rgba(147,51,234,0.1)]'
                                        : 'bg-slate-800/80 border border-white/10 text-slate-200 rounded-tl-none ring-1 ring-purple-500/10'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-slate-900 border border-purple-500/30 flex items-center justify-center shadow-lg">
                                                <BrainCircuit size={8} className="text-purple-400" />
                                            </div>
                                        )}
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isChatting && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800/80 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex flex-col gap-2 min-w-[120px]">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-purple-500/80 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                            <span className="w-1.5 h-1.5 bg-purple-500/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <span className="w-1.5 h-1.5 bg-purple-500/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                        <span className="text-[8px] font-mono text-purple-400/70 uppercase animate-pulse">Scanning Geopolitical Substrate...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Suggestions & Input Area */}
                        <div className="border-t border-purple-500/20 bg-slate-900/80 backdrop-blur-3xl p-3 space-y-3 shrink-0">
                            {/* Suggestion Chips */}
                            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                                {suggestions.map((s, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => handleSend(s)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-[10px] font-bold text-purple-300 hover:text-white transition-all flex items-center gap-1.5"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Zap size={10} className="text-purple-400" />
                                        {s}
                                    </motion.button>
                                ))}
                            </div>

                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Interrogate the matrix..."
                                        className="w-full bg-slate-950/80 border-2 border-purple-500/20 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 shadow-inner transition-all hover:border-purple-500/40"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <span className="text-[8px] font-mono text-slate-600 bg-black/40 px-1 rounded uppercase">ENT</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isChatting}
                                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all active:scale-95 group"
                                >
                                    <Zap size={14} className="group-hover:animate-pulse" fill="currentColor" />
                                </button>
                            </form>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

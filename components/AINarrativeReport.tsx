"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Newspaper, Share2, Quote, ScrollText, X } from 'lucide-react'
import { AINarrative } from '@/lib/AIServices'

interface AINarrativeReportProps {
    isVisible: boolean
    scenario: string
    events: any[]
    emergenceData: any
    onClose?: () => void
}

export default function AINarrativeReport({ isVisible, scenario, events, emergenceData, onClose }: AINarrativeReportProps) {
    const [report, setReport] = useState<string>("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [timestamp, setTimestamp] = useState("")
    const [isMounted, setIsMounted] = useState(false)
    const [documentData] = useState(() => ({
        id: Math.random().toString(36).substring(7).toUpperCase(),
        time: Date.now()
    }))

    useEffect(() => {
        setIsMounted(true)
        setTimestamp(new Date().toLocaleTimeString())
        if (!isVisible || !emergenceData) return

        const generate = async () => {
            setIsGenerating(true)
            try {
                const text = await AINarrative.generateReport(scenario, events, emergenceData)
                setReport(text)
            } catch (e) {
                console.error("Narrative Error:", e)
                setReport("Intelligence reporting failed. Connection lost.")
            } finally {
                setIsGenerating(false)
            }
        }

        generate()
    }, [isVisible, scenario, emergenceData])

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 50, filter: 'blur(10px)' }}
            className="fixed bottom-6 left-4 z-40 w-[460px]"
        >
            <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Top Border Glow Line */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FileText size={18} className="text-cyan-400" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 leading-none">Post-Collapse Archive</span>
                            <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">ARCHIVE_NODE_88 // {timestamp || 'INITIALIZING'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 max-h-[500px] overflow-y-auto scrollbar-none relative">
                    {/* Subtle Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-20 flex flex-col items-center gap-6"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="p-4 rounded-full border border-cyan-500/10 bg-cyan-500/5"
                                >
                                    <ScrollText size={40} className="text-cyan-500/40" />
                                </motion.div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-[0.5em] animate-pulse">Decrypting Data Blocks</div>
                                    <div className="w-32 h-0.5 bg-slate-900 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cyan-400"
                                            animate={{ x: [-128, 128] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="relative">
                                    <Quote size={32} className="absolute -top-4 -left-4 text-cyan-500/10 shrink-0" />
                                    <div className="font-serif italic text-xl text-slate-100 leading-relaxed indent-8 selection:bg-cyan-500/30">
                                        {report}
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-widest text-[8px]">Decryption Complete</span>
                                        </div>
                                    </div>
                                </div>

                                {isMounted && (
                                    <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Newspaper size={14} className="text-slate-500" />
                                                <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Sources Classified</span>
                                            </div>
                                            <div className="text-[9px] font-mono text-red-500/40 font-bold uppercase tracking-tighter ring-1 ring-red-500/20 px-1.5 rounded">
                                                RESTRICTED
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-[9px] font-mono text-slate-600">
                                            <div className="space-y-1">
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>REF_ID</span>
                                                    <span className="text-slate-400 font-bold">{documentData.id}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>TIMESTAMP</span>
                                                    <span className="text-slate-400 font-bold">{documentData.time}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>CLEARANCE</span>
                                                    <span className="text-slate-400 font-bold">LEVEL [EXODUS]</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-1">
                                                    <span>ENCRYPTION</span>
                                                    <span className="text-slate-400 font-bold">AES-256-GCM</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Status Bar */}
                <div className="px-6 py-2 bg-black flex items-center justify-between border-t border-white/5">
                    <div className="flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="w-3 h-1 bg-cyan-500/20 rounded-full" />
                        ))}
                    </div>
                    <span className="text-[8px] font-mono text-slate-700 tracking-[0.2em]">CONNECTED TO GLOBAL_SAT_HUB_01</span>
                </div>
            </div>
        </motion.div>
    )
}

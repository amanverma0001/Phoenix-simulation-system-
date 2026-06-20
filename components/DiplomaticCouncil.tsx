"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Users, Shield, Globe, MessageSquare, AlertTriangle } from "lucide-react"

interface Message {
    id: string
    sender: string
    role: string
    content: string
    type: "ai" | "user" | "system"
    flag?: string
}

interface Persona {
    id: string
    name: string
    role: string
    flag: string
    color: string
    personality: string
}

const PERSONAS: Persona[] = [
    { id: 'us_state', name: 'US State Dept', role: 'Global Hegemon', flag: '🇺🇸', color: '#3b82f6', personality: 'Pragmatic, assertive, focused on stability.' },
    { id: 'eu_com', name: 'EU Commission', role: 'Regulator', flag: '🇪🇺', color: '#fbbf24', personality: 'Bureaucratic, cautious, environmentally focused.' },
    { id: 'kremlin', name: 'The Kremlin', role: 'Rival Power', flag: '🇷🇺', color: '#ef4444', personality: 'Defiant, strategic, energy-focused.' },
    { id: 'beijing', name: 'Beijing Office', role: 'Rising Giant', flag: '🇨🇳', color: '#f97316', personality: 'Patient, economically driven, observant.' },
    { id: 'india_mission', name: 'Indian Mission', role: 'Strategic Autonomy', flag: '🇮🇳', color: '#f97316', personality: 'Balanced, independent, focused on global south leadership.' },
]

export default function DiplomaticCouncil({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'System', role: 'AI Intelligence', content: 'Diplomatic terminal active. Secure line established with G7 and BRICS+ representatives.', type: 'system' }
    ])
    const [inputText, setInputText] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!inputText.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'Security Council Chair',
            role: 'User',
            content: inputText,
            type: 'user'
        }

        setMessages(prev => [...prev, userMsg])
        setInputText("")
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: persona.name,
                role: persona.role,
                flag: persona.flag,
                content: generateAIResponse(persona, inputText),
                type: 'ai'
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    const generateAIResponse = (persona: Persona, query: string) => {
        const q = query.toLowerCase()
        if (q.includes('energy') || q.includes('gas')) {
            return `Regarding energy flows: ${persona.name} maintains that all current infrastructure must remain protected under international law. Stability is non-negotiable.`
        }
        if (q.includes('war') || q.includes('military')) {
            return `Our military posture remains defensive. However, any escalation will be met with a proportional response. We advise immediate de-escalation.`
        }
        if (persona.id === 'india_mission') {
            if (q.includes('energy') || q.includes('oil')) {
                return `The Indian Mission emphasizes that energy security is essential for the growth of the Global South. We prioritize strategic autonomy in our procurement decisions.`;
            }
            return `New Delhi calls for a peaceful resolution through dialogue and diplomacy. Our position remains steadfastly focused on humanitarian interests and regional stability.`;
        }

        return `Message received. ${persona.name} is currently analyzing the situational data. Our official position will be released shortly.`
    }

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <div className="w-full max-w-4xl h-[600px] glass-premium rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,255,255,0.15)]">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Users className="text-cyan-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black font-orbitron text-white tracking-widest uppercase">Global Diplomatic Council</h2>
                            <p className="text-[10px] font-mono text-cyan-500/60 uppercase">High-Level Strategic Dialogue Area</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <span className="text-white/40 group-hover:text-white transition-colors">✕</span>
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar personas */}
                    <div className="w-64 border-r border-white/10 bg-black/20 p-4 space-y-4">
                        <h3 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">Connected Envoys</h3>
                        {PERSONAS.map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-help group">
                                <span className="text-2xl">{p.flag}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                                    <p className="text-[9px] font-mono text-cyan-400/60 truncate uppercase">{p.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-black/10">
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
                        >
                            <AnimatePresence>
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, x: m.type === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex flex-col ${m.type === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`flex items-center gap-2 mb-1 ${m.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                            {m.flag && <span className="text-sm">{m.flag}</span>}
                                            <span className="text-[10px] font-mono text-gray-500 uppercase">{m.sender}</span>
                                            <span className="text-[8px] font-mono text-cyan-500/40">• {m.role}</span>
                                        </div>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${m.type === 'user'
                                            ? 'bg-cyan-500/10 text-cyan-50 border border-cyan-500/30 rounded-tr-none'
                                            : m.type === 'system'
                                                ? 'bg-white/5 text-gray-400 border border-white/10 w-full text-center italic'
                                                : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isTyping && (
                                <div className="flex gap-2 p-2">
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type diplomatic dispatch..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1.5 p-2 text-cyan-400 hover:text-white transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="p-2 border-t border-white/10 bg-black/40 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Encription: AES-256</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={10} className="text-toxic" />
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Secure Channel</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={10} className="text-white/30" />
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Nodes: 12 Active</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

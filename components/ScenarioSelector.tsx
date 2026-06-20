"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, Anchor, Star, ChevronRight, AlertTriangle, X, BookOpen, Play, Sparkles } from 'lucide-react';
import UserManual from './UserManual';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Scenario {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    color: string;
    gradient: string;
}

interface ScenarioSelectorProps {
    onSelect: (scenarioId: string) => void;
    isVisible: boolean;
    onClose: () => void;
}

// ============================================================================
// SCENARIO DATA
// ============================================================================

export const SCENARIOS: Scenario[] = [
    {
        id: 'SANCTION_RUSSIA',
        title: 'The Energy Weapon',
        subtitle: 'Sanction Russia',
        description: 'Impose comprehensive sanctions on Russia, cutting all energy flows. Europe\'s 40% gas dependency triggers cascading industrial collapse.',
        icon: Zap,
        color: '#ff6600',
        gradient: 'from-orange-500 via-red-500 to-rose-600',
    },
    {
        id: 'UK_EXIT',
        title: 'The Alliance Fracture',
        subtitle: 'UK Complete EU Exit',
        description: 'Hard Brexit with complete severance of all EU ties. Financial services, trade, and territorial integrity all face immediate pressure.',
        icon: Users,
        color: '#0066ff',
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    },
    {
        id: 'BLOCK_BOSPHORUS',
        title: 'The Chokepoint Closure',
        subtitle: 'Turkey Blocks Bosphorus',
        description: 'Turkey closes the Bosphorus Strait to all traffic. 3 million barrels of oil daily are suddenly landlocked.',
        icon: Anchor,
        color: '#00ccaa',
        gradient: 'from-teal-500 via-emerald-500 to-green-600',
    },
];

// ============================================================================
// SCENARIO CARD COMPONENT
// ============================================================================

function ScenarioCard({
    scenario,
    isHovered,
    onHover,
    onSelect
}: {
    scenario: Scenario;
    isHovered: boolean;
    onHover: (id: string | null) => void;
    onSelect: (id: string) => void;
}) {
    const IconComponent = scenario.icon;

    return (
        <motion.div
            className="relative flex-1 min-w-[300px] max-w-[380px]"
            initial={{ opacity: 0, y: 30, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onMouseEnter={() => onHover(scenario.id)}
            onMouseLeave={() => onHover(null)}
        >
            <motion.div
                className="relative h-full rounded-2xl cursor-pointer overflow-hidden group"
                animate={{
                    scale: isHovered ? 1.03 : 1,
                    y: isHovered ? -8 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => onSelect(scenario.id)}
                style={{
                    background: 'linear-gradient(135deg, rgba(15,15,25,0.95) 0%, rgba(10,10,20,0.98) 100%)',
                    borderWidth: '1px',
                    borderColor: isHovered ? scenario.color : 'rgba(255,255,255,0.1)',
                    boxShadow: isHovered
                        ? `0 25px 80px ${scenario.color}40, 0 0 40px ${scenario.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`
                        : '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
            >
                {/* Animated corner accents */}
                <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'}`} style={{ borderColor: scenario.color }} />
                <div className={`absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'}`} style={{ borderColor: scenario.color }} />
                <div className={`absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'}`} style={{ borderColor: scenario.color }} />
                <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'}`} style={{ borderColor: scenario.color }} />

                {/* Tactical Scanline on hover */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-0'}`} style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)'
                }} />

                {/* Floating Glow Orb */}
                <motion.div
                    className="absolute -top-16 -right-16 w-40 h-40 blur-[80px] rounded-full pointer-events-none"
                    style={{ background: scenario.color }}
                    animate={{
                        opacity: isHovered ? 0.5 : 0.15,
                        scale: isHovered ? 1.3 : 1
                    }}
                />

                {/* Card content */}
                <div className="relative p-6 h-full flex flex-col">
                    {/* Severity indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                        <motion.div
                            className="w-2 h-2 rounded-full"
                            style={{ background: scenario.color }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">HIGH IMPACT</span>
                    </div>

                    {/* Icon and title */}
                    <div className="flex items-start gap-4 mb-5 mt-2">
                        <motion.div
                            className={`p-4 rounded-2xl bg-gradient-to-br ${scenario.gradient} shadow-lg`}
                            animate={{
                                rotate: isHovered ? [0, 3, -3, 0] : 0,
                                scale: isHovered ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                            style={{
                                boxShadow: isHovered ? `0 10px 30px ${scenario.color}50` : 'none'
                            }}
                        >
                            <IconComponent className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="flex-1 pt-1">
                            <h3
                                className="text-xl font-black mb-1 tracking-tight"
                                style={{ color: scenario.color }}
                            >
                                {scenario.title}
                            </h3>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.15em]">
                                {scenario.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                        {scenario.description}
                    </p>

                    {/* Launch button - appears on hover */}
                    <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                            <Star className="w-3 h-3" />
                            <span>RECOMMENDED</span>
                        </div>
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                            style={{
                                background: `${scenario.color}20`,
                                color: scenario.color,
                                border: `1px solid ${scenario.color}50`
                            }}
                        >
                            <ChevronRight className="w-4 h-4" />
                            Launch
                        </div>
                    </motion.div>
                </div>

                {/* Bottom gradient indicator */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(to right, ${scenario.color}, ${scenario.color}50, transparent)` }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                />
            </motion.div>
        </motion.div>
    );
}

// ============================================================================
// MAIN SCENARIO SELECTOR COMPONENT
// ============================================================================

export default function ScenarioSelector({ onSelect, isVisible, onClose, onOpenGenerator }: ScenarioSelectorProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [showManual, setShowManual] = useState(false);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence>
                {showManual && (
                    <UserManual isVisible={showManual} onClose={() => setShowManual(false)} />
                )}
            </AnimatePresence>

            {/* Backdrop with animated grid */}
            <motion.div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
            >
                {/* Animated grid lines */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'gridPulse 4s ease-in-out infinite'
                }} />
                {/* Central glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl" />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30" />
                <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-500/30" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-500/30" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/30" />
            </motion.div>

            {/* Content Container (Scrollable) */}
            <motion.div
                className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar pr-4 flex flex-col items-center"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
                {/* Close/Cancel Button */}
                <motion.button
                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 rounded-full transition-colors z-20 border border-white/10 hover:border-red-500/50"
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Skip to main control"
                >
                    <X className="w-6 h-6" />
                </motion.button>

                {/* Header - Enhanced */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Glowing badge */}
                    <motion.div
                        className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full border border-cyan-500/40 bg-cyan-500/10"
                        animate={{ boxShadow: ['0 0 20px rgba(0,255,255,0.2)', '0 0 40px rgba(0,255,255,0.4)', '0 0 20px rgba(0,255,255,0.2)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        >
                            <AlertTriangle className="w-5 h-5 text-cyan-400" />
                        </motion.div>
                        <span className="text-sm font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold">
                            Crisis Protocol
                        </span>
                    </motion.div>

                    {/* Main title with glow */}
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-white mb-3"
                        style={{ textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(0,255,255,0.2)' }}
                    >
                        What Future Will You Create?
                    </motion.h2>

                    {/* Subtitle with animated underline */}
                    <div className="relative inline-block">
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Each scenario triggers a unique cascade with different winners and losers.
                            <span className="text-cyan-400 font-semibold"> Choose wisely</span>—reality will never be the same.
                        </p>
                        <motion.div
                            className="absolute -bottom-2 left-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                            initial={{ width: 0, x: '-50%' }}
                            animate={{ width: '60%', x: '-50%' }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        />
                    </div>
                </motion.div>

                {/* Scenario cards */}
                <div className="flex flex-wrap gap-6 justify-center">
                    {SCENARIOS.map((scenario, index) => (
                        <motion.div
                            key={scenario.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.15 }}
                        >
                            <ScenarioCard
                                scenario={scenario}
                                isHovered={hoveredId === scenario.id}
                                onHover={setHoveredId}
                                onSelect={onSelect}
                            />
                        </motion.div>
                    ))}

                    {/* Dynamic AI Scenario Card */}
                    {onOpenGenerator && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75 }}
                        >
                            <div
                                className="relative w-[340px] h-full rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-black hover:border-purple-400 transition-all cursor-pointer group flex flex-col items-start text-left"
                                onClick={onOpenGenerator}
                            >
                                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors rounded-2xl" />

                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                                </div>

                                <div className="space-y-1 mb-4">
                                    <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                                        Generative AI
                                    </p>
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                        Create Custom Scenario
                                    </h3>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300">
                                    Input a specific trigger or let the AI hallucinate a catastrophic vector based on live parameters.
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                                    Initialize <ChevronRight size={14} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Footer hint & Action */}
                <motion.div
                    className="flex flex-col items-center gap-4 mt-8 pb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-gray-500 text-sm font-mono">
                        Hover for preview • Click to begin simulation
                    </p>

                    <div className="flex items-center gap-4">
                        <motion.button
                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 font-bold tracking-widest hover:bg-white/10 hover:text-white transition-all uppercase text-[10px] flex items-center gap-2"
                            onClick={() => setShowManual(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <BookOpen size={14} />
                            Tactical Manual
                        </motion.button>

                        <motion.button
                            className="px-8 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold tracking-widest hover:bg-cyan-500/20 hover:border-cyan-400 transition-all uppercase text-[10px] flex items-center gap-2 group relative overflow-hidden"
                            onClick={onClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Play size={12} fill="currentColor" />
                            Proceed to Main Control
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

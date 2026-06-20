"use client";

/**
 * InsightCards Component - Hidden Truths Revealed
 * 
 * Displays insight cards that reveal hidden patterns discovered during collapse:
 * - Hidden Dependencies: Unexpected connections between entities
 * - Unexpected Alliances: Strange bedfellows formed by crisis
 * - Corporate Power Exposed: Hidden corporate influence revealed
 * - Ethnic Fracture Activated: Cultural fault lines exposed
 * - Shadow Actor Emergence: Non-state actors rising
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Link2, Users, Building2, Map, Ghost, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';
import type { EmergenceReport } from '@/lib/EmergenceDetector';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type InsightType =
    | 'hidden_dependency'
    | 'unexpected_alliance'
    | 'corporate_power'
    | 'ethnic_fracture'
    | 'shadow_actor'
    | 'cascade_breakdown'; // NEW: For loser analysis

export interface Insight {
    id: string;
    type: InsightType;
    title: string;
    description: string;
    entities: string[];
    surpriseScore: number; // 1-10
    icon?: string;
    subReasons?: string[]; // NEW: Cascade breakdown sub-reasons
}

interface InsightCardsProps {
    insights: Insight[];
    onClose: () => void;
    isVisible: boolean;
    onActiveInsightChange?: (insight: Insight) => void;
}

// ============================================================================
// INSIGHT CONFIGURATION
// ============================================================================

const INSIGHT_CONFIG: Record<InsightType, { icon: React.ElementType; color: string; gradient: string; label: string }> = {
    hidden_dependency: {
        icon: Link2,
        color: '#00ffff',
        gradient: 'from-cyan-500 to-blue-500',
        label: 'Hidden Dependency',
    },
    unexpected_alliance: {
        icon: Users,
        color: '#ff00ff',
        gradient: 'from-pink-500 to-purple-500',
        label: 'Unexpected Alliance',
    },
    corporate_power: {
        icon: Building2,
        color: '#ffa500',
        gradient: 'from-orange-500 to-yellow-500',
        label: 'Corporate Power Exposed',
    },
    ethnic_fracture: {
        icon: Map,
        color: '#8b4513',
        gradient: 'from-amber-600 to-orange-700',
        label: 'Ethnic Fracture Activated',
    },
    shadow_actor: {
        icon: Ghost,
        color: '#ff0040',
        gradient: 'from-red-500 to-rose-600',
        label: 'Shadow Actor Emergence',
    },
    cascade_breakdown: {
        icon: AlertTriangle,
        color: '#ff4444',
        gradient: 'from-red-600 to-orange-500',
        label: 'Cascade Breakdown',
    },
};

// ============================================================================
// INSIGHT CARD COMPONENT
// ============================================================================

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
    const [cardPage, setCardPage] = useState(0);
    const config = INSIGHT_CONFIG[insight.type];
    const IconComponent: any = config.icon;

    // Reset page when insight changes
    useEffect(() => {
        setCardPage(0);
    }, [insight.id]);

    const hasExtraDetails = (insight.subReasons && insight.subReasons.length > 0) || insight.type === 'cascade_breakdown';

    return (
        <motion.div
            className="relative w-full max-w-md mx-auto"
            initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: index * 0.1
            }}
        >
            {/* Card Container */}
            <div
                className="relative rounded-xl overflow-hidden min-h-[360px] flex flex-col"
                style={{
                    background: 'rgba(0, 10, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${config.color}40`,
                    boxShadow: `0 8px 32px ${config.color}30`,
                }}
            >
                <div className="p-6 flex-1 flex flex-col">
                    {/* Animated border glow */}
                    <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ border: `1px solid ${config.color}30` }}
                    />

                    <AnimatePresence mode="wait">
                        {cardPage === 0 ? (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex-1 flex flex-col"
                            >
                                {/* Icon & Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-mono text-gray-500">{config.label}</p>
                                        <h3 className="text-lg font-bold" style={{ color: config.color }}>{insight.title}</h3>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                                    {insight.description}
                                </p>

                                {insight.entities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {insight.entities.map((entity, i) => (
                                            <span key={entity} className="px-2 py-1 text-[10px] rounded-full bg-white/5 text-gray-400 border border-white/10 uppercase tracking-tighter font-mono">
                                                {entity}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {hasExtraDetails && (
                                    <button
                                        onClick={() => setCardPage(1)}
                                        className="mt-6 w-full py-2 rounded-lg border border-cyan-500/30 text-[10px] font-mono uppercase tracking-widest text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        Inspect Failure Vectors <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <button
                                    onClick={() => setCardPage(0)}
                                    className="mb-4 text-[10px] font-mono text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-3 h-3" /> Back to Summary
                                </button>

                                {/* Sub-reasons */}
                                {insight.subReasons && insight.subReasons.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-[10px] uppercase tracking-widest text-red-400 font-mono mb-3 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Chain of Failure
                                        </p>
                                        <div className="space-y-3">
                                            {insight.subReasons.map((reason, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex gap-3 items-start"
                                                >
                                                    <span className="text-red-500 font-mono text-xs font-bold pt-0.5">{i + 1}.</span>
                                                    <span className="text-xs text-slate-300 leading-snug">{reason}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Surprise score meter (Moved to bottom of details) */}
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Surprise Index</span>
                                        <span className="text-xs font-bold font-mono" style={{ color: config.color }}>
                                            {insight.surpriseScore.toFixed(1)}/10
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${config.gradient}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${insight.surpriseScore * 10}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN INSIGHT CARDS COMPONENT
// ============================================================================

export default function InsightCards({ insights, onClose, isVisible, onActiveInsightChange }: InsightCardsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    // Reset index when insights change
    useEffect(() => {
        setCurrentIndex(0);
    }, [insights]);

    // Notify parent of active insight change for globe sync
    useEffect(() => {
        if (isVisible && insights.length > 0 && onActiveInsightChange) {
            onActiveInsightChange(insights[currentIndex]);
        }
    }, [currentIndex, insights, isVisible, onActiveInsightChange]);

    const nextCard = () => {
        if (currentIndex < insights.length - 1 && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setIsFlipping(false);
            }, 200);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0 && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
                setIsFlipping(false);
            }, 200);
        }
    };

    if (!isVisible || insights.length === 0) return null;

    const currentInsight = insights[currentIndex];

    return (
        <AnimatePresence>
            <motion.div
                className="fixed bottom-6 left-4 z-40 w-96"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25 }}
            >
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between mb-3 px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-2">
                        <motion.span
                            className="text-cyan-400 text-lg"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                            💡
                        </motion.span>
                        <span className="text-sm font-mono uppercase tracking-wider text-cyan-400">
                            Hidden Truths Revealed
                        </span>
                    </div>
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.2, rotate: 90 }}
                    >
                        <X className="w-4 h-4" />
                    </motion.button>
                </motion.div>

                {/* Card display */}
                <AnimatePresence mode="wait">
                    <InsightCard
                        key={currentInsight.id}
                        insight={currentInsight}
                        index={0}
                    />
                </AnimatePresence>

                {/* Navigation */}
                {insights.length > 1 && (
                    <motion.div
                        className="flex items-center justify-center gap-4 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            onClick={prevCard}
                            disabled={currentIndex === 0}
                            className={`p-2 rounded-lg border transition-all ${currentIndex === 0
                                ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                                : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'
                                }`}
                            whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
                            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>

                        {/* Dot indicators */}
                        <div className="flex gap-2">
                            {insights.map((_, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                        ? 'bg-cyan-400 scale-125'
                                        : 'bg-gray-600 hover:bg-gray-500'
                                        }`}
                                    whileHover={{ scale: 1.3 }}
                                />
                            ))}
                        </div>

                        <motion.button
                            onClick={nextCard}
                            disabled={currentIndex === insights.length - 1}
                            className={`p-2 rounded-lg border transition-all ${currentIndex === insights.length - 1
                                ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                                : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'
                                }`}
                            whileHover={currentIndex < insights.length - 1 ? { scale: 1.1 } : {}}
                            whileTap={currentIndex < insights.length - 1 ? { scale: 0.95 } : {}}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// ============================================================================
// INSIGHT GENERATOR - Creates insights based on collapse data
// ============================================================================

export function generateInsights(scenario: string, emergenceData?: EmergenceReport): Insight[] {
    const insights: Insight[] = [];

    // Scenario-specific insights
    if (scenario === 'sanction_russia' || scenario === 'SANCTION_RUSSIA') {
        insights.push({
            id: 'dep-1',
            type: 'hidden_dependency',
            title: 'The Invisible Chain',
            description: "Germany's chemical sector required 40% of total gas imports. Its collapse triggered automotive supply chain breakdown across 7 countries.",
            entities: ['Germany', 'BASF', 'Volkswagen', 'Poland', 'Czech Republic'],
            surpriseScore: 8.5,
        });

        insights.push({
            id: 'alliance-1',
            type: 'unexpected_alliance',
            title: 'Strange Bedfellows',
            description: 'Turkey and Qatar, historic rivals, formed an energy cartel controlling 45% of Europe\'s LNG supply within 6 months.',
            entities: ['Turkey', 'Qatar', 'LNG Markets'],
            surpriseScore: 7.8,
        });

        insights.push({
            id: 'corp-1',
            type: 'corporate_power',
            title: 'The Hidden Empire',
            description: 'Gazprom\'s actual influence exceeded 7 nation-states combined. It controlled politicians, infrastructure, and pricing across the continent.',
            entities: ['Gazprom', 'Nord Stream', 'European Commission'],
            surpriseScore: 9.2,
        });

        insights.push({
            id: 'ethnic-1',
            type: 'ethnic_fracture',
            title: 'The Old Borders Return',
            description: 'Economic stress reactivated Bavaria\'s 200-year separatist tendency. Cultural fault lines matter more than political ones under pressure.',
            entities: ['Bavaria', 'Germany', 'Catalonia'],
            surpriseScore: 6.5,
        });

        insights.push({
            id: 'shadow-1',
            type: 'shadow_actor',
            title: 'Non-State Power Rising',
            description: 'Wagner Group gained more territory in 6 months than Russia in 6 years. Private armies fill power vacuums faster than governments.',
            entities: ['Wagner Group', 'Libya', 'Central African Republic'],
            surpriseScore: 8.0,
        });
    }

    // UK Exit scenario insights
    if (scenario === 'brexit' || scenario === 'UK_EXIT') {
        insights.push({
            id: 'dep-2',
            type: 'hidden_dependency',
            title: 'Financial Gravity',
            description: 'London processed 40% of EU forex transactions. The shift to continental exchanges took 18 months and cost €2.3 billion.',
            entities: ['London', 'Frankfurt', 'Dublin', 'Euro Clearing'],
            surpriseScore: 7.2,
        });

        insights.push({
            id: 'ethnic-2',
            type: 'ethnic_fracture',
            title: 'The Union Fractures',
            description: 'Scotland\'s 62% EU support triggered an independence cascade. The "United" Kingdom became a historical term.',
            entities: ['Scotland', 'Northern Ireland', 'Wales'],
            surpriseScore: 8.8,
        });
    }

    // Bosphorus scenario insights
    if (scenario === 'bosphorus' || scenario === 'BLOCK_BOSPHORUS') {
        insights.push({
            id: 'dep-3',
            type: 'hidden_dependency',
            title: 'The Chokepoint Effect',
            description: '3 million barrels of oil transit the Bosphorus daily. The closure made landlocked oil worthless within 72 hours.',
            entities: ['Turkey', 'Russia', 'Kazakhstan', 'Black Sea'],
            surpriseScore: 9.0,
        });

        insights.push({
            id: 'corp-2',
            type: 'corporate_power',
            title: 'Pipeline Politics',
            description: 'Alternative pipeline proposals that were "impossible" for 20 years were suddenly approved in 3 weeks.',
            entities: ['Trans-Caspian Pipeline', 'Iran', 'Azerbaijan'],
            surpriseScore: 7.5,
        });
    }

    // Cascade breakdown insights for losers
    if (emergenceData?.losers && emergenceData.losers.length > 0) {
        const cascadeReasons: Record<string, string[]> = {
            russia: [
                'Energy export revenue collapsed by 68%',
                'SWIFT sanctions froze foreign reserves',
                'Supply chain for military equipment disrupted',
                'Brain drain accelerated as tech workers fled',
            ],
            germany: [
                'Chemical sector lost 40% of gas supply',
                'BASF announced partial relocation to China',
                'Automotive industry faced parts shortage',
                'Industrial production dropped 15%',
            ],
            ukraine: [
                'Direct impact from military conflict',
                'Agricultural exports blocked at ports',
                'Infrastructure damage exceeded $100B',
                'Population displacement reached 8 million',
            ],
            poland: [
                'Transit fees from Russian gas ended',
                'Energy prices spiked 300%',
                'Industrial competitiveness declined',
                'EU subsidy negotiations stalled',
            ],
        };

        emergenceData.losers.slice(0, 2).forEach((loser, i) => {
            const countryKey = loser.entityId.toLowerCase();
            const reasons = cascadeReasons[countryKey] || [
                'Primary trade relationships severed',
                'Energy supply disruption',
                'Financial market volatility',
                'Regional instability spillover',
            ];

            insights.push({
                id: `cascade-${i}`,
                type: 'cascade_breakdown',
                title: `${loser.name}'s Collapse Chain`,
                description: `${loser.name} suffered a ${Math.abs(loser.percentageChange).toFixed(1)}% influence loss through interconnected failures.`,
                entities: [loser.entityId],
                surpriseScore: Math.min(10, Math.abs(loser.percentageChange) / 5),
                subReasons: reasons,
            });
        });
    }

    return insights;
}

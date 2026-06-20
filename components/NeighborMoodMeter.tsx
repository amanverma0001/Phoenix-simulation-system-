"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, AlertCircle, TrendingUp } from 'lucide-react';
import { getGeopoliticalContext, calculateMood, getMoodEmoji } from '@/lib/GeopoliticalRelationships';
import { countries } from '@/lib/geopoliticalData';

interface NeighborMoodMeterProps {
    targetCountryId: string | null;
    eventType: 'sanction' | 'collapse' | 'none';
    isVisible: boolean;
}

interface MoodState {
    id: string;
    name: string;
    mood: 'HAPPY' | 'CONCERNED' | 'ANGRY' | 'NEUTRAL';
    stability: number;
}

export default function NeighborMoodMeter({ targetCountryId, eventType, isVisible }: NeighborMoodMeterProps) {
    const [neighborMoods, setNeighborMoods] = useState<MoodState[]>([]);

    useEffect(() => {
        if (!targetCountryId || eventType === 'none') {
            setNeighborMoods([]);
            return;
        }

        const { neighbors } = getGeopoliticalContext(targetCountryId);

        const moods: MoodState[] = neighbors.map(neighborId => {
            const country = countries.find(c => c.id === neighborId);
            return {
                id: neighborId,
                name: country?.name || neighborId,
                mood: calculateMood(neighborId, targetCountryId, eventType),
                stability: country?.stability || 80
            };
        });

        setNeighborMoods(moods);
    }, [targetCountryId, eventType]);

    if (!isVisible || neighborMoods.length === 0) return null;

    return (
        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
                    Regional Sentiment Analysis
                </h3>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {neighborMoods.map((neighbor, index) => (
                        <motion.div
                            key={neighbor.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between group"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {neighbor.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${neighbor.mood === 'HAPPY' ? 'bg-green-500' :
                                                    neighbor.mood === 'ANGRY' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${neighbor.stability}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                    <span className="text-[8px] font-mono text-gray-500">
                                        STABILITY: {neighbor.stability}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: neighbor.mood === 'ANGRY' ? [0, 5, -5, 0] : 0
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="text-2xl"
                                >
                                    {getMoodEmoji(neighbor.mood)}
                                </motion.div>
                                <div className="text-[10px] font-mono font-bold" style={{
                                    color: neighbor.mood === 'HAPPY' ? '#22c55e' :
                                        neighbor.mood === 'ANGRY' ? '#ef4444' :
                                            '#eab308'
                                }}>
                                    {neighbor.mood}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[9px] text-gray-500 leading-relaxed italic">
                    AI-detected emotional resonance in neighboring territories. Sanction cascades have a 68% correlation with regional mood shifts.
                </p>
            </div>
        </div>
    );
}

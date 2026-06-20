/**
 * LiveIndicator Component - "Reality Pulse"
 * 
 * Shows live data status with:
 * - Pulsing status dot (green/yellow/red)
 * - "Updated X min ago" timestamp
 * - Click to expand details
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, ChevronDown, ChevronUp, Fuel, TrendingDown, TrendingUp, Globe2 } from 'lucide-react';
import type { EnergyData, CrisisIndicator, LiveEvent } from '@/lib/liveDataService';

// ============================================================================
// TYPES
// ============================================================================

interface LiveIndicatorProps {
    energy: EnergyData | null;
    crisis: CrisisIndicator | null;
    events: LiveEvent[];
    timeSinceUpdate: string;
    isPolling: boolean;
    error: string | null;
    onRefresh?: () => void;
}

// ============================================================================
// STATUS DOT COLORS
// ============================================================================

const STATUS_COLORS = {
    NORMAL: { bg: '#00ff88', glow: 'rgba(0, 255, 136, 0.5)' },
    ELEVATED: { bg: '#ffaa00', glow: 'rgba(255, 170, 0, 0.5)' },
    HIGH: { bg: '#ff6600', glow: 'rgba(255, 102, 0, 0.5)' },
    CRITICAL: { bg: '#ff0040', glow: 'rgba(255, 0, 64, 0.5)' },
    OFFLINE: { bg: '#666666', glow: 'rgba(102, 102, 102, 0.3)' },
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function LiveIndicator({
    energy,
    crisis,
    events,
    timeSinceUpdate,
    isPolling,
    error,
    onRefresh,
}: LiveIndicatorProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Determine status color
    const statusCategory = error ? 'OFFLINE' : (crisis?.category || 'NORMAL');
    const colors = STATUS_COLORS[statusCategory as keyof typeof STATUS_COLORS] || STATUS_COLORS.NORMAL;

    return (
        <div className="relative z-50">
            {/* Compact Indicator */}
            <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md border transition-all"
                style={{
                    background: 'rgba(0, 10, 20, 0.8)',
                    borderColor: `${colors.bg}40`,
                }}
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Pulsing Status Dot */}
                <motion.div
                    className="relative w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.bg }}
                    animate={{
                        boxShadow: [
                            `0 0 0 0 ${colors.glow}`,
                            `0 0 0 8px transparent`,
                        ],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />

                {/* Label */}
                <span className="text-xs font-mono text-white/80">
                    {error ? 'OFFLINE' : 'LIVE'}
                </span>

                {/* Timestamp */}
                <span className="text-xs font-mono text-white/50">
                    {timeSinceUpdate}
                </span>

                {/* Expand Icon */}
                {isExpanded ? (
                    <ChevronUp size={14} className="text-white/50" />
                ) : (
                    <ChevronDown size={14} className="text-white/50" />
                )}
            </motion.button>

            {/* Expanded Details Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="absolute top-full right-0 mt-2 w-80 rounded-xl overflow-hidden border"
                        style={{
                            background: 'rgba(0, 10, 20, 0.95)',
                            borderColor: 'rgba(0, 255, 255, 0.2)',
                            backdropFilter: 'blur(20px)',
                        }}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-cyan-500/20">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-cyan-400 font-mono">
                                    GLOBAL STATUS
                                </h3>
                                {isPolling ? (
                                    <Wifi size={16} className="text-green-400" />
                                ) : (
                                    <WifiOff size={16} className="text-red-400" />
                                )}
                            </div>

                            {/* Crisis Level Bar */}
                            {crisis && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                                        <span className="text-white/60">Risk Level</span>
                                        <span style={{ color: colors.bg }}>{crisis.category}</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: colors.bg }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${crisis.level}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Energy Section */}
                        {energy && (
                            <div className="px-4 py-3 border-b border-cyan-500/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Fuel size={14} className="text-yellow-400" />
                                    <span className="text-xs font-bold text-white/80">ENERGY NETWORKS</span>
                                </div>

                                <div className="space-y-2 text-xs font-mono">
                                    {/* Nord Stream */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Nord Stream</span>
                                        <span className={energy.nordStream.status === 'offline' ? 'text-red-400' : 'text-green-400'}>
                                            {energy.nordStream.status.toUpperCase()} ({Math.round(energy.nordStream.utilization * 100)}%)
                                        </span>
                                    </div>

                                    {/* TurkStream */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">TurkStream</span>
                                        <span className="text-green-400">
                                            {Math.round(energy.turkStream.utilization * 100)}% capacity
                                        </span>
                                    </div>

                                    {/* EU Storage */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">EU Storage</span>
                                        <span className={energy.euStorage.fillLevel < 0.4 ? 'text-red-400' : 'text-cyan-400'}>
                                            {Math.round(energy.euStorage.fillLevel * 100)}%
                                            {energy.euStorage.trend === 'increasing' && <TrendingUp size={12} className="inline ml-1" />}
                                            {energy.euStorage.trend === 'decreasing' && <TrendingDown size={12} className="inline ml-1" />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Events */}
                        {events.length > 0 && (
                            <div className="px-4 py-3 border-b border-cyan-500/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe2 size={14} className="text-purple-400" />
                                    <span className="text-xs font-bold text-white/80">RECENT EVENTS</span>
                                </div>

                                <div className="space-y-2">
                                    {events.slice(0, 3).map((event) => (
                                        <div key={event.id} className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${event.type === 'energy' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        event.type === 'geopolitical' ? 'bg-red-500/20 text-red-400' :
                                                            event.type === 'economic' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-purple-500/20 text-purple-400'
                                                    }`}>
                                                    {event.type.toUpperCase()}
                                                </span>
                                                <span className="text-white/50 text-[10px]">
                                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-white/70 mt-1 line-clamp-1">{event.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Primary Concern */}
                        {crisis && (
                            <div className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={14} style={{ color: colors.bg }} />
                                    <span className="text-xs text-white/60">Primary Concern:</span>
                                </div>
                                <p className="text-sm font-mono text-white/80 mt-1">
                                    {crisis.primaryConcern}
                                </p>
                            </div>
                        )}

                        {/* Refresh Button */}
                        {onRefresh && (
                            <div className="px-4 py-3 border-t border-cyan-500/10">
                                <button
                                    onClick={onRefresh}
                                    className="w-full py-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg transition-colors"
                                >
                                    ↻ REFRESH DATA
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

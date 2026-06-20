"use client";

/**
 * LiveDataPanel - Real-time geopolitical data display
 * 
 * Shows AI-fetched current world events, tensions, and country status.
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe2,
    Zap,
    AlertTriangle,
    RefreshCw,
    Wifi,
    WifiOff,
    TrendingDown,
    TrendingUp,
    Clock,
    Newspaper,
    Activity
} from 'lucide-react';
import { useAILiveData, useTimeAgo } from '@/hooks/useAILiveData';

interface LiveDataPanelProps {
    className?: string;
    compact?: boolean;
}

export default function LiveDataPanel({ className = '', compact = false }: LiveDataPanelProps) {
    const { data, events, isLoading, error, lastUpdated, isLive, refresh } = useAILiveData();
    const timeAgo = useTimeAgo(lastUpdated);

    // Loading state
    if (isLoading && !data) {
        return (
            <div className={`p-6 bg-slate-900/50 rounded-xl border border-slate-700 ${className}`}>
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <Globe2 className="text-cyan-400" size={20} />
                    </motion.div>
                    <div>
                        <div className="text-sm text-white font-medium">Fetching live data...</div>
                        <div className="text-xs text-slate-400">Analyzing current geopolitical state</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !data) {
        return (
            <div className={`p-6 bg-red-900/20 rounded-xl border border-red-500/30 ${className}`}>
                <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="text-red-400" size={20} />
                    <span className="text-red-400 font-medium">Failed to load live data</span>
                </div>
                <button
                    onClick={refresh}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm text-red-400 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Live Status Header */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 
                            rounded-xl border border-cyan-500/30">
                <div className="flex items-center gap-3">
                    <motion.div
                        className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-yellow-500'}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            {isLive ? (
                                <Wifi className="text-green-400" size={14} />
                            ) : (
                                <WifiOff className="text-yellow-400" size={14} />
                            )}
                            <span className="text-sm font-bold text-cyan-400">
                                {isLive ? 'LIVE DATA' : 'CACHED DATA'}
                            </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock size={10} />
                            Updated {timeAgo || 'just now'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={refresh}
                    disabled={isLoading}
                    className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 
                               rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw
                        className={`text-cyan-400 ${isLoading ? 'animate-spin' : ''}`}
                        size={14}
                    />
                </button>
            </div>

            {/* Global Tension Matrix */}
            {!compact && data.globalTensions.length > 0 && (
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Activity className="text-purple-400" size={16} />
                            <span className="text-sm font-bold text-white uppercase tracking-tighter">Tension Matrix</span>
                        </div>
                        <div className="text-[10px] font-mono text-purple-400/60 animate-pulse">ANALYZING NODES...</div>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        {Array.from({ length: 16 }).map((_, i) => {
                            const tension = data.globalTensions[i % data.globalTensions.length];
                            const intensity = tension ? tension.severity : 0.2;
                            return (
                                <motion.div
                                    key={i}
                                    className="aspect-square rounded-sm relative overflow-hidden bg-slate-800"
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: [0.4, 1, 0.4],
                                        backgroundColor: intensity > 0.8 ? '#ef4444' : intensity > 0.5 ? '#f97316' : '#a855f7'
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: i * 0.05
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/40" />
                                    {intensity > 0.7 && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            animate={{ opacity: [0, 0.5, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: Math.random() }}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Global Tensions List */}
            {data.globalTensions.length > 0 && (
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="text-orange-400" size={16} />
                        <span className="text-sm font-bold text-white">Active Tensions</span>
                    </div>
                    <div className="space-y-2">
                        {data.globalTensions.slice(0, compact ? 2 : 5).map((tension, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                            >
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-xs text-slate-300 font-medium truncate">
                                        {tension.parties.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace('_', ' ')).join(' ↔ ')}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                                        {tension.description}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden shrink-0">
                                        <motion.div
                                            className={`h-full ${tension.severity > 0.7 ? 'bg-red-500' :
                                                tension.severity > 0.4 ? 'bg-orange-500' :
                                                    'bg-yellow-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${tension.severity * 100}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-bold font-mono shrink-0 ${tension.severity > 0.7 ? 'text-red-400' :
                                        tension.severity > 0.4 ? 'text-orange-400' :
                                            'text-yellow-400'
                                        }`}>
                                        {Math.round(tension.severity * 100)}%
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Events */}
            {events.length > 0 && (
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                        <Newspaper className="text-blue-400" size={16} />
                        <span className="text-sm font-bold text-white">Recent Events</span>
                    </div>
                    <div className="space-y-2">
                        {events.slice(0, compact ? 3 : 5).map((event, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-2 bg-slate-800/50 rounded-lg"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-300 font-medium">
                                            {event.title}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                                            <span>{event.date}</span>
                                            <span className="px-1.5 py-0.5 bg-slate-700/50 rounded text-[9px] uppercase">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${event.severity > 0.7 ? 'bg-red-500/20 text-red-400' :
                                        event.severity > 0.4 ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {event.severity > 0.7 ? 'HIGH' : event.severity > 0.4 ? 'MED' : 'LOW'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Country Status Grid */}
            {!compact && data.countries.length > 0 && (
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                        <Globe2 className="text-cyan-400" size={16} />
                        <span className="text-sm font-bold text-white">Country Status</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {data.countries.slice(0, 8).map((country, i) => {
                            const avgHealth = (
                                country.energySecurity +
                                country.economicHealth +
                                country.politicalStability
                            ) / 3;

                            return (
                                <motion.div
                                    key={country.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm">{country.flag}</span>
                                            <span className="text-[10px] font-medium text-white truncate max-w-[60px]">
                                                {country.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {avgHealth > 0.6 ? (
                                                <TrendingUp className="text-green-400" size={10} />
                                            ) : (
                                                <TrendingDown className="text-red-400" size={10} />
                                            )}
                                            <span className={`text-[10px] font-bold font-mono ${avgHealth > 0.7 ? 'text-green-400' :
                                                avgHealth > 0.5 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                {Math.round(avgHealth * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${avgHealth > 0.7 ? 'bg-green-500' :
                                                avgHealth > 0.5 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${avgHealth * 100}%` }}
                                            transition={{ duration: 0.3, delay: i * 0.03 }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Data Source Footer */}
            <div className="text-center text-[9px] text-slate-500 font-mono">
                {isLive ? '🤖 AI-GENERATED FROM CURRENT EVENTS' : '📦 USING CACHED FALLBACK DATA'}
            </div>
        </div>
    );
}

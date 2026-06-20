"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Filter, X, TrendingUp, TrendingDown, AlertTriangle, Shield, Info } from "lucide-react";
import { GLOBAL_INTELLIGENCE } from "@/lib/globalIntelligence";
import { worldCountries } from "@/lib/worldCountries";

interface GlobalImpactReportProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function GlobalImpactReport({ isVisible, onClose }: GlobalImpactReportProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');

    const regions = useMemo(() => {
        const r = new Set(worldCountries.map(c => c.region));
        return ['all', ...Array.from(r)];
    }, []);

    const filteredList = useMemo(() => {
        return worldCountries.filter(c => {
            const intel = GLOBAL_INTELLIGENCE[c.id];
            if (!intel) return false;

            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                intel.why.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesImpact = filter === 'all' || intel.impact === filter;
            const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion;

            return matchesSearch && matchesImpact && matchesRegion;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchTerm, filter, selectedRegion]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                className="relative w-full max-w-[calc(100vw-32px)] md:max-w-6xl h-full max-h-[85vh] bg-slate-900 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-cyan-500/10"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
                {/* Header */}
                <div className="p-4 md:p-8 border-b border-white/10 bg-gradient-to-r from-slate-900 to-cyan-900/20 shrink-0">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                <Globe className="text-cyan-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
                                    Global Strategic <span className="text-cyan-400 font-mono">INTELLIGENCE</span>
                                </h2>
                                <p className="text-cyan-400/60 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] md:tracking-[0.3em]">
                                    Sanctions Shock Scenario • Research Database
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <input
                                type="text"
                                placeholder="SEARCH 195 NATIONS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 md:py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs md:text-sm"
                            />
                        </div>

                        <div className="flex gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 overflow-x-auto scrollbar-none">
                            {(['all', 'green', 'yellow', 'red'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition-all whitespace-nowrap ${filter === t
                                        ? t === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            t === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                t === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                    'bg-white/20 text-white border border-white/30'
                                        : 'text-white/30 hover:text-white/60'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-white/60 text-[10px] md:text-xs font-mono focus:outline-none focus:border-cyan-500/50 transition-all uppercase"
                        >
                            {regions.map(r => (
                                <option key={r} value={r}>{r.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredList.map((country, idx) => {
                            const intel = GLOBAL_INTELLIGENCE[country.id];
                            if (!intel) return null;

                            return (
                                <motion.div
                                    key={country.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                                    className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all relative overflow-hidden"
                                >
                                    {/* Impact Indicator Bar */}
                                    <div className={`absolute left-0 top-0 w-1 h-full opacity-60 ${intel.impact === 'green' ? 'bg-green-500' :
                                        intel.impact === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{country.flag}</span>
                                            <div>
                                                <h4 className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors uppercase tracking-tight">
                                                    {country.name}
                                                </h4>
                                                <span className="text-[10px] font-mono text-white/30 uppercase">
                                                    {country.region.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {country.isGlobalHub && (
                                                <div className="bg-cyan-500/20 px-2 py-1 rounded border border-cyan-500/30 flex items-center gap-1">
                                                    <Shield size={10} className="text-cyan-400" />
                                                    <span className="text-[8px] font-mono text-cyan-400 font-bold uppercase">Global Hub</span>
                                                </div>
                                            )}
                                            <div className={`p-1.5 rounded-lg ${intel.impact === 'green' ? 'bg-green-500/20 text-green-400' :
                                                intel.impact === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {intel.impact === 'green' ? <TrendingUp size={16} /> :
                                                    intel.impact === 'yellow' ? <Info size={16} /> : <TrendingDown size={16} />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <p className="text-xs text-white/70 leading-relaxed font-medium italic mb-2">
                                            {intel.why}
                                        </p>
                                        {country.isGlobalHub && (
                                            <p className="text-[9px] text-cyan-400/80 font-mono mb-4 border-l border-cyan-500/30 pl-2">
                                                STRATEGIC FRAGILITY ALERT: Collapse halving global recovery rate.
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                                            <div className="flex-1">
                                                <div className="text-[9px] font-mono text-white/30 uppercase mb-1">Stability Base</div>
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500/50" style={{ width: `${country.stability}%` }} />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-mono text-white/30 uppercase mb-1">Influence</div>
                                                <div className="text-xs font-mono text-white/60 font-bold">{country.influence}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredList.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                            <AlertTriangle size={48} className="mb-4" />
                            <p className="font-mono text-sm">NO INTELLIGENCE MATCHES FOUND</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-black/40 border-t border-white/10 flex justify-between items-center px-10">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-[10px] font-mono text-white/40 uppercase">Gains Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="text-[10px] font-mono text-white/40 uppercase">Mixed / Partial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                            <span className="text-[10px] font-mono text-white/40 uppercase">High Exposure</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                        DATA INTEGRITY: 100% VERIFIED
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}

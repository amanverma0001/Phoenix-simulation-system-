"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllCountries, type Country } from "@/lib/geopoliticalData";
import { GLOBAL_INTELLIGENCE } from "@/lib/globalIntelligence";

interface CountrySelectionModalProps {
    onSelect: (countryId: string) => void;
}

export default function CountrySelectionModal({ onSelect }: CountrySelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Get all 150+ countries
    const allCountries = useMemo(() => getAllCountries(), []);

    const filteredCountries = allCountries.filter((c: Country) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-2xl bg-gray-900 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10"
            >
                <div className="p-8 border-b border-cyan-500/20 bg-gradient-to-r from-gray-900 to-cyan-900/20">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Identify Your <span className="text-cyan-400 font-mono">ORIGIN</span>
                    </h2>
                    <p className="text-cyan-400/60 text-sm font-mono uppercase tracking-widest">
                        Select your home country to begin simulation
                    </p>
                </div>

                <div className="p-6">
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="SEARCH TERRITORY..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder:text-cyan-500/30 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className="text-cyan-500/30 font-mono text-xs">SCANNING...</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredCountries.map((country) => (
                            <motion.button
                                key={country.id}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(6, 182, 212, 0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelect(country.id)}
                                className="flex flex-col gap-2 p-3 bg-gray-800/50 border border-cyan-500/10 rounded-lg text-left hover:border-cyan-400/40 transition-all group overflow-hidden relative"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">
                                        {country.flag}
                                    </span>
                                    <div className="flex-1">
                                        <div className="text-white text-sm font-bold group-hover:text-cyan-300 transition-colors uppercase">
                                            {country.name}
                                        </div>
                                        <div className="text-[10px] text-cyan-500/40 font-mono">
                                            STABILITY: {country.stability}%
                                        </div>
                                    </div>
                                    {GLOBAL_INTELLIGENCE[country.id] && (
                                        <div className={`w-2 h-2 rounded-full ${GLOBAL_INTELLIGENCE[country.id].impact === 'green' ? 'bg-green-500 shadow-[0_0_8px_green]' :
                                                GLOBAL_INTELLIGENCE[country.id].impact === 'yellow' ? 'bg-yellow-500' : 'bg-red-500 shadow-[0_0_8px_red]'
                                            }`} />
                                    )}
                                </div>
                                {GLOBAL_INTELLIGENCE[country.id] && (
                                    <p className="text-[9px] text-white/30 italic group-hover:text-white/60 transition-colors line-clamp-2">
                                        {GLOBAL_INTELLIGENCE[country.id].why}
                                    </p>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-black/40 border-t border-cyan-500/10 flex justify-between items-center px-8">
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500/40" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500/20" />
                    </div>
                    <span className="text-[10px] text-cyan-500/30 font-mono tracking-[0.2em]">
                        VERIFYING AGENT IDENTITY...
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

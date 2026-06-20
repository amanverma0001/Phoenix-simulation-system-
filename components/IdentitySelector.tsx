"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, MapPin, ChevronRight, Search, DollarSign, Zap } from 'lucide-react';
import { countries, Country } from '@/lib/geopoliticalData';

interface IdentitySelectorProps {
    onSelect: (countryId: string, role: string) => void;
    isVisible: boolean;
    onSkip?: () => void;
}

export default function IdentitySelector({ onSelect, isVisible, onSkip }: IdentitySelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);

    // Only show primary countries for selection
    const availableCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ROLES = [
        {
            id: 'corporate',
            name: 'Corporate CEO',
            icon: DollarSign,
            description: 'Maximize economic extraction. x1.8 Economic impact, x0.5 Military impact.',
            color: '#fbbf24'
        },
        {
            id: 'intelligence',
            name: 'Intelligence Director',
            icon: Shield,
            description: 'Focus on internal stability and shadow actors. x1.4 Stability impact.',
            color: '#3b82f6'
        },
        {
            id: 'diplomat',
            name: 'Diplomatic Envoy',
            icon: Globe,
            description: 'Maintain global trust. Higher Coherence gains and lower Trust decay.',
            color: '#10b981'
        }
    ];

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />

            <motion.div
                className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col"
                initial={{ scale: 0.9, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
                {step === 1 ? (
                    <>
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Shield className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
                                    Step 01: Specify Geopolitical Anchor
                                </span>
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 italic">Origin</span>
                            </h2>
                        </div>

                        <div className="relative mb-6 max-w-md mx-auto w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search regions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono text-sm"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {availableCountries.map((country, index) => (
                                    <motion.button
                                        key={country.id}
                                        className="group relative rounded-xl p-4 text-left transition-all overflow-hidden"
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
                                        whileHover={{ scale: 1.03, y: -4 }}
                                        onClick={() => {
                                            setSelectedCountry(country.id);
                                            setStep(2);
                                        }}
                                        onMouseEnter={() => setHoveredCountry(country.id)}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                        style={{
                                            background: hoveredCountry === country.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${hoveredCountry === country.id ? country.color + '80' : 'rgba(255,255,255,0.05)'}`,
                                            boxShadow: hoveredCountry === country.id ? `0 10px 40px ${country.color}30, 0 0 20px ${country.color}20` : 'none',
                                        }}
                                    >
                                        {/* Corner accents */}
                                        <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t transition-all duration-300 ${hoveredCountry === country.id ? 'opacity-100' : 'opacity-30'}`} style={{ borderColor: country.color }} />
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b transition-all duration-300 ${hoveredCountry === country.id ? 'opacity-100' : 'opacity-30'}`} style={{ borderColor: country.color }} />

                                        {/* Shine sweep */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                        {/* Floating glow */}
                                        <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full blur-2xl transition-opacity duration-300" style={{ background: country.color, opacity: hoveredCountry === country.id ? 0.3 : 0 }} />

                                        <h4 className="font-bold text-white mb-1 relative z-10">{country.name}</h4>
                                        <span className="text-[10px] font-mono text-gray-500 relative z-10">Influence: {country.influence}</span>

                                        {/* Bottom indicator line */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-[2px]"
                                            style={{ background: country.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: hoveredCountry === country.id ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                                <Zap className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
                                    Step 02: Define Strategic Mandate
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                                Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 italic">Identity</span>
                            </h2>
                            <p className="text-gray-400">Class-based modifiers affect how your actions propagate through the system.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
                            {ROLES.map((role) => (
                                <motion.button
                                    key={role.id}
                                    className="flex flex-col p-5 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all group relative overflow-hidden"
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    onClick={() => onSelect(selectedCountry!, role.id)}
                                    style={{
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                                    }}
                                >
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor: role.color }} />
                                    <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor: role.color }} />
                                    <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor: role.color }} />
                                    <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor: role.color }} />

                                    {/* Floating glow orb */}
                                    <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-40" style={{ background: role.color }} />

                                    {/* Shine sweep */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                    {/* Scanlines on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.05) 2px, rgba(0,255,255,0.05) 4px)' }} />

                                    <motion.div
                                        className="mb-4 p-3 rounded-lg inline-flex"
                                        style={{ background: `${role.color}20` }}
                                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <role.icon className="w-7 h-7" style={{ color: role.color, filter: `drop-shadow(0 0 8px ${role.color}80)` }} />
                                    </motion.div>
                                    <h3 className="text-lg font-bold text-white mb-1 relative z-10">{role.name}</h3>
                                    <p className="text-xs text-gray-400 mb-3 line-clamp-3 relative z-10">{role.description}</p>
                                    <div className="mt-auto flex items-center text-[9px] font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity relative z-10" style={{ color: role.color }}>
                                        SELECT <ChevronRight className="w-3 h-3 ml-1" />
                                    </div>

                                    {/* Accent line - now animated */}
                                    <motion.div
                                        className="absolute top-0 left-0 h-1"
                                        style={{ background: `linear-gradient(to right, ${role.color}, ${role.color}50)` }}
                                        initial={{ width: '30%' }}
                                        whileHover={{ width: '100%' }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.button>
                            ))}
                        </div>

                        <button
                            className="mt-8 text-gray-500 text-xs font-mono hover:text-white transition-colors"
                            onClick={() => setStep(1)}
                        >
                            ← RETURN TO ORIGIN SELECTION
                        </button>
                    </motion.div>
                )}
                {/* Footer with Skip */}
                <div className="mt-8 text-center space-y-4">
                    {onSkip && (
                        <motion.button
                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                            onClick={onSkip}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            ⏭ Skip to Simulation
                        </motion.button>
                    )}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
                        <Globe className="w-3 h-3 animate-spin-slow" />
                        <span>All 12 primary sovereign entities detected</span>
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </motion.div>
    );
}

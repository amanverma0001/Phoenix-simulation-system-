"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, RefreshCw, Play, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { aiScenarioGenerator, GeneratedScenario } from '@/lib/AIScenarioGenerator';

interface ScenarioGeneratorPanelProps {
    onRunScenario?: (scenario: GeneratedScenario) => void;
    isVisible?: boolean;
    onClose?: () => void;
}

export default function ScenarioGeneratorPanel({ onRunScenario, isVisible = true, onClose }: ScenarioGeneratorPanelProps) {
    const [scenario, setScenario] = useState<GeneratedScenario | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);

    const generateRandom = async () => {
        setIsGenerating(true);
        try {
            const newScenario = await aiScenarioGenerator.generateRandomScenario();
            setScenario(newScenario);
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateCustom = async () => {
        if (!customPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const newScenario = await aiScenarioGenerator.generateFromPrompt(customPrompt);
            setScenario(newScenario);
            setCustomPrompt('');
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateDaily = async () => {
        setIsGenerating(true);
        try {
            const newScenario = await aiScenarioGenerator.generateDailyScenario();
            setScenario(newScenario);
        } catch (error) {
            console.error('Daily generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const runScenario = () => {
        if (scenario && onRunScenario) {
            onRunScenario(scenario);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'extreme': return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'hard': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
            case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            default: return 'text-green-400 bg-green-500/20 border-green-500/30';
        }
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md"
        >
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl
                      border-2 border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div
                    className="px-5 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 
                     border-b border-emerald-500/20 flex items-center justify-between cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Sparkles size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-400">AI Scenario Generator</h3>
                            <p className="text-xs text-slate-400">Infinite unique scenarios</p>
                        </div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-5 space-y-4">
                                {/* Generation Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={generateRandom}
                                        disabled={isGenerating}
                                        className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500
                               hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-700
                               disabled:to-slate-700 rounded-xl font-bold text-white text-sm
                               flex items-center justify-center gap-2 transition-all"
                                    >
                                        {isGenerating ? (
                                            <RefreshCw size={16} className="animate-spin" />
                                        ) : (
                                            <Sparkles size={16} />
                                        )}
                                        Random
                                    </button>

                                    <button
                                        onClick={generateDaily}
                                        disabled={isGenerating}
                                        className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500
                               hover:from-purple-400 hover:to-pink-400 disabled:from-slate-700
                               disabled:to-slate-700 rounded-xl font-bold text-white text-sm
                               flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Calendar size={16} />
                                        Daily
                                    </button>
                                </div>

                                {/* Custom Prompt */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && generateCustom()}
                                        placeholder="e.g., China invades Taiwan"
                                        className="flex-1 px-4 py-2.5 bg-slate-900/50 border border-emerald-500/30 
                               rounded-xl text-white text-sm placeholder-slate-500 focus:border-emerald-400
                               focus:outline-none transition-colors"
                                        disabled={isGenerating}
                                    />
                                    <button
                                        onClick={generateCustom}
                                        disabled={isGenerating || !customPrompt.trim()}
                                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 
                               disabled:bg-slate-700 rounded-xl font-bold text-white text-sm
                               transition-colors"
                                    >
                                        <Zap size={16} />
                                    </button>
                                </div>

                                {/* Generated Scenario Display */}
                                <AnimatePresence mode="wait">
                                    {scenario && !isGenerating && (
                                        <motion.div
                                            key={scenario.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-3"
                                        >
                                            {/* Title & Description */}
                                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className="text-base font-bold text-emerald-400 leading-tight">
                                                        {scenario.title}
                                                    </h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getDifficultyColor(scenario.difficulty)}`}>
                                                        {scenario.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-300 leading-relaxed">
                                                    {scenario.description}
                                                </p>
                                            </div>

                                            {/* Trigger Event */}
                                            <div className="p-3 bg-slate-900/50 rounded-xl">
                                                <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1">Trigger</div>
                                                <div className="text-xs text-white">{scenario.triggerEvent}</div>
                                            </div>

                                            {/* Countries */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {scenario.affectedCountries.map((country, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 
                                       rounded-lg text-xs text-emerald-300"
                                                    >
                                                        {country}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Winners/Losers */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-2.5 bg-green-900/20 border border-green-500/20 rounded-xl">
                                                    <div className="text-[10px] text-green-400 uppercase font-bold mb-1">Winners</div>
                                                    {scenario.expectedOutcome.winners.slice(0, 2).map((w, i) => (
                                                        <div key={i} className="text-[10px] text-green-300 truncate">
                                                            • {w.country}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-2.5 bg-red-900/20 border border-red-500/20 rounded-xl">
                                                    <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Losers</div>
                                                    {scenario.expectedOutcome.losers.slice(0, 2).map((l, i) => (
                                                        <div key={i} className="text-[10px] text-red-300 truncate">
                                                            • {l.country}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Run Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={runScenario}
                                                className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500
                                   hover:from-emerald-400 hover:to-teal-400 rounded-xl 
                                   font-bold text-white flex items-center justify-center gap-2
                                   shadow-lg shadow-emerald-500/20"
                                            >
                                                <Play size={18} />
                                                Run This Scenario
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Loading State */}
                                {isGenerating && (
                                    <div className="py-8 flex flex-col items-center gap-3">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="p-4 bg-emerald-500/10 rounded-full"
                                        >
                                            <Sparkles size={24} className="text-emerald-400" />
                                        </motion.div>
                                        <div className="text-sm text-emerald-400 font-mono animate-pulse">
                                            Generating scenario...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

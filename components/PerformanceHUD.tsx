"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, HardDrive, Zap, X } from 'lucide-react';
import { performanceMonitor, PerformanceMetrics } from '@/lib/PerformanceMonitor';

interface PerformanceHUDProps {
    cascadeComplexity?: number;
    activeEntities?: number;
}

export default function PerformanceHUD({ cascadeComplexity = 0, activeEntities = 0 }: PerformanceHUDProps) {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0,
        cascadeComplexity: 0,
        activeEntities: 0,
        renderTime: 0
    });
    const [isVisible, setIsVisible] = useState(false);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const updateMetrics = () => {
            const newMetrics = performanceMonitor.update();
            performanceMonitor.setActiveEntities(activeEntities);
            setMetrics({ ...newMetrics, cascadeComplexity, activeEntities });
            animationRef.current = requestAnimationFrame(updateMetrics);
        };

        if (isVisible) {
            animationRef.current = requestAnimationFrame(updateMetrics);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isVisible, cascadeComplexity, activeEntities]);

    // Toggle with Shift+P
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'P' && e.shiftKey) {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const grade = performanceMonitor.getPerformanceGrade();
    const gradeColor = performanceMonitor.getGradeColor(grade);

    const getFpsColor = (fps: number) => {
        if (fps >= 55) return 'text-green-400';
        if (fps >= 45) return 'text-yellow-400';
        if (fps >= 30) return 'text-orange-400';
        return 'text-red-400';
    };

    const getFpsBarColor = (fps: number) => {
        if (fps >= 55) return 'bg-green-500';
        if (fps >= 45) return 'bg-yellow-500';
        if (fps >= 30) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (!isVisible) {
        return (
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsVisible(true)}
                className="fixed top-4 left-4 z-50 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm 
                   border border-slate-700 rounded-lg text-xs text-slate-400 
                   hover:text-cyan-400 hover:border-cyan-500/30 transition-all
                   flex items-center gap-2 screenshot-ignore"
            >
                <Activity size={14} />
                <span className="font-mono">Stats</span>
                <span className={`font-bold ${getFpsColor(metrics.fps)}`}>{metrics.fps}</span>
            </motion.button>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed top-4 left-4 z-50 w-72 screenshot-ignore"
            >
                <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-cyan-400" />
                            <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Performance</span>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-4 space-y-4 font-mono text-xs">
                        {/* FPS */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Zap size={12} />
                                    <span>FPS</span>
                                </div>
                                <span className={`font-bold text-lg ${getFpsColor(metrics.fps)}`}>
                                    {metrics.fps}
                                </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${getFpsBarColor(metrics.fps)} transition-all`}
                                    animate={{ width: `${Math.min((metrics.fps / 60) * 100, 100)}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </div>

                        {/* Memory */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <HardDrive size={12} />
                                    <span>Memory</span>
                                </div>
                                <span className="text-cyan-400 font-bold">{metrics.memoryUsage} MB</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-500"
                                    animate={{ width: `${Math.min((metrics.memoryUsage / 300) * 100, 100)}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </div>

                        {/* Cascade Complexity */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Cpu size={12} />
                                    <span>Cascade Complexity</span>
                                </div>
                                <span className="text-purple-400 font-bold">{cascadeComplexity}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-purple-500"
                                    animate={{ width: `${Math.min((cascadeComplexity / 100) * 100, 100)}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </div>

                        {/* Active Entities */}
                        <div className="flex items-center justify-between py-2 border-t border-slate-800">
                            <span className="text-slate-400">Active Entities</span>
                            <span className="text-white font-bold text-lg">{activeEntities}</span>
                        </div>

                        {/* Performance Grade */}
                        <div className="pt-3 border-t border-slate-800">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Performance Grade</span>
                                <motion.div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center
                             text-2xl font-black text-white bg-gradient-to-br ${gradeColor}
                             shadow-lg`}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {grade}
                                </motion.div>
                            </div>
                        </div>

                        {/* Hint */}
                        <div className="pt-3 border-t border-slate-800 text-slate-500 text-[10px] text-center">
                            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Shift+P</kbd> to toggle
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

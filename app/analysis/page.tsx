"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    BarChart3, TrendingDown, Globe, AlertTriangle,
    ArrowLeft, Activity, Users, Zap, Shield
} from "lucide-react"
import Link from "next/link"

export default function AnalysisPage() {
    // Mock data for demonstration
    const analysisData = {
        globalStability: 42,
        regionsAffected: 8,
        cascadeDepth: 12,
        emergenceEvents: 5,
        primaryDrivers: [
            { name: "Energy Disruption", impact: 35 },
            { name: "Trade Collapse", impact: 28 },
            { name: "Social Unrest", impact: 22 },
            { name: "Currency Crisis", impact: 15 },
        ],
        regionalBreakdown: [
            { region: "Europe", stability: 35, trend: "down" },
            { region: "Asia-Pacific", stability: 58, trend: "stable" },
            { region: "Middle East", stability: 22, trend: "down" },
            { region: "Americas", stability: 67, trend: "up" },
            { region: "Africa", stability: 45, trend: "down" },
        ]
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-auto">
            {/* Animated background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                            >
                                <ArrowLeft className="text-cyan-400" size={20} />
                            </motion.button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black font-orbitron text-white tracking-wider uppercase">
                                Deep Analysis
                            </h1>
                            <p className="text-xs font-mono text-cyan-500/60 uppercase tracking-widest">
                                Post-Simulation Intelligence Report
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className="text-green-400 animate-pulse" size={16} />
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Analysis Complete</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Global Stability", value: `${analysisData.globalStability}%`, icon: Shield, color: "text-red-400" },
                        { label: "Regions Affected", value: analysisData.regionsAffected, icon: Globe, color: "text-orange-400" },
                        { label: "Cascade Depth", value: analysisData.cascadeDepth, icon: Zap, color: "text-yellow-400" },
                        { label: "Emergence Events", value: analysisData.emergenceEvents, icon: Users, color: "text-cyan-400" },
                    ].map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <metric.icon className={metric.color} size={20} />
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                    {metric.label}
                                </span>
                            </div>
                            <p className={`text-4xl font-black font-orbitron ${metric.color}`}>
                                {metric.value}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Analysis Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Primary Drivers */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-3xl bg-white/[0.02] border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="text-cyan-400" size={24} />
                            <h2 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider">
                                Primary Drivers
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {analysisData.primaryDrivers.map((driver, index) => (
                                <div key={driver.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">{driver.name}</span>
                                        <span className="text-sm font-bold text-white">{driver.impact}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${driver.impact}%` }}
                                            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Regional Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 rounded-3xl bg-white/[0.02] border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="text-orange-400" size={24} />
                            <h2 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider">
                                Regional Breakdown
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {analysisData.regionalBreakdown.map((region) => (
                                <div key={region.region} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
                                    <span className="text-sm font-medium text-white">{region.region}</span>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-lg font-bold font-orbitron ${region.stability > 60 ? 'text-green-400' :
                                                region.stability > 40 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            {region.stability}%
                                        </span>
                                        <TrendingDown className={`${region.trend === 'up' ? 'text-green-400 rotate-180' :
                                                region.trend === 'down' ? 'text-red-400' : 'text-gray-500'
                                            }`} size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Return CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <Link href="/simulator">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-2 border-cyan-500 text-cyan-400 font-bold font-orbitron uppercase tracking-widest"
                        >
                            Return to Simulation
                        </motion.button>
                    </Link>
                </motion.div>
            </main>
        </div>
    )
}

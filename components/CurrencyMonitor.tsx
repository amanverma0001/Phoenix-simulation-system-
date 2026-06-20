"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    TrendingUp, TrendingDown, Minus, RefreshCw,
    DollarSign, X, Activity, Globe, Zap, Wifi, WifiOff
} from "lucide-react"
import { fetchRealCurrencyRates, CurrencyRate } from "@/lib/currencyService"
import { getCascadeEngine } from "@/lib/CascadeEngine"

interface CurrencyMonitorProps {
    isVisible: boolean
    onClose: () => void
    globalStability: number
    countryStabilities?: Record<string, number>
}

export default function CurrencyMonitor({
    isVisible,
    onClose,
    globalStability,
    countryStabilities = {}
}: CurrencyMonitorProps) {
    const [rates, setRates] = useState<CurrencyRate[]>([])
    const [sparklines, setSparklines] = useState<Record<string, number[]>>({})
    const [flashingCurrencies, setFlashingCurrencies] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)
    const [isLive, setIsLive] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Fetch real rates from API
    const fetchRates = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            const fetchedRates = await fetchRealCurrencyRates()

            if (fetchedRates.length > 0) {
                setRates(prevRates => {
                    // Determine which currencies had significant changes
                    const newFlashing = new Set<string>()

                    fetchedRates.forEach(newRate => {
                        const oldRate = prevRates.find(r => r.code === newRate.code)
                        if (oldRate) {
                            const change = Math.abs((newRate.rate - oldRate.rate) / oldRate.rate) * 100
                            if (change > 0.1) {
                                newFlashing.add(newRate.code)
                            }
                        }
                    })

                    setFlashingCurrencies(newFlashing)
                    setTimeout(() => setFlashingCurrencies(new Set()), 500)

                    return fetchedRates
                })

                // Update sparklines
                setSparklines(prev => {
                    const updated: Record<string, number[]> = { ...prev }
                    fetchedRates.forEach(rate => {
                        const existing = updated[rate.code] || []
                        updated[rate.code] = [...existing.slice(-19), rate.rate]
                    })
                    return updated
                })

                setIsLive(true)
                setLastUpdate(new Date())
            }
        } catch (err) {
            console.error('[CurrencyMonitor] Fetch error:', err)
            setError('Failed to fetch rates')
            setIsLive(false)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Initial fetch and polling
    useEffect(() => {
        if (isVisible) {
            fetchRates()

            // Poll every 30 seconds for updates
            const interval = setInterval(fetchRates, 30000)
            return () => clearInterval(interval)
        }
    }, [isVisible, fetchRates])

    // Apply stability-based volatility simulation between real updates
    useEffect(() => {
        if (!isVisible || rates.length === 0) return

        const interval = setInterval(() => {
            const instability = (100 - globalStability) / 100

            setRates(prevRates => {
                const newFlashing = new Set<string>()

                const updated = prevRates.map(rate => {
                    // Get country-specific instability
                    const countryStability = countryStabilities[rate.country] ?? globalStability
                    const countryInstability = (100 - countryStability) / 100
                    const totalInstability = (instability * 0.5 + countryInstability * 0.5)

                    // Small random fluctuation based on instability
                    const volatility = 0.001 + (totalInstability * 0.005)
                    const change = (Math.random() - 0.5) * 2 * volatility
                    const newRate = rate.rate * (1 + change)

                    const changePercent = ((newRate - rate.previousRate) / rate.previousRate) * 100

                    if (Math.abs(changePercent) > 0.3) {
                        newFlashing.add(rate.code)
                    }

                    // [Refinement] Economic Feedback Loopback
                    // Only trigger for significant individual country drops
                    if (changePercent < -5) {
                        getCascadeEngine().handleCurrencyCollapse(rate.country.toLowerCase(), Math.abs(changePercent));
                    }

                    return {
                        ...rate,
                        rate: newRate,
                        change: newRate - rate.previousRate,
                        changePercent
                    }
                })

                setFlashingCurrencies(newFlashing)
                setTimeout(() => setFlashingCurrencies(new Set()), 300)

                return updated
            })

            // Update sparklines
            setSparklines(prev => {
                const updated: Record<string, number[]> = { ...prev }
                rates.forEach(rate => {
                    const existing = updated[rate.code] || []
                    updated[rate.code] = [...existing.slice(-19), rate.rate]
                })
                return updated
            })
        }, 3000) // Update every 3 seconds

        return () => clearInterval(interval)
    }, [isVisible, rates, globalStability, countryStabilities])

    const getChangeIcon = (change: number) => {
        if (change > 0.05) return <TrendingUp className="text-green-400" size={14} />
        if (change < -0.05) return <TrendingDown className="text-red-400" size={14} />
        return <Minus className="text-gray-500" size={14} />
    }

    const getChangeColor = (change: number) => {
        if (change > 0.05) return 'text-green-400'
        if (change < -0.05) return 'text-red-400'
        return 'text-gray-500'
    }

    const getCrisisLevel = (rate: CurrencyRate) => {
        if (Math.abs(rate.changePercent) > 2) return { level: 'CRISIS', color: 'text-red-400 bg-red-500/20 border-red-500/30' }
        if (Math.abs(rate.changePercent) > 1) return { level: 'VOLATILE', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' }
        return null
    }

    // Render mini sparkline
    const renderSparkline = (data: number[]) => {
        if (!data || data.length < 2) return null

        const min = Math.min(...data)
        const max = Math.max(...data)
        const range = max - min || 1

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * 60
            const y = 20 - ((val - min) / range) * 18
            return `${x},${y}`
        }).join(' ')

        const trend = data[data.length - 1] > data[0]

        return (
            <svg width="60" height="24" className="opacity-60">
                <polyline
                    points={points}
                    fill="none"
                    stroke={trend ? '#22c55e' : '#ef4444'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/30 via-transparent to-cyan-500/10 p-[1px]" />

                <div className="relative bg-black/95 backdrop-blur-3xl rounded-3xl border border-cyan-500/20 overflow-hidden">

                    {/* Header */}
                    <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30"
                                    animate={{
                                        boxShadow: ['0 0 15px rgba(6,182,212,0.2)', '0 0 25px rgba(6,182,212,0.4)', '0 0 15px rgba(6,182,212,0.2)']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <DollarSign className="text-cyan-400" size={24} />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-black font-orbitron text-white tracking-wider uppercase">
                                        Global Currency Monitor
                                    </h2>
                                    <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mt-1">
                                        Real-time FX rates vs USD • API-powered
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Live/Offline status */}
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isLive
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-yellow-500/10 border-yellow-500/30'
                                    }`}>
                                    {isLive ? (
                                        <>
                                            <Wifi className="text-green-400" size={14} />
                                            <span className="text-[10px] font-mono text-green-400">LIVE</span>
                                        </>
                                    ) : (
                                        <>
                                            <WifiOff className="text-yellow-400" size={14} />
                                            <span className="text-[10px] font-mono text-yellow-400">SIMULATED</span>
                                        </>
                                    )}
                                </div>
                                {/* Refresh button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); fetchRates() }}
                                    className="p-2 hover:bg-cyan-500/10 rounded-xl text-gray-500 hover:text-cyan-400 transition-all"
                                    disabled={isLoading}
                                >
                                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-cyan-500/10 rounded-xl text-gray-500 hover:text-cyan-400 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Currency list */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {isLoading && rates.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className="text-cyan-400 animate-spin" size={32} />
                                <span className="ml-4 text-gray-400 font-mono">Fetching live rates...</span>
                            </div>
                        ) : error && rates.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-red-400 font-mono">{error}</p>
                                <button
                                    onClick={fetchRates}
                                    className="mt-4 px-4 py-2 bg-cyan-500/20 rounded-xl text-cyan-400 hover:bg-cyan-500/30 transition-all"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {rates.map((rate, index) => {
                                    const crisis = getCrisisLevel(rate)
                                    const isFlashing = flashingCurrencies.has(rate.code)

                                    return (
                                        <motion.div
                                            key={rate.code}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                backgroundColor: isFlashing
                                                    ? rate.changePercent > 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                                                    : 'rgba(255, 255, 255, 0.02)'
                                            }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">{rate.flag}</span>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold font-orbitron text-white">
                                                            USD/{rate.code}
                                                        </span>
                                                        {crisis && (
                                                            <span className={`px-2 py-0.5 text-[8px] font-mono font-bold rounded-md border ${crisis.color}`}>
                                                                {crisis.level}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-mono text-gray-500">
                                                        {rate.name} • {rate.country}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                {/* Sparkline */}
                                                <div className="hidden sm:block">
                                                    {renderSparkline(sparklines[rate.code])}
                                                </div>

                                                {/* Rate */}
                                                <div className="text-right">
                                                    <motion.p
                                                        className="text-lg font-bold font-orbitron text-white"
                                                        key={rate.rate}
                                                        initial={{ scale: 1.1 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        {rate.rate.toFixed(rate.rate < 10 ? 4 : 2)}
                                                    </motion.p>
                                                </div>

                                                {/* Change */}
                                                <div className="flex items-center gap-2 min-w-[80px] justify-end">
                                                    {getChangeIcon(rate.changePercent)}
                                                    <span className={`text-sm font-mono font-bold ${getChangeColor(rate.changePercent)}`}>
                                                        {rate.changePercent > 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Globe className="text-cyan-400" size={14} />
                                    <span className="text-[10px] font-mono text-gray-500">
                                        Stability: <span className={globalStability < 40 ? 'text-red-400' : 'text-cyan-400'}>{globalStability.toFixed(1)}%</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="text-yellow-400" size={14} />
                                    <span className="text-[10px] font-mono text-gray-500">
                                        Volatility: <span className="text-yellow-400">{globalStability < 40 ? 'HIGH' : globalStability < 70 ? 'MODERATE' : 'LOW'}</span>
                                    </span>
                                </div>
                                {lastUpdate && (
                                    <span className="text-[10px] font-mono text-gray-600">
                                        Updated: {lastUpdate.toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-mono text-gray-600">
                                Press [C] to toggle
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

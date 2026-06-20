"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useAIVoice } from '@/hooks/useAIVoice';
import { getShockScore } from '@/lib/GlobalShockDataset';

interface SystemCoherenceMeterProps {
    stability: number;              // 0-100 scale (current stability)
    isAnimating?: boolean;          // Is cascade active?
    onThresholdCrossed?: () => void; // Callback when hits 70%
    compact?: boolean;              // Use compact version
    unstableCountries?: string[];    // List of names or IDs
    targetCountryId?: string | null; // Targeted for GDS analysis
}

export default function SystemCoherenceMeter({
    stability,
    isAnimating = false,
    onThresholdCrossed,
    compact = false,
    unstableCountries = [],
    targetCountryId = null
}: SystemCoherenceMeterProps) {
    const { speakCoherenceAlert } = useAIVoice();

    // Convert to 0-1 scale internally
    const normalizedStability = Math.max(0, Math.min(100, stability)) / 100;

    const [displayStability, setDisplayStability] = useState(normalizedStability);
    const [phase, setPhase] = useState<'optimal' | 'degraded' | 'unstable' | 'critical' | 'collapsed'>('optimal');
    const [hasTriggeredThreshold, setHasTriggeredThreshold] = useState(false);

    // Smooth animation for the meter
    const motionStability = useMotionValue(normalizedStability);
    const smoothStability = useSpring(motionStability, {
        stiffness: 50,
        damping: 20,
        mass: 1
    });

    // Previous stability for delta calculation
    const prevStabilityRef = useRef(normalizedStability);

    // Update refs for use inside intervals
    const stabilityRef = useRef(normalizedStability);
    const unstableCountriesRef = useRef(unstableCountries);

    useEffect(() => {
        stabilityRef.current = displayStability;
    }, [displayStability]);

    useEffect(() => {
        unstableCountriesRef.current = unstableCountries;
    }, [unstableCountries]);

    // Update display stability smoothly
    useEffect(() => {
        motionStability.set(normalizedStability);

        const unsubscribe = smoothStability.on('change', (latest) => {
            setDisplayStability(latest);
        });

        return () => unsubscribe();
    }, [normalizedStability, motionStability, smoothStability]);

    // Determine phase based on stability
    useEffect(() => {
        if (displayStability >= 0.90) {
            setPhase('optimal');
        } else if (displayStability >= 0.70) {
            setPhase('degraded');
        } else if (displayStability >= 0.50) {
            setPhase('critical');
        } else {
            setPhase('collapsed');
        }
    }, [displayStability]);

    // Trigger callback when crossing 70% threshold
    useEffect(() => {
        const prev = prevStabilityRef.current;
        const current = displayStability;

        if (prev > 0.70 && current <= 0.70 && !hasTriggeredThreshold) {
            setHasTriggeredThreshold(true);
            onThresholdCrossed?.();
        }

        prevStabilityRef.current = current;
    }, [displayStability, hasTriggeredThreshold, onThresholdCrossed]);

    // Handle AI voice reaction to phase changes
    const lastAlertPhaseRef = useRef<string>('optimal');
    useEffect(() => {
        if (phase !== 'optimal' && phase !== lastAlertPhaseRef.current) {
            if (phase === 'degraded' || phase === 'critical' || phase === 'collapsed') {
                speakCoherenceAlert(phase);
            }
            lastAlertPhaseRef.current = phase;
        } else if (phase === 'optimal') {
            lastAlertPhaseRef.current = 'optimal';
        }
    }, [phase, speakCoherenceAlert]);

    // Reset threshold trigger when stability goes back up
    useEffect(() => {
        // Use a 2% buffer to prevent jitter loop at exactly 70%
        if (displayStability > 0.72) {
            setHasTriggeredThreshold(false);
        }
    }, [displayStability]);

    const percentage = Math.round(displayStability * 100);

    // Calculate drop rate
    const [dropRate, setDropRate] = useState(0);
    useEffect(() => {
        if (!isAnimating) {
            setDropRate(0);
            return;
        }

        const interval = setInterval(() => {
            const current = smoothStability.get();
            const prev = prevStabilityRef.current;
            const delta = (prev - current) * 10;
            setDropRate(delta);
        }, 100);

        return () => clearInterval(interval);
    }, [isAnimating, smoothStability]);

    // Phase colors
    const getPhaseColor = (): string => {
        switch (phase) {
            case 'optimal': return '#22d3ee';   // Cyan
            case 'degraded': return '#fbbf24';  // Yellow
            case 'critical': return '#ef4444';  // Red
            case 'collapsed': return '#7f1d1d'; // Dark red
            default: return '#22d3ee';
        }
    };

    // Phase labels
    const getPhaseLabel = (): string => {
        switch (phase) {
            case 'optimal': return 'OPTIMAL';
            case 'degraded': return 'DEGRADED';
            case 'critical': return 'CRITICAL';
            case 'collapsed': return 'COLLAPSE';
            default: return 'OPTIMAL';
        }
    };

    const phaseColor = getPhaseColor();
    const phaseLabel = getPhaseLabel();

    // SVG circle calculations
    const radius = compact ? 60 : 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayStability * circumference);
    const size = compact ? 160 : 220;
    const center = size / 2;

    // Data Undercurrents: Generate shifting hex codes for critical states
    const [hexStream, setHexStream] = useState<string[]>([]);
    const isCritical = displayStability <= 0.50; // Stabilize dependency

    useEffect(() => {
        if (!isCritical) {
            setHexStream([]);
            return;
        }
        const interval = setInterval(() => {
            const newHex = Array.from({ length: 6 }, () =>
                Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
            ).join(' ');
            setHexStream(prev => [newHex, ...prev.slice(0, 4)]);
        }, 150);
        return () => clearInterval(interval);
    }, [isCritical]);

    // Glitch Labels: Randomly swap phase label to thematic text
    const [glitchLabel, setGlitchLabel] = useState<string | null>(null);
    const isGlitchZone = displayStability <= 0.40; // Stabilize dependency

    useEffect(() => {
        if (!isGlitchZone) {
            setGlitchLabel(null);
            return;
        }
        const glitchTexts = ['EMERGENCE', 'REVEALING PATTERNS', 'ORDER→NOISE', 'EVOLVING'];
        const interval = setInterval(() => {
            if (Math.random() < 0.3) {
                setGlitchLabel(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
                setTimeout(() => setGlitchLabel(null), 200);
            }
        }, 800);
        return () => clearInterval(interval);
    }, [isGlitchZone]);

    // AI Observation Stream: Real-time "thoughts" from the AI
    const [aiObservations, setAiObservations] = useState<{ id: string, text: string, isAlert: boolean }[]>([]);
    useEffect(() => {
        const observations = [
            "Analyzing systemic data flows...",
            "Structural integrity within nominal range",
            "Monitoring latent volatility peaks",
            "Consensus protocols active",
            "Geopolitical friction at baseline",
            "Detecting micro-drift in relationships",
            "AI Oracle: Probability of cascade < 2%"
        ];

        const crisisObservations = [
            "WARNING: Consensus failure detected",
            "AI: Structural nodes under high load",
            "Volatility exceeding predictive baseline",
            "Alert: Emergent patterns overriding control",
            "Critical: Systemic trust depletion",
            "Simulation: Entering non-linear phase",
            "AI: Rerouting predictive resources..."
        ];

        const interval = setInterval(() => {
            const currentStability = stabilityRef.current;
            const currentUnstable = unstableCountriesRef.current;

            let pool = currentStability > 0.6 ? [...observations] : [...crisisObservations];

            // Add dynamic context if unstable countries exist
            if (currentUnstable.length > 0) {
                const target = currentUnstable[Math.floor(Math.random() * currentUnstable.length)];
                pool.push(`Intelligence: Mapping fracture in ${target}...`);
                pool.push(`Observation: ${target} bypasses consensus.`);
            }

            const newObs = {
                id: Math.random().toString(36).substr(2, 9),
                text: pool[Math.floor(Math.random() * pool.length)],
                isAlert: currentStability <= 0.6
            };
            setAiObservations(prev => [newObs, ...prev].slice(0, 4));
        }, 4000); // Fixed 4s interval for stability

        return () => clearInterval(interval);
    }, []); // Empty deps to avoid resets

    return (
        <div className="relative flex flex-col items-center">
            {/* Data Undercurrents Layer */}
            {displayStability <= 0.50 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden opacity-30">
                    {hexStream.map((hex, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 0.6 - i * 0.1, y: 0 }}
                            className="text-[8px] font-mono text-red-400/60 tracking-widest"
                        >
                            {hex}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Main Circular Meter */}
            <div className="relative flex items-center justify-center">
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform -rotate-90 relative z-10"
                >
                    {/* Background Grid Pattern */}
                    <defs>
                        <pattern id="meterGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <circle cx={center} cy={center} r={radius + 20} fill="url(#meterGrid)" opacity={displayStability <= 0.5 ? 0.3 : 0.1} />

                    {/* Background ring */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={compact ? 12 : 16}
                    />

                    {/* Background glow ring */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="rgba(6, 182, 212, 0.1)"
                        strokeWidth={compact ? 14 : 18}
                    />

                    {/* Progress ring */}
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={phaseColor}
                        strokeWidth={compact ? 10 : 14}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        initial={{ strokeDashoffset: 0 }}
                        animate={{
                            strokeDashoffset: offset,
                            strokeWidth: displayStability <= 0.3 ? [compact ? 10 : 14, compact ? 12 : 18, compact ? 10 : 14] : (compact ? 10 : 14),
                            opacity: displayStability <= 0.3 ? [1, 0.7, 1] : 1
                        }}
                        transition={{
                            strokeDashoffset: { duration: 0.5 },
                            strokeWidth: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                            opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                        }}
                        style={{
                            filter: displayStability <= 0.70
                                ? `drop-shadow(0 0 15px ${phaseColor}) drop-shadow(0 0 30px ${phaseColor}40)`
                                : `drop-shadow(0 0 8px ${phaseColor}40)`
                        }}
                    />

                    {/* Critical threshold marker (70%) */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray={`${circumference * 0.02} ${circumference * 0.98}`}
                        strokeDashoffset={circumference * 0.3}
                        opacity="0.5"
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* SEC label */}
                    <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-500/40 mb-1 font-bold">
                        SYSTEM_COH
                    </div>

                    {/* Percentage */}
                    <motion.div
                        className={`font-mono font-black ${compact ? 'text-4xl' : 'text-6xl'}`}
                        style={{ color: phaseColor }}
                        animate={{
                            scale: displayStability <= 0.50 ? [1, 1.05, 1] : 1,
                            filter: displayStability <= 0.70
                                ? `drop-shadow(0 0 10px ${phaseColor})`
                                : 'none'
                        }}
                        transition={{
                            scale: { repeat: displayStability <= 0.50 ? Infinity : 0, duration: 0.8 },
                            filter: { duration: 0.3 }
                        }}
                    >
                        {percentage}
                    </motion.div>

                    {/* Drop rate indicator */}
                    {isAnimating && dropRate > 0.01 && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1 text-red-400 font-mono text-[10px] mt-1"
                        >
                            <span>↓</span>
                            <span>{(dropRate * 100).toFixed(1)}%/s</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Labels */}
            <div className="mt-4 text-center space-y-1">
                {/* System Coherence label */}
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                    System Coherence
                </div>

                {/* Phase label - with Glitch Label support */}
                <motion.div
                    className={`font-black uppercase tracking-[0.2em] ${compact ? 'text-sm' : 'text-lg'}`}
                    style={{ color: glitchLabel ? '#a855f7' : phaseColor }}
                    animate={{
                        scale: displayStability <= 0.50 ? [1, 1.03, 1] : 1,
                    }}
                    transition={{
                        repeat: displayStability <= 0.50 ? Infinity : 0,
                        duration: 0.6
                    }}
                >
                    {glitchLabel || phaseLabel}
                </motion.div>

                {/* Critical threshold warning */}
                {displayStability <= 0.70 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-2 text-red-400 mt-2"
                    >
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="text-xs"
                        >
                            ⚠
                        </motion.span>
                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider">CRITICAL THRESHOLD</span>
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="text-xs"
                        >
                            ⚠
                        </motion.span>
                    </motion.div>
                )}

                {/* AI Observation Stream */}
                {!compact && (
                    <div className="mt-6 w-full max-w-[200px] bg-black/60 border border-white/5 rounded-md p-2 overflow-hidden h-24 relative backdrop-blur-sm">
                        <div className="text-[7px] font-mono text-cyan-500/40 uppercase mb-2 flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="tracking-[0.2em]">INTELLIGENCE_STREAM</span>
                            <span className="flex items-center gap-1">
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-1 h-1 rounded-full bg-cyan-400"
                                />
                                <span className="text-[6px]">REALTIME</span>
                            </span>
                        </div>
                        <div className="space-y-1.5 overflow-hidden">
                            {aiObservations.map((obs, i) => (
                                <motion.div
                                    key={obs.id}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1 - i * 0.25, x: 0 }}
                                    className={`font-mono text-[8px] leading-tight flex gap-2 ${obs.isAlert ? "text-red-400/80" : "text-gray-400/70"}`}
                                >
                                    <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                    <span>{obs.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Scanline effect */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[20%] w-full animate-scan" style={{ top: '-100%' }} />
                    </div>
                )}

                {/* GLOBAL SHOCK METER OVERLAY */}
                <AnimatePresence>
                    {targetCountryId && getShockScore(targetCountryId) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="mt-6 w-full max-w-[280px] p-4 glass-premium border border-white/10 rounded-xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Animated background pulse */}
                            <motion.div
                                className="absolute inset-0 opacity-10 pointer-events-none"
                                animate={{ background: [`radial-gradient(circle at center, ${getShockScore(targetCountryId)?.color}44 0%, transparent 70%)`, `radial-gradient(circle at center, ${getShockScore(targetCountryId)?.color}22 0%, transparent 70%)`] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global Shock Meter</span>
                                        <h3 className="text-sm font-black text-white mt-1 uppercase tracking-wider">
                                            {targetCountryId.toUpperCase()} Target Analysis
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono text-gray-500 uppercase">GDS</div>
                                        <div className="text-2xl font-black font-mono leading-none" style={{ color: getShockScore(targetCountryId)?.color }}>
                                            {getShockScore(targetCountryId)?.score}
                                        </div>
                                    </div>
                                </div>

                                {/* Impact Tier Visualization */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-mono text-gray-400 uppercase">Impact Tier</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-white/10" style={{ color: getShockScore(targetCountryId)?.color, backgroundColor: `${getShockScore(targetCountryId)?.color}11` }}>
                                            {getShockScore(targetCountryId)?.tier}
                                        </span>
                                    </div>

                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            className="h-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getShockScore(targetCountryId)?.score}%` }}
                                            style={{ backgroundColor: getShockScore(targetCountryId)?.color, boxShadow: `0 0 10px ${getShockScore(targetCountryId)?.color}` }}
                                            transition={{ duration: 0.8, ease: "circOut" }}
                                        />
                                    </div>

                                    <div className="pt-2 border-t border-white/5">
                                        <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Primary Reason</p>
                                        <p className="text-[10px] text-gray-100 italic leading-snug">
                                            "{getShockScore(targetCountryId)?.reason}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tactical Brackets */}
                            <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white/20" />
                            <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-white/20" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Particle effect on critical */}
            {displayStability <= 0.50 && !compact && (
                <CriticalParticles color={phaseColor} center={center} />
            )}
        </div>
    );
}

// Critical threshold particle effect
function CriticalParticles({ color, center }: { color: string; center: number }) {
    const particles = Array.from({ length: 8 });

    return (
        <div className="absolute inset-0 pointer-events-none" style={{ width: center * 2, height: center * 2 }}>
            {particles.map((_, i) => {
                const angle = (i / particles.length) * 360;
                const distance = center - 20;
                const x = Math.cos((angle * Math.PI) / 180) * distance;
                const y = Math.sin((angle * Math.PI) / 180) * distance;

                return (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                            backgroundColor: color,
                            left: center,
                            top: center,
                        }}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: [0, x],
                            y: [0, y],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeOut'
                        }}
                    />
                );
            })}
        </div>
    );
}

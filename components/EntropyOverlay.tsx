"use client";

import { motion } from "framer-motion";
import { useEntropy } from "@/lib/EntropyContext";

/**
 * EntropyOverlay - Global visual effects driven by chaos level
 * Applies grid distortion, color shifts, and chaos aesthetics
 */
export default function EntropyOverlay() {
    const { chaosLevel, colorShift, collapseHistory, isEdgeOfChaos } = useEntropy();

    // Only show effects when chaos is significant
    if (chaosLevel < 15) return null;

    return (
        <>
            {/* Grid Distortion Overlay */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[5]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
                animate={{
                    transform: chaosLevel > 30 ? [
                        'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                        `perspective(1000px) rotateX(${(chaosLevel - 30) * 0.02}deg) rotateY(${(chaosLevel - 30) * 0.03}deg)`,
                        'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                    ] : undefined,
                    skewX: chaosLevel > 50 ? [0, (chaosLevel - 50) * 0.02, 0] : undefined,
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Color Mutation Filter */}
            <div
                className="fixed inset-0 pointer-events-none z-[4] mix-blend-overlay"
                style={{
                    background: chaosLevel > 40
                        ? `radial-gradient(ellipse at center, 
                            hsla(${colorShift.hue + chaosLevel * 0.8}, 70%, 50%, ${(chaosLevel - 40) * 0.003}) 0%, 
                            transparent 70%)`
                        : undefined,
                    filter: `hue-rotate(${colorShift.hue}deg) saturate(${colorShift.saturation}%)`,
                }}
            />

            {/* Chaos Vignette - intensifies with instability */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[3]"
                style={{
                    background: `radial-gradient(ellipse at center, 
                        transparent ${80 - chaosLevel * 0.3}%, 
                        rgba(${chaosLevel > 60 ? '139,0,0' : '0,0,0'}, ${chaosLevel * 0.005}) 100%)`,
                }}
                animate={{
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
            />

            {/* Ghost Traces - echoes of previous collapses */}
            {collapseHistory.length > 0 && chaosLevel > 20 && (
                <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
                    {collapseHistory.slice(-3).map((memory, index) => (
                        <motion.div
                            key={memory.timestamp}
                            className="absolute text-red-500/10 font-mono text-xs uppercase tracking-widest"
                            style={{
                                top: `${20 + index * 25}%`,
                                left: `${10 + index * 15}%`,
                                transform: `rotate(${-5 + index * 3}deg)`,
                            }}
                            animate={{
                                opacity: [0.05, 0.1, 0.05],
                                x: [0, 5, 0],
                            }}
                            transition={{
                                duration: 10 + index * 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="text-2xl font-black blur-[1px]">
                                {memory.scenario.replace(/_/g, ' ')}
                            </div>
                            <div className="mt-1 blur-[0.5px]">
                                {memory.affectedCountries.slice(0, 3).join(' • ')}
                            </div>
                            <div className="mt-1 text-red-500/5">
                                STABILITY: {memory.finalStability.toFixed(1)}%
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Scan Line Intensification */}
            {chaosLevel > 60 && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-[6]"
                    style={{
                        background: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(0,0,0,${(chaosLevel - 60) * 0.003}) 2px,
                            rgba(0,0,0,${(chaosLevel - 60) * 0.003}) 4px
                        )`,
                    }}
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 0.1,
                        repeat: Infinity,
                    }}
                />
            )}

            {/* Static/Noise burst at critical levels */}
            {chaosLevel > 75 && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-[7]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        opacity: (chaosLevel - 75) * 0.008,
                    }}
                    animate={{
                        opacity: [(chaosLevel - 75) * 0.005, (chaosLevel - 75) * 0.015, (chaosLevel - 75) * 0.005],
                    }}
                    transition={{
                        duration: 0.2,
                        repeat: Infinity,
                    }}
                />
            )}

            {/* Keg Zone: Data Spikes (Raw leakage) */}
            {isEdgeOfChaos && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-[10] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0, 0.1, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 5,
                    }}
                >
                    <div className="text-[10vw] font-black text-white/5 whitespace-pre font-mono select-none rotate-12">
                        {`{ "error": "SEG_FAULT", "drift": ${chaosLevel.toFixed(2)}, "origin": "KEG_ZONE" }`}
                    </div>
                </motion.div>
            )}
        </>
    );
}

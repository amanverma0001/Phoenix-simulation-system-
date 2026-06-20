/**
 * ShatterEffect Component - Hollywood-Quality Map Collapse Animation
 * 
 * The dramatic shatter effect when stability drops below 70%:
 * - Timeline-based animation (0.0s → 3.5s)
 * - Pre-calculated Voronoi cells with Matter.js physics
 * - Layered audio integration
 * - Camera zoom and screen shake
 * - RGB glitch, vignette, and flash effects
 * - Warning text overlays
 * 
 * Timeline:
 * - T=0.0s: Tension begins
 * - T=0.5s: Warning phase
 * - T=1.0s: Critical threshold
 * - T=1.5s: Dramatic pause (100ms)
 * - T=1.6s: Fracture begins
 * - T=2.0s: THE EXPLOSION
 * - T=2.0-3.0s: Chaos phase
 * - T=3.0s: Revelation
 * - T=3.5s: New world emerges
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Delaunay } from 'd3-delaunay';
import { motion, AnimatePresence } from 'framer-motion';
import type { SoundType } from '@/hooks/useSound';
import { useIsMobile } from '@/hooks/use-mobile';

export type ShatterPattern = 'explosion' | 'implosion' | 'vortex' | 'wave' | 'chaos';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ShatterEffectProps {
    active: boolean;
    pattern?: ShatterPattern;
    onComplete?: () => void;
    width: number;
    height: number;
    playSound?: (sound: SoundType) => void;
    stopSounds?: () => void;
    epicenter?: { x: number; y: number }; // [Refinement] Localized shattering
    winners?: { x: number; y: number }[]; // [NEW] Geopolitical Hubs to pull pieces toward
}

interface ShatterPiece {
    id: number;
    body: Matter.Body;
    vertices: { x: number; y: number }[];
    color: string;
    opacity: number;
    rotation: number;
    hasTrail: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

type AnimationPhase =
    | 'idle'
    | 'tension'      // T=0.0s - 0.5s
    | 'warning'      // T=0.5s - 1.0s
    | 'critical'     // T=1.0s - 1.5s
    | 'pause'        // T=1.5s - 1.6s (100ms dramatic pause)
    | 'fracture'     // T=1.6s - 2.0s
    | 'explosion'    // T=2.0s - 2.5s
    | 'chaos'        // T=2.5s - 3.0s
    | 'revelation'   // T=3.0s - 3.5s
    | 'complete';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    // Voronoi settings (scaled for mobile)
    BASE_VORONOI_CELL_COUNT: 120,
    MOBILE_VORONOI_CELL_COUNT: 60,

    // Physics
    EXPLOSION_FORCE: 0.25,
    GRAVITY: 0.003,

    // Particles (scaled for mobile)
    BASE_PARTICLE_COUNT: 8,
    MOBILE_PARTICLE_COUNT: 4,
    MAX_PARTICLES: 500,

    // Animation duration
    TOTAL_DURATION: 3500,

    // Timeline (milliseconds)
    TIMELINE: {
        TENSION_START: 0,
        WARNING_START: 500,
        CRITICAL_START: 1000,
        PAUSE_START: 1500,
        PAUSE_END: 1600,
        FRACTURE_START: 1600,
        EXPLOSION_START: 2000,
        CHAOS_START: 2500,
        REVELATION_START: 3000,
        COMPLETE: 3500,
    },

    // Visual effects
    SHAKE_INTENSITY: {
        LIGHT: 5,
        MEDIUM: 15,
        HEAVY: 25,
    },
    RGB_OFFSET: 5,
    FLASH_DURATION: 50,

    // Colors
    PIECE_COLORS: [
        '#1a1a2e', '#16213e', '#0f3460', '#1a1a3a',
        '#0d1b2a', '#1b263b', '#2d3a4a', '#1e2a38',
    ],
    PARTICLE_COLORS: ['#ff4500', '#ff8800', '#ffaa00', '#ffffff', '#ff0040'],
    GLOW_COLOR: 'rgba(0, 255, 255, 0.6)',
};

// ============================================================================
// WARNING OVERLAY COMPONENT
// ============================================================================

function WarningOverlay({ phase, elapsed }: { phase: AnimationPhase; elapsed: number }) {
    const warnings: Record<string, { text: string; color: string; show: boolean }> = {
        warning: {
            text: '⚠️ ORDER DISSOLVING INTO NOISE',
            color: '#ffaa00',
            show: phase === 'warning',
        },
        critical: {
            text: '🔴 SYSTEM EVOLVING BEYOND CONTROL',
            color: '#ff0040',
            show: phase === 'critical' || phase === 'pause',
        },
        fracture: {
            text: '💥 PATTERNS CASCADING SPECTACULARLY',
            color: '#ff0000',
            show: phase === 'fracture',
        },
        revelation: {
            text: '🔮 EMERGENCE: NEW PATTERNS FORMING',
            color: '#a855f7',
            show: phase === 'revelation',
        },
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
            <AnimatePresence mode="wait">
                {Object.entries(warnings).map(([key, warning]) =>
                    warning.show && (
                        <motion.div
                            key={key}
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{
                                opacity: 1,
                                scale: [1, 1.1, 1],
                                y: 0
                            }}
                            exit={{ opacity: 0, scale: 1.2, y: -20 }}
                            transition={{
                                duration: 0.3,
                                scale: {
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                        >
                            <p
                                className="text-2xl md:text-4xl font-bold font-mono uppercase tracking-wider"
                                style={{
                                    color: warning.color,
                                    textShadow: `0 0 20px ${warning.color}, 0 0 40px ${warning.color}`,
                                }}
                            >
                                {warning.text}
                            </p>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// SHATTER EFFECT COMPONENT
// ============================================================================

export default function ShatterEffect({
    active,
    pattern,
    onComplete,
    width,
    height,
    playSound,
    stopSounds,
    epicenter,
    winners,
}: ShatterEffectProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const piecesRef = useRef<ShatterPiece[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const audioPlayedRef = useRef<Set<string>>(new Set());
    const isMobile = useIsMobile();

    const [phase, setPhase] = useState<AnimationPhase>('idle');
    const [elapsed, setElapsed] = useState(0);
    const [showFlash, setShowFlash] = useState(false);
    const [cameraZoom, setCameraZoom] = useState(1);

    // Get phase from elapsed time
    const getPhaseFromTime = useCallback((ms: number): AnimationPhase => {
        const T = CONFIG.TIMELINE;
        if (ms < T.WARNING_START) return 'tension';
        if (ms < T.CRITICAL_START) return 'warning';
        if (ms < T.PAUSE_START) return 'critical';
        if (ms < T.PAUSE_END) return 'pause';
        if (ms < T.EXPLOSION_START) return 'fracture';
        if (ms < T.CHAOS_START) return 'explosion';
        if (ms < T.REVELATION_START) return 'chaos';
        if (ms < T.COMPLETE) return 'revelation';
        return 'complete';
    }, []);

    // Get shake intensity for current phase
    const getShakeIntensity = useCallback((currentPhase: AnimationPhase): number => {
        switch (currentPhase) {
            case 'fracture': return CONFIG.SHAKE_INTENSITY.MEDIUM;
            case 'explosion': return CONFIG.SHAKE_INTENSITY.HEAVY;
            case 'chaos': return CONFIG.SHAKE_INTENSITY.MEDIUM * 0.6;
            case 'revelation': return CONFIG.SHAKE_INTENSITY.LIGHT * 0.3;
            default: return 0;
        }
    }, []);

    // Get camera zoom for current phase
    const getCameraZoom = useCallback((currentPhase: AnimationPhase, progress: number): number => {
        switch (currentPhase) {
            case 'tension': return 1 + (0.05 * progress); // Slow ominous zoom
            case 'warning': return 1.05 + (0.05 * progress); // Continue zoom
            case 'critical': return 1.1 + (0.05 * progress); // Continue zoom
            case 'pause': return 1.15; // Hold
            case 'fracture': return 1.15 + (0.35 * progress); // Rapid zoom in
            case 'explosion': return 1.5;
            case 'chaos': return 1.5 - (0.5 * progress); // Zoom out
            case 'revelation': return 1.0;
            default: return 1;
        }
    }, []);

    // Play audio at the right times
    const triggerAudio = useCallback((currentPhase: AnimationPhase, ms: number) => {
        if (!playSound) return;

        const T = CONFIG.TIMELINE;

        // Tension rumble at start
        if (ms >= T.TENSION_START && !audioPlayedRef.current.has('tension')) {
            playSound('tensionRumble');
            audioPlayedRef.current.add('tension');
        }

        // CUT AUDIO at Pause (Silence)
        if (ms >= T.PAUSE_START && ms < T.PAUSE_END && !audioPlayedRef.current.has('silence')) {
            stopSounds?.();
            audioPlayedRef.current.add('silence');
        }

        // Warning beeps
        if (ms >= T.WARNING_START && !audioPlayedRef.current.has('warning')) {
            playSound('warningBeep');
            audioPlayedRef.current.add('warning');
        }

        // Glass crack
        if (ms >= T.FRACTURE_START && !audioPlayedRef.current.has('crack')) {
            playSound('glassCrack');
            audioPlayedRef.current.add('crack');
        }

        // EXPLOSION
        if (ms >= T.EXPLOSION_START && !audioPlayedRef.current.has('explosion')) {
            playSound('explosionSequence');
            audioPlayedRef.current.add('explosion');

            // Trigger white flash
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), CONFIG.FLASH_DURATION);
        }

        // Debris settle
        if (ms >= T.CHAOS_START && !audioPlayedRef.current.has('debris')) {
            playSound('debrisSettle');
            audioPlayedRef.current.add('debris');
        }

        // Ethereal reveal
        if (ms >= T.REVELATION_START && !audioPlayedRef.current.has('reveal')) {
            playSound('etherealReveal');
            audioPlayedRef.current.add('reveal');
        }
    }, [playSound, stopSounds]);

    // Main animation loop
    const animateRef = useRef<((timestamp: number) => void) | null>(null);

    useEffect(() => {
        animateRef.current = (timestamp: number) => {
            if (!canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const ms = timestamp - startTimeRef.current;
            setElapsed(ms);

            const currentPhase = getPhaseFromTime(ms);
            setPhase(currentPhase);

            // Trigger audio
            triggerAudio(currentPhase, ms);

            // Update camera zoom
            const phaseProgress = (() => {
                const T = CONFIG.TIMELINE;
                switch (currentPhase) {
                    case 'tension': return (ms - T.TENSION_START) / (T.WARNING_START - T.TENSION_START);
                    case 'warning': return (ms - T.WARNING_START) / (T.CRITICAL_START - T.WARNING_START);
                    case 'critical': return (ms - T.CRITICAL_START) / (T.PAUSE_START - T.CRITICAL_START);
                    case 'fracture': return (ms - T.FRACTURE_START) / (T.EXPLOSION_START - T.FRACTURE_START);
                    case 'chaos': return (ms - T.CHAOS_START) / (T.REVELATION_START - T.CHAOS_START);
                    default: return 0;
                }
            })();
            setCameraZoom(getCameraZoom(currentPhase, phaseProgress));

            // Check for completion
            if (currentPhase === 'complete') {
                onComplete?.();
                return;
            }

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Get shake intensity
            const shakeIntensity = getShakeIntensity(currentPhase);
            const shakeX = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0;
            const shakeY = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0;

            ctx.save();

            // Apply camera zoom and shake
            const centerX = width / 2;
            const centerY = height / 2;
            ctx.translate(centerX, centerY);
            ctx.scale(cameraZoom, cameraZoom);
            ctx.translate(-centerX + shakeX, -centerY + shakeY);

            // Draw RGB glitch during fracture/explosion phases
            if (currentPhase === 'fracture' || currentPhase === 'explosion') {
                drawRGBGlitch(ctx, width, height, CONFIG.RGB_OFFSET);
            }

            // Draw cracks during fracture phase
            if (currentPhase === 'fracture') {
                drawCracks(ctx, width, height, (ms - CONFIG.TIMELINE.FRACTURE_START) / 400);
            }

            // Draw pieces after explosion starts
            if (ms >= CONFIG.TIMELINE.EXPLOSION_START) {
                const fadeProgress = ms >= CONFIG.TIMELINE.REVELATION_START
                    ? (ms - CONFIG.TIMELINE.REVELATION_START) / 500
                    : 0;
                const opacity = Math.max(0.3, 1 - fadeProgress * 0.7);

                piecesRef.current.forEach(piece => {
                    piece.opacity = opacity;

                    // [NEW] Magnetic Re-ordering: Pull pieces toward winners during chaos/revelation
                    if ((currentPhase === 'chaos' || currentPhase === 'revelation') && winners && winners.length > 0) {
                        const nearestWinner = winners.reduce((prev, curr) => {
                            const dPrev = Math.pow(piece.body.position.x - prev.x, 2) + Math.pow(piece.body.position.y - prev.y, 2);
                            const dCurr = Math.pow(piece.body.position.x - curr.x, 2) + Math.pow(piece.body.position.y - curr.y, 2);
                            return dCurr < dPrev ? curr : prev;
                        }, winners[0]);

                        const driftDx = nearestWinner.x - piece.body.position.x;
                        const driftDy = nearestWinner.y - piece.body.position.y;
                        const driftDist = Math.sqrt(driftDx * driftDx + driftDy * driftDy);

                        if (driftDist > 50) {
                            const driftForce = 0.0001 * (ms - CONFIG.TIMELINE.CHAOS_START) / 1000;
                            Matter.Body.applyForce(piece.body, piece.body.position, {
                                x: (driftDx / driftDist) * driftForce,
                                y: (driftDy / driftDist) * driftForce
                            });
                        }
                    }

                    drawPiece(ctx, piece, currentPhase === 'revelation');

                    // Add particles during chaos
                    if (currentPhase === 'explosion' || currentPhase === 'chaos') {
                        const particleLimit = isMobile ? CONFIG.MAX_PARTICLES / 2 : CONFIG.MAX_PARTICLES;
                        const particleCount = isMobile ? CONFIG.MOBILE_PARTICLE_COUNT : CONFIG.BASE_PARTICLE_COUNT;

                        if (Math.random() < 0.1 && particlesRef.current.length < particleLimit) {
                            for (let i = 0; i < particleCount; i++) {
                                particlesRef.current.push({
                                    x: piece.body.position.x + (Math.random() - 0.5) * 30,
                                    y: piece.body.position.y + (Math.random() - 0.5) * 30,
                                    vx: (Math.random() - 0.5) * 6,
                                    vy: (Math.random() - 0.5) * 4 - 2,
                                    life: 1,
                                    maxLife: 0.5 + Math.random() * 0.5,
                                    color: CONFIG.PARTICLE_COLORS[Math.floor(Math.random() * CONFIG.PARTICLE_COLORS.length)],
                                    size: 1 + Math.random() * 4,
                                });
                            }
                        }
                    }
                });
            }

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.08; // Gravity
                particle.life -= 0.03;

                if (particle.life <= 0) return false;

                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                return true;
            });

            ctx.restore();

            // Continue animation
            animationRef.current = requestAnimationFrame(animateRef.current!);
        };
    }, [width, height, onComplete, getPhaseFromTime, getShakeIntensity, getCameraZoom, triggerAudio, cameraZoom, isMobile]);

    // Start/stop effect
    useEffect(() => {
        if (!active) {
            // Cleanup
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            if (runnerRef.current) {
                Matter.Runner.stop(runnerRef.current);
            }
            setPhase('idle');
            piecesRef.current = [];
            particlesRef.current = [];
            audioPlayedRef.current.clear();
            return;
        }

        // Initialize
        startTimeRef.current = performance.now();
        setPhase('tension');
        audioPlayedRef.current.clear();

        // [Refinement] Mobile Throttling: reduce physics complexity
        engineRef.current = Matter.Engine.create({
            gravity: { x: 0, y: CONFIG.GRAVITY },
            positionIterations: isMobile ? 4 : 6,
            velocityIterations: isMobile ? 2 : 4
        });

        // Ensure engine is efficient
        engineRef.current.enableSleeping = true;

        // [Refinement] Epicenter Seeding: bias points around the crisis zone
        const cellCount = isMobile ? CONFIG.MOBILE_VORONOI_CELL_COUNT : CONFIG.BASE_VORONOI_CELL_COUNT;
        const points: [number, number][] = [];

        for (let i = 0; i < cellCount; i++) {
            if (epicenter && i < cellCount * 0.6) {
                // Seed 60% of points around the epicenter
                const range = Math.min(width, height) * 0.3;
                points.push([
                    epicenter.x + (Math.random() - 0.5) * range,
                    epicenter.y + (Math.random() - 0.5) * range
                ]);
            } else {
                points.push([Math.random() * width, Math.random() * height]);
            }
        }
        const delaunay = Delaunay.from(points);
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        const cells = [];
        for (let i = 0; i < points.length; i++) {
            const c = voronoi.cellPolygon(i);
            if (c) cells.push(c.map(([x, y]: [number, number]) => ({ x, y })));
        }

        // Create shatter pieces
        const pieces: ShatterPiece[] = [];
        cells.forEach((cell, index) => {
            if (cell.length < 3) return;
            const cx = cell.reduce((s: number, p: { x: number; y: number }) => s + p.x, 0) / cell.length;
            const cy = cell.reduce((s: number, p: { x: number; y: number }) => s + p.y, 0) / cell.length;
            const verts = cell.map((p: { x: number; y: number }) => Matter.Vector.create(p.x - cx, p.y - cy));

            try {
                const body = Matter.Bodies.fromVertices(cx, cy, [verts], {
                    friction: 0.1,
                    frictionAir: 0.02,
                    restitution: 0.3,
                    density: 0.001,
                });

                if (body) {
                    const color = CONFIG.PIECE_COLORS[Math.floor(Math.random() * CONFIG.PIECE_COLORS.length)];
                    pieces.push({
                        id: index,
                        body,
                        vertices: cell,
                        color,
                        opacity: 1,
                        rotation: 0,
                        hasTrail: Math.random() > 0.7,
                    });
                }
            } catch (e) { }
        });

        piecesRef.current = pieces;
        pieces.forEach(p => Matter.Composite.add(engineRef.current!.world, p.body));

        // Start physics
        runnerRef.current = Matter.Runner.create();
        Matter.Runner.run(runnerRef.current, engineRef.current);

        // Apply pattern-based forces at T=2.0s
        setTimeout(() => {
            const cx = width / 2;
            const cy = height / 2;
            const currentPattern = pattern || 'explosion';

            piecesRef.current.forEach(p => {
                const dx = p.body.position.x - cx;
                const dy = p.body.position.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const dirX = dx / dist;
                const dirY = dy / dist;

                let force = { x: 0, y: 0 };
                let angularVelocity = (Math.random() - 0.5) * 0.3;

                switch (currentPattern) {
                    case 'implosion':
                        // Force towards center
                        force = {
                            x: -dirX * CONFIG.EXPLOSION_FORCE * 0.8,
                            y: -dirY * CONFIG.EXPLOSION_FORCE * 0.8,
                        };
                        angularVelocity *= 2;
                        break;

                    case 'vortex':
                        // Spiral motion
                        force = {
                            x: (dirY - dirX * 0.5) * CONFIG.EXPLOSION_FORCE,
                            y: (-dirX - dirY * 0.5) * CONFIG.EXPLOSION_FORCE,
                        };
                        angularVelocity = 0.5;
                        break;

                    case 'wave':
                        // Delay force based on distance from center
                        const delay = dist * 2;
                        setTimeout(() => {
                            Matter.Body.applyForce(p.body, p.body.position, {
                                x: dirX * CONFIG.EXPLOSION_FORCE * 1.5,
                                y: dirY * CONFIG.EXPLOSION_FORCE * 1.5,
                            });
                        }, delay);
                        return; // Skip immediate application

                    case 'chaos':
                        // Completely random directions
                        force = {
                            x: (Math.random() - 0.5) * CONFIG.EXPLOSION_FORCE * 2,
                            y: (Math.random() - 0.5) * CONFIG.EXPLOSION_FORCE * 2,
                        };
                        angularVelocity *= 3;
                        break;

                    case 'explosion':
                    default:
                        // Radial from center (default)
                        force = {
                            x: dirX * CONFIG.EXPLOSION_FORCE * (0.5 + Math.random() * 0.5),
                            y: dirY * CONFIG.EXPLOSION_FORCE * (0.5 + Math.random() * 0.5),
                        };
                        break;
                }

                Matter.Body.applyForce(p.body, p.body.position, force);
                Matter.Body.setAngularVelocity(p.body, angularVelocity);
            });
        }, CONFIG.TIMELINE.EXPLOSION_START);

        // Start animation
        if (animateRef.current) {
            animationRef.current = requestAnimationFrame(animateRef.current);
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
            if (engineRef.current) Matter.Engine.clear(engineRef.current);
        };
    }, [active, width, height, isMobile]);

    if (!active) return null;

    return (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {/* Main canvas */}
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="absolute inset-0"
                style={{ transform: `scale(${cameraZoom})` }}
            />

            {/* Vignette overlay during warning/critical */}
            <AnimatePresence>
                {(phase === 'warning' || phase === 'critical' || phase === 'pause') && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === 'critical' || phase === 'pause' ? 0.7 : 0.4 }}
                        exit={{ opacity: 0 }}
                        style={{
                            background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%)',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* CRT Distortion overlay */}
            {(phase === 'fracture' || phase === 'explosion') && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(0, 255, 255, 0.05) 2px,
                            rgba(0, 255, 255, 0.05) 4px
                        )`,
                        animation: 'scanlines 0.1s linear infinite',
                    }}
                />
            )}

            {/* White flash on explosion */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        className="absolute inset-0 bg-white pointer-events-none"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    />
                )}
            </AnimatePresence>

            {/* Red pulse during explosion */}
            {phase === 'explosion' && (
                <div
                    className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"
                    style={{ animationDuration: '100ms' }}
                />
            )}

            {/* Warning text overlays */}
            <WarningOverlay phase={phase} elapsed={elapsed} />
        </div>
    );
}

// ============================================================================
// DRAWING HELPERS
// ============================================================================

function drawPiece(ctx: CanvasRenderingContext2D, piece: ShatterPiece, isRevelation: boolean = false) {
    if (piece.opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = piece.opacity;

    ctx.translate(piece.body.position.x, piece.body.position.y);
    ctx.rotate(piece.body.angle);

    ctx.beginPath();
    const vertices = piece.body.vertices;
    ctx.moveTo(vertices[0].x - piece.body.position.x, vertices[0].y - piece.body.position.y);

    for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x - piece.body.position.x, vertices[i].y - piece.body.position.y);
    }
    ctx.closePath();

    // Fill with color
    ctx.fillStyle = piece.color;
    ctx.fill();

    // Geometric Bloom: Iridescent glow on revelation phase for some pieces
    if (isRevelation && piece.hasTrail) {
        const hue = (Date.now() / 10 + piece.id * 30) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowBlur = 20;
    } else {
        // Default glowing border
        ctx.strokeStyle = CONFIG.GLOW_COLOR;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'cyan';
        ctx.shadowBlur = 12;
    }
    ctx.stroke();

    ctx.restore();
}

function drawCracks(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
    const crackCount = Math.min(30, Math.floor(intensity * 15));

    ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'red';
    ctx.shadowBlur = 15;

    for (let i = 0; i < crackCount; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        let x = startX;
        let y = startY;
        for (let j = 0; j < 6; j++) {
            x += (Math.random() - 0.5) * 60;
            y += (Math.random() - 0.5) * 60;
            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }

    ctx.shadowBlur = 0;
}

function drawRGBGlitch(ctx: CanvasRenderingContext2D, width: number, height: number, offset: number) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Red channel offset (right)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.fillRect(offset, 0, width, height);

    // Cyan channel offset (left)
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.fillRect(-offset, 0, width, height);

    ctx.restore();
}

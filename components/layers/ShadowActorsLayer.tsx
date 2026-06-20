/**
 * ShadowActorsLayer - Shadow Actors Visualization
 * 
 * Displays shadow entities:
 * - Wagner Group, militias, separatists
 * - Red/black danger zone colors
 * - Network lines connecting actors
 * - Dynamic spawning with burst effects
 */

"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { hiddenEntities, HiddenEntity } from '@/lib/geopoliticalData';

interface ShadowActorsLayerProps {
    visible: boolean;
    width: number;
    height: number;
    projection: d3.GeoProjection;
}

// Shadow actors from hidden entities
const shadowActors = hiddenEntities.filter(e => e.layer === 'shadow' && e.position);

interface SpawnParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

export default function ShadowActorsLayer({
    visible,
    width,
    height,
    projection,
}: ShadowActorsLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const pulseRef = useRef(0);
    const particlesRef = useRef<SpawnParticle[]>([]);
    const spawnedRef = useRef(false);

    useEffect(() => {
        if (!visible) {
            spawnedRef.current = false;
            particlesRef.current = [];
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            return;
        }

        // Create spawn burst particles on first visibility
        if (!spawnedRef.current) {
            spawnedRef.current = true;
            shadowActors.forEach(actor => {
                if (actor.position) {
                    const pos = projection([actor.position.lng, actor.position.lat]);
                    if (pos) {
                        for (let i = 0; i < 20; i++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 2 + Math.random() * 3;
                            particlesRef.current.push({
                                x: pos[0],
                                y: pos[1],
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                life: 1,
                            });
                        }
                    }
                }
            });
        }

        const animate = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            pulseRef.current += 0.03;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw network connections first
            drawNetworkConnections(ctx, shadowActors, projection);

            // Draw shadow actors
            shadowActors.forEach((actor, index) => {
                if (actor.position) {
                    drawShadowActor(ctx, actor, projection, pulseRef.current, index);
                }
            });

            // Update and draw spawn particles
            particlesRef.current = particlesRef.current.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= 0.02;
                particle.vx *= 0.95;
                particle.vy *= 0.95;

                if (particle.life <= 0) return false;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 3 * particle.life, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 0, 0, ${particle.life})`;
                ctx.shadowColor = 'red';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;

                return true;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [visible, width, height, projection]);

    if (!visible) return null;

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="absolute inset-0 pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}

function drawNetworkConnections(
    ctx: CanvasRenderingContext2D,
    actors: HiddenEntity[],
    projection: d3.GeoProjection
) {
    const positions: [number, number][] = [];

    actors.forEach(actor => {
        if (actor.position) {
            const pos = projection([actor.position.lng, actor.position.lat]);
            if (pos) positions.push(pos);
        }
    });

    // Draw connections between nearby actors
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const dx = positions[j][0] - positions[i][0];
            const dy = positions[j][1] - positions[i][1];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 300) {
                const opacity = 1 - (distance / 300);
                ctx.beginPath();
                ctx.moveTo(positions[i][0], positions[i][1]);
                ctx.lineTo(positions[j][0], positions[j][1]);
                ctx.strokeStyle = `rgba(255, 0, 0, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }
}

function drawShadowActor(
    ctx: CanvasRenderingContext2D,
    actor: HiddenEntity,
    projection: d3.GeoProjection,
    pulsePhase: number,
    index: number
) {
    if (!actor.position) return;

    const center = projection([actor.position.lng, actor.position.lat]);
    if (!center) return;

    const pulseOffset = Math.sin(pulsePhase + index) * 0.2;
    const radius = 15 + actor.influence * 0.5 + pulseOffset * 10;

    // Draw danger zone
    const gradient = ctx.createRadialGradient(
        center[0], center[1], 0,
        center[0], center[1], radius * 2
    );
    gradient.addColorStop(0, 'rgba(139, 0, 0, 0.6)');
    gradient.addColorStop(0.5, 'rgba(139, 0, 0, 0.3)');
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(center[0], center[1], radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw pulsing core
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius * (0.8 + pulseOffset), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.shadowColor = 'red';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw warning symbol (skull-like)
    ctx.font = '12px Rajdhani';
    ctx.fillStyle = '#FF0000';
    ctx.textAlign = 'center';
    ctx.fillText('⚠', center[0], center[1] + 4);

    // Label
    ctx.font = 'bold 9px Rajdhani';
    ctx.fillStyle = '#FF4444';
    ctx.fillText(actor.name, center[0], center[1] + 20);
}

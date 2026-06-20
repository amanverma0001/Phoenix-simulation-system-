/**
 * EnergyNetworkLayer - Pipeline Visualization
 * 
 * Displays major energy pipelines with:
 * - Animated flowing particles
 * - Orange/yellow glowing colors
 * - Pulsing chokepoints
 * - Disrupted pipeline effects
 */

"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { pipelines, Pipeline } from '@/lib/geopoliticalData';

interface EnergyNetworkLayerProps {
    visible: boolean;
    width: number;
    height: number;
    projection: d3.GeoProjection;
}

interface FlowParticle {
    pipelineId: string;
    progress: number;  // 0 to 1 along pipeline
    speed: number;
}

export default function EnergyNetworkLayer({
    visible,
    width,
    height,
    projection,
}: EnergyNetworkLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<FlowParticle[]>([]);
    const animationRef = useRef<number | null>(null);

    // Initialize particles
    useEffect(() => {
        if (!visible) return;

        // Create initial particles for each pipeline
        particlesRef.current = [];
        pipelines.forEach(pipeline => {
            const particleCount = pipeline.status === 'active' ? 8 : 0;
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    pipelineId: pipeline.id,
                    progress: Math.random(),
                    speed: 0.002 + Math.random() * 0.002,
                });
            }
        });
    }, [visible]);

    // Animation loop
    useEffect(() => {
        if (!visible) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            return;
        }

        const animate = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw pipelines
            pipelines.forEach(pipeline => {
                drawPipeline(ctx, pipeline, projection);
            });

            // Update and draw particles
            particlesRef.current.forEach(particle => {
                // Update progress
                particle.progress += particle.speed;
                if (particle.progress > 1) particle.progress = 0;

                // Draw particle
                const pipeline = pipelines.find(p => p.id === particle.pipelineId);
                if (pipeline && pipeline.status === 'active') {
                    drawFlowParticle(ctx, pipeline, particle.progress, projection);
                }
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

function drawPipeline(
    ctx: CanvasRenderingContext2D,
    pipeline: Pipeline,
    projection: d3.GeoProjection
) {
    const start = projection([pipeline.startPosition.lng, pipeline.startPosition.lat]);
    const end = projection([pipeline.endPosition.lng, pipeline.endPosition.lat]);

    if (!start || !end) return;

    // Build path including waypoints
    const points: [number, number][] = [start];
    if (pipeline.waypoints) {
        pipeline.waypoints.forEach(wp => {
            const point = projection([wp.lng, wp.lat]);
            if (point) points.push(point);
        });
    }
    points.push(end);

    // Draw pipeline line
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }

    // Style based on status
    if (pipeline.status === 'active') {
        ctx.strokeStyle = pipeline.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = pipeline.color;
        ctx.shadowBlur = 10;
    } else if (pipeline.status === 'disrupted') {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 15;
    } else {
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
        ctx.lineWidth = 2;
    }

    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Draw terminals (chokepoints)
    drawTerminal(ctx, start, pipeline.status === 'active');
    drawTerminal(ctx, end, pipeline.status === 'active');
}

function drawTerminal(
    ctx: CanvasRenderingContext2D,
    position: [number, number],
    active: boolean
) {
    ctx.beginPath();
    ctx.arc(position[0], position[1], active ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = active ? '#FFB300' : '#666';
    ctx.shadowColor = active ? '#FFB300' : 'transparent';
    ctx.shadowBlur = active ? 15 : 0;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawFlowParticle(
    ctx: CanvasRenderingContext2D,
    pipeline: Pipeline,
    progress: number,
    projection: d3.GeoProjection
) {
    // Build path
    const start = projection([pipeline.startPosition.lng, pipeline.startPosition.lat]);
    const end = projection([pipeline.endPosition.lng, pipeline.endPosition.lat]);

    if (!start || !end) return;

    const points: [number, number][] = [start];
    if (pipeline.waypoints) {
        pipeline.waypoints.forEach(wp => {
            const point = projection([wp.lng, wp.lat]);
            if (point) points.push(point);
        });
    }
    points.push(end);

    // Calculate position along path
    const totalLength = calculatePathLength(points);
    const targetDistance = progress * totalLength;
    const position = getPositionAtDistance(points, targetDistance);

    if (!position) return;

    // Draw glowing particle
    const gradient = ctx.createRadialGradient(position[0], position[1], 0, position[0], position[1], 8);
    gradient.addColorStop(0, pipeline.color);
    gradient.addColorStop(0.5, `${pipeline.color}88`);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(position[0], position[1], 8, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}

function calculatePathLength(points: [number, number][]): number {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
        const dx = points[i][0] - points[i - 1][0];
        const dy = points[i][1] - points[i - 1][1];
        length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
}

function getPositionAtDistance(
    points: [number, number][],
    targetDistance: number
): [number, number] | null {
    let accumulatedDistance = 0;

    for (let i = 1; i < points.length; i++) {
        const dx = points[i][0] - points[i - 1][0];
        const dy = points[i][1] - points[i - 1][1];
        const segmentLength = Math.sqrt(dx * dx + dy * dy);

        if (accumulatedDistance + segmentLength >= targetDistance) {
            const ratio = (targetDistance - accumulatedDistance) / segmentLength;
            return [
                points[i - 1][0] + dx * ratio,
                points[i - 1][1] + dy * ratio,
            ];
        }

        accumulatedDistance += segmentLength;
    }

    return points[points.length - 1];
}

/**
 * EthnicLayer - Cultural/Ethnic Boundaries Visualization
 * 
 * Displays cultural divisions:
 * - Bavaria, Catalonia, Scotland, Basque, Chechnya, etc.
 * - Earth tone colors
 * - Soft organic shapes
 * - Only visible after collapse
 */

"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { hiddenEntities, HiddenEntity } from '@/lib/geopoliticalData';

interface EthnicLayerProps {
    visible: boolean;
    width: number;
    height: number;
    projection: d3.GeoProjection;
}

// Ethnic regions from hidden entities
const ethnicRegions = hiddenEntities.filter(e => e.layer === 'ethnic' && e.position);

export default function EthnicLayer({
    visible,
    width,
    height,
    projection,
}: EthnicLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const opacityRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!visible) {
            opacityRef.current = 0;
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

            // Fade in effect
            if (opacityRef.current < 1) {
                opacityRef.current = Math.min(1, opacityRef.current + 0.02);
            }

            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = opacityRef.current;

            // Draw ethnic regions
            ethnicRegions.forEach((region, index) => {
                if (region.position) {
                    drawEthnicRegion(ctx, region, projection, index);
                }
            });

            ctx.globalAlpha = 1;
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
        />
    );
}

function drawEthnicRegion(
    ctx: CanvasRenderingContext2D,
    region: HiddenEntity,
    projection: d3.GeoProjection,
    index: number
) {
    if (!region.position) return;

    const center = projection([region.position.lng, region.position.lat]);
    if (!center) return;

    // Create organic blob shape
    const radius = 30 + region.influence;
    const points: [number, number][] = [];
    const pointCount = 12;

    for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;
        const variation = 0.7 + Math.sin(index * 3 + i * 2) * 0.3;
        const r = radius * variation;
        points.push([
            center[0] + Math.cos(angle) * r,
            center[1] + Math.sin(angle) * r,
        ]);
    }

    // Draw organic shape with bezier curves
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const controlX = (current[0] + next[0]) / 2;
        const controlY = (current[1] + next[1]) / 2;
        ctx.quadraticCurveTo(current[0], current[1], controlX, controlY);
    }

    ctx.closePath();

    // Fill with earth tone
    const gradient = ctx.createRadialGradient(
        center[0], center[1], 0,
        center[0], center[1], radius
    );
    gradient.addColorStop(0, `${region.color}60`);
    gradient.addColorStop(1, `${region.color}20`);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Soft border
    ctx.strokeStyle = `${region.color}80`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.font = 'bold 9px Rajdhani';
    ctx.fillStyle = region.color;
    ctx.textAlign = 'center';
    ctx.fillText(region.name, center[0], center[1] + 4);
}

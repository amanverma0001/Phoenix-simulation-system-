/**
 * CorporateLayer - Corporate Territory Visualization
 * 
 * Displays corporate zones with:
 * - Semi-transparent overlays
 * - Neon cyan/magenta borders
 * - Pulsing glow effects
 */

"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { hiddenEntities, HiddenEntity } from '@/lib/geopoliticalData';

interface CorporateLayerProps {
    visible: boolean;
    width: number;
    height: number;
    projection: d3.GeoProjection;
}

// Corporate zones simplified positions
const corporateZones: {
    entity: HiddenEntity;
    center: [number, number];  // [lng, lat]
    radius: number;
}[] = [];

// Initialize corporate zones from hidden entities
hiddenEntities
    .filter(e => e.type === 'corporation' || e.type === 'alliance')
    .forEach(entity => {
        if (entity.position) {
            corporateZones.push({
                entity,
                center: [entity.position.lng, entity.position.lat],
                radius: 100 + (entity.influence * 2),
            });
        }
    });

export default function CorporateLayer({
    visible,
    width,
    height,
    projection,
}: CorporateLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const pulseRef = useRef(0);

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

            pulseRef.current += 0.02;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw corporate zones
            corporateZones.forEach((zone, index) => {
                drawCorporateZone(ctx, zone, projection, pulseRef.current, index);
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

function drawCorporateZone(
    ctx: CanvasRenderingContext2D,
    zone: { entity: HiddenEntity; center: [number, number]; radius: number },
    projection: d3.GeoProjection,
    pulsePhase: number,
    index: number
) {
    const center = projection(zone.center);
    if (!center) return;

    const pulseOffset = Math.sin(pulsePhase + index * 0.5) * 0.1;
    const radius = zone.radius * (1 + pulseOffset);

    // Create gradient fill
    const gradient = ctx.createRadialGradient(
        center[0], center[1], 0,
        center[0], center[1], radius
    );

    // Color based on entity type
    const color = zone.entity.color || '#00FFFF';
    gradient.addColorStop(0, `${color}40`);  // 25% opacity at center
    gradient.addColorStop(0.7, `${color}20`);  // 12% opacity
    gradient.addColorStop(1, 'transparent');

    // Draw zone fill
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw pulsing border
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + pulseOffset * 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Draw entity label
    ctx.font = '10px Rajdhani';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(zone.entity.name, center[0], center[1] + 4);
}

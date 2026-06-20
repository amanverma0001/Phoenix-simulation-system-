"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface FinanceHub {
    id: string;
    name: string;
    lng: number;
    lat: number;
    value: number; // Importance
}

const FINANCE_HUBS: FinanceHub[] = [
    { id: 'london', name: 'London', lng: -0.1276, lat: 51.5074, value: 100 },
    { id: 'frankfurt', name: 'Frankfurt', lng: 8.6821, lat: 50.1109, value: 85 },
    { id: 'new_york', name: 'New York', lng: -74.0060, lat: 40.7128, value: 95 },
    { id: 'hong_kong', name: 'Hong Kong', lng: 114.1694, lat: 22.3193, value: 90 },
    { id: 'singapore', name: 'Singapore', lng: 103.8198, lat: 1.3521, value: 88 },
    { id: 'tokyo', name: 'Tokyo', lng: 139.6917, lat: 35.6895, value: 80 },
];

interface FinanceLayerProps {
    visible: boolean;
    width: number;
    height: number;
    projection: d3.GeoProjection;
    globalStability: number;
}

export default function FinanceLayer({
    visible,
    width,
    height,
    projection,
    globalStability
}: FinanceLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!visible) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        const animate = (time: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, width, height);

            FINANCE_HUBS.forEach(hub => {
                const pos = projection([hub.lng, hub.lat]);
                if (!pos) return;

                const pulse = Math.sin(time / 500) * 0.5 + 0.5;
                const stabilityFactor = globalStability / 100;
                const radius = (hub.value / 20) * (1 + pulse * 0.2) * (0.5 + 0.5 * stabilityFactor);

                // Glow
                const gradient = ctx.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], radius * 4);
                gradient.addColorStop(0, `rgba(0, 255, 255, ${0.4 * stabilityFactor})`);
                gradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(pos[0], pos[1], radius * 4, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Center Point
                ctx.beginPath();
                ctx.arc(pos[0], pos[1], radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${0.8 * stabilityFactor})`;
                ctx.fill();

                // Label (if stable)
                if (globalStability > 30) {
                    ctx.font = '8px Orbitron, sans-serif';
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * stabilityFactor})`;
                    ctx.fillText(hub.name, pos[0] + 10, pos[1] + 3);
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [visible, width, height, projection, globalStability]);

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

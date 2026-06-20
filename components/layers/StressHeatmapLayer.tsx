"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface StressHeatmapLayerProps {
    visible: boolean;
    width: number;
    height: number;
    projection: d3.GeoProjection;
    countries: any[];
}

export default function StressHeatmapLayer({
    visible,
    width,
    height,
    projection,
    countries
}: StressHeatmapLayerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!visible) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, width, height);

        // Filter for unstable countries
        const stressedCountries = countries.filter(c => c.stability < 70);

        stressedCountries.forEach(country => {
            const pos = projection([country.lng, country.lat]);
            if (!pos) return;

            const stress = (100 - country.stability) / 100;
            const radius = 50 + stress * 100;

            // Thermal Gradient
            const gradient = ctx.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], radius);
            gradient.addColorStop(0, `rgba(255, 50, 0, ${0.3 * stress})`);
            gradient.addColorStop(0.5, `rgba(255, 100, 0, ${0.1 * stress})`);
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(pos[0], pos[1], radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Intense core for high stress
            if (stress > 0.6) {
                const coreRadius = radius * 0.3;
                const coreGradient = ctx.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], coreRadius);
                coreGradient.addColorStop(0, `rgba(255, 255, 0, ${0.2 * stress})`);
                coreGradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(pos[0], pos[1], coreRadius, 0, Math.PI * 2);
                ctx.fillStyle = coreGradient;
                ctx.fill();
            }
        });

    }, [visible, width, height, projection, countries]);

    if (!visible) return null;

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="absolute inset-0 pointer-events-none"
            style={{ mixBlendMode: 'color-dodge', opacity: 0.8 }}
        />
    );
}

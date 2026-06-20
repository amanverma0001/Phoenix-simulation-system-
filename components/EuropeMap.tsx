/**
 * EuropeMap Component - D3.js + Canvas Map Visualization
 * 
 * Features:
 * - D3.js Mercator projection centered on Europe
 * - Canvas rendering for performance
 * - Dynamic country coloring based on stability
 * - Interactive hover states with tooltips
 * - Country labels
 * - Integration with simulation state
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Country, getStabilityColor, countries, getPhaseFromStability } from '@/lib/geopoliticalData';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EuropeMapProps {
    countryStabilities: Record<string, number>;
    isCollapsed: boolean;
    onCountryHover?: (countryId: string | null) => void;
    onCountryClick?: (countryId: string) => void;
    sentiments?: Record<string, { mood: string; emoji: string; color: string; intensity: number }>;
    className?: string;
}

interface TooltipData {
    country: string;
    flag: string;
    stability: number;
    phase: string;
    x: number;
    y: number;
}

// ============================================================================
// EUROPE GEOJSON DATA (Simplified for 12 countries)
// ============================================================================

// Simplified boundary data for 12 main countries
// These are approximate bounding boxes for visualization
const europeGeoData: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
        // Russia (European part only)
        {
            type: "Feature",
            id: "russia",
            properties: { name: "Russia", id: "russia" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [27.0, 60.0], [30.0, 60.5], [35.0, 59.5], [40.0, 58.0], [45.0, 56.0],
                    [50.0, 55.0], [55.0, 54.0], [60.0, 52.0], [55.0, 50.0], [50.0, 48.0],
                    [45.0, 47.0], [42.0, 45.0], [40.0, 43.0], [38.0, 45.0], [36.0, 46.5],
                    [34.0, 46.0], [32.0, 46.5], [30.0, 48.0], [28.0, 50.0], [26.0, 52.0],
                    [24.0, 54.0], [23.0, 56.0], [25.0, 58.0], [27.0, 60.0]
                ]]
            }
        },
        // Germany
        {
            type: "Feature",
            id: "germany",
            properties: { name: "Germany", id: "germany" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [6.0, 54.5], [9.0, 55.0], [11.0, 54.5], [14.0, 54.0], [15.0, 51.0],
                    [15.0, 50.5], [13.0, 48.5], [12.0, 47.5], [10.0, 47.5], [8.0, 48.0],
                    [7.0, 49.0], [6.0, 49.5], [6.0, 51.5], [5.5, 52.5], [6.0, 54.5]
                ]]
            }
        },
        // France
        {
            type: "Feature",
            id: "france",
            properties: { name: "France", id: "france" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-1.5, 48.5], [2.0, 51.0], [4.0, 50.0], [5.5, 49.0], [6.0, 48.0],
                    [7.0, 47.5], [7.0, 45.5], [6.5, 43.5], [4.0, 43.0], [3.0, 42.5],
                    [0.0, 42.5], [-1.5, 43.5], [-2.0, 47.0], [-4.5, 48.5], [-1.5, 48.5]
                ]]
            }
        },
        // United Kingdom
        {
            type: "Feature",
            id: "uk",
            properties: { name: "United Kingdom", id: "uk" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-5.5, 50.0], [-5.0, 54.0], [-4.0, 56.0], [-3.0, 58.5], [-2.0, 58.5],
                    [0.0, 57.0], [1.5, 53.0], [1.5, 51.0], [0.0, 50.5], [-3.0, 50.0],
                    [-5.5, 50.0]
                ]]
            }
        },
        // Poland
        {
            type: "Feature",
            id: "poland",
            properties: { name: "Poland", id: "poland" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [15.0, 54.0], [18.0, 54.5], [22.0, 54.0], [24.0, 53.5], [24.0, 51.5],
                    [24.0, 50.0], [22.0, 49.0], [19.0, 49.0], [18.0, 49.5], [15.0, 50.5],
                    [15.0, 51.0], [14.0, 52.0], [15.0, 54.0]
                ]]
            }
        },
        // Turkey
        {
            type: "Feature",
            id: "turkey",
            properties: { name: "Turkey", id: "turkey" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [26.0, 42.0], [28.0, 41.5], [32.0, 42.0], [36.0, 41.0], [40.0, 40.0],
                    [44.0, 39.0], [44.0, 37.0], [42.0, 36.5], [36.0, 36.0], [32.0, 36.5],
                    [28.0, 36.5], [26.0, 38.0], [26.0, 40.0], [26.0, 42.0]
                ]]
            }
        },
        // Ukraine
        {
            type: "Feature",
            id: "ukraine",
            properties: { name: "Ukraine", id: "ukraine" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [24.0, 51.5], [28.0, 51.5], [32.0, 52.0], [36.0, 50.5], [40.0, 49.5],
                    [40.0, 47.0], [38.0, 45.5], [35.0, 46.0], [32.0, 46.5], [30.0, 46.0],
                    [26.0, 48.0], [24.0, 49.0], [22.5, 48.5], [22.5, 50.0], [24.0, 51.5]
                ]]
            }
        },
        // Italy
        {
            type: "Feature",
            id: "italy",
            properties: { name: "Italy", id: "italy" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [7.0, 45.5], [10.0, 46.5], [13.0, 46.5], [13.5, 45.0], [12.5, 44.0],
                    [14.0, 42.0], [16.0, 40.0], [18.5, 40.0], [18.0, 38.0], [16.0, 38.0],
                    [15.5, 38.5], [14.0, 37.5], [12.5, 37.5], [12.0, 38.5], [10.0, 39.0],
                    [9.0, 41.0], [8.0, 44.0], [7.0, 45.5]
                ]]
            }
        },
        // Spain
        {
            type: "Feature",
            id: "spain",
            properties: { name: "Spain", id: "spain" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-9.0, 43.0], [-5.0, 43.5], [-2.0, 43.5], [0.0, 42.5], [3.0, 42.5],
                    [3.0, 40.0], [1.0, 38.0], [-1.0, 37.0], [-5.5, 36.0], [-7.5, 37.0],
                    [-9.0, 38.5], [-9.0, 40.0], [-8.5, 42.0], [-9.0, 43.0]
                ]]
            }
        },
        // Greece
        {
            type: "Feature",
            id: "greece",
            properties: { name: "Greece", id: "greece" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [20.0, 42.0], [24.0, 41.5], [26.0, 41.5], [26.0, 40.0], [25.0, 38.0],
                    [24.0, 36.0], [22.0, 36.5], [21.0, 37.0], [20.0, 39.0], [19.5, 40.5],
                    [20.0, 42.0]
                ]]
            }
        },
        // Belarus
        {
            type: "Feature",
            id: "belarus",
            properties: { name: "Belarus", id: "belarus" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [24.0, 53.5], [28.0, 54.5], [30.0, 55.0], [32.0, 54.5], [32.0, 52.5],
                    [30.0, 51.5], [27.0, 51.5], [24.0, 51.5], [23.5, 52.5], [24.0, 53.5]
                ]]
            }
        },
        // Kazakhstan (Western part visible on European map)
        {
            type: "Feature",
            id: "kazakhstan",
            properties: { name: "Kazakhstan", id: "kazakhstan" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [50.0, 55.0], [55.0, 54.5], [60.0, 52.0], [62.0, 50.0], [60.0, 47.0],
                    [55.0, 45.0], [52.0, 45.5], [50.0, 47.0], [47.0, 48.0], [47.0, 51.0],
                    [50.0, 55.0]
                ]]
            }
        },
        // India
        {
            type: "Feature",
            id: "india",
            properties: { name: "India", id: "india" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [68.0, 23.0], [70.0, 21.0], [72.0, 19.0], [74.0, 15.0], [76.0, 10.0],
                    [77.0, 8.0], [78.0, 8.0], [80.0, 12.0], [82.0, 16.0], [84.0, 19.0],
                    [86.0, 21.0], [88.0, 22.0], [89.0, 26.0], [88.0, 27.0], [85.0, 26.0],
                    [82.0, 28.0], [80.0, 30.0], [78.0, 32.0], [76.0, 34.0], [74.0, 32.0],
                    [72.0, 28.0], [70.0, 26.0], [68.0, 23.0]
                ]]
            }
        }
    ]
};

// ============================================================================
// MAP COMPONENT
// ============================================================================

export default function EuropeMap({
    countryStabilities,
    isCollapsed,
    onCountryHover,
    onCountryClick,
    sentiments = {},
    className = '',
}: EuropeMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const projectionRef = useRef<d3.GeoProjection | null>(null);
    const pathGeneratorRef = useRef<d3.GeoPath | null>(null);

    // Get country info helper
    const getCountryInfo = useCallback((countryId: string) => {
        return countries.find(c => c.id === countryId);
    }, []);

    // Setup projection and path generator
    useEffect(() => {
        const { width, height } = dimensions;

        // Mercator projection adjusted to show Europe and India
        const projection = d3.geoMercator()
            .center([40, 45])  // Center between Europe and India
            .scale(width * 0.5)  // Scale down to fit both
            .translate([width / 2, height / 2]);

        const pathGenerator = d3.geoPath().projection(projection);

        projectionRef.current = projection;
        pathGeneratorRef.current = pathGenerator;
    }, [dimensions]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: rect.width || 800,
                    height: rect.height || 600,
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Draw map on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !projectionRef.current || !pathGeneratorRef.current) return;

        const { width, height } = dimensions;
        const dpr = window.devicePixelRatio || 1;

        // Set canvas size for retina displays
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);

        // Draw grid pattern
        drawGrid(ctx, width, height);

        // Draw each country
        europeGeoData.features.forEach((feature) => {
            const countryId = feature.properties?.id as string;
            const stability = countryStabilities[countryId] ?? 100;
            const countryInfo = getCountryInfo(countryId);
            const isHovered = hoveredCountry === countryId;

            // Get color based on stability
            const color = getStabilityColor(stability);

            // Create path
            ctx.beginPath();
            pathGeneratorRef.current!(feature as any, ctx as any);

            // Fill country
            ctx.fillStyle = isHovered
                ? adjustColor(color, 20)  // Brighten on hover
                : color;
            ctx.globalAlpha = isCollapsed ? 0.8 : 0.6;
            ctx.fill();

            // Draw border
            ctx.strokeStyle = isHovered ? '#00ffff' : 'rgba(0, 255, 255, 0.4)';
            ctx.lineWidth = isHovered ? 2 : 1;
            ctx.globalAlpha = 1;
            ctx.stroke();

            // Draw country label
            if (countryInfo && projectionRef.current) {
                const centroid = d3.geoCentroid(feature as any);
                const [x, y] = projectionRef.current(centroid) || [0, 0];

                ctx.font = isHovered ? 'bold 12px Rajdhani' : '10px Rajdhani';
                ctx.fillStyle = isCollapsed ? '#fff' : 'rgba(255, 255, 255, 0.8)';
                ctx.textAlign = 'center';
                ctx.fillText(countryInfo.flag + ' ' + countryInfo.name, x, y);
            }
        });

        // Draw glow effect for collapsed state
        if (isCollapsed) {
            ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
            ctx.shadowBlur = 20;
        }

    }, [dimensions, countryStabilities, isCollapsed, hoveredCountry, getCountryInfo]);

    // Handle mouse events
    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!projectionRef.current || !pathGeneratorRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find which country is under the cursor
        let found = false;
        for (const feature of europeGeoData.features) {
            const path = new Path2D();
            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            ctx.beginPath();
            pathGeneratorRef.current(feature as any, ctx as any);

            if (ctx.isPointInPath(x, y)) {
                const countryId = feature.properties?.id as string;
                const countryInfo = getCountryInfo(countryId);
                const stability = countryStabilities[countryId] ?? 100;

                if (countryInfo) {
                    setHoveredCountry(countryId);
                    setTooltip({
                        country: countryInfo.name,
                        flag: countryInfo.flag,
                        stability,
                        phase: getPhaseFromStability(stability),
                        x: event.clientX,
                        y: event.clientY,
                    });
                    onCountryHover?.(countryId);
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            setHoveredCountry(null);
            setTooltip(null);
            onCountryHover?.(null);
        }
    }, [countryStabilities, getCountryInfo, onCountryHover]);

    const handleMouseLeave = useCallback(() => {
        setHoveredCountry(null);
        setTooltip(null);
        onCountryHover?.(null);
    }, [onCountryHover]);

    const handleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (hoveredCountry) {
            onCountryClick?.(hoveredCountry);
        }
    }, [hoveredCountry, onCountryClick]);

    return (
        <div ref={containerRef} className={`relative w-full h-full ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            />

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y + 10,
                    }}
                >
                    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/50 rounded-lg px-3 py-2 shadow-lg shadow-cyan-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{tooltip.flag}</span>
                            <span className="text-cyan-400 font-bold">{tooltip.country}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                            <div className="flex justify-between gap-4">
                                <span>Stability:</span>
                                <span style={{ color: getStabilityColor(tooltip.stability) }}>
                                    {tooltip.stability.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span>Phase:</span>
                                <span className={getPhaseColor(tooltip.phase)}>{tooltip.phase}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sentiment Emojis Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                    {europeGeoData.features.map((feature) => {
                        const countryId = feature.properties?.id as string;
                        const sentiment = sentiments[countryId];
                        if (!sentiment || !projectionRef.current) return null;

                        const centroid = d3.geoCentroid(feature as any);
                        const [x, y] = projectionRef.current(centroid) || [0, 0];

                        return (
                            <motion.div
                                key={`sentiment-${countryId}`}
                                initial={{ opacity: 0, scale: 0, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0, y: -10 }}
                                className="absolute flex flex-col items-center justify-center p-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
                                style={{
                                    left: x,
                                    top: y - 25,
                                    transform: 'translate(-50%, -50%)',
                                    boxShadow: `0 0 15px ${sentiment.color}44`
                                }}
                            >
                                <span className="text-lg leading-none" title={sentiment.mood}>{sentiment.emoji}</span>
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    animate={{
                                        boxShadow: [`0 0 0px ${sentiment.color}00`, `0 0 20px ${sentiment.color}66`, `0 0 0px ${sentiment.color}00`]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Map overlay effects */}
            {isCollapsed && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* Red vignette for collapsed state */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255, 0, 0, 0.2) 100%)',
                        }}
                    />
                </div>
            )}
        </div>
    );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const gridSize = 50;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function adjustColor(hex: string, amount: number): string {
    const clamp = (val: number) => Math.min(255, Math.max(0, val));

    let color = hex.replace('#', '');
    if (color.length === 3) {
        color = color.split('').map(c => c + c).join('');
    }

    const r = clamp(parseInt(color.slice(0, 2), 16) + amount);
    const g = clamp(parseInt(color.slice(2, 4), 16) + amount);
    const b = clamp(parseInt(color.slice(4, 6), 16) + amount);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getPhaseColor(phase: string): string {
    switch (phase) {
        case 'STABLE': return 'text-green-400';
        case 'STRESSED': return 'text-yellow-400';
        case 'UNSTABLE': return 'text-orange-400';
        case 'COLLAPSED': return 'text-red-400';
        default: return 'text-gray-400';
    }
}

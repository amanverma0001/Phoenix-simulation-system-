"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import EuropeMap from "./EuropeMap";
import GlobeMap from "./GlobeMap";
import ShatterEffect from "./ShatterEffect";
import EnergyNetworkLayer from "./layers/EnergyNetworkLayer";
import CorporateLayer from "./layers/CorporateLayer";
import EthnicLayer from "./layers/EthnicLayer";
import ShadowActorsLayer from "./layers/ShadowActorsLayer";
import type { SoundType } from "@/hooks/useSound";
import { useAISentiment } from "@/hooks/useAISentiment";
import FinanceLayer from "./layers/FinanceLayer";
import StressHeatmapLayer from "./layers/StressHeatmapLayer";

interface MapContainerProps {
  isCollapsed: boolean;
  compareMode: boolean;
  activeLayers: Record<string, boolean>;
  countryStabilities?: Record<string, number>;
  onCountryHover?: (countryId: string | null) => void;
  onMeterShiftClick?: (e: React.MouseEvent) => void;
  playSound?: (sound: SoundType) => void;
  highlightedEntities?: string[];
  onSanction?: (countryId: string) => void;
  userOrigin?: string | null;
  countries?: any[];
  events?: any[];
  dataDrift?: number; // [Refinement]
}

export default function MapContainer({
  isCollapsed,
  compareMode,
  activeLayers,
  countryStabilities = {},
  onCountryHover,
  onMeterShiftClick,
  playSound,
  highlightedEntities = [],
  onSanction,
  userOrigin,
  countries = [],
  events = [],
  dataDrift = 0,
}: MapContainerProps) {
  const [dividerX, setDividerX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showShatter, setShowShatter] = useState(false);
  const [shatterComplete, setShatterComplete] = useState(false);
  const [globeRotation, setGlobeRotation] = useState(0);
  const [dayProgress, setDayProgress] = useState(0);
  const [realityGlitch, setRealityGlitch] = useState(false);

  const sentiments = useAISentiment(countries, events);

  const containerRef = useRef<HTMLDivElement>(null);

  // Create D3 projection for layer components
  const projection = useMemo(() => {
    return d3.geoMercator()
      .center([15, 52])
      .scale(dimensions.width * 1.2)
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions]);

  const globalStability = useMemo(() => {
    const vals = Object.values(countryStabilities);
    if (vals.length === 0) return 100;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [countryStabilities]);

  // [Fix] Memoize stable stabilities for official view to prevent re-renders
  const stableStabilities = useMemo(() =>
    Object.fromEntries(Object.keys(countryStabilities).map((k) => [k, 100])),
    [countryStabilities]
  );

  // Handle divider drag
  const handleDividerMouseDown = () => {
    setIsDragging(true);
  };

  const handleDividerTouchStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateDividerX(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.touches[0]) {
        updateDividerX(e.touches[0].clientX);
      }
    };

    const updateDividerX = (clientX: number) => {
      const container = document.getElementById("map-container");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newX = ((clientX - rect.left) / rect.width) * 100;
      setDividerX(Math.max(20, Math.min(80, newX)));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Trigger shatter effect on collapse
  useEffect(() => {
    if (isCollapsed && !shatterComplete) {
      setShowShatter(true);
    }
  }, [isCollapsed, shatterComplete]);

  const handleShatterComplete = () => {
    setShowShatter(false);
    setShatterComplete(true);
  };

  // Reset shatter when un-collapsed
  useEffect(() => {
    if (!isCollapsed) {
      setShatterComplete(false);
    }
  }, [isCollapsed]);

  // Day/Night Cycle (Simulated 10-minute day)
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setDayProgress((elapsed % 600) / 600); // 10 min loop
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reality Glitch Trigger
  useEffect(() => {
    if (globalStability < 30) {
      const triggerGlitch = () => {
        setRealityGlitch(true);
        setTimeout(() => setRealityGlitch(false), 200 + Math.random() * 500);
      };

      const glitchTimer = setInterval(() => {
        if (Math.random() > 0.8) triggerGlitch();
      }, 5000);

      return () => clearInterval(glitchTimer);
    }
  }, [globalStability]);

  return (
    <div
      id="map-container"
      ref={containerRef}
      className={`relative flex-1 overflow-hidden transition-all duration-700 ${realityGlitch ? 'glitch-effect' : ''}`}
      onClick={onMeterShiftClick}
    >
      {/* Day/Night Atmospheric Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${Math.sin(dayProgress * Math.PI) * 0.4 + 0.2}) 100%)`,
          mixBlendMode: 'multiply'
        }}
      />
      {compareMode ? (
        <>
          {/* COMPARE MODE HEADER - Cinematic Overlay */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 right-0 z-30 flex justify-center pointer-events-none"
          >
            <div className="mt-4 px-6 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-[0.4em] uppercase">
                  Reality Comparison Active
                </span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-red-400"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Left side - Official Reality */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 overflow-hidden"
            style={{ width: `${dividerX}%` }}
          >
            {/* Blue gradient overlay for "clean" look */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none z-20" />

            {/* Animated Corner Brackets */}
            <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-lg z-20" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-cyan-500/50 rounded-bl-lg z-20" />

            <div className="h-full flex flex-col">
              {/* Premium HUD Label */}
              <div className="absolute top-8 left-8 z-20">
                <motion.div
                  className="flex flex-col gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-cyan-400"
                      animate={{
                        boxShadow: ["0 0 10px rgba(0,255,128,0.8)", "0 0 20px rgba(0,255,128,0.4)", "0 0 10px rgba(0,255,128,0.8)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-bold text-white tracking-widest uppercase">Official View</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-500/60 pl-6">PROPAGANDA_MATRIX_V2.1</span>
                </motion.div>
              </div>

              {/* Official globe - clean, stable state */}
              <div className="h-full relative">
                <GlobeMap
                  countryStabilities={stableStabilities}
                  isCollapsed={false}
                  className="opacity-90"
                  rotation={globeRotation}
                  onRotationChange={setGlobeRotation}
                  highlightedEntities={highlightedEntities}
                  onCountryHover={onCountryHover}
                  onSanction={onSanction}
                  sentiments={sentiments}
                  dataDrift={0} // Official view has no drift
                />

                {/* Bottom Label */}
                <motion.div
                  className="absolute inset-x-0 bottom-16 flex items-center justify-center pointer-events-none z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="px-6 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-400 font-bold">
                      Curated Narrative
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Shadow Reality */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 right-0 bottom-0 overflow-hidden"
            style={{ width: `${100 - dividerX}%` }}
          >
            {/* Red/magenta gradient overlay for "danger" look */}
            <div className="absolute inset-0 bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none z-20" />

            {/* Animated Corner Brackets */}
            <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-red-500/50 rounded-tr-lg z-20" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-red-500/50 rounded-br-lg z-20" />

            <div className="h-full relative">
              {/* Premium HUD Label */}
              <div className="absolute top-8 right-8 z-20 text-right">
                <motion.div
                  className="flex flex-col gap-1 items-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white tracking-widest uppercase">Shadow Reality</span>
                    <motion.div
                      className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-pink-500"
                      animate={{
                        boxShadow: ["0 0 10px rgba(255,50,100,0.8)", "0 0 20px rgba(255,50,100,0.4)", "0 0 10px rgba(255,50,100,0.8)"]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-red-500/60 pr-6">⚠ CLASSIFIED_INTEL</span>
                </motion.div>
              </div>

              {/* Real globe with actual stabilities */}
              <GlobeMap
                countryStabilities={countryStabilities}
                isCollapsed={isCollapsed}
                rotation={globeRotation}
                onRotationChange={setGlobeRotation}
                highlightedEntities={highlightedEntities}
                onCountryHover={onCountryHover}
                onSanction={onSanction}
                sentiments={sentiments}
                dataDrift={dataDrift} // Shadow view shows real drift
              />

              {/* Power Structure Layers */}
              <EnergyNetworkLayer
                visible={activeLayers.energy || true}
                width={dimensions.width * (1 - dividerX / 100)}
                height={dimensions.height}
                projection={projection}
              />
              <CorporateLayer
                visible={activeLayers.corporate || true}
                width={dimensions.width * (1 - dividerX / 100)}
                height={dimensions.height}
                projection={projection}
              />
              <EthnicLayer
                visible={activeLayers.ethnic}
                width={dimensions.width * (1 - dividerX / 100)}
                height={dimensions.height}
                projection={projection}
              />
              <ShadowActorsLayer
                visible={activeLayers.shadow}
                width={dimensions.width * (1 - dividerX / 100)}
                height={dimensions.height}
                projection={projection}
              />
              <FinanceLayer
                visible={!!activeLayers.finance}
                width={dimensions.width * (1 - dividerX / 100)}
                height={dimensions.height}
                projection={projection}
                globalStability={globalStability}
              />
              <StressHeatmapLayer
                visible={!!activeLayers.stress}
                width={dimensions.width * (1 - dividerX / 100)}
                height={dimensions.height}
                projection={projection}
                countries={countries}
              />

              {/* Bottom Label */}
              <motion.div
                className="absolute inset-x-0 bottom-16 flex items-center justify-center pointer-events-none z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="px-6 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <p className="text-sm uppercase tracking-[0.3em] text-red-400 font-bold">
                    Hidden Fragmentations
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CINEMATIC DIVIDER */}
          <motion.div
            className="absolute top-0 bottom-0 z-30 cursor-col-resize group"
            style={{ left: `calc(${dividerX}% - 16px)`, width: '32px' }}
            onMouseDown={handleDividerMouseDown}
            onTouchStart={handleDividerTouchStart}
          >
            {/* Glowing Core Line */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-white to-red-400 transform -translate-x-1/2"
              animate={{
                boxShadow: isDragging
                  ? "0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(0,255,255,0.5)"
                  : "0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(0,255,255,0.3)",
              }}
            />

            {/* Animated Pulse Rings (center handle) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="w-10 h-10 rounded-full border border-white/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/80 to-red-500/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                whileHover={{ scale: 1.1 }}
              >
                <motion.span
                  className="text-white text-lg font-bold select-none"
                  animate={{ opacity: isDragging ? 1 : [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⟷
                </motion.span>
              </motion.div>
            </div>

            {/* Top & Bottom end caps */}
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.8)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-[0_0_15px_rgba(255,100,100,0.8)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </>
      ) : (
        <div className="h-full relative">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L10 30 L30 30 L40 20 L30 10 L10 10 Z' fill='none' stroke='%2300ffff' strokeWidth='0.5'/%3E%3C/svg%3E")
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Main 3D Globe */}
          <GlobeMap
            countryStabilities={countryStabilities}
            isCollapsed={isCollapsed}
            highlightedEntities={highlightedEntities}
            onCountryHover={onCountryHover}
            onSanction={onSanction}
            userOrigin={userOrigin}
            sentiments={sentiments}
            dataDrift={dataDrift}
          />

          {/* Visualization Layers (only show when collapsed or toggled) */}
          <EnergyNetworkLayer
            visible={activeLayers.energy}
            width={dimensions.width}
            height={dimensions.height}
            projection={projection}
          />
          <CorporateLayer
            visible={activeLayers.corporate}
            width={dimensions.width}
            height={dimensions.height}
            projection={projection}
          />
          <EthnicLayer
            visible={activeLayers.ethnic}
            width={dimensions.width}
            height={dimensions.height}
            projection={projection}
          />
          <ShadowActorsLayer
            visible={activeLayers.shadow}
            width={dimensions.width}
            height={dimensions.height}
            projection={projection}
          />
          <FinanceLayer
            visible={!!activeLayers.finance}
            width={dimensions.width}
            height={dimensions.height}
            projection={projection}
            globalStability={globalStability}
          />
          <StressHeatmapLayer
            visible={!!activeLayers.stress}
            width={dimensions.width}
            height={dimensions.height}
            projection={projection}
            countries={countries}
          />

          {/* Shatter Effect */}
          <ShatterEffect
            active={showShatter}
            onComplete={handleShatterComplete}
            width={dimensions.width}
            height={dimensions.height}
            playSound={playSound}
          />

          {/* State overlay text */}
          <AnimatePresence>
            {isCollapsed && shatterComplete ? (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-sm uppercase tracking-widest text-red-500 mb-4 neon-glow animate-pulse">
                    ⚡ SYSTEM COLLAPSED ⚡
                  </p>
                  <p className="text-xs text-red-500/60 uppercase tracking-widest max-w-md">
                    {Object.entries(activeLayers)
                      .filter(([_, active]) => active)
                      .map(([layer]) => {
                        const labels: Record<string, string> = {
                          energy: "ENERGY NETWORKS EXPOSED",
                          corporate: "CORPORATE TERRITORIES REVEALED",
                          ethnic: "ETHNIC BOUNDARIES FRAGMENTED",
                          shadow: "SHADOW ACTORS EMERGING",
                        };
                        return labels[layer];
                      })
                      .join(" • ")}
                  </p>
                </div>
              </motion.div>
            ) : !isCollapsed ? (
              <motion.div
                className="absolute bottom-4 left-4 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xs uppercase tracking-widest text-cyan-400/50">
                  Interactive Map • Hover for details
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>


        </div>
      )}

    </div>
  );
}

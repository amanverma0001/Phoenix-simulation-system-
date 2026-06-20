"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Eye, FastForward } from "lucide-react";
import { CascadeEvent } from "@/lib/CascadeEngine";

interface TimelineProps {
  events?: CascadeEvent[];
  onTimeChange?: (time: number, event?: CascadeEvent) => void;
  onViewState?: (event: CascadeEvent) => void;
}

export default function Timeline({ events = [], onTimeChange, onViewState }: TimelineProps) {
  const [playheadPosition, setPlayheadPosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredEventIndex, setHoveredEventIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform cascade events into timeline format
  const timelineEvents = useMemo(() => {
    if (events.length === 0) {
      // Default events if none provided
      return [
        { time: 0, offsetY: 0, label: "User sanctioned Russia", color: "#00ffff", isPulse: false, severity: "low" as any, originalEvent: { id: 'mock-1', timestamp: 0, type: 'action' as any, description: 'User sanctioned Russia', severity: 'low' as any, entities: [], changes: [], systemState: {} as any } },
        { time: 2.3, offsetY: 0, label: "Germany energy -55%", color: "#ffff00", isPulse: false, severity: "medium" as any, originalEvent: { id: 'mock-2', timestamp: 2300, type: 'effect' as any, description: 'Germany energy -55%', severity: 'medium' as any, entities: [], changes: [], systemState: {} as any } },
        { time: 4.1, offsetY: 0, label: "Poland redirected flow", color: "#ffff00", isPulse: false, severity: "medium" as any, originalEvent: { id: 'mock-3', timestamp: 4100, type: 'effect' as any, description: 'Poland redirected flow', severity: 'medium' as any, entities: [], changes: [], systemState: {} as any } },
        { time: 6.8, offsetY: 0, label: "Bavaria separatism +40%", color: "#ff8800", isPulse: false, severity: "high" as any, originalEvent: { id: 'mock-4', timestamp: 6800, type: 'emergence' as any, description: 'Bavaria separatism +40%', severity: 'high' as any, entities: [], changes: [], systemState: {} as any } },
        { time: 7.2, offsetY: 0, label: "⚡ PHASE TRANSITION", color: "#ff0040", isPulse: true, severity: "critical" as any, originalEvent: { id: 'mock-5', timestamp: 7200, type: 'phase_transition' as any, description: '⚡ PHASE TRANSITION', severity: 'critical' as any, entities: [], changes: [], systemState: {} as any } },
        { time: 7.5, offsetY: 0, label: "Reality fracture begins", color: "#ff0040", isPulse: false, severity: "critical" as any, originalEvent: { id: 'mock-6', timestamp: 7500, type: 'emergence' as any, description: 'Reality fracture begins', severity: 'critical' as any, entities: [], changes: [], systemState: {} as any } },
      ];
    }

    const maxTimeValue = Math.max(...events.map(e => e.timestamp)) || 1;
    const markersSeen: Record<string, number> = {};

    return events.map(event => {
      let color = "#00ffff";
      switch (event.severity) {
        case "low": color = "#00ffff"; break;
        case "medium": color = "#ffff00"; break;
        case "high": color = "#ff8800"; break;
        case "critical": color = "#ff0040"; break;
      }

      const rawTime = (event.timestamp / maxTimeValue) * 7.5;
      const timeKey = rawTime.toFixed(2);
      markersSeen[timeKey] = (markersSeen[timeKey] || 0) + 1;

      return {
        time: rawTime,
        offsetY: (markersSeen[timeKey] - 1) * -8, // Stagger vertically
        label: event.description,
        color,
        isPulse: event.type === "phase_transition" || event.severity === "critical",
        severity: event.severity,
        originalEvent: event,
      };
    });
  }, [events]);

  const maxTime = timelineEvents.length > 0
    ? Math.max(...timelineEvents.map(e => e.time))
    : 7.5;

  const handlePlayheadMouseDown = () => {
    setIsDragging(true);
  };

  React.useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      setPlayheadPosition(Math.max(0, Math.min(100, newX)));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Auto-play functionality with speed control
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlayheadPosition(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + (0.5 * playbackSpeed);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Notify parent of time changes
  useEffect(() => {
    const currentTime = (playheadPosition / 100) * maxTime;
    const nearestEvent = timelineEvents.find((e, i) => {
      const eventPos = (e.time / maxTime) * 100;
      return Math.abs(eventPos - playheadPosition) < 2;
    });
    onTimeChange?.(currentTime, nearestEvent?.originalEvent);
  }, [playheadPosition, maxTime, onTimeChange, timelineEvents]);

  const handleReplay = () => {
    setPlayheadPosition(0);
    setIsPlaying(true);
    setSelectedEventIndex(null);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Navigate to previous event
  const goToPrevEvent = () => {
    const currentPos = playheadPosition;
    const prevEvents = timelineEvents
      .map((e, i) => ({ pos: (e.time / maxTime) * 100, index: i }))
      .filter(e => e.pos < currentPos - 1)
      .sort((a, b) => b.pos - a.pos);

    if (prevEvents.length > 0) {
      setPlayheadPosition(prevEvents[0].pos);
      setSelectedEventIndex(prevEvents[0].index);
    }
  };

  // Navigate to next event
  const goToNextEvent = () => {
    const currentPos = playheadPosition;
    const nextEvents = timelineEvents
      .map((e, i) => ({ pos: (e.time / maxTime) * 100, index: i }))
      .filter(e => e.pos > currentPos + 1)
      .sort((a, b) => a.pos - b.pos);

    if (nextEvents.length > 0) {
      setPlayheadPosition(nextEvents[0].pos);
      setSelectedEventIndex(nextEvents[0].index);
    }
  };

  // Handle View Globe State
  const handleViewState = () => {
    if (selectedEventIndex !== null && timelineEvents[selectedEventIndex]?.originalEvent) {
      onViewState?.(timelineEvents[selectedEventIndex].originalEvent);
    } else {
      // Find nearest event
      const nearestEvent = timelineEvents
        .map((e, i) => ({ event: e, dist: Math.abs((e.time / maxTime) * 100 - playheadPosition), index: i }))
        .sort((a, b) => a.dist - b.dist)[0];

      if (nearestEvent?.event.originalEvent) {
        onViewState?.(nearestEvent.event.originalEvent);
        setSelectedEventIndex(nearestEvent.index);
      }
    }
  };

  return (
    <motion.div
      className="w-full relative border-t border-cyan-500/20 px-6 py-6"
      style={{
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 -8px 32px rgba(0, 255, 255, 0.2)",
      }}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300, duration: 0.8 }}
    >
      {/* Title */}
      <div className="text-xs text-cyan-400/60 uppercase tracking-widest mb-3 font-mono">
        ⏱ Collapse Archaeology Timeline
      </div>

      {/* Timeline Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Replay button */}
        <motion.button
          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-[10px] uppercase font-mono whitespace-nowrap px-2.5 py-1.5 rounded border border-cyan-500/30 hover:border-cyan-400/50 bg-cyan-500/5"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)" }}
          onClick={handleReplay}
        >
          <RotateCcw size={12} />
          Restart
        </motion.button>

        {/* Prev Event */}
        <motion.button
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[10px] uppercase font-mono px-2 py-1.5 rounded border border-cyan-500/30 hover:border-cyan-400/50 bg-cyan-500/5"
          whileHover={{ scale: 1.05 }}
          onClick={goToPrevEvent}
        >
          <ChevronLeft size={14} />
          Prev
        </motion.button>

        {/* Play/Pause button */}
        <motion.button
          className="flex items-center gap-1.5 text-white hover:text-cyan-300 text-[10px] uppercase font-mono whitespace-nowrap px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)" }}
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          {isPlaying ? "Pause" : "Play"}
        </motion.button>

        {/* Next Event */}
        <motion.button
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[10px] uppercase font-mono px-2 py-1.5 rounded border border-cyan-500/30 hover:border-cyan-400/50 bg-cyan-500/5"
          whileHover={{ scale: 1.05 }}
          onClick={goToNextEvent}
        >
          Next
          <ChevronRight size={14} />
        </motion.button>

        {/* Speed control */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 bg-white/5">
          <FastForward size={12} className="text-gray-400" />
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-transparent text-[10px] font-mono text-cyan-400 outline-none cursor-pointer"
          >
            <option value="0.25" className="bg-gray-900">0.25x</option>
            <option value="0.5" className="bg-gray-900">0.5x</option>
            <option value="1" className="bg-gray-900">1x</option>
            <option value="2" className="bg-gray-900">2x</option>
            <option value="5" className="bg-gray-900">5x</option>
          </select>
        </div>

        <div className="flex-1" />

        {/* View Globe State button */}
        {onViewState && (
          <motion.button
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-[10px] uppercase font-mono px-3 py-1.5 rounded border border-purple-500/30 hover:border-purple-400/50 bg-purple-500/10"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }}
            onClick={handleViewState}
          >
            <Eye size={12} />
            View Globe State
          </motion.button>
        )}

        {/* Time display */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="text-gray-500 uppercase tracking-tighter">
            Events: <span className="text-cyan-400 font-bold">{events.length}</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="text-cyan-400 font-bold tabular-nums text-lg">
            {((playheadPosition / 100) * maxTime).toFixed(2)}s
          </div>
        </div>
      </div>

      {/* Timeline Bar */}
      <div ref={containerRef} className="relative h-12 cursor-pointer group/bar">
        {/* Shimmer effect gradient */}
        <motion.div
          className="absolute top-8 left-0 right-0 h-0.5 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Progress bar background */}
        <div
          className="absolute top-8 left-0 right-0 h-0.5 rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 128, 0.1))",
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.2)",
          }}
        />

        {/* Progress bar fill */}
        <motion.div
          className="absolute top-8 left-0 h-0.5 rounded-full"
          style={{
            background: "linear-gradient(90deg, #00ffff, #ff0080)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.8)",
          }}
          animate={{ width: `${playheadPosition}%` }}
          transition={{ duration: 0.05 }}
        />

        {/* Event markers */}
        {timelineEvents.map((event, idx) => {
          const position = (event.time / maxTime) * 100;
          const isHovered = hoveredEventIndex === idx;
          const markerSize = event.isPulse ? 16 : event.severity === "critical" ? 12 : 10;

          return (
            <motion.div
              key={idx}
              className="absolute top-1/2 -translate-x-1/2"
              style={{
                left: `${position}%`,
                marginTop: `${-markerSize / 2 + event.offsetY}px`,
                zIndex: isHovered ? 50 : 20
              }}
              onMouseEnter={() => setHoveredEventIndex(idx)}
              onMouseLeave={() => setHoveredEventIndex(null)}
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: markerSize,
                  height: markerSize,
                  border: `2px solid ${event.color}`,
                  boxShadow: `0 0 20px ${event.color}`,
                }}
                animate={event.isPulse ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.8, repeat: event.isPulse ? Infinity : 0 }}
              />

              {/* Inner dot */}
              <motion.div
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: markerSize * 0.5,
                  height: markerSize * 0.5,
                  background: event.color,
                  boxShadow: `0 0 8px ${event.color}`,
                }}
                animate={isHovered ? { scale: 1.4 } : { scale: 1 }}
              />

              {/* Connection line to timeline */}
              <div
                className="absolute w-px h-3 -translate-x-1/2"
                style={{
                  top: markerSize / 2,
                  borderLeft: `1px dashed ${event.color}`,
                  opacity: 0.5,
                }}
              />

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/95 border border-white/20 rounded-lg text-[10px] font-mono text-white whitespace-pre-wrap min-w-[140px] max-w-[200px] z-50 pointer-events-none shadow-2xl"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-cyan-400 font-bold">{event.time.toFixed(1)}s</span>
                      <span className="opacity-40">{event.severity}</span>
                    </div>
                    {event.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Playhead */}
        <motion.div
          className="absolute cursor-col-resize z-30"
          style={{
            left: `${playheadPosition}%`,
            top: "-8px",
            transform: "translateX(-50%)",
          }}
          onMouseDown={handlePlayheadMouseDown}
        >
          {/* Gradient line */}
          <motion.div
            className="w-0.5 h-10 rounded-full"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(0, 255, 255, 1), transparent)",
              boxShadow: isDragging ? "0 0 30px rgba(0, 255, 255, 0.8)" : "0 0 15px rgba(0, 255, 255, 0.5)",
            }}
          />

          {/* Handle */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-cyan-400 rounded-full cursor-grab active:cursor-grabbing"
            style={{
              boxShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
            }}
            whileHover={{ scale: 1.2 }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <div className="w-1 h-0.5 bg-gray-800 rounded-full" />
              <div className="w-1 h-0.5 bg-gray-800 rounded-full" />
            </div>
          </motion.div>

          {/* Trail */}
          {isDragging && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-12 rounded-full"
                  style={{
                    background: `rgba(0, 255, 255, ${0.5 - i * 0.1})`,
                    left: -i * 4,
                    top: 0,
                  }}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>

      {/* Time display */}
      <div className="text-xs uppercase font-mono text-cyan-400 whitespace-nowrap text-right">
        <div className="mb-1 text-gray-500">CURRENT</div>
        <motion.div
          className="text-lg font-bold tabular-nums"
          key={Math.round((playheadPosition / 100) * maxTime * 10)}
        >
          {((playheadPosition / 100) * maxTime).toFixed(1)}s
        </motion.div>
        <div className="text-xs text-gray-500">
          {events.length} events
        </div>
      </div>
    </motion.div>
  );
}

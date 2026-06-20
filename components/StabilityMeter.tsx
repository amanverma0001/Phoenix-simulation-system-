"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGlitchEffect } from "@/lib/useGlitchEffect"
import { useIsMobile } from "@/hooks/use-mobile"

interface StabilityMeterProps {
  stability?: number
  homeStability?: number
  isHome?: boolean
}

export default function StabilityMeter({ stability, homeStability, isHome }: StabilityMeterProps) {
  const isMobile = useIsMobile()
  // Ensure stability is never undefined to prevent SVG errors
  const safeStability = stability ?? 100;
  const [displayStability, setDisplayStability] = useState(safeStability)
  const [prevStability, setPrevStability] = useState(safeStability)
  const meterRef = useRef<HTMLDivElement>(null)

  const { triggerGlitch } = useGlitchEffect(meterRef as any)

  // Responsive sizes
  const size = isMobile ? "w-48 h-48" : "w-64 h-64"
  const svgSize = 240 // viewBox stays same, we scale the container
  const radius = 95
  const homeRadius = 65
  const circumference = 2 * Math.PI * radius
  const homeCircumference = 2 * Math.PI * homeRadius

  useEffect(() => {
    // Trigger intense glitch at collapse threshold
    if (safeStability < 70 && displayStability >= 70) {
      triggerGlitch("intense")
    } else if (safeStability < 50) {
      triggerGlitch("subtle")
    }

    const timer = setTimeout(() => {
      setPrevStability(displayStability)
      setDisplayStability(safeStability)
    }, 50)

    return () => clearTimeout(timer)
  }, [safeStability, triggerGlitch]); // Removed displayStability from deps to stop loop

  const getGradient = (value: number) => {
    if (value >= 90) return "linear-gradient(135deg, #00ff00, #00dd00)" // Green to lime
    if (value >= 70) return "linear-gradient(135deg, #ffff00, #ffaa00)" // Yellow to orange
    if (value >= 50) return "linear-gradient(135deg, #ffaa00, #ff3300)" // Orange to red
    return "linear-gradient(135deg, #ff0040, #aa0000)" // Red to dark red
  }

  const getColor = (value: number) => {
    if (value >= 90) return "#00ff00"
    if (value >= 70) return "#ffff00"
    if (value >= 50) return "#ff8800"
    return "#ff0040"
  }

  const getLabel = (value: number) => {
    if (value >= 90) return "OPTIMAL"
    if (value >= 70) return "DEGRADED"
    if (value >= 50) return "CRITICAL"
    return "COLLAPSE"
  }

  const safeDisplayStability = isNaN(displayStability) ? 100 : displayStability
  const safeHomeStability = homeStability ?? 100
  const currentColor = getColor(safeDisplayStability)
  const homeColor = getColor(safeHomeStability)
  const strokeDashoffset = circumference - (safeDisplayStability / 100) * circumference
  const homeStrokeDashoffset = homeCircumference - (safeHomeStability / 100) * homeCircumference

  const shouldPulse = safeDisplayStability < 70
  const isShaking = safeDisplayStability !== prevStability && Math.abs(safeDisplayStability - prevStability) > 15

  // Progress indicator dots
  const dots = Array.from({ length: 12 }, (_, i) => i)
  const activeDots = Math.round((safeDisplayStability / 100) * 12)

  return (
    <motion.div
      ref={meterRef}
      className={`w-full flex flex-col items-center gap-4 breathing-slow max-w-full ${isMobile ? 'py-2' : 'gap-6'}`}
      animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative ${size} ${shouldPulse ? "animate-pulse" : ""}`}
        style={{
          filter: shouldPulse
            ? "drop-shadow(0 0 30px rgba(255, 0, 64, 0.8))"
            : "drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))",
        }}
      >
        <svg className="w-full h-full" viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentColor} stopOpacity="1" />
              <stop offset="50%" stopColor={currentColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={currentColor} stopOpacity="0.4" />
            </linearGradient>

            <filter id="premium-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="soft-glow" />
              <feGaussianBlur stdDeviation="6" result="outer-glow" />
              <feMerge>
                <feMergeNode in="outer-glow" />
                <feMergeNode in="soft-glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <mask id="segmented-mask">
              <circle cx="120" cy="120" r={radius} fill="none" stroke="white" strokeWidth="12" strokeDasharray="3 2" />
            </mask>
          </defs>

          {/* Outer Tech Decoration */}
          {Array.from({ length: 72 }).map((_, i) => (
            <line
              key={`outer-tick-${i}`}
              x1="120" y1="5" x2="120" y2={i % 6 === 0 ? "15" : "10"}
              stroke={i % 6 === 0 ? "rgba(0, 255, 255, 0.3)" : "rgba(0, 255, 255, 0.1)"}
              strokeWidth={i % 6 === 0 ? "1.5" : "0.5"}
              transform={`rotate(${i * 5} 120 120)`}
            />
          ))}

          {/* Inner data-flow ring */}
          <motion.circle
            cx="120" cy="120" r="85"
            fill="none" stroke="rgba(0, 255, 255, 0.05)"
            strokeWidth="0.5" strokeDasharray="2 20"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />

          {/* Main Background Track */}
          <circle
            cx="120" cy="120" r={radius}
            fill="none" stroke="rgba(0, 255, 255, 0.03)"
            strokeWidth="14"
            filter="blur(2px)"
          />
          <circle
            cx="120" cy="120" r={radius}
            fill="none" stroke="rgba(255,255,255,0.02)"
            strokeWidth="12"
            strokeDasharray="4 2"
          />

          {/* Dynamic Progress Ring - Segmented */}
          <motion.circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="url(#meterGradient)"
            strokeWidth="12"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            mask="url(#segmented-mask)"
            style={{
              filter: "url(#premium-glow)",
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
            transition={{ duration: 1, ease: "circOut" }}
          />

          {/* Home Stability Indicator (Secondary Inner Ring) */}
          {isHome && (
            <motion.circle
              cx="120"
              cy="120"
              r={homeRadius}
              fill="none"
              stroke={homeColor}
              strokeWidth="4"
              strokeDasharray={`${homeCircumference} ${homeCircumference}`}
              strokeDashoffset={homeStrokeDashoffset}
              strokeLinecap="round"
              style={{
                opacity: 0.4,
                transform: "rotate(-90deg)",
                filter: `drop-shadow(0 0 8px ${homeColor}80)`,
                transformOrigin: "center",
              }}
              transition={{ duration: 1.5, ease: "circOut" }}
            />
          )}

          {/* Tech Nodes (Dots) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360 - 90
            const x = 120 + 108 * Math.cos((angle * Math.PI) / 180)
            const y = 120 + 108 * Math.sin((angle * Math.PI) / 180)
            const isActive = i < activeDots

            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={1.5}
                fill={isActive ? "#fff" : "rgba(0, 255, 255, 0.1)"}
                style={{
                  filter: isActive ? `drop-shadow(0 0 10px ${currentColor})` : "none",
                  opacity: isActive ? 1 : 0.3
                }}
              />
            )
          })}
        </svg>

        {/* Center pulsing glow circle */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${currentColor}15 0%, transparent 70%)`,
            filter: `blur(40px)`,
          }}
          animate={{
            scale: shouldPulse ? [1, 1.4, 1] : 1,
            opacity: shouldPulse ? [0.3, 0.7, 0.3] : 0.2
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Center UI Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: isShaking ? [1, 1.1, 0.9, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <span
                className={`text-6xl md:text-7xl font-black font-orbitron tracking-tighter transition-colors duration-500 ${safeDisplayStability < 50 ? 'text-red-500' : 'text-white'}`}
                style={{
                  textShadow: `0 0 40px ${currentColor}80, 0 0 10px rgba(255,255,255,0.2)`,
                  filter: shouldPulse ? 'drop-shadow(0 0 15px rgba(255,0,0,0.5))' : 'none'
                }}
              >
                {Math.round(safeDisplayStability)}
              </span>
              <motion.span
                className="absolute -top-1 -right-4 text-[10px] font-mono text-cyan-400 opacity-50"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SEC_CH
              </motion.span>
            </div>

            <div className="flex flex-col items-center -mt-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-cyan-500/40 mb-3">
                System Coherence
              </span>

              <div className="px-4 py-1.5 rounded-lg glass-premium-accent border border-white/10 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className={`text-[10px] font-black tracking-[0.3em] font-orbitron ${safeDisplayStability < 50 ? 'text-red-400' : (safeDisplayStability < 70 ? 'text-yellow-400' : 'text-cyan-400')}`}>
                  {getLabel(safeDisplayStability)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status text with glitch effect */}
      <motion.div className="text-center" key={getLabel(safeDisplayStability)}>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">System Coherence</p>
        <motion.p
          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold uppercase font-mono neon-glow tracking-wider`}
          style={{ color: currentColor }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {getLabel(safeDisplayStability)}
        </motion.p>

        {/* Critical Warning Text */}
        <AnimatePresence>
          {safeDisplayStability < 75 && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                scale: [1, 1.1, 1]
              }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                scale: {
                  duration: safeDisplayStability < 40 ? 0.3 : 0.8,
                  repeat: Infinity
                }
              }}
              className="text-[9px] font-bold text-red-500 mt-1 tracking-[0.2em] font-mono"
            >
              ⚠ {safeDisplayStability < 40 ? "IMMINENT COLLAPSE" : "CRITICAL THRESHOLD"} ⚠
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

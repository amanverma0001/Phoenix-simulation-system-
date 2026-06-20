"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Volume2, VolumeX, Settings, RotateCcw, Menu,
  DollarSign, Globe, Zap, Brain, FileText,
  LayoutDashboard, Activity, BarChart2, ShieldAlert,
  ChevronDown, RefreshCw, Mic, MicOff
} from "lucide-react"
import { useGlitchEffect } from "@/lib/useGlitchEffect"
import TitleWithVisualizer from "./TitleWithVisualizer"
import type { EnergyData, CrisisIndicator, LiveEvent } from "@/lib/liveDataService"
import GlobalCommandClock from "./GlobalCommandClock"

interface TimeStamp {
  label: string;
  time: string;
  offset: string;
}

interface GlobalCommandClockProps {
  compact?: boolean;
}

interface HeaderProps {
  soundEnabled: boolean
  onToggleSound: () => void
  onToggleCompare: () => void
  onReset: () => void
  onOpenAccessibility?: () => void
  activeModule: string | null
  onToggleModule: (module: string) => void
  liveData?: {
    energy: EnergyData | null
    crisis: CrisisIndicator | null
    events: LiveEvent[]
    timeSinceUpdate: string
    isPolling: boolean
    error: string | null
    onRefresh?: () => void
  }
  isMobile?: boolean
  onMenuToggle?: () => void
  voiceEnabled?: boolean
  onToggleVoice?: () => void
}

// Floating particle component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
    initial={{
      x: Math.random() * 100 - 50,
      y: 20,
      opacity: 0
    }}
    animate={{
      y: [-20, -100],
      x: [
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
      ],
      opacity: [0, 0.6, 0],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
)

export default function Header({
  soundEnabled,
  onToggleSound,
  onToggleCompare,
  onReset,
  onOpenAccessibility,
  activeModule,
  onToggleModule,
  liveData,
  isMobile = false,
  onMenuToggle,
  voiceEnabled = true,
  onToggleVoice,
}: HeaderProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const { triggerGlitch } = useGlitchEffect(titleRef as any)

  const modules = [
    { id: 'currency', icon: DollarSign, label: 'MARKETS', color: '#00FF9C' },
    { id: 'diplomacy', icon: Globe, label: 'DIPLOMACY', color: '#3A86FF' },
    { id: 'directives', icon: ShieldAlert, label: 'DIRECTIVES', color: '#FF006E' },
    { id: 'oracle', icon: Brain, label: 'WHAT IF', color: '#8338EC' },
    { id: 'narrative', icon: FileText, label: 'ANALYSIS', color: '#FFC857' },
  ]

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePos({ x: x * 10, y: y * 5 })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Periodic glitch
  useEffect(() => {
    const interval = setInterval(() => {
      triggerGlitch("subtle")
    }, 15000 + Math.random() * 10000)
    return () => clearInterval(interval)
  }, [triggerGlitch])

  return (
    <header className="w-full flex flex-col relative z-20 pointer-events-auto">
      <motion.div
        ref={navRef}
        className="relative px-6 py-4 overflow-hidden glass-premium"
      >
        {/* Animated starfield/grid background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>

        {/* Floating particles */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <FloatingParticle key={i} delay={i * 0.8} />
            ))}
          </div>
        )}

        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent">
          <motion.div
            className="h-full w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
        </div>

        {/* Bottom edge glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF]/30 to-transparent" />

        {/* Main content */}
        <div className="relative flex items-center justify-between">
          {/* Left Section - System Status */}
          <div className="flex items-center gap-6">
            {isMobile && onMenuToggle && (
              <motion.button
                onClick={onMenuToggle}
                className="p-2 text-cyan-400"
                whileTap={{ scale: 0.9 }}
              >
                <Menu size={24} />
              </motion.button>
            )}


            {/* Global Clock - Integrated into Header */}
            {!isMobile && (
              <div className="hidden lg:block border-l border-white/10 pl-6 ml-2">
                <GlobalCommandClock compact />
              </div>
            )}
          </div>

          {/* Center Section - Command Menu */}
          {!isMobile && (
            <div
              className="absolute left-1/2 px-1 py-1 rounded-full glass-premium-accent border border-white/10 shadow-[0_12px_48px_rgba(0,0,0,0.5)] hidden xl:block"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex items-center gap-0.5">
                {modules.map((mod) => {
                  const isActive = activeModule === mod.id
                  const Icon = mod.icon

                  return (
                    <motion.button
                      key={mod.id}
                      onClick={() => onToggleModule(mod.id)}
                      className="relative px-3 md:px-5 py-2.5 rounded-full group transition-all"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Interactive ripple glow on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at center, ${mod.color}15 0%, transparent 70%)`
                        }}
                      />

                      {/* Active state high-end glow */}
                      {isActive && (
                        <motion.div
                          layoutId="activeModuleBg"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${mod.color}25, ${mod.color}05)`,
                            boxShadow: `0 0 25px ${mod.color}30, inset 0 1px 0 ${mod.color}30`,
                            border: `1px solid ${mod.color}40`
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}

                      {/* Content Section */}
                      <div className="relative flex items-center gap-2.5 z-10">
                        <Icon
                          size={14}
                          className="transition-all duration-300"
                          style={{
                            color: isActive ? mod.color : 'rgba(255,255,255,0.4)',
                            filter: isActive ? `drop-shadow(0 0 10px ${mod.color})` : 'none',
                            transform: isActive ? 'scale(1.1)' : 'scale(1)'
                          }}
                        />
                        <span
                          className={`text-[10px] font-mono font-bold tracking-[0.15em] transition-all duration-300 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}
                          style={{
                            textShadow: isActive ? `0 0 15px ${mod.color}80` : 'none'
                          }}
                        >
                          {mod.label}
                        </span>
                      </div>

                      {/* Animated bottom accent streak */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="absolute bottom-1.5 left-4 right-4 h-[2px] rounded-full"
                            style={{ background: mod.color, boxShadow: `0 0 12px ${mod.color}` }}
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0, scaleX: 0 }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Right Section - Controls */}
          <div className="flex items-center gap-3">
            {/* Control Buttons */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/5">
              {!isMobile && (
                <motion.button
                  onClick={onToggleCompare}
                  className="hidden xl:flex px-4 py-2 rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-transparent border border-[#00F0FF]/30 text-[#00F0FF] text-[10px] font-mono font-black uppercase items-center gap-2 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Border light sweep */}
                  <motion.div
                    className="absolute inset-0 border border-[#00F0FF]"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8 }}
                  />
                  <LayoutDashboard size={14} />
                  <span>COMPARE</span>
                </motion.button>
              )}

              {/* Icon Buttons */}
              {[
                { icon: RotateCcw, onClick: onReset, label: 'Reset' },
                { icon: voiceEnabled ? Mic : MicOff, onClick: onToggleVoice, label: 'AI Voice', active: voiceEnabled },
                { icon: Settings, onClick: onOpenAccessibility, label: 'Settings' },
              ].filter(btn => isMobile ? (btn.label === 'AI Voice') : true).map((btn, i) => (
                <motion.button
                  key={i}
                  onClick={btn.onClick}
                  className={`p-2.5 rounded-lg backdrop-blur-xl border transition-all group relative overflow-hidden ${btn.active
                    ? 'bg-[#00FF9C]/10 border-[#00FF9C]/40 text-[#00FF9C]'
                    : 'bg-white/5 border-white/10 text-cyan-400/60 hover:text-cyan-400'
                    }`}
                  whileHover={{ scale: 1.1, rotate: btn.label === 'Reset' ? -90 : 0 }}
                  whileTap={{ scale: 0.9 }}
                  title={btn.label}
                >
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-cyan-400/20"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileHover={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                  <btn.icon size={16} className="relative z-10" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.03) 50%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </header>
  )
}

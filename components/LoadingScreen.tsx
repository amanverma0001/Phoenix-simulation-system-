"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Activity, Globe, Zap } from "lucide-react"

interface LoadingScreenProps {
  onLoadComplete: () => void
}

type Stage = 'core' | 'title' | 'complete'

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [stage, setStage] = useState<Stage>('core')
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Store callback in ref to prevent useEffect re-runs
  const onLoadCompleteRef = useRef(onLoadComplete)
  onLoadCompleteRef.current = onLoadComplete

  useEffect(() => {
    setIsMounted(true)

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1.5
      })
    }, 50)

    // Stage transitions
    const t1 = setTimeout(() => setStage('title'), 3000)
    const t2 = setTimeout(() => setStage('complete'), 5500)
    const t3 = setTimeout(() => onLoadCompleteRef.current(), 6200)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, []) // Empty dependency array - only runs once on mount

  return (
    <motion.div
      className="fixed inset-0 bg-black z-[9999] overflow-hidden flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0c1929_0%,_#000000_70%)]" />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isMounted && Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [null, "-50%"],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Stage 1: Central Core Animation */}
        {stage === 'core' && (
          <motion.div
            key="core"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Orbiting Rings */}
            <div className="relative w-64 h-64">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 border border-cyan-500/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Middle Ring */}
              <motion.div
                className="absolute inset-8 border border-cyan-500/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Inner Pulsing Core */}
              <motion.div
                className="absolute inset-16 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full backdrop-blur-xl flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(6,182,212,0.2)",
                    "0 0 80px rgba(6,182,212,0.4)",
                    "0 0 40px rgba(6,182,212,0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Globe className="text-cyan-400" size={48} />
              </motion.div>

              {/* Orbiting Nodes */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: -6,
                    marginTop: -6,
                  }}
                  animate={{
                    rotate: [angle, angle + 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3
                  }}
                  custom={i}
                >
                  <motion.div
                    className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                    style={{ transform: 'translateX(120px)' }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Status Text */}
            <motion.p
              className="mt-10 text-cyan-400/60 text-sm font-light tracking-[0.3em] uppercase"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Synchronizing Reality
            </motion.p>
          </motion.div>
        )}

        {/* Stage 2: Title Reveal */}
        {stage === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center relative z-20"
          >
            {/* Glitch Echo */}
            <motion.div
              className="absolute inset-0 blur-2xl opacity-20 select-none pointer-events-none"
              animate={{
                x: [-3, 3, -3],
                filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
              }}
              transition={{ duration: 0.15, repeat: Infinity }}
            >
              <h1 className="text-[12vw] font-black tracking-tighter text-cyan-500">FRACTURED</h1>
            </motion.div>

            <div className="relative mb-6">
              <motion.h1
                className="text-[100px] md:text-[140px] font-black leading-none tracking-tighter"
                initial={{ scale: 0.9, filter: 'blur(15px)', y: 20 }}
                animate={{ scale: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.8, type: "spring", damping: 15 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-white">
                  FRACTURED
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
                  WORLD
                </span>
              </motion.h1>

              {/* Underline */}
              <motion.div
                className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full mt-4"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/40 text-sm tracking-[0.4em] uppercase font-light"
            >
              Geopolitical Collapse Simulator
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-12 mt-10"
            >
              <Stat label="Countries" value="47" />
              <Stat label="Power Nodes" value="128" />
              <Stat label="Sync" value="99.9%" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center px-8">
        <div className="flex-1 flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="text-cyan-400/50" size={14} />
          </motion.div>
          <span className="text-cyan-500/40 text-[10px] tracking-widest font-mono uppercase">
            {progress < 100 ? 'Loading Reality Matrix...' : 'Ready'}
          </span>
        </div>

        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex-1 text-right">
          <span className="text-cyan-500/30 text-[10px] font-mono">
            {isMounted ? new Date().toLocaleTimeString() : '--:--:--'}
          </span>
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
    </motion.div>
  )
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-[9px] text-cyan-500/50 uppercase tracking-widest">{label}</span>
    </div>
  )
}

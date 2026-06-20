"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap } from "lucide-react"

interface Winner {
  entityId: string
  name: string
  percentageChange: number
  reason: string
  surpriseScore?: number  // 0-10, higher = more surprising
}

interface Loser {
  entityId: string
  name: string
  percentageChange: number
}

interface EmergencePanelProps {
  winners: Winner[]
  losers: Loser[]
  onClose: () => void
}

export default function EmergencePanel({ winners, losers, onClose }: EmergencePanelProps) {
  const [counter, setCounter] = useState<Record<string, number>>({})

  // Animate counter numbers
  useEffect(() => {
    const targets: Record<string, number> = {
      ...winners.reduce((acc, w) => ({ ...acc, [w.entityId]: w.percentageChange }), {}),
      ...losers.reduce((acc, l) => ({ ...acc, [l.entityId]: Math.abs(l.percentageChange) }), {}),
    }

    const intervals = Object.keys(targets).map((key) => {
      let current = 0
      const target = targets[key]
      const increment = target / 20

      return setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(intervals[Object.keys(targets).indexOf(key)])
        }
        setCounter((prev) => ({ ...prev, [key]: Math.round(current) }))
      }, 30)
    })

    return () => intervals.forEach(clearInterval)
  }, [winners, losers])

  // Emit particles on mount
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    // Generate 30 particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }))
    setParticles(newParticles)

    // Remove particles after animation
    const timer = setTimeout(() => setParticles([]), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="w-96 z-30"
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300, duration: 0.6 }}
    >
      <div
        className="relative rounded-xl p-6 overflow-hidden"
        style={{
          background: "rgba(0, 10, 20, 0.85)",
          backdropFilter: "blur(30px)",
          border: "3px solid transparent",
          backgroundImage:
            "linear-gradient(rgba(0, 10, 20, 0.85), rgba(0, 10, 20, 0.85)), linear-gradient(135deg, #00ffff, #ff0080, #ffff00, #00ffff)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: "0 16px 64px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Corner highlights */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-cyan-400 opacity-60" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-magenta-400 opacity-60" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-yellow-400 opacity-60" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-cyan-400 opacity-60" />

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-cyan-300 transition-colors z-10"
          whileHover={{ scale: 1.2, rotate: 90 }}
        >
          <X size={18} />
        </motion.button>

        {/* Header with animated underline */}
        <div className="mb-6 relative">
          <h3 className="text-sm uppercase tracking-widest text-cyan-400 neon-glow mb-3 font-mono">
            🔥 EMERGENT WINNERS
          </h3>
          <motion.div
            className="h-0.5 bg-gradient-to-r from-cyan-400 to-magenta-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Winners list */}
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {winners.map((winner, idx) => (
            <motion.div
              key={winner.entityId}
              className={`flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-colors relative overflow-hidden ${(winner.surpriseScore || 0) > 7.5
                  ? 'bg-gradient-to-r from-yellow-500/10 to-cyan-400/5 border-yellow-400/30 hover:border-yellow-400/50'
                  : 'bg-cyan-400/5 border-cyan-400/10 hover:bg-cyan-400/10'
                }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* BLACK SWAN Badge for high surprise scores */}
              {(winner.surpriseScore || 0) > 7.5 && (
                <motion.div
                  className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-[8px] font-black tracking-wider rounded-bl-lg text-black flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  <Zap size={8} />
                  BLACK SWAN
                </motion.div>
              )}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-cyan-300 truncate">{winner.name}</p>
                <p className="text-[10px] text-cyan-400/70 italic truncate">{winner.reason}</p>
              </div>
              <motion.p
                className="text-lg font-bold text-cyan-400 font-mono whitespace-nowrap"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                +{counter[winner.entityId] || 0}%
              </motion.p>

              {/* Trailing sparkles on count */}
              <AnimatePresence>
                {(counter[winner.entityId] || 0) > 0 && (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full pointer-events-none"
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{ x: Math.random() * 30 - 15, y: Math.random() * 30 - 15, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ right: 20 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-500/30 my-4" />

        {/* Losers header */}
        <h3 className="text-sm uppercase tracking-widest text-red-400 neon-glow mb-3 font-mono">⚠️ UNEXPECTED LOSERS</h3>

        {/* Losers list */}
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {losers.map((loser, idx) => (
            <motion.div
              key={loser.entityId}
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (winners.length + idx) * 0.1 }}
            >
              <p className="text-sm font-bold text-red-300 truncate">{loser.name}</p>
              <motion.p
                className="text-lg font-bold text-red-400 font-mono"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, delay: (winners.length + idx) * 0.1 }}
              >
                -{counter[loser.entityId] || 0}%
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Burst particle effect on entrance */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              background: ["#00ffff", "#ff0080", "#ffff00"][particle.id % 3],
              boxShadow: `0 0 8px ${["#00ffff", "#ff0080", "#ffff00"][particle.id % 3]}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: particle.x, y: particle.y, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

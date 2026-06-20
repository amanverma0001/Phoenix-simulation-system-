"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

interface ChaosOverlayProps {
  active: boolean
}

export default function ChaosOverlay({ active }: ChaosOverlayProps) {
  useEffect(() => {
    if (active) {
      document.body.style.filter = "hue-rotate(360deg)"
      const timer = setInterval(() => {
        document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`
      }, 100)
      return () => clearInterval(timer)
    } else {
      document.body.style.filter = "hue-rotate(0deg)"
    }
  }, [active])

  if (!active) return null

  return (
    <motion.div className="fixed inset-0 pointer-events-none z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Rainbow glitch overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)`,
          opacity: 0.05,
          animation: "glitch 200ms infinite",
        }}
      />

      {/* Floating message */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white/80 text-center font-mono"
        animate={{
          opacity: [1, 0.5],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
      >
        REALITY LIMITS DISABLED
      </motion.div>
    </motion.div>
  )
}

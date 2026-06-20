"use client"

import { motion } from "framer-motion"

interface DeveloperViewProps {
  active: boolean
}

export default function DeveloperView({ active }: DeveloperViewProps) {
  if (!active) return null

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-black/80 border-2 border-cyan-400 rounded-lg p-4 font-mono text-xs text-cyan-300 z-50 max-w-xs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="font-bold text-cyan-400 mb-2">DEV MODE ACTIVE</div>
      <div className="space-y-1">
        <div>System Memory: {(Math.random() * 512).toFixed(1)}MB</div>
        <div>Render FPS: {Math.floor(50 + Math.random() * 10)}</div>
        <div>Audio Context: Active</div>
        <div>Particles: {Math.floor(Math.random() * 1000 + 500)}</div>
        <div>Canvas Layers: 3</div>
      </div>
    </motion.div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TitleWithVisualizerProps {
  children: string
}

export default function TitleWithVisualizer({ children }: TitleWithVisualizerProps) {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [audioLevels, setAudioLevels] = useState(Array(8).fill(0.3))

  // Typewriter effect
  useEffect(() => {
    if (isTyping && displayText.length < children.length) {
      const timer = setTimeout(() => {
        setDisplayText(children.slice(0, displayText.length + 1))
      }, 50)
      return () => clearTimeout(timer)
    } else if (displayText.length === children.length) {
      setIsTyping(false)
    }
  }, [displayText, children, isTyping])

  // Fake audio visualizer animation
  useEffect(() => {
    if (!isTyping) return

    const interval = setInterval(() => {
      setAudioLevels((prev) => prev.map(() => 0.2 + Math.random() * 0.8))
    }, 100)

    return () => clearInterval(interval)
  }, [isTyping])

  return (
    <div className="relative inline-flex items-center gap-4">
      {/* Audio visualizer bars */}
      <div className="flex items-end gap-1 h-12">
        {audioLevels.map((level, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-cyan-400 to-magenta-400 rounded-full"
            animate={{ height: `${20 + level * 20}px` }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>

      {/* Title text */}
      <div className="title-rgb-split text-3xl font-bold text-white">
        {displayText}
      </div>

      {/* Corner brackets */}
      <motion.div
        className="absolute -left-8 top-0 text-cyan-400/60 text-2xl font-bold"
        animate={{ opacity: [0.6, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        ▌
      </motion.div>
      <motion.div
        className="absolute -right-8 bottom-0 text-magenta-400/60 text-2xl font-bold"
        animate={{ opacity: [0.6, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        ▐
      </motion.div>
    </div>
  )
}

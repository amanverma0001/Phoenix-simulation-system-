"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function StatusBar() {
  const [systemStats, setSystemStats] = useState({
    cpu: 73,
    mem: 8.2,
    netUp: 145,
    netDown: 89,
  })

  const [dateTime, setDateTime] = useState("---- . -- . -- | --:--:-- UTC")

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(50 + Math.random() * 50),
        mem: 7 + Math.random() * 2,
        netUp: Math.floor(100 + Math.random() * 200),
        netDown: Math.floor(50 + Math.random() * 150),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update date/time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")
      setDateTime(`${year}.${month}.${day} | ${hours}:${minutes}:${seconds} UTC`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-7 bg-black/80 border-b border-cyan-500/10 flex items-center justify-between px-4 font-mono text-[10px] text-cyan-500/70 backdrop-blur-3xl tracking-tighter shadow-[0_1px_10px_rgba(0,255,255,0.05)]">
      {/* Left - System Status */}
      <div className="flex items-center gap-2">
        <motion.span
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ opacity: [1, 0.5] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
        />
        <span>SYSTEM ONLINE</span>
      </div>

      {/* Center - Scrolling stats */}
      <motion.div
        className="flex-1 mx-8 overflow-hidden relative h-full flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ x: [0, -500] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
          className="whitespace-nowrap"
        >
          CPU: {systemStats.cpu.toFixed(0)}% | MEM: {systemStats.mem.toFixed(1)}GB | NET: ↑{systemStats.netUp}MB ↓
          {systemStats.netDown}MB
        </motion.div>
      </motion.div>

      {/* Right - Date/Time */}
      <div className="text-cyan-300">{dateTime}</div>
    </div>
  )
}

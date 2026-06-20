"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Handshake, Zap } from "lucide-react"
import { useParticleSystem } from "@/lib/useParticleSystem"

interface ActionButtonsProps {
  onActionClick: (action: string) => void
  isDisabled: boolean
  onActionHover?: (actionId: string | null) => void
}

const actions = [
  {
    id: "sanction",
    text: "SANCTION RUSSIA",
    icon: AlertTriangle,
    color: "text-red-500",
    borderColor: "#ff0040",
    hoverColor: "#ff0040",
    particleColor: "rgb(255, 0, 64)",
  },
  {
    id: "sanction_china",
    text: "SANCTION CHINA",
    icon: AlertTriangle,
    color: "text-orange-500",
    borderColor: "#ff4000",
    hoverColor: "#ff4000",
    particleColor: "rgb(255, 64, 0)",
  },
  {
    id: "sanction_usa",
    text: "SANCTION USA",
    icon: AlertTriangle,
    color: "text-blue-500",
    borderColor: "#0040ff",
    hoverColor: "#0040ff",
    particleColor: "rgb(0, 64, 255)",
  },
  {
    id: "alliance",
    text: "FORM ALLIANCE",
    icon: Handshake,
    color: "text-cyan-400",
    borderColor: "#00ffff",
    hoverColor: "#00ffff",
    particleColor: "rgb(0, 255, 255)",
  },
  {
    id: "blockade",
    text: "ENERGY BLOCKADE",
    icon: Zap,
    color: "text-yellow-400",
    borderColor: "#ffff00",
    hoverColor: "#ffff00",
    particleColor: "rgb(255, 255, 0)",
  },
]

export default function ActionButtons({ onActionClick, isDisabled, onActionHover }: ActionButtonsProps) {
  const [disabled, setDisabled] = useState<string | null>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleId = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { canvasRef, emit } = useParticleSystem()

  const handleClick = (actionId: string, action: (typeof actions)[0], e: React.MouseEvent) => {
    if (isDisabled || disabled) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { id: rippleId.current++, x, y }
    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)

    emit(e.clientX, e.clientY, {
      count: 20,
      colors: [action.particleColor],
      speed: 150,
      spread: 360,
      size: 3,
      life: 100,
    })

    document.body.classList.add("shake")
    setTimeout(() => document.body.classList.remove("shake"), 500)

    onActionClick(actionId)
    setDisabled(actionId)
    setTimeout(() => setDisabled(null), 1000)
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <div ref={containerRef} className="w-full flex flex-col gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          const isButtonDisabled = isDisabled || disabled === action.id

          return (
            <motion.div key={action.id} className="relative" whileHover={!isButtonDisabled ? { y: -1 } : {}}>
              <button
                onMouseEnter={() => !isButtonDisabled && onActionHover?.(action.id)}
                onMouseLeave={() => onActionHover?.(null)}
                onClick={(e) => handleClick(action.id, action, e)}
                disabled={isButtonDisabled}
                className="relative w-full py-4 px-5 font-mono uppercase text-[11px] font-black tracking-[0.2em]
                  flex items-center justify-between gap-3 transition-all duration-300 rounded-xl overflow-hidden
                  group border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                style={{
                  background: isButtonDisabled
                    ? 'rgba(255,255,255,0.02)'
                    : `linear-gradient(135deg, ${action.borderColor}08 0%, transparent 100%)`,
                  height: "58px",
                }}
              >
                {/* Premium Glass Background */}
                <div className="absolute inset-0 glass-premium opacity-50 group-hover:opacity-80 transition-opacity" />

                {/* Scanning Light Sweep - Sharper and more physical */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-40 z-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${action.borderColor}40, white, ${action.borderColor}40, transparent)`,
                    width: '40%',
                    filter: 'blur(15px)',
                  }}
                  animate={{
                    x: ["-150%", "350%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Cyberpunk Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 transition-all group-hover:border-white/60" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 transition-all group-hover:border-white/60" />

                {/* Side indicator */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full transition-all duration-300"
                  style={{
                    backgroundColor: isButtonDisabled ? 'rgba(255,255,255,0.1)' : action.borderColor,
                    boxShadow: isButtonDisabled ? 'none' : `0 0 10px ${action.borderColor}`
                  }}
                />

                {/* Left Content */}
                <div className="relative z-20 flex items-center gap-4">
                  <motion.div
                    className="p-2 rounded-lg bg-white/5 border border-white/5"
                    whileHover={!isButtonDisabled ? { scale: 1.1, rotate: [0, -10, 10, 0] } : {}}
                  >
                    <Icon
                      size={16}
                      style={{
                        color: isButtonDisabled ? 'rgba(255,255,255,0.2)' : action.borderColor,
                        filter: isButtonDisabled ? 'none' : `drop-shadow(0 0 8px ${action.borderColor}80)`
                      }}
                    />
                  </motion.div>
                  <span
                    className={`transition-all duration-300 ${isButtonDisabled ? 'text-white/20' : 'text-white/80 group-hover:text-white'}`}
                    style={{
                      textShadow: !isButtonDisabled ? `0 0 10px ${action.borderColor}40` : 'none'
                    }}
                  >
                    {action.text}
                  </span>
                </div>

                {/* Status Indicator / Right Decoration */}
                <div className="relative z-20 flex items-center gap-2">
                  <div className={`text-[8px] font-mono tracking-widest ${isButtonDisabled ? 'text-white/10' : 'text-cyan-500/40'}`}>
                    {isButtonDisabled ? 'LOCKED' : 'READY'}
                  </div>
                  {!isButtonDisabled && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: action.borderColor, boxShadow: `0 0 8px ${action.borderColor}` }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Ripple effects */}
                {ripples.map((ripple) => (
                  <motion.div
                    key={ripple.id}
                    className="ripple"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 10,
                      height: 10,
                      marginLeft: -5,
                      marginTop: -5,
                      background: action.borderColor
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 8, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                ))}
              </button>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

"use client"

import { useEffect, useRef } from "react"

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

export const useParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      // Clear canvas completely for transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.5 // Gravity
        particle.life -= 1

        const opacity = particle.life / particle.maxLife
        ctx.fillStyle = particle.color.replace(")", `,${opacity})`).replace("rgb", "rgba")
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const emit = (
    x: number,
    y: number,
    options: {
      count?: number
      colors?: string[]
      speed?: number
      spread?: number
      size?: number
      life?: number
    },
  ) => {
    const { count = 10, colors = ["rgb(0, 255, 255)"], speed = 5, spread = 360, size = 2, life = 100 } = options

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * (spread * (Math.PI / 180))
      const velocity = speed + Math.random() * 2

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life,
        maxLife: life,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
  }

  return { canvasRef, emit }
}

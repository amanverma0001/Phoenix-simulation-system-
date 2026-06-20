"use client"

import { useEffect } from "react"

interface MatrixRainProps {
  active: boolean
}

export default function MatrixRain({ active }: MatrixRainProps) {
  useEffect(() => {
    if (!active) return

    const canvas = document.createElement("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = "fixed"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.zIndex = "39"
    canvas.style.pointerEvents = "none"
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")!
    const chars = "ｦｧｨｩｪｫｬｭｮｯﾰﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ".split("")
    const drops: number[] = []

    for (let i = 0; i < canvas.width / 16; i++) {
      drops[i] = Math.random() * canvas.height
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00ff00"
      ctx.font = "16px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * 16, drops[i])

        drops[i]++
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
      }

      requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.remove()
    }
  }, [active])

  return null
}

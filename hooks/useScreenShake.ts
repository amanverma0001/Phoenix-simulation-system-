"use client"

import { useRef, useCallback } from "react"

export default function useScreenShake() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const triggerShake = useCallback(() => {
    const container = document.querySelector("body")
    if (!container) return

    container.classList.add("shake")
    setTimeout(() => {
      container.classList.remove("shake")
    }, 500)
  }, [])

  return { triggerShake }
}

"use client"

import { useEffect, useState, useCallback } from "react"

interface EasterEggState {
  chaosMode: boolean
  matrixMode: boolean
  developerView: boolean
}

interface EasterEggActions {
  triggerChaosMode: () => void
  triggerMatrixMode: () => void
  triggerDeveloperView: () => void
  triggerInstantCollapse: () => void
}

export function useEasterEggs(
  onChaosMode?: (enabled: boolean) => void,
  onMatrixMode?: (enabled: boolean) => void,
  onDeveloperView?: (enabled: boolean) => void,
  onInstantCollapse?: () => void,
): EasterEggState & EasterEggActions {
  const [state, setState] = useState<EasterEggState>({
    chaosMode: false,
    matrixMode: false,
    developerView: false,
  })

  const triggerChaosMode = useCallback(() => {
    setState((prev) => ({ ...prev, chaosMode: !prev.chaosMode }))
    onChaosMode?.(!state.chaosMode)
  }, [state.chaosMode, onChaosMode])

  const triggerMatrixMode = useCallback(() => {
    setState((prev) => ({ ...prev, matrixMode: !prev.matrixMode }))
    onMatrixMode?.(!state.matrixMode)
  }, [state.matrixMode, onMatrixMode])

  const triggerDeveloperView = useCallback(() => {
    setState((prev) => ({ ...prev, developerView: !prev.developerView }))
    onDeveloperView?.(!state.developerView)
  }, [state.developerView, onDeveloperView])

  const triggerInstantCollapse = useCallback(() => {
    onInstantCollapse?.()
  }, [onInstantCollapse])

  // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ]
    let konamiIndex = 0

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key === "b" || e.key === "B" ? "b" : e.key === "a" || e.key === "A" ? "a" : e.code

      if (key === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          triggerChaosMode()
          konamiIndex = 0
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [triggerChaosMode])

  // Type "FRACTURE" to trigger instant collapse
  useEffect(() => {
    let fractureBuffer = ""

    const handleKeyPress = (e: KeyboardEvent) => {
      fractureBuffer += (e.key || "").toUpperCase()
      if (fractureBuffer.includes("FRACTURE")) {
        triggerInstantCollapse()
        fractureBuffer = ""
      }
      if (fractureBuffer.length > 8) {
        fractureBuffer = fractureBuffer.slice(-8)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [triggerInstantCollapse])

  return {
    ...state,
    triggerChaosMode,
    triggerMatrixMode,
    triggerDeveloperView,
    triggerInstantCollapse,
  }
}

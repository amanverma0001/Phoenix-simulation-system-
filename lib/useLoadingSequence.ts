"use client"

import { useState, useEffect } from "react"

export interface LoadingStep {
  stage: number
  message: string
  progress: number
  active: boolean
}

export function useLoadingSequence(onComplete?: () => void) {
  const [steps, setSteps] = useState<LoadingStep[]>([
    { stage: 1, message: "LOADING GEOPOLITICAL MATRIX...", progress: 0, active: true },
    { stage: 1, message: "SCANNING DEPENDENCY GRAPHS...", progress: 0, active: false },
    { stage: 1, message: "CALIBRATING EMERGENCE DETECTOR...", progress: 0, active: false },
    { stage: 1, message: "REALITY ENGINE ONLINE...", progress: 0, active: false },
    { stage: 2, message: "INITIALIZING COORDINATE SYSTEM...", progress: 0, active: false },
    { stage: 3, message: "REVEALING USER INTERFACE...", progress: 0, active: false },
  ])

  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isComplete) return

    let currentStep = 0
    const stepDuration = 400
    const totalSteps = steps.length

    const interval = setInterval(() => {
      currentStep++
      const stepProgress = Math.min(currentStep / totalSteps, 1)
      setProgress(stepProgress)

      setSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          active: idx === currentStep - 1,
          progress: idx < currentStep ? 100 : idx === currentStep - 1 ? 50 : 0,
        })),
      )

      if (currentStep >= totalSteps) {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [isComplete, onComplete])

  return {
    steps,
    progress,
    isComplete,
  }
}

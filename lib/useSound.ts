"use client"

import { useEffect, useRef, useCallback } from "react"

// Sound definitions with Web Audio API synthesis
interface Sound {
  name: string
  play: () => void
  stop: () => void
  setVolume: (volume: number) => void
}

export default function useSound(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainsRef = useRef<Map<string, GainNode>>(new Map())
  const soundsRef = useRef<Map<string, Sound>>(new Map())

  // Initialize audio context
  useEffect(() => {
    if (typeof window === "undefined") return

    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    // Initialize on first user interaction
    const handleInteraction = () => {
      initAudio()
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("keydown", handleInteraction)

    return () => {
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
    }
  }, [])

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!enabled || !audioContextRef.current) return

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()

      oscillator.frequency.value = frequency
      oscillator.type = type
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.connect(gain)
      gain.connect(ctx.destination)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    },
    [enabled],
  )

  const playSound = useCallback(
    (soundName: string) => {
      if (!enabled) return

      switch (soundName) {
        case "button":
          playTone(800, 0.1, "sine")
          break
        case "click":
          playTone(1200, 0.05, "square")
          break
        case "toggle":
          playTone(600, 0.08, "sine")
          playTone(800, 0.08, "sine")
          break
        case "panel":
          playTone(400, 0.3, "sine")
          break
        case "glassBrake":
          // Burst of noise effect
          if (audioContextRef.current) {
            const ctx = audioContextRef.current
            const bufferSize = ctx.sampleRate * 0.5
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1
            }
            const source = ctx.createBufferSource()
            source.buffer = buffer
            const gain = ctx.createGain()
            gain.gain.setValueAtTime(0.1, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
            source.connect(gain)
            gain.connect(ctx.destination)
            source.start(ctx.currentTime)
          }
          playTone(100, 0.2, "sine")
          break
        case "success":
          playTone(400, 0.15, "sine")
          playTone(600, 0.15, "sine")
          playTone(800, 0.2, "sine")
          break
        case "alarm":
          playTone(800, 0.1, "sine")
          playTone(600, 0.1, "sine")
          break
        default:
          break
      }
    },
    [enabled, playTone],
  )

  const startAmbience = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.frequency.value = 40
    osc.type = "sine"
    gain.gain.setValueAtTime(0.01, ctx.currentTime)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()

    oscillatorsRef.current.push(osc)
    gainsRef.current.set("ambience", gain)
  }, [enabled])

  const stopAmbience = useCallback(() => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop()
      } catch (e) {}
    })
    oscillatorsRef.current = []
  }, [])

  const setMasterVolume = useCallback((volume: number) => {
    gainsRef.current.forEach((gain) => {
      gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioContextRef.current?.currentTime || 0)
    })
  }, [])

  return {
    playSound,
    startAmbience,
    stopAmbience,
    setMasterVolume,
  }
}

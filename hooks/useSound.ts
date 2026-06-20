"use client"

import { useEffect, useRef, useCallback } from "react"

export type SoundType =
  | "button"
  | "alert"
  | "glassBrake"
  | "click"
  | "glitch"
  | "toggle"
  | "success"
  | "panel"
  | "crush"
  // New timeline-driven sounds
  | "tensionRumble"
  | "warningBeep"
  | "glassCrack"
  | "explosionSequence"
  | "debrisSettle"
  | "etherealReveal"
  | "darkAmbient"
  | "threshold_warning"
  | "action"
  | "impact"
  | "reset";

export default function useSound(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainsRef = useRef<Map<string, GainNode>>(new Map())
  const activeNodesRef = useRef<AudioNode[]>([])
  const stabilityFilterRef = useRef<BiquadFilterNode | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window === "undefined") return

    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

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
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.1) => {
      if (!enabled || !audioContextRef.current) return

      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()

      oscillator.frequency.value = frequency
      oscillator.type = type
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.connect(gain)
      gain.connect(ctx.destination)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    },
    [enabled],
  )

  // Create noise buffer for impact sounds
  const createNoiseBuffer = useCallback((ctx: AudioContext, duration: number) => {
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }, [])

  // Play sub-bass rumble (20Hz) - T=0.0s
  const playTensionRumble = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Deep 20Hz rumble
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.frequency.setValueAtTime(20, ctx.currentTime)
    osc.type = "sine"
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.5)
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1.5)

    // Add second harmonic for richness
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.frequency.setValueAtTime(40, ctx.currentTime)
    osc2.type = "sine"
    gain2.gain.setValueAtTime(0.15, ctx.currentTime)
    gain2.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime)
    osc2.stop(ctx.currentTime + 1.5)
  }, [enabled])

  // Play warning beeps - T=0.5s
  const playWarningBeep = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Repeating alert beeps
    const beepFrequencies = [1200, 1000, 1200]
    const beepTiming = [0, 0.15, 0.30]

    beepFrequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.frequency.value = freq
      osc.type = "square"
      gain.gain.setValueAtTime(0.15, ctx.currentTime + beepTiming[i])
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + beepTiming[i] + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + beepTiming[i])
      osc.stop(ctx.currentTime + beepTiming[i] + 0.1)
    })
  }, [enabled])

  // Play glass crack sound - T=1.6s
  const playGlassCrack = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // High frequency crystalline crack
    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      // Exponential decay with high frequency noise
      const decay = Math.exp(-i / (ctx.sampleRate * 0.05))
      data[i] = (Math.random() * 2 - 1) * decay
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // High-pass filter for glass-like sound
    const filter = ctx.createBiquadFilter()
    filter.type = "highpass"
    filter.frequency.value = 3000
    filter.Q.value = 2

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.4, ctx.currentTime)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(ctx.currentTime)

    // Add resonant crack
    const crackOsc = ctx.createOscillator()
    const crackGain = ctx.createGain()
    crackOsc.frequency.setValueAtTime(4000, ctx.currentTime)
    crackOsc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15)
    crackOsc.type = "sine"
    crackGain.gain.setValueAtTime(0.2, ctx.currentTime)
    crackGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    crackOsc.connect(crackGain)
    crackGain.connect(ctx.destination)
    crackOsc.start(ctx.currentTime)
    crackOsc.stop(ctx.currentTime + 0.15)
  }, [enabled])

  // Play massive explosion sequence - T=2.0s
  const playExplosionSequence = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Layer 1: Glass shatter (white noise burst with high-pass)
    const glassBuffer = createNoiseBuffer(ctx, 0.8)
    const glassSource = ctx.createBufferSource()
    glassSource.buffer = glassBuffer

    const glassFilter = ctx.createBiquadFilter()
    glassFilter.type = "highpass"
    glassFilter.frequency.value = 2500

    const glassGain = ctx.createGain()
    glassGain.gain.setValueAtTime(0.7, ctx.currentTime)
    glassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    glassSource.connect(glassFilter)
    glassFilter.connect(glassGain)
    glassGain.connect(ctx.destination)
    glassSource.start(ctx.currentTime)

    // Layer 2: Bass drop (sub-bass sweep)
    const bassOsc = ctx.createOscillator()
    const bassGain = ctx.createGain()
    bassOsc.frequency.setValueAtTime(80, ctx.currentTime)
    bassOsc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5)
    bassOsc.type = "sine"
    bassGain.gain.setValueAtTime(0.8, ctx.currentTime)
    bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
    bassOsc.connect(bassGain)
    bassGain.connect(ctx.destination)
    bassOsc.start(ctx.currentTime)
    bassOsc.stop(ctx.currentTime + 0.8)

    // Layer 3: Sub-bass (20Hz rumble that rattles speakers)
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.frequency.value = 20
    subOsc.type = "sine"
    subGain.gain.setValueAtTime(0.6, ctx.currentTime)
    subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0)
    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subOsc.start(ctx.currentTime)
    subOsc.stop(ctx.currentTime + 1.0)

    // Layer 4: Impact (low noise burst)
    const impactBuffer = createNoiseBuffer(ctx, 0.3)
    const impactSource = ctx.createBufferSource()
    impactSource.buffer = impactBuffer

    const impactFilter = ctx.createBiquadFilter()
    impactFilter.type = "lowpass"
    impactFilter.frequency.value = 400

    const impactGain = ctx.createGain()
    impactGain.gain.setValueAtTime(0.9, ctx.currentTime + 0.05)
    impactGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)

    impactSource.connect(impactFilter)
    impactFilter.connect(impactGain)
    impactGain.connect(ctx.destination)
    impactSource.start(ctx.currentTime + 0.05)

    // Layer 5: Additional crackle (high frequency particles)
    const crackleBuffer = createNoiseBuffer(ctx, 0.6)
    const crackleSource = ctx.createBufferSource()
    crackleSource.buffer = crackleBuffer

    const crackleGain = ctx.createGain()
    crackleGain.gain.setValueAtTime(0.3, ctx.currentTime)
    crackleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

    crackleSource.connect(crackleGain)
    crackleGain.connect(ctx.destination)
    crackleSource.start(ctx.currentTime + 0.1)
  }, [enabled, createNoiseBuffer])

  // Play debris settling sounds - T=2.0s-3.0s
  const playDebrisSettle = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Low frequency rumbles fading out
    const rumbleOsc = ctx.createOscillator()
    const rumbleGain = ctx.createGain()
    rumbleOsc.frequency.value = 35
    rumbleOsc.type = "sine"
    rumbleGain.gain.setValueAtTime(0.15, ctx.currentTime)
    rumbleGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5)
    rumbleOsc.connect(rumbleGain)
    rumbleGain.connect(ctx.destination)
    rumbleOsc.start(ctx.currentTime)
    rumbleOsc.stop(ctx.currentTime + 1.5);

    // Scattered impact sounds
    [0.2, 0.5, 0.8, 1.1].forEach((delay: number) => {
      const buffer = createNoiseBuffer(ctx, 0.1)
      const source = ctx.createBufferSource()
      source.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = "lowpass"
      filter.frequency.value = 300 + Math.random() * 200

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.05 + Math.random() * 0.05, ctx.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(ctx.currentTime + delay)
    })
  }, [enabled, createNoiseBuffer])

  // Play ethereal reveal chime - T=3.0s
  const playEtherealReveal = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Ascending harmonics
    const frequencies = [440, 554, 659, 880, 1047, 1319]

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.frequency.value = freq
      osc.type = "sine"

      const startTime = ctx.currentTime + i * 0.08
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.1 - i * 0.012, startTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.0)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 1.0)
    })

    // Shimmer effect
    const shimmerOsc = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmerOsc.frequency.value = 2000
    shimmerOsc.type = "sine"
    shimmerGain.gain.setValueAtTime(0.02, ctx.currentTime)
    shimmerGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
    shimmerOsc.connect(shimmerGain)
    shimmerGain.connect(ctx.destination)
    shimmerOsc.start(ctx.currentTime)
    shimmerOsc.stop(ctx.currentTime + 0.8)
  }, [enabled])

  // Play dark ambient loop - T=3.5s+
  const playDarkAmbient = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Low drone
    const droneOsc = ctx.createOscillator()
    const droneGain = ctx.createGain()
    droneOsc.frequency.value = 55
    droneOsc.type = "sine"
    droneGain.gain.setValueAtTime(0, ctx.currentTime)
    droneGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2)
    droneOsc.connect(droneGain)
    droneGain.connect(ctx.destination)
    droneOsc.start(ctx.currentTime)

    activeNodesRef.current.push(droneOsc, droneGain)
  }, [enabled])

  const playSound = useCallback(
    (soundType: SoundType) => {
      if (!enabled) return

      switch (soundType) {
        case "button":
          playTone(800, 0.1, "sine")
          break
        case "click":
          playTone(1200, 0.05, "square", 0.05)
          break
        case "toggle":
          playTone(600, 0.08, "sine")
          setTimeout(() => playTone(800, 0.08, "sine"), 50)
          break
        case "alert":
          playTone(1200, 0.2, "square", 0.1)
          setTimeout(() => playTone(1000, 0.2, "square", 0.1), 100)
          break
        case "glassBrake":
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
        case "glitch":
          playTone(600, 0.05, "square")
          setTimeout(() => playTone(900, 0.05, "square"), 60)
          break
        case "success":
          playTone(400, 0.15, "sine")
          setTimeout(() => playTone(600, 0.15, "sine"), 100)
          setTimeout(() => playTone(800, 0.2, "sine"), 200)
          break
        case "panel":
          playTone(400, 0.3, "sine", 0.05)
          break
        case "crush":
          if (audioContextRef.current) {
            const ctx = audioContextRef.current
            // Low frequency rumble
            const osc1 = ctx.createOscillator()
            const gain1 = ctx.createGain()
            osc1.frequency.setValueAtTime(50, ctx.currentTime)
            osc1.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 1)
            gain1.gain.setValueAtTime(0.5, ctx.currentTime)
            gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
            osc1.connect(gain1)
            gain1.connect(ctx.destination)
            osc1.start()
            osc1.stop(ctx.currentTime + 1)

            // Noise burst
            const bufferSize = ctx.sampleRate * 0.5
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
              data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1))
            }
            const noise = ctx.createBufferSource()
            noise.buffer = buffer
            const noiseGain = ctx.createGain()
            noiseGain.gain.setValueAtTime(0.3, ctx.currentTime)
            noise.connect(noiseGain)
            noiseGain.connect(ctx.destination)
            noise.start()
          }
          break
        // New timeline-driven sounds
        case "tensionRumble":
          playTensionRumble()
          break
        case "warningBeep":
          playWarningBeep()
          break
        case "glassCrack":
          playGlassCrack()
          break
        case "explosionSequence":
          playExplosionSequence()
          break
        case "debrisSettle":
          playDebrisSettle()
          break
        case "etherealReveal":
          playEtherealReveal()
          break
        case "darkAmbient":
          playDarkAmbient()
          break
      }
    },
    [enabled, playTone, playTensionRumble, playWarningBeep, playGlassCrack,
      playExplosionSequence, playDebrisSettle, playEtherealReveal, playDarkAmbient],
  )

  const startAmbience = useCallback(() => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.frequency.value = 40
    osc.type = "sine"
    gain.gain.setValueAtTime(0.02, ctx.currentTime)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()

    oscillatorsRef.current.push(osc)
    gainsRef.current.set("ambience", gain)
  }, [enabled])

  const setStability = useCallback((stability: number) => {
    if (!audioContextRef.current || !enabled) return
    const ctx = audioContextRef.current

    // As stability drops, we add distortion/filter effects
    if (!stabilityFilterRef.current) {
      stabilityFilterRef.current = ctx.createBiquadFilter()
      stabilityFilterRef.current.type = "lowpass"
      stabilityFilterRef.current.frequency.setValueAtTime(20000, ctx.currentTime)
      stabilityFilterRef.current.connect(ctx.destination)

      // Reconnect gains to the filter
      gainsRef.current.forEach(gain => {
        try {
          gain.disconnect()
          gain.connect(stabilityFilterRef.current!)
        } catch (e) { }
      })
    }

    // Dramatically lower low-pass filter as stability drops below 75
    const freq = stability > 75 ? 20000 : Math.max(200, stability * 200)
    stabilityFilterRef.current.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.5)

    // Trigger occasional glitches if stability is low
    if (stability < 75 && Math.random() < (1 - stability / 75) * 0.1) {
      playSound("glitch")
    }
  }, [enabled, playSound])

  const stopAmbience = useCallback(() => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop()
      } catch (e) { }
    })
    oscillatorsRef.current = []

    // Also stop any active nodes
    activeNodesRef.current.forEach((node) => {
      try {
        if (node instanceof OscillatorNode) {
          node.stop()
        }
      } catch (e) { }
    })
    activeNodesRef.current = []
  }, [])

  return { playSound, startAmbience, stopAmbience, setStability }
}

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useEntropy } from "@/lib/EntropyContext"
import { hiddenNews } from "@/lib/HiddenNewsData"

/**
 * useAIVoice - Natural Female Voice Synthesis Hook
 * 
 * Provides the most natural, human-like female voice available
 * by prioritizing premium system voices and natural speech settings.
 */
export function useAIVoice() {
    const [isSupported, setIsSupported] = useState(false)
    const [isEnabled, setIsEnabled] = useState(true)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const synthRef = useRef<SpeechSynthesis | null>(null)
    const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            synthRef.current = window.speechSynthesis
            setIsSupported(true)

            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices()

                // Priority list for most natural-sounding female voices
                // These are premium neural/natural voices on various systems
                const naturalVoicePriority = [
                    'Samantha',           // macOS - very natural
                    'Google UK English Female',  // Chrome - high quality
                    'Microsoft Zira',     // Windows - good quality
                    'Google US English',  // Chrome fallback
                    'Ava',                // macOS premium
                    'Karen',              // macOS Australian
                    'Moira',              // macOS Irish
                    'Tessa',              // macOS South African
                    'Victoria',           // macOS
                    'Fiona',              // macOS Scottish
                    'Female',             // Generic female
                ]

                // Find the best available voice
                let selectedVoice = null
                for (const voiceName of naturalVoicePriority) {
                    selectedVoice = voices.find(v =>
                        v.name.includes(voiceName) && v.lang.startsWith('en')
                    )
                    if (selectedVoice) break
                }

                // Fallback to any English voice
                voiceRef.current = selectedVoice ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    voices[0]

                console.log('[AIVoice] Using voice:', voiceRef.current?.name, '- Lang:', voiceRef.current?.lang)
            }

            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices
            }
            // Also try loading immediately
            setTimeout(loadVoices, 100)
            loadVoices()
        }
    }, [])

    const { stability } = useEntropy();

    const speak = useCallback((text: string, priority: "normal" | "urgent" = "normal") => {
        if (!isSupported || !isEnabled || !synthRef.current) return

        // Interrupt previous speech if urgent
        if (priority === "urgent") {
            synthRef.current.cancel()
        }

        const utterance = new SpeechSynthesisUtterance(text)
        if (voiceRef.current) {
            utterance.voice = voiceRef.current
        }

        // Dynamic voice degradation based on stability (Keg Principle)
        // Stability 100-80: Pure/Professional
        // Stability 40-60: Strained/Fast
        // Stability < 20: Glitchy/Deep/Erratic

        let pitch = 1.0;
        let rate = 0.95;

        if (stability < 20) {
            // System collapse - deep, distorted, slow or panicked
            pitch = 0.5 + Math.random() * 0.2;
            rate = 0.7 + Math.random() * 0.8;
        } else if (stability <= 60) {
            // Edge of Chaos - nervous, fast, slightly high pitch
            pitch = 1.1 + (60 - stability) * 0.01;
            rate = 1.05 + (60 - stability) * 0.01;
        }

        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        synthRef.current.speak(utterance)
    }, [isSupported, isEnabled])

    const speakWelcome = useCallback(() => {
        speak("Welcome to Fractured World. Simulation systems are now active. Please specify your geopolitical anchor to begin.", "urgent")
    }, [speak])

    const speakHiddenNews = useCallback(() => {
        const randomFact = hiddenNews[Math.floor(Math.random() * hiddenNews.length)]
        speak(`Intelligence Briefing: ${randomFact}`, "normal")
    }, [speak])

    const speakSanction = useCallback((countryName: string) => {
        speak(`System Alert: ${countryName} has been sanctioned. Cascade ripples are propagating through the network.`, "urgent")
    }, [speak])

    const speakCoherenceAlert = useCallback((phase: 'degraded' | 'critical' | 'collapsed') => {
        const alerts = {
            degraded: "Observation: System coherence is degrading. Geopolitical patterns are beginning to deviate from baseline constants.",
            critical: "Warning: Critical coherence breach. The simulation is entering the Keg Zone. Reality consensus is failing.",
            collapsed: "Alert: System collapse imminent. Emergence has overtaken control. Expect non-linear artifacts."
        };
        speak(alerts[phase], "urgent");
    }, [speak]);

    const stop = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel()
            setIsSpeaking(false)
        }
    }, [])

    return {
        isSupported,
        isEnabled,
        isSpeaking,
        setIsEnabled,
        speak,
        speakWelcome,
        speakHiddenNews,
        speakSanction,
        speakCoherenceAlert,
        stop
    }
}

"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { AILiveCommentator } from '@/lib/AIServices';

export interface CommentaryConfig {
    enabled: boolean;
    rate: number;
    pitch: number;
    volume: number;
}

export function useAICommentary(state: any) {
    const [config, setConfig] = useState<CommentaryConfig>({
        enabled: true,
        rate: 0.95,   // Slightly slower for clarity and politeness
        pitch: 1.1,   // Slightly higher for a softer, feminine tone
        volume: 0.9,  // Gentle volume
    });

    const synthesisRef = useRef<SpeechSynthesis | null>(null);
    const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const lastEventCountRef = useRef(0);
    const isShatterNarrationDone = useRef(false);

    // Initialize Speech Synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthesisRef.current = window.speechSynthesis;

            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                // Prefer polite, professional female voices
                const preferred = voices.find(v =>
                    v.name.includes('Samantha') ||
                    v.name.includes('Google UK English Female') ||
                    v.name.includes('Microsoft Zira') ||
                    v.name.includes('Victoria') ||
                    v.name.includes('Karen') ||
                    (v.name.includes('Female') && v.lang.startsWith('en'))
                );
                voiceRef.current = preferred || voices.find(v => v.lang.startsWith('en')) || voices[0];
            };

            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = loadVoices;
            }
            loadVoices();
        }
    }, []);

    const speak = useCallback((text: string, interrupt = false) => {
        if (!config.enabled || !synthesisRef.current || !text) return;

        if (interrupt) {
            synthesisRef.current.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (voiceRef.current) utterance.voice = voiceRef.current;

        utterance.rate = config.rate;
        utterance.pitch = config.pitch;
        utterance.volume = config.volume;

        synthesisRef.current.speak(utterance);
        console.log(`🎙️ AI Commentator: "${text}"`);
    }, [config]);

    // Handle Event Commentary
    useEffect(() => {
        if (!config.enabled || !state.isRunning) return;

        const currentEvents = state.events || [];
        if (currentEvents.length > lastEventCountRef.current) {
            const newEvent = currentEvents[currentEvents.length - 1];

            const triggerCommentary = async () => {
                try {
                    const commentary = await AILiveCommentator.generate({
                        event: newEvent.title || 'Geopolitical Shift',
                        description: newEvent.description || 'System stability is fluctuating.',
                        stability: state.globalStability,
                        intensity: state.globalStability < 80 ? 'crisis' : 'normal'
                    });
                    speak(commentary);
                } catch (e) {
                    console.error('Commentary generation failed:', e);
                }
            };

            triggerCommentary();
            lastEventCountRef.current = currentEvents.length;
        }
    }, [state.events, state.globalStability, state.isRunning, config.enabled, speak]);

    // Handle Shatter/Collapse Climax
    useEffect(() => {
        if (!config.enabled) return;

        if (state.isCollapsed && !isShatterNarrationDone.current) {
            const triggerClimax = async () => {
                try {
                    const commentary = await AILiveCommentator.generate({
                        event: 'SYSTEM SHATTER',
                        description: 'The global stability threshold has been breached. Structural collapse is imminent.',
                        stability: state.globalStability,
                        intensity: 'climax'
                    });
                    speak(commentary, true); // Interrupt for the climax!
                } catch (e) {
                    speak("The system has entered a critical state. Please stand by for further analysis.", true);
                }
            };

            triggerClimax();
            isShatterNarrationDone.current = true;
        } else if (!state.isCollapsed) {
            isShatterNarrationDone.current = false;
        }
    }, [state.isCollapsed, state.globalStability, config.enabled, speak]);

    return {
        config,
        toggleEnabled: () => setConfig(prev => ({ ...prev, enabled: !prev.enabled })),
        setConfig,
        speak
    };
}

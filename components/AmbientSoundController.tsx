"use client"

import React, { useEffect, useRef, useCallback, useState } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { COUNTRY_PROFILES } from "../lib/GeopoliticalDataset"

interface AmbientSoundControllerProps {
    globalStability: number
    isEnabled: boolean
    onToggle: () => void
    lastActionTarget?: string | null
    lastActionType?: 'sanction' | 'collapse' | 'none'
    activeScenario?: string | null
}

export default function AmbientSoundController({
    globalStability,
    isEnabled,
    onToggle,
    lastActionTarget,
    lastActionType,
    activeScenario
}: AmbientSoundControllerProps) {
    const audioContextRef = useRef<AudioContext | null>(null)
    const masterGainRef = useRef<GainNode | null>(null)
    const nodesRef = useRef<AudioNode[]>([])
    const layerGainsRef = useRef<Record<string, GainNode>>({})
    const filtersRef = useRef<Record<string, BiquadFilterNode>>({})
    const distortionRef = useRef<WaveShaperNode | null>(null)
    const pulseTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [isAudioReady, setIsAudioReady] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)

    // Distortion curve helper
    const makeDistortionCurve = (amount: number) => {
        const k = amount;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    };

    const stopAllAudio = useCallback(() => {
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        nodesRef.current.forEach(node => {
            try {
                if (node instanceof OscillatorNode) node.stop();
                node.disconnect();
            } catch { }
        })
        nodesRef.current = [];
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            try { audioContextRef.current.close() } catch { }
        }
        audioContextRef.current = null;
        masterGainRef.current = null;
        layerGainsRef.current = {};
        filtersRef.current = {};
        distortionRef.current = null;
        setIsAudioReady(false);
    }, []);

    const startAudio = useCallback(async () => {
        if (audioContextRef.current) return;

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            // 1. MASTER CHAIN
            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0, ctx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 3); // Increased from 0.7 to 0.9
            masterGain.connect(ctx.destination);
            masterGainRef.current = masterGain;

            const globalFilter = ctx.createBiquadFilter();
            globalFilter.type = 'lowpass';
            globalFilter.frequency.setValueAtTime(15000, ctx.currentTime);
            globalFilter.connect(masterGain);
            filtersRef.current.global = globalFilter;

            const globalDistortion = ctx.createWaveShaper();
            globalDistortion.curve = makeDistortionCurve(0);
            globalDistortion.connect(globalFilter);
            distortionRef.current = globalDistortion;

            // 2. LAYER 1: ORBITAL ATMOSPHERE (Deep Drones)
            const orbitalGain = ctx.createGain();
            orbitalGain.gain.setValueAtTime(0.15, ctx.currentTime);
            orbitalGain.connect(globalDistortion);
            layerGainsRef.current.orbital = orbitalGain;

            [87.31, 130.81, 196.00].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = i === 0 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                const lfo = ctx.createOscillator();
                const lfoG = ctx.createGain();
                lfo.frequency.setValueAtTime(0.05 + i * 0.02, ctx.currentTime);
                lfoG.gain.setValueAtTime(0.02, ctx.currentTime);
                lfo.connect(lfoG);
                lfoG.connect(g.gain);
                lfo.start();

                g.gain.setValueAtTime(0.06, ctx.currentTime);
                osc.connect(g);
                g.connect(orbitalGain);
                osc.start();
                nodesRef.current.push(osc, g, lfo, lfoG);
            });

            // 3. LAYER 2: DATA PULSE
            const pulseGain = ctx.createGain();
            pulseGain.gain.setValueAtTime(0, ctx.currentTime);
            pulseGain.connect(globalDistortion);
            layerGainsRef.current.pulse = pulseGain;

            const playPulse = () => {
                if (!audioContextRef.current || !isEnabled || !layerGainsRef.current.pulse) return;
                const now = audioContextRef.current.currentTime;
                // Stability relative speed: 100% -> 1s, 0% -> 0.3s
                const bpm = 60 + (100 - globalStability) * 0.7;
                const interval = (60 / bpm) * 1000;

                const osc = audioContextRef.current.createOscillator();
                const g = audioContextRef.current.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200 + Math.random() * 800, now);
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.03, now + 0.005);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.connect(g);
                g.connect(layerGainsRef.current.pulse);
                osc.start(now);
                osc.stop(now + 0.1);

                pulseTimerRef.current = setTimeout(playPulse, interval);
            };
            playPulse();

            // 4. LAYER 3: ORACLE SWELLS
            const oracleGain = ctx.createGain();
            oracleGain.gain.setValueAtTime(0.08, ctx.currentTime);
            oracleGain.connect(globalDistortion);
            layerGainsRef.current.oracle = oracleGain;

            // 5. LAYER 4: TENSION (Braams)
            const tensionGain = ctx.createGain();
            tensionGain.gain.setValueAtTime(0, ctx.currentTime);
            tensionGain.connect(masterGain);
            layerGainsRef.current.tension = tensionGain;

            const tOsc = ctx.createOscillator();
            const tG = ctx.createGain();
            tOsc.type = 'sawtooth';
            tOsc.frequency.setValueAtTime(35, ctx.currentTime);
            const tFilter = ctx.createBiquadFilter();
            tFilter.type = 'lowpass';
            tFilter.frequency.setValueAtTime(100, ctx.currentTime);
            tOsc.connect(tFilter);
            tFilter.connect(tG);
            tG.connect(tensionGain);
            tG.gain.setValueAtTime(0.1, ctx.currentTime);
            tOsc.start();
            nodesRef.current.push(tOsc, tG, tFilter);

            // 6. LAYER 5: STATIC
            const staticGain = ctx.createGain();
            staticGain.gain.setValueAtTime(0, ctx.currentTime);
            staticGain.connect(masterGain);
            layerGainsRef.current.static = staticGain;

            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const staticSource = ctx.createBufferSource();
            staticSource.buffer = noiseBuffer;
            staticSource.loop = true;
            const staticFilter = ctx.createBiquadFilter();
            staticFilter.type = 'bandpass';
            staticFilter.frequency.setValueAtTime(1200, ctx.currentTime);
            staticSource.connect(staticFilter);
            staticFilter.connect(staticGain);
            staticSource.start();
            nodesRef.current.push(staticSource, staticFilter);

            setIsAudioReady(true);
        } catch (err) {
            console.error('[AmbientSound] Architecture failure:', err);
        }
    }, [isEnabled, globalStability]);

    // Update triggers
    useEffect(() => {
        if (!isAudioReady || !audioContextRef.current || !isEnabled || !lastActionTarget) return;
        const now = audioContextRef.current.currentTime;

        const osc = audioContextRef.current.createOscillator();
        const g = audioContextRef.current.createGain();
        osc.frequency.setValueAtTime(1500, now);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.04, now + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        osc.connect(g);
        g.connect(layerGainsRef.current.oracle!);
        osc.start(now);
        osc.stop(now + 1.5);
    }, [lastActionTarget, isAudioReady, isEnabled]);

    // Parameter Mapping
    useEffect(() => {
        if (!isAudioReady || !audioContextRef.current || !isEnabled) return;
        const now = audioContextRef.current.currentTime;

        if (filtersRef.current.global) {
            const freq = Math.max(300, 300 + (globalStability * globalStability * 0.2));
            filtersRef.current.global.frequency.setTargetAtTime(freq, now, 2);
        }

        if (distortionRef.current) {
            const dist = globalStability < 50 ? (50 - globalStability) * 1.2 : 0;
            distortionRef.current.curve = makeDistortionCurve(dist);
        }

        if (layerGainsRef.current.pulse) {
            const vol = globalStability < 85 ? 0.08 : 0;
            layerGainsRef.current.pulse.gain.setTargetAtTime(vol, now, 2);
        }

        if (layerGainsRef.current.tension) {
            const vol = globalStability < 75 ? (75 - globalStability) * 0.003 : 0;
            layerGainsRef.current.tension.gain.setTargetAtTime(vol, now, 3);
        }

        if (layerGainsRef.current.static) {
            const vol = globalStability < 20 ? (20 - globalStability) * 0.006 : 0;
            layerGainsRef.current.static.gain.setTargetAtTime(vol, now, 5);
        }

    }, [globalStability, isAudioReady, isEnabled]);

    useEffect(() => {
        const handle = () => { if (!hasInteracted) { setHasInteracted(true); if (isEnabled) startAudio(); } };
        ['mousedown', 'keydown', 'touchstart'].forEach(e => window.addEventListener(e, handle));
        return () => ['mousedown', 'keydown', 'touchstart'].forEach(e => window.removeEventListener(e, handle));
    }, [hasInteracted, isEnabled, startAudio]);

    useEffect(() => {
        if (!isEnabled) stopAllAudio();
        else if (hasInteracted && !audioContextRef.current) startAudio();
    }, [isEnabled, hasInteracted, startAudio, stopAllAudio]);

    return (
        <div className="fixed bottom-6 left-1/4 z-[60]">
            <motion.button
                onClick={onToggle}
                className={`p-3 rounded-full border transition-all flex items-center gap-2 group relative ${isEnabled
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    : "bg-black/40 border-white/10 text-white/40"
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {/* Pulsing ring when audio active */}
                {isEnabled && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
                {isEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <div className="flex flex-col items-start leading-none pr-2 overflow-hidden w-0 group-hover:w-auto transition-all">
                    <span className="text-[8px] font-mono uppercase tracking-widest whitespace-nowrap">Ambient Sound</span>
                    <span className="text-[10px] font-bold whitespace-nowrap">{isEnabled ? 'IMMERSIVE' : 'MUTED'}</span>
                </div>
            </motion.button>
        </div>
    );
}

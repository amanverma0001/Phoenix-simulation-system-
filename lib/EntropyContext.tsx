"use client";

import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from "react";

/**
 * EntropyContext - Global state for chaos-driven visual effects
 * Provides entropy/chaos level to all components for theme-aligned visuals
 */

interface EntropyState {
    stability: number; // 0-100
    chaosLevel: number; // Derived: higher = more chaos
    timeOnPage: number; // Seconds spent on page
    interactionCount: number; // Number of user interactions
    collapseHistory: CollapseMemory[];
    colorShift: { hue: number; saturation: number };
}

interface CollapseMemory {
    timestamp: number;
    scenario: string;
    finalStability: number;
    affectedCountries: string[];
}

interface EntropyContextType extends EntropyState {
    updateStability: (stability: number) => void;
    recordInteraction: () => void;
    recordCollapse: (scenario: string, stability: number, countries: string[]) => void;
    getGhostTraces: () => CollapseMemory[];
    isEdgeOfChaos: boolean; // Stability 40-60%
}

const EntropyContext = createContext<EntropyContextType | null>(null);

export function useEntropy() {
    const context = useContext(EntropyContext);
    if (!context) {
        // Return default values if not in provider
        return {
            stability: 100,
            chaosLevel: 0,
            timeOnPage: 0,
            interactionCount: 0,
            collapseHistory: [],
            colorShift: { hue: 0, saturation: 100 },
            updateStability: () => { },
            recordInteraction: () => { },
            recordCollapse: () => { },
            getGhostTraces: () => [],
            isEdgeOfChaos: false,
        };
    }
    return context;
}

export function EntropyProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<EntropyState>({
        stability: 100,
        chaosLevel: 0,
        timeOnPage: 0,
        interactionCount: 0,
        collapseHistory: [],
        colorShift: { hue: 0, saturation: 100 },
    });

    // Track time on page - color mutation trigger
    useEffect(() => {
        const interval = setInterval(() => {
            setState(prev => {
                const newTime = prev.timeOnPage + 1;
                // Slowly shift hue over time (1 degree per 10 seconds)
                const hueShift = (newTime / 10) % 30; // Max 30 degree shift
                // Saturation pulses with chaos
                const satPulse = 100 - (prev.chaosLevel * 0.3);
                return {
                    ...prev,
                    timeOnPage: newTime,
                    colorShift: { hue: hueShift, saturation: satPulse }
                };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Load collapse history from localStorage for "ghost traces"
    useEffect(() => {
        const saved = localStorage.getItem('collapse_history');
        if (saved) {
            try {
                const history = JSON.parse(saved);
                setState(prev => ({ ...prev, collapseHistory: history }));
            } catch { }
        }
    }, []);

    // Wrap callbacks in useCallback to prevent infinite loops in consumers
    const updateStability = useCallback((stability: number) => {
        const chaosLevel = Math.max(0, 100 - stability);
        setState(prev => ({ ...prev, stability, chaosLevel }));
    }, []);

    const recordInteraction = useCallback(() => {
        setState(prev => ({ ...prev, interactionCount: prev.interactionCount + 1 }));
    }, []);

    const recordCollapse = useCallback((scenario: string, stability: number, countries: string[]) => {
        const memory: CollapseMemory = {
            timestamp: Date.now(),
            scenario,
            finalStability: stability,
            affectedCountries: countries,
        };
        setState(prev => {
            const newHistory = [...prev.collapseHistory, memory].slice(-5); // Keep last 5
            localStorage.setItem('collapse_history', JSON.stringify(newHistory));
            return { ...prev, collapseHistory: newHistory };
        });
    }, []);

    const getGhostTraces = useCallback(() => state.collapseHistory, [state.collapseHistory]);

    const isEdgeOfChaos = state.stability >= 40 && state.stability <= 60;

    return (
        <EntropyContext.Provider value={{
            ...state,
            updateStability,
            recordInteraction,
            recordCollapse,
            getGhostTraces,
            isEdgeOfChaos,
        }}>
            {children}
        </EntropyContext.Provider>
    );
}

/**
 * Utility: Get CSS transform for grid distortion based on chaos level
 */
export function getGridDistortion(chaosLevel: number): React.CSSProperties {
    if (chaosLevel < 20) return {};

    const intensity = (chaosLevel - 20) / 80; // 0 to 1 for chaos 20-100
    const skewX = (Math.random() - 0.5) * intensity * 2;
    const skewY = (Math.random() - 0.5) * intensity * 1.5;
    const rotate = (Math.random() - 0.5) * intensity * 1;

    return {
        transform: `skew(${skewX}deg, ${skewY}deg) rotate(${rotate}deg)`,
        transition: 'transform 2s ease-in-out',
    };
}

/**
 * Utility: Scramble text based on chaos level
 */
export function scrambleText(text: string, chaosLevel: number): string {
    if (chaosLevel < 40) return text;

    const glitchChars = '█▓▒░▄▀■□▪▫◊◦●○◐◑';
    const scrambleChance = (chaosLevel - 40) / 60 * 0.15; // Max 15% chars scrambled

    return text.split('').map(char => {
        if (char === ' ') return char;
        if (Math.random() < scrambleChance) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
    }).join('');
}

/**
 * Hook: Text that periodically glitches based on chaos
 */
export function useGlitchText(originalText: string, chaosLevel: number) {
    const [displayText, setDisplayText] = useState(originalText);

    useEffect(() => {
        if (chaosLevel < 40) {
            setDisplayText(originalText);
            return;
        }

        const interval = setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to glitch
                setDisplayText(scrambleText(originalText, chaosLevel));
                // Restore after brief glitch
                setTimeout(() => setDisplayText(originalText), 150);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [originalText, chaosLevel]);

    return displayText;
}

/**
 * Component: Text that scrambles during critical states
 */
export function GlitchText({
    children,
    chaosLevel,
    className = ""
}: {
    children: string;
    chaosLevel: number;
    className?: string;
}) {
    const displayText = useGlitchText(children, chaosLevel);

    return (
        <span className={className} style={{
            textShadow: chaosLevel > 50
                ? `${(Math.random() - 0.5) * 2}px 0 #ff0080, ${(Math.random() - 0.5) * 2}px 0 #00ffff`
                : undefined,
        }}>
            {displayText}
        </span>
    );
}

/**
 * CSS Variables for color mutation - apply to root
 */
export function getColorMutationVars(colorShift: { hue: number; saturation: number }, chaosLevel: number) {
    // Base colors shift toward red/orange as chaos increases
    const hueRotate = colorShift.hue + (chaosLevel > 50 ? (chaosLevel - 50) * 0.5 : 0);

    return {
        '--entropy-hue-shift': `${hueRotate}deg`,
        '--entropy-saturation': `${colorShift.saturation}%`,
        '--entropy-chaos': chaosLevel / 100,
    } as React.CSSProperties;
}

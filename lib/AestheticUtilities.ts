/**
 * AestheticUtilities - Central design system tokens for the tactical interface
 */

export const THEME = {
    colors: {
        primary: "#00ffff",       // Cyan/Neon
        primaryGlow: "rgba(0, 255, 255, 0.4)",
        secondary: "#ff0080",     // Magenta/Accent
        toxic: "#00ff44",         // Green/Stability
        critical: "#ff3300",      // Red/Warning
        warning: "#ffaa00",       // Orange/Caution
        background: "#050a15",    // Deep Navy
        surface: "rgba(5, 10, 21, 0.8)",
    },
    glass: {
        premium: "glass-premium",
        accent: "glass-premium-accent",
    },
    animations: {
        breathing: "breathing-slow",
        shine: "toxic-gradient-text",
    }
};

export const getBoxShadow = (color: string, intensity: number = 0.3) => {
    return `0 0 ${20 * intensity}px ${color}, 0 0 ${40 * intensity}px ${color}44`;
};

export const getGlassStyle = (opacity: number = 0.4, blur: number = 20) => ({
    background: `rgba(0, 0, 0, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: '1px solid rgba(0, 255, 255, 0.1)',
});

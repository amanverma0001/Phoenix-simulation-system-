/**
 * useBreakpoint Hook - Responsive design breakpoint detection
 * 
 * Provides:
 * - Current breakpoint (mobile/tablet/desktop)
 * - Boolean helpers (isMobile, isTablet, isDesktop)
 * - Window dimensions
 */

import { useState, useEffect } from 'react';

// ============================================================================
// BREAKPOINT CONFIGURATION
// ============================================================================

export const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    desktopLarge: 1440,
    desktopXL: 1920,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'desktopLarge' | 'desktopXL';

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export interface UseBreakpointReturn {
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isDesktopLarge: boolean;
    width: number;
    height: number;
}

export default function useBreakpoint(): UseBreakpointReturn {
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Debounce resize handler
        let timeoutId: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 100);
        };

        window.addEventListener('resize', debouncedResize);
        handleResize(); // Initial call

        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, []);

    // Determine current breakpoint
    const getBreakpoint = (width: number): Breakpoint => {
        if (width >= BREAKPOINTS.desktopXL) return 'desktopXL';
        if (width >= BREAKPOINTS.desktopLarge) return 'desktopLarge';
        if (width >= BREAKPOINTS.desktop) return 'desktop';
        if (width >= BREAKPOINTS.tablet) return 'tablet';
        return 'mobile';
    };

    const breakpoint = getBreakpoint(dimensions.width);

    return {
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop' || breakpoint === 'desktopLarge' || breakpoint === 'desktopXL',
        isDesktopLarge: breakpoint === 'desktopLarge' || breakpoint === 'desktopXL',
        width: dimensions.width,
        height: dimensions.height,
    };
}

// ============================================================================
// UTILITY: RESPONSIVE VALUE SELECTOR
// ============================================================================

/**
 * Select a value based on current breakpoint
 * Usage: const size = responsiveValue({ mobile: 100, tablet: 150, desktop: 200 })
 */
export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
    const { breakpoint } = useBreakpoint();

    // Find the closest matching breakpoint
    const breakpointOrder: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'desktopLarge', 'desktopXL'];
    const currentIndex = breakpointOrder.indexOf(breakpoint);

    for (let i = currentIndex; i >= 0; i--) {
        const bp = breakpointOrder[i];
        if (values[bp] !== undefined) {
            return values[bp] as T;
        }
    }

    return defaultValue;
}

// ============================================================================
// PERFORMANCE CONFIG BY BREAKPOINT
// ============================================================================

export interface PerformanceConfig {
    particleCount: number;
    shatterPieces: number;
    targetFPS: number;
    antialias: boolean;
    postProcessing: boolean;
    shadowQuality: 'none' | 'basic' | 'full';
}

export function usePerformanceConfig(): PerformanceConfig {
    const { breakpoint } = useBreakpoint();

    const configs: Record<Breakpoint, PerformanceConfig> = {
        mobile: {
            particleCount: 200,
            shatterPieces: 60,
            targetFPS: 30,
            antialias: false,
            postProcessing: false,
            shadowQuality: 'none',
        },
        tablet: {
            particleCount: 80,
            shatterPieces: 80,
            targetFPS: 45,
            antialias: true,
            postProcessing: false,
            shadowQuality: 'basic',
        },
        desktop: {
            particleCount: 100,
            shatterPieces: 100,
            targetFPS: 60,
            antialias: true,
            postProcessing: true,
            shadowQuality: 'basic',
        },
        desktopLarge: {
            particleCount: 120,
            shatterPieces: 120,
            targetFPS: 60,
            antialias: true,
            postProcessing: true,
            shadowQuality: 'full',
        },
        desktopXL: {
            particleCount: 150,
            shatterPieces: 150,
            targetFPS: 60,
            antialias: true,
            postProcessing: true,
            shadowQuality: 'full',
        },
    };

    return configs[breakpoint];
}

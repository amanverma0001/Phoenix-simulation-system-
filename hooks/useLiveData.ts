/**
 * useLiveData Hook - React interface for live data layer
 * 
 * Features:
 * - Automatic polling (configurable intervals)
 * - Caching with localStorage fallback
 * - Loading/error states
 * - Graceful degradation to static data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    fetchAllLiveData,
    generateLiveEnergyData,
    generateLiveEvents,
    calculateCrisisLevel,
    getTimeSinceUpdate,
    type LiveDataState,
    type EnergyData,
    type LiveEvent,
    type CrisisIndicator,
} from '@/lib/liveDataService';

// ============================================================================
// CONFIGURATION
// ============================================================================

interface UseLiveDataOptions {
    /** Enable automatic polling */
    enablePolling?: boolean;
    /** Polling interval for critical data (energy, crisis) in ms */
    criticalInterval?: number;
    /** Polling interval for standard data (events) in ms */
    standardInterval?: number;
    /** Polling interval for slow data (economic) in ms */
    slowInterval?: number;
}

const DEFAULT_OPTIONS: Required<UseLiveDataOptions> = {
    enablePolling: true,
    criticalInterval: 30 * 1000,      // 30 seconds
    standardInterval: 60 * 1000,      // 1 minute
    slowInterval: 5 * 60 * 1000,      // 5 minutes
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export interface UseLiveDataReturn {
    // Data
    energy: EnergyData | null;
    events: LiveEvent[];
    crisis: CrisisIndicator | null;

    // State
    isLoading: boolean;
    isPolling: boolean;
    error: string | null;
    lastFetch: Date | null;
    timeSinceUpdate: string;

    // Actions
    refresh: () => Promise<void>;
    startPolling: () => void;
    stopPolling: () => void;
}

export default function useLiveData(options: UseLiveDataOptions = {}): UseLiveDataReturn {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // State
    const [data, setData] = useState<LiveDataState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(opts.enablePolling);
    const [error, setError] = useState<string | null>(null);
    const [lastFetch, setLastFetch] = useState<Date | null>(null);
    const [timeSinceUpdate, setTimeSinceUpdate] = useState('Never');

    // Refs for intervals
    const criticalIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const standardIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch all data (initial load or full refresh)
    const fetchFull = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchAllLiveData();
            setData(result);
            setLastFetch(new Date());
            setError(result.error);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Quick update for simulated data (no API calls)
    const quickUpdate = useCallback(() => {
        if (!data) return;

        const energy = generateLiveEnergyData();
        const events = generateLiveEvents(5);
        const crisis = calculateCrisisLevel(energy, events);

        setData(prev => prev ? {
            ...prev,
            energy,
            events,
            crisis,
            lastFetch: new Date(),
        } : null);

        setLastFetch(new Date());
    }, [data]);

    // Public refresh function
    const refresh = useCallback(async () => {
        await fetchFull();
    }, [fetchFull]);

    // Start polling
    const startPolling = useCallback(() => {
        setIsPolling(true);

        // Critical data polling (energy, crisis)
        if (!criticalIntervalRef.current) {
            criticalIntervalRef.current = setInterval(() => {
                quickUpdate();
            }, opts.criticalInterval);
        }

        // Standard data polling (events)
        if (!standardIntervalRef.current) {
            standardIntervalRef.current = setInterval(() => {
                const events = generateLiveEvents(5);
                setData(prev => prev ? { ...prev, events } : null);
            }, opts.standardInterval);
        }
    }, [quickUpdate, opts.criticalInterval, opts.standardInterval]);

    // Stop polling
    const stopPolling = useCallback(() => {
        setIsPolling(false);

        if (criticalIntervalRef.current) {
            clearInterval(criticalIntervalRef.current);
            criticalIntervalRef.current = null;
        }

        if (standardIntervalRef.current) {
            clearInterval(standardIntervalRef.current);
            standardIntervalRef.current = null;
        }
    }, []);

    // Update "time since update" display
    useEffect(() => {
        const updateTime = () => {
            setTimeSinceUpdate(getTimeSinceUpdate(lastFetch));
        };

        updateTime();
        timeUpdateIntervalRef.current = setInterval(updateTime, 10000); // Every 10s

        return () => {
            if (timeUpdateIntervalRef.current) {
                clearInterval(timeUpdateIntervalRef.current);
            }
        };
    }, [lastFetch]);

    // Initial fetch
    useEffect(() => {
        fetchFull();

        return () => {
            stopPolling();
        };
    }, [fetchFull, stopPolling]);

    // Start/stop polling based on option
    useEffect(() => {
        if (opts.enablePolling && !isLoading) {
            startPolling();
        } else {
            stopPolling();
        }

        return () => {
            stopPolling();
        };
    }, [opts.enablePolling, isLoading, startPolling, stopPolling]);

    return {
        // Data
        energy: data?.energy || null,
        events: data?.events || [],
        crisis: data?.crisis || null,

        // State
        isLoading,
        isPolling,
        error,
        lastFetch,
        timeSinceUpdate,

        // Actions
        refresh,
        startPolling,
        stopPolling,
    };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for just energy data (more efficient if only energy needed)
 */
export function useEnergyData() {
    const [energy, setEnergy] = useState<EnergyData>(generateLiveEnergyData);

    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(generateLiveEnergyData());
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    return energy;
}

/**
 * Hook for crisis indicator only
 */
export function useCrisisIndicator() {
    const [crisis, setCrisis] = useState<CrisisIndicator | null>(null);

    useEffect(() => {
        const update = () => {
            const energy = generateLiveEnergyData();
            const events = generateLiveEvents(3);
            setCrisis(calculateCrisisLevel(energy, events));
        };

        update();
        const interval = setInterval(update, 30000);

        return () => clearInterval(interval);
    }, []);

    return crisis;
}

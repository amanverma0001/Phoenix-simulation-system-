/**
 * useAILiveData - React Hook for AI-powered Live Geopolitical Data
 * 
 * Uses Gemini AI to fetch real-time geopolitical data with
 * auto-refresh, caching, and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    liveDataFetcher,
    LiveGeopoliticalData,
    GeopoliticalEvent
} from '@/lib/LiveDataFetcher';

export interface UseAILiveDataReturn {
    data: LiveGeopoliticalData | null;
    events: GeopoliticalEvent[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    isLive: boolean;  // True if data came from AI, false if fallback
    refresh: () => Promise<void>;
    clearCache: () => void;
}

export function useAILiveData(autoRefresh: boolean = true): UseAILiveDataReturn {
    const [data, setData] = useState<LiveGeopoliticalData | null>(null);
    const [events, setEvents] = useState<GeopoliticalEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const liveData = await liveDataFetcher.fetchCurrentState();
            setData(liveData);
            setEvents(liveData.recentEvents || []);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('[useAILiveData] Fetch failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch live data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearCache = useCallback(() => {
        liveDataFetcher.clearCache();
        fetchData();
    }, [fetchData]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-refresh DISABLED to conserve API quota
    // useEffect(() => {
    //     if (!autoRefresh) return;
    //     const interval = setInterval(fetchData, 5 * 60 * 1000);
    //     return () => clearInterval(interval);
    // }, [autoRefresh, fetchData]);

    return {
        data,
        events,
        isLoading,
        error,
        lastUpdated,
        isLive: data?.dataSource === 'ai',
        refresh: fetchData,
        clearCache
    };
}

/**
 * Hook to get time ago string that updates automatically
 */
export function useTimeAgo(date: Date | null): string {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        if (!date) {
            setTimeAgo('');
            return;
        }

        const updateTimeAgo = () => {
            const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

            if (seconds < 60) setTimeAgo(`${seconds}s ago`);
            else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
            else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
        };

        updateTimeAgo();
        const interval = setInterval(updateTimeAgo, 1000);
        return () => clearInterval(interval);
    }, [date]);

    return timeAgo;
}

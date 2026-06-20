"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { AISentimentAnalyzer } from '@/lib/AIServices';

export interface SentimentData {
    mood: string;
    emoji: string;
    color: string;
    intensity: number;
}

export function useAISentiment(countries: any[], events: any[]) {
    const [sentiments, setSentiments] = useState<Record<string, SentimentData>>({});
    const lastStabilityRef = useRef<Record<string, number>>({});
    const processingQueue = useRef<Set<string>>(new Set());

    const analyzeSentiment = useCallback(async (countryId: string, stability: number) => {
        if (processingQueue.current.has(countryId)) return;

        processingQueue.current.add(countryId);
        try {
            const data = await AISentimentAnalyzer.analyze(countryId, stability, events.slice(-3));
            setSentiments(prev => ({ ...prev, [countryId]: data }));
        } catch (e) {
            console.error(`Sentiment analysis failed for ${countryId}:`, e);
        } finally {
            processingQueue.current.delete(countryId);
        }
    }, [events]);

    useEffect(() => {
        countries.forEach(country => {
            const prevStability = lastStabilityRef.current[country.id] ?? 100;
            const diff = Math.abs(prevStability - country.stability);

            // Trigger analysis if stability shifts significantly (>5%)
            if (diff > 5 || !sentiments[country.id]) {
                analyzeSentiment(country.id, country.stability);
                lastStabilityRef.current[country.id] = country.stability;
            }
        });
    }, [countries, sentiments, analyzeSentiment]);

    return sentiments;
}

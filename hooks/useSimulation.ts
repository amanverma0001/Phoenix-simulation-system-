/**
 * useSimulation - React Hook for Cascade Simulation
 * 
 * Provides a clean interface to interact with the CascadeEngine
 * and EmergenceDetector from React components.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    CascadeEngine,
    getCascadeEngine,
    resetCascadeEngine,
    ActionType,
    CascadeEvent,
    SystemSnapshot,
    CascadeResult,
} from '@/lib/CascadeEngine';
import {
    EmergenceDetector,
    getEmergenceDetector,
    resetEmergenceDetector,
    EmergenceReport,
} from '@/lib/EmergenceDetector';
import { getSimulationHistory, TemporalSnapshot } from '@/lib/SimulationHistory';
import { Country, getPhaseFromStability, PhaseState } from '@/lib/geopoliticalData';

export interface SimulationState {
    isRunning: boolean;
    globalStability: number;
    phase: PhaseState;
    coherence: number;
    collapseThreshold: number;
    isCollapsed: boolean;
    countries: Country[];
    events: CascadeEvent[];
    emergence: EmergenceReport | null;
    activeScenario: string | null;
    globalTrust: number;
    dataDrift: number;
}

export interface SimulationActions {
    executeAction: (action: ActionType, targetId?: string, anchorId?: string | null) => Promise<CascadeResult>;
    reset: () => void;
    getCountryStability: (countryId: string) => number;
    getEmergenceData: () => EmergenceReport;
}

const initialState: SimulationState = {
    isRunning: false,
    globalStability: 100,
    phase: 'STABLE',
    coherence: 90, // [Fixed] Initial healthy coherence baseline
    collapseThreshold: 70,
    isCollapsed: false,
    countries: [],
    events: [],
    emergence: null,
    activeScenario: null,
    globalTrust: 1.0,
    dataDrift: 0,
};

export default function useSimulation(): [SimulationState, SimulationActions] {
    const [state, setState] = useState<SimulationState>(initialState);
    const engineRef = useRef<CascadeEngine | null>(null);
    const detectorRef = useRef<EmergenceDetector | null>(null);

    // Initialize engine on mount
    useEffect(() => {
        engineRef.current = getCascadeEngine();
        detectorRef.current = getEmergenceDetector();

        // Set initial countries
        setState(prev => ({
            ...prev,
            countries: engineRef.current?.getCountries() || [],
        }));

        // Subscribe to tick updates
        engineRef.current.onTick((snapshot) => {
            const history = getSimulationHistory();

            setState(prev => {
                const newState = {
                    ...prev,
                    globalStability: snapshot.globalStability,
                    phase: snapshot.phase,
                    coherence: snapshot.coherence,
                    collapseThreshold: snapshot.collapseThreshold,
                    isCollapsed: snapshot.globalStability < snapshot.collapseThreshold,
                    globalTrust: snapshot.globalTrust,
                    dataDrift: snapshot.dataDrift,
                };

                // Record to history during active simulation
                history.record({
                    timestamp: Date.now(),
                    globalStability: snapshot.globalStability,
                    coherence: snapshot.coherence,
                    countries: engineRef.current?.getCountries().map(c => ({ id: c.id, stability: c.stability })) || [],
                    eventsCount: engineRef.current?.getEvents().length || 0,
                    emergence: prev.emergence
                });

                return newState;
            });
        });
    }, []);

    // Execute simulation action
    const executeAction = useCallback(async (action: ActionType, targetId?: string, anchorId?: string | null): Promise<CascadeResult> => {
        if (!engineRef.current || !detectorRef.current) {
            throw new Error('Simulation engine not initialized');
        }

        setState(prev => ({ ...prev, isRunning: true, activeScenario: action }));

        try {
            // Run the cascade simulation
            const result = await engineRef.current.executeAction(action, targetId, anchorId);

            // Analyze emergence
            const emergence = detectorRef.current.analyze(engineRef.current, anchorId);

            // Update state with results
            setState(prev => ({
                ...prev,
                isRunning: false,
                globalStability: result.finalState.globalStability,
                phase: result.finalState.phase,
                coherence: result.finalState.coherence,
                collapseThreshold: result.finalState.collapseThreshold,
                isCollapsed: result.finalState.globalStability < result.finalState.collapseThreshold,
                countries: engineRef.current?.getCountries() || [],
                events: engineRef.current?.getEvents() || [],
                emergence,
                globalTrust: result.finalState.globalTrust,
                dataDrift: result.finalState.dataDrift,
            }));

            return result;
        } catch (error) {
            console.error('[useSimulation] Error executing action:', error);
            setState(prev => ({ ...prev, isRunning: false }));
            throw error;
        }
    }, []);

    // Reset simulation
    const reset = useCallback(() => {
        // [Adaptive Rule] Rebirth Mechanic: Capture state before reset
        const prevWinners = state.emergence?.winners.map(w => w.entityId) || [];
        const wasCollapsed = state.isCollapsed;
        const drift = state.dataDrift;

        engineRef.current = resetCascadeEngine();
        detectorRef.current = resetEmergenceDetector();

        // Apply mutations if the previous run ended in collapse
        if (wasCollapsed && engineRef.current) {
            engineRef.current.applyRebirthMutations(prevWinners, drift);
        }

        setState({
            ...initialState,
            countries: engineRef.current?.getCountries() || [],
        });

        // Re-subscribe to tick updates
        engineRef.current.onTick((snapshot) => {
            setState(prev => ({
                ...prev,
                globalStability: snapshot.globalStability,
                phase: snapshot.phase,
                coherence: snapshot.coherence,
                collapseThreshold: snapshot.collapseThreshold,
                isCollapsed: snapshot.globalStability < snapshot.collapseThreshold,
                dataDrift: snapshot.dataDrift,
            }));
        });
    }, []);

    // Get country stability
    const getCountryStability = useCallback((countryId: string): number => {
        const country = state.countries.find(c => c.id === countryId);
        return country?.stability || 0;
    }, [state.countries]);

    const actions: SimulationActions = {
        executeAction,
        reset,
        getCountryStability,
        getEmergenceData: useCallback(() => {
            return state.emergence || {
                winners: [],
                losers: [],
                insights: [],
                mostSurprising: null,
                anchorImpact: null,
                timestamp: Date.now()
            };
        }, [state.emergence]),
    };

    return [state, actions];
}

/**
 * SimulationHistory - Temporal State Tracking
 * 
 * Captures snapshots of the simulation state during cascades
 * to allow users to "scrub" through time and analyze the 
 * exact sequence of collapse.
 */

import { SystemSnapshot } from "./CascadeEngine";
import { EmergenceReport } from "./EmergenceDetector";

export interface TemporalSnapshot {
    timestamp: number;
    globalStability: number;
    coherence: number;
    countries: { id: string, stability: number }[];
    eventsCount: number;
    emergence: EmergenceReport | null;
}

export class SimulationHistory {
    private history: TemporalSnapshot[] = [];
    private maxSnapshots: number = 200; // Limit memory usage

    public record(snapshot: TemporalSnapshot): void {
        this.history.push(snapshot);
        if (this.history.length > this.maxSnapshots) {
            this.history.shift();
        }
    }

    public getHistory(): TemporalSnapshot[] {
        return this.history;
    }

    public getSnapshotAtPosition(percentage: number): TemporalSnapshot | null {
        if (this.history.length === 0) return null;
        const index = Math.floor((percentage / 100) * (this.history.length - 1));
        return this.history[index];
    }

    public clear(): void {
        this.history = [];
    }

    public get length(): number {
        return this.history.length;
    }
}

let historyInstance: SimulationHistory | null = null;

export function getSimulationHistory(): SimulationHistory {
    if (!historyInstance) {
        historyInstance = new SimulationHistory();
    }
    return historyInstance;
}

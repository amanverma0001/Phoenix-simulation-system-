"use client";

/**
 * PerformanceMonitor - Track FPS, memory, and simulation complexity
 */
export interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    memoryUsage: number;
    cascadeComplexity: number;
    activeEntities: number;
    renderTime: number;
}

class PerformanceMonitor {
    private fps: number = 60;
    private frameTime: number = 16.67;
    private lastTime: number = 0;
    private frameCount: number = 0;
    private lastFpsUpdate: number = 0;
    private metrics: PerformanceMetrics = {
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0,
        cascadeComplexity: 0,
        activeEntities: 0,
        renderTime: 0
    };

    constructor() {
        if (typeof window !== 'undefined') {
            this.lastTime = performance.now();
            this.lastFpsUpdate = this.lastTime;
        }
    }

    update(): PerformanceMetrics {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;

        this.frameTime = delta;
        this.frameCount++;

        // Update FPS every 500ms for stability
        if (now - this.lastFpsUpdate >= 500) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }

        this.metrics.fps = this.fps;
        this.metrics.frameTime = this.frameTime;

        // Memory usage (if available)
        if (typeof window !== 'undefined' && (performance as any).memory) {
            this.metrics.memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / 1048576); // MB
        }

        return this.metrics;
    }

    measureCascadeComplexity(state: {
        countries?: any[];
        events?: any[];
        relationships?: any[];
    }): number {
        const countryCount = state.countries?.length || 0;
        const eventCount = state.events?.length || 0;
        const relationshipCount = state.relationships?.length || 0;

        const complexity = (relationshipCount * 0.5) + (countryCount * 1.0) + (eventCount * 0.3);
        this.metrics.cascadeComplexity = Math.round(complexity);

        return this.metrics.cascadeComplexity;
    }

    setActiveEntities(count: number) {
        this.metrics.activeEntities = count;
    }

    measureRenderTime(callback: () => void): number {
        const start = performance.now();
        callback();
        const renderTime = performance.now() - start;
        this.metrics.renderTime = Math.round(renderTime * 100) / 100;
        return this.metrics.renderTime;
    }

    getPerformanceGrade(): 'S' | 'A' | 'B' | 'C' | 'D' {
        if (this.fps >= 55) return 'S';
        if (this.fps >= 45) return 'A';
        if (this.fps >= 35) return 'B';
        if (this.fps >= 25) return 'C';
        return 'D';
    }

    getGradeColor(grade: string): string {
        switch (grade) {
            case 'S': return 'from-yellow-400 to-orange-500';
            case 'A': return 'from-green-400 to-emerald-500';
            case 'B': return 'from-blue-400 to-cyan-500';
            case 'C': return 'from-orange-400 to-red-500';
            default: return 'from-red-600 to-red-800';
        }
    }

    getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    getFPS(): number {
        return this.fps;
    }
}

export const performanceMonitor = new PerformanceMonitor();

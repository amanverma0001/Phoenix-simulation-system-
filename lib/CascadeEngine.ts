/**
 * CascadeEngine - Core Simulation Engine for Fractured World
 */

import {
    type Country,
    type HiddenEntity,
    type Relationship,
    type PhaseState,
    countries as initialCountries,
    hiddenEntities,
    relationships,
    getPhaseFromStability,
    cloneCountries,
    cloneRelationships,
    cloneHiddenEntities,
    getRelationshipsByEntity,
} from './geopoliticalData';
import { AICoherenceAnalyzer } from './AIServices';

export type { Country, HiddenEntity, Relationship, PhaseState };

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ActionType =
    | 'SANCTION_RUSSIA'
    | 'SANCTION_CHINA'
    | 'SANCTION_USA'
    | 'SANCTION_IRAN'
    | 'BLOCK_PIPELINE'
    | 'DISSOLVE_ALLIANCE'
    | 'ECONOMIC_CRISIS'
    | 'MILITARY_TENSION'
    | 'ENERGY_CUTOFF'
    | 'UK_EXIT'
    | 'BLOCK_BOSPHORUS'
    | 'SANCTION_COUNTRY'
    | 'DIRECTIVE_STIMULUS'
    | 'DIRECTIVE_LOCKDOWN'
    | 'DIRECTIVE_ACCORD'
    | 'DIRECTIVE_NATIONALIZE';

export type RoleType = 'corporate' | 'intelligence' | 'diplomat' | 'none';

// Re-export type for external use as TimelineEvent
export type TimelineEvent = CascadeEvent;

export interface CascadeEvent {
    id: string;
    timestamp: number;        // Simulation time in ms
    type: 'action' | 'effect' | 'threshold' | 'phase_transition' | 'emergence' | 'relationship_break';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    entities: string[];       // Affected entity IDs
    changes: {
        entityId: string;
        property: string;
        oldValue: number;
        newValue: number;
    }[];
    systemState: SystemSnapshot;
}

export interface SystemSnapshot {
    globalStability: number;
    countryStabilities: Record<string, number>;
    phase: PhaseState;
    coherence: number;
    collapseThreshold: number;
    globalTrust: number;
    dataDrift: number;        // [Refinement] Epistemic Drift: Data uncertainty (0-1)
}

export interface CascadeResult {
    events: CascadeEvent[];
    finalState: SystemSnapshot;
    duration: number;
    phaseTransitionOccurred: boolean;
    emergentEntities: string[];
}

export interface PropagationNode {
    entityId: string;
    depth: number;
    effectStrength: number;
    source: string | null;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    TICK_INTERVAL: 100,           // ms per simulation tick
    MAX_TICKS: 100,               // Maximum ticks per cascade
    BASE_COLLAPSE_THRESHOLD: 70,  // Base stability for collapse
    SHOCK_THRESHOLD_DECREASE: 3,  // % decrease per past shock
    RECOVERY_THRESHOLD_INCREASE: 2, // % recovery over time
    COHERENCE_COLLAPSE_THRESHOLD: 30, // Coherence below which collapse occurs
    PROPAGATION_DECAY: 0.7,       // Effect decay per hop
    MIN_EFFECT_STRENGTH: 0.05,    // Minimum effect to propagate
    RELATIONSHIP_BREAK_THRESHOLD: 0.3, // Relationship strength below which it breaks
    HYSTERESIS_MEMORY: 5,         // Number of shocks to remember
};

// ============================================================================
// CASCADE ENGINE CLASS
// ============================================================================

export class CascadeEngine {
    private countries: Country[];
    private entities: HiddenEntity[];
    private relationships: Relationship[];
    private events: CascadeEvent[];
    private currentTick: number;
    private running: boolean;
    private tickCallbacks: ((state: SystemSnapshot) => void)[];
    private globalShockHistory: number;
    private globalTrust: number;      // [Refinement] Systemic Exhaustion
    private playerRole: RoleType;    // [Refinement] Identity Depth
    private eventCounter: number;     // Unique counter for event IDs
    private aiCoherenceCache: number; // [LLM] Cached AI-driven coherence
    private recentEvents: string[];   // [LLM] Recent simulation events for context

    constructor() {
        this.countries = cloneCountries();
        this.entities = cloneHiddenEntities();
        this.relationships = cloneRelationships();
        this.events = [];
        this.currentTick = 0;
        this.running = false;
        this.tickCallbacks = [];
        this.globalShockHistory = 0;
        this.globalTrust = 1.0;
        this.playerRole = 'none';
        this.eventCounter = 0;
        this.aiCoherenceCache = 95; // Default healthy starting value (AI coherence baseline)
        this.recentEvents = [];
    }

    public setRole(role: RoleType): void {
        this.playerRole = role;
    }

    // ────────────────────────────────────────────────────────────────────────
    // PUBLIC API
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Execute an action and run the cascade simulation
     */
    async executeAction(action: ActionType, targetId?: string, actorId?: string | null): Promise<CascadeResult> {
        // [Refinement] Concurrency Protection
        if (this.running) {
            console.warn('[CascadeEngine] Action ignored: Simulation already in progress');
            return {
                events: [],
                finalState: this.captureSnapshot(),
                duration: 0,
                phaseTransitionOccurred: false,
                emergentEntities: [],
            };
        }

        this.running = true;
        this.currentTick = 0;
        this.events = [];

        const startState = this.captureSnapshot();

        // Apply initial action effects
        const initialAffected = this.applyAction(action, targetId, actorId);

        // Log the action event
        const actionDesc = this.getActionDescription(action, targetId);
        this.logEvent({
            type: 'action',
            description: actionDesc,
            severity: 'critical',
            entities: initialAffected,
            changes: [],
        });

        // [LLM] Record for AI context and trigger immediate re-analysis
        this.recentEvents.unshift(actionDesc);
        if (this.recentEvents.length > 5) this.recentEvents.pop();
        this.triggerAICoherenceUpdate(true);

        // Run cascade simulation
        await this.runCascade(initialAffected, actorId);

        const finalState = this.captureSnapshot();

        // Detect emergent entities
        const emergentEntities = this.detectEmergentEntities(startState, finalState);

        // Check if phase transition occurred
        const phaseTransitionOccurred = startState.phase !== finalState.phase;

        if (phaseTransitionOccurred) {
            this.globalShockHistory++;
            this.logEvent({
                type: 'phase_transition',
                description: `System transitioned from ${startState.phase} to ${finalState.phase}`,
                severity: 'critical',
                entities: [],
                changes: [],
            });
        }

        this.running = false;

        return {
            events: this.events,
            finalState,
            duration: this.currentTick * CONFIG.TICK_INTERVAL,
            phaseTransitionOccurred,
            emergentEntities,
        };
    }

    /**
     * Get current system state
     */
    getState(): SystemSnapshot {
        return this.captureSnapshot();
    }

    /**
     * Get all countries with current state
     */
    getCountries(): Country[] {
        return this.countries;
    }

    /**
     * Get all recorded events
     */
    getEvents(): CascadeEvent[] {
        return this.events;
    }

    /**
     * Register callback for tick updates
     */
    onTick(callback: (state: SystemSnapshot) => void): void {
        this.tickCallbacks.push(callback);
    }

    /**
     * Reset engine to initial state
     */
    reset(): void {
        this.countries = cloneCountries();
        this.entities = cloneHiddenEntities();
        this.relationships = cloneRelationships();
        this.events = [];
        this.currentTick = 0;
        this.running = false;
        this.globalShockHistory = 0;
        this.globalTrust = 1.0;
        this.aiCoherenceCache = 95;
        this.recentEvents = [];
        AICoherenceAnalyzer.reset();
    }

    /**
     * applyRebirthMutations - Randomizes initial state based on previous run's collapse
     */
    applyRebirthMutations(previousWinners: string[], trustLoss: number): void {
        this.globalTrust = Math.max(0.3, 1.0 - trustLoss);
        this.globalShockHistory = Math.floor(trustLoss * 10);

        // Winners of the previous collapse start with a head start (Emergence)
        this.countries.forEach(c => {
            if (previousWinners.includes(c.id)) {
                c.influence *= 1.2;
                c.stability = Math.min(100, c.stability + 10);
                c.economicPower *= 1.1;
            } else {
                // General mutation of the system (adaptive rules)
                const drift = (Math.random() - 0.5) * 10;
                c.stability = Math.max(40, Math.min(100, c.stability + drift));
            }
        });

        this.logEvent({
            type: 'emergence',
            description: 'System reborn with mutated parameters from previous collapse',
            severity: 'high',
            entities: previousWinners,
            changes: []
        });
    }

    private applyAction(action: ActionType, targetId?: string, actorId?: string | null): string[] {
        const affected: string[] = [];

        switch (action) {
            case 'SANCTION_COUNTRY':
                if (targetId) {
                    this.applySanctionEffect(targetId, affected, actorId);
                }
                break;
            case 'SANCTION_RUSSIA':
                this.applySanctionEffect('russia', affected, actorId);
                break;

            case 'SANCTION_CHINA':
                this.applySanctionEffect('china', affected, actorId);
                break;

            case 'SANCTION_USA':
                this.applySanctionEffect('usa', affected, actorId);
                break;

            case 'SANCTION_IRAN':
                this.applySanctionEffect('iran', affected, actorId);
                break;

            case 'BLOCK_PIPELINE':
                // Nord Stream disruption
                const nordstream = this.entities.find(e => e.id === 'nordstream1');
                if (nordstream) {
                    nordstream.revealed = true;
                    affected.push('nordstream1');

                    // Germany suffers most
                    const germany = this.getCountry('germany');
                    if (germany) {
                        germany.stability -= 30;
                        germany.economicPower -= 25;
                        germany.shockHistory++;
                        affected.push('germany');
                    }

                    // Ripple to other dependent countries
                    ['italy', 'poland', 'france'].forEach(countryId => {
                        const country = this.getCountry(countryId);
                        if (country) {
                            country.stability -= 15;
                            country.economicPower -= 10;
                            affected.push(countryId);
                        }
                    });
                }
                break;

            case 'DISSOLVE_ALLIANCE':
                // Weaken NATO relationships
                const natoRels = this.relationships.filter(r =>
                    r.source === 'nato' || r.target === 'nato'
                );
                natoRels.forEach(rel => {
                    rel.strength *= 0.5;
                    affected.push(rel.source, rel.target);
                });

                // Reduce military stability across NATO countries
                ['germany', 'france', 'uk', 'poland', 'italy', 'spain', 'greece', 'turkey'].forEach(countryId => {
                    const country = this.getCountry(countryId);
                    if (country) {
                        country.stability -= 10;
                        country.militaryPower -= 15;
                    }
                });
                break;

            case 'ECONOMIC_CRISIS':
                // Global economic shock
                this.countries.forEach(country => {
                    country.economicPower -= 20;
                    country.stability -= 15;
                    country.shockHistory++;
                    affected.push(country.id);
                });
                break;

            case 'MILITARY_TENSION':
                // Increase instability in conflict zones
                const tensionZones = ['ukraine', 'turkey', 'greece', 'poland'];
                tensionZones.forEach(countryId => {
                    const country = this.getCountry(countryId);
                    if (country) {
                        country.stability -= 20;
                        country.militaryPower += 10; // Militarization
                        affected.push(countryId);
                    }
                });

                // Reveal shadow actors
                this.entities.filter(e => e.layer === 'shadow').forEach(e => {
                    e.revealed = true;
                    affected.push(e.id);
                });
                break;

            case 'ENERGY_CUTOFF':
                // Russia cuts energy supply
                const energyDependents = this.countries.filter(c =>
                    (c.energyDependency['russia'] || 0) > 0.3
                );
                energyDependents.forEach(country => {
                    const dep = country.energyDependency['russia'] || 0;
                    country.stability -= dep * 50;
                    country.economicPower -= dep * 40;
                    country.shockHistory++;
                    affected.push(country.id);
                });

                // Russia also suffers from lost revenue
                const russiaE = this.getCountry('russia');
                if (russiaE) {
                    // [Refinement] Role Multipliers: Corporate hits economic power harder
                    const ecoMulti = this.playerRole === 'corporate' ? 1.8 : 1.0;
                    const stabMulti = this.playerRole === 'intelligence' ? 1.4 : 1.0;

                    russiaE.economicPower -= 35 * ecoMulti;
                    russiaE.stability -= 10 * stabMulti;
                    affected.push('russia');
                }
                break;

            case 'DIRECTIVE_STIMULUS':
                this.applyDirectiveEffect(15, 5, 0.1, affected);
                break;
            case 'DIRECTIVE_LOCKDOWN':
                this.applyDirectiveEffect(5, -10, 0.2, affected);
                break;
            case 'DIRECTIVE_ACCORD':
                this.applyDirectiveEffect(10, 20, 0.15, affected);
                break;
            case 'DIRECTIVE_NATIONALIZE':
                this.applyDirectiveEffect(20, -25, 0.25, affected);
                break;

            case 'UK_EXIT':
                const uk = this.getCountry('uk');
                if (uk) {
                    uk.stability -= 25;
                    uk.economicPower -= 30;
                    uk.influence -= 15;
                    uk.shockHistory += 2;
                    affected.push('uk');

                    // Reveal regions
                    ['scotland', 'northern_ireland'].forEach(id => {
                        const entity = this.entities.find(e => e.id === id);
                        if (entity) {
                            entity.revealed = true;
                            entity.influence += 25;
                            affected.push(id);
                        }
                    });

                    // Weaken EU relationships
                    ['germany', 'france', 'italy', 'spain', 'poland', 'greece'].forEach(countryId => {
                        const rel = this.relationships.find(r =>
                            (r.source === 'uk' && r.target === countryId) ||
                            (r.source === countryId && r.target === 'uk')
                        );
                        if (rel) {
                            rel.strength *= 0.4;
                            affected.push(countryId);
                        }
                        const country = this.getCountry(countryId);
                        if (country) country.economicPower -= 10;
                    });
                }
                break;

            case 'BLOCK_BOSPHORUS':
                const bosphorus = this.entities.find(e => e.id === 'bosphorus');
                if (bosphorus) {
                    bosphorus.revealed = true;
                    bosphorus.influence += 40;
                    affected.push('bosphorus');

                    // Turkey gains massive leverage
                    const tr = this.getCountry('turkey');
                    if (tr) {
                        tr.influence += 25;
                        tr.stability -= 10; // Internal pressure
                        affected.push('turkey');
                    }

                    // Black Sea countries hit hard
                    ['russia', 'ukraine', 'kazakhstan', 'romania', 'bulgaria'].forEach(countryId => {
                        const country = this.getCountry(countryId);
                        if (country) {
                            country.stability -= 30;
                            country.economicPower -= 35;
                            country.shockHistory++;
                            affected.push(countryId);
                        }
                    });

                    // Global energy shock (simulated)
                    this.countries.forEach(c => {
                        if (c.id !== 'turkey' && !['russia', 'kazakhstan'].includes(c.id)) {
                            c.economicPower -= 15;
                            affected.push(c.id);
                        }
                    });
                }
                break;

        }

        return [...new Set(affected)];
    }

    /**
     * Apply sanction effects with severity dynamically calculated for ANY country.
     * Uses: influence, energy export volume, critical relationships, dependent countries.
     */
    private applySanctionEffect(countryId: string, affected: string[], actorId?: string | null): void {
        const country = this.getCountry(countryId);
        if (!country) return;

        // Calculate dynamic impact factors for this specific country
        const impactFactors = this.calculateCountryImpact(countryId);

        // Total impact multiplier (0.15 to 0.50 range for stability drop)
        const totalImpact = impactFactors.totalImpact;

        // Apply to sanctioned country
        const baseStabilityLoss = 15 + (totalImpact * 25);  // 15-40
        const baseEconomicLoss = 20 + (totalImpact * 30);   // 20-50
        const baseInfluenceLoss = 10 + (totalImpact * 20);  // 10-30

        country.stability = Math.max(0, country.stability - baseStabilityLoss);
        country.economicPower = Math.max(0, country.economicPower - baseEconomicLoss);
        country.influence = Math.max(0, country.influence - baseInfluenceLoss);
        country.shockHistory++;
        affected.push(countryId);

        // [Refinement] Reciprocity Logic: Identify global powers that suffer from sanctioning this target
        this.applyReciprocalImpacts(countryId, totalImpact, affected, actorId);

        // Collateral damage based on dependencies
        const dependentCountries = this.getDependentCountries(countryId);
        const connectedCountries = this.getConnectedCountries(countryId);

        // High-impact countries affect ALL countries globally
        if (totalImpact > 0.35) {
            this.countries.forEach(c => {
                if (c.id === countryId) return;

                const energyDep = c.energyDependency?.[countryId] || 0;
                const tradeExposure = this.getTradeExposure(c.id, countryId);
                const isDependent = dependentCountries.includes(c.id);

                // Impact scales with dependency level
                let impact = totalImpact * 5 * (0.2 + energyDep + tradeExposure);
                if (isDependent) impact *= 1.5;

                c.stability = Math.max(0, c.stability - impact);
                c.economicPower = Math.max(0, c.economicPower - impact * 0.4);
                if (impact > 2) affected.push(c.id);
            });
        }
        // Medium-impact countries affect connected/dependent countries
        else if (totalImpact > 0.20) {
            [...new Set([...connectedCountries, ...dependentCountries])].forEach(otherId => {
                const other = this.getCountry(otherId);
                if (!other) return;

                const energyDep = other.energyDependency?.[countryId] || 0;
                const impact = totalImpact * 8 * (0.3 + energyDep);

                other.stability = Math.max(0, other.stability - impact);
                other.economicPower = Math.max(0, other.economicPower - impact * 0.3);
                affected.push(otherId);
            });
        }
        // Low-impact countries only affect direct neighbors minimally
        else {
            connectedCountries.slice(0, 3).forEach(neighborId => {
                const neighbor = this.getCountry(neighborId);
                if (neighbor) {
                    const impact = totalImpact * 4;
                    neighbor.stability = Math.max(0, neighbor.stability - impact);
                    affected.push(neighborId);
                }
            });
        }
    }

    /**
     * Calculate total impact multiplier for any country (0-1 scale).
     * Based on: influence, energy exports, critical relationships, dependents.
     */
    private calculateCountryImpact(countryId: string): {
        totalImpact: number;
        influenceFactor: number;
        energyFactor: number;
        criticalFactor: number;
        dependencyFactor: number;
    } {
        const country = this.getCountry(countryId);
        if (!country) {
            return { totalImpact: 0.15, influenceFactor: 0, energyFactor: 0, criticalFactor: 0, dependencyFactor: 0 };
        }

        // 1. Influence factor (0-0.25 contribution)
        const influenceFactor = (country.influence / 100) * 0.25;

        // 2. Energy export volume factor (0-0.30 contribution)
        const energyVolume = this.getEnergyExportVolume(countryId);
        const energyFactor = Math.min(energyVolume / 150, 1.0) * 0.30; // Normalize to 150bcm

        // 3. Critical relationships factor (0-0.25 contribution)
        const criticalRels = this.getCriticalRelationshipsCount(countryId);
        const criticalFactor = Math.min(criticalRels / 8, 1.0) * 0.25; // Normalize to 8 critical rels

        // 4. Dependent countries factor (0-0.20 contribution)
        const dependentCount = this.getDependentCountries(countryId).length;
        const dependencyFactor = Math.min(dependentCount / 6, 1.0) * 0.20; // Normalize to 6 dependents

        // Total impact (range: 0.10 to 0.50)
        const totalImpact = Math.max(0.10, Math.min(0.50,
            influenceFactor + energyFactor + criticalFactor + dependencyFactor
        ));

        return { totalImpact, influenceFactor, energyFactor, criticalFactor, dependencyFactor };
    }

    /**
     * Get total energy export volume for a country (from pipelines).
     */
    private getEnergyExportVolume(countryId: string): number {
        // Sum pipeline capacities where this country is the owner/source
        const countryPipelines = this.entities.filter(e =>
            e.type === 'pipeline' && e.parentCountry === countryId
        );

        // Also check relationships for energy exports
        const energyExports = this.relationships.filter(r =>
            r.source === countryId && r.type === 'energy'
        );

        // Estimate volume: pipeline count * 30 bcm + energy relationships * 10 bcm
        return (countryPipelines.length * 30) + (energyExports.length * 10);
    }

    /**
     * Get count of critical relationships for a country.
     */
    private getCriticalRelationshipsCount(countryId: string): number {
        return this.relationships.filter(r =>
            (r.source === countryId || r.target === countryId) && r.critical
        ).length;
    }

    /**
     * Get countries that are highly dependent (>30%) on this country.
     */
    private getDependentCountries(countryId: string): string[] {
        const dependents: string[] = [];

        // Check energy dependencies
        this.countries.forEach(c => {
            if (c.id !== countryId) {
                const dependency = c.energyDependency?.[countryId] || 0;
                if (dependency > 0.30) {
                    dependents.push(c.id);
                }
            }
        });

        // Also check strong relationship targets
        this.relationships
            .filter(r => r.source === countryId && r.strength > 0.50)
            .forEach(r => {
                if (!dependents.includes(r.target)) {
                    dependents.push(r.target);
                }
            });

        return dependents;
    }

    /**
     * Get trade exposure between two countries (0-1 scale).
     */
    private getTradeExposure(countryId: string, targetId: string): number {
        const rel = this.relationships.find(r =>
            (r.source === countryId && r.target === targetId) ||
            (r.source === targetId && r.target === countryId)
        );
        if (!rel) return 0.05; // Baseline global exposure
        return rel.strength * (rel.type === 'trade' ? 1 : (rel.type === 'energy' ? 0.8 : 0.3));
    }

    /**
     * Get countries connected through any relationships.
     */
    private getConnectedCountries(countryId: string): string[] {
        const connected: string[] = [];
        this.relationships.forEach(rel => {
            if (rel.source === countryId && rel.target !== countryId) {
                connected.push(rel.target);
            } else if (rel.target === countryId && rel.source !== countryId) {
                connected.push(rel.source);
            }
        });
        return [...new Set(connected)];
    }

    private async runCascade(initialAffected: string[], actorId?: string | null): Promise<void> {
        const queue: PropagationNode[] = initialAffected.map(id => ({
            entityId: id,
            depth: 0,
            effectStrength: 1.0,
            source: null,
        }));

        const visited = new Set<string>();

        while (queue.length > 0 && this.currentTick < CONFIG.MAX_TICKS) {
            const node = queue.shift()!;

            if (visited.has(node.entityId) || node.effectStrength < CONFIG.MIN_EFFECT_STRENGTH) {
                continue;
            }

            visited.add(node.entityId);

            const newAffected = this.propagateEffect(node);
            const shadowAffected: string[] = [];
            this.processShadowActors(shadowAffected); // [Refinement] Shadow Actor Autonomy

            const radicalAffected: string[] = [];
            this.processRadicalization(radicalAffected); // [Refinement] Radial Radicalization

            // [Refinement] Real-time AI Dynamic Influence
            // AI occasionally probes or mutates the system during a cascade
            if (this.currentTick % 5 === 0 && Math.random() > 0.6) {
                this.injectAIEntropy();
            }

            // [Adaptive Rules] Dynamic propagation decay & relationship breaking
            const snapshot = this.captureSnapshot();
            // As data drift (uncertainty) increases, the system becomes more conductive to chaos (higher decay value = less weakening)
            const adaptiveDecay = Math.min(0.95, CONFIG.PROPAGATION_DECAY + (snapshot.dataDrift * 0.25));
            // Break relationships more easily in chaos
            const adaptiveBreakThreshold = Math.min(0.6, CONFIG.RELATIONSHIP_BREAK_THRESHOLD + (snapshot.dataDrift * 0.3));

            newAffected.forEach(affected => {
                if (!visited.has(affected.entityId)) {
                    queue.push({
                        ...affected,
                        depth: node.depth + 1,
                        effectStrength: node.effectStrength * adaptiveDecay,
                    });
                }
            });

            // [Refinement] Logistics Fragility: Global Hub Check
            const brokenHubs = this.countries.filter(c => c.isGlobalHub && (c.phase === 'UNSTABLE' || c.phase === 'COLLAPSED'));
            const recoveryMultiplier = brokenHubs.length > 0 ? 0.3 : 1.0; // [Adaptive] Harsher recovery penalty

            // Stabilization/Recovery Logic
            const currentlyAffectedIds = new Set([...initialAffected, ...newAffected.map(n => n.entityId), ...shadowAffected]);
            this.countries.forEach(c => {
                if (c.stability < 100 && !currentlyAffectedIds.has(c.id)) {
                    // Countries recover naturally if not currently in the cascade
                    c.stability = Math.min(100, c.stability + (0.5 * recoveryMultiplier));
                }
            });

            this.applyFeedbackLoops();
            this.applyMarketNoise(shadowAffected); // Inject noise into affected list
            this.checkThresholds();
            this.checkRelationshipBreaks(adaptiveBreakThreshold);
            this.tick();
            await this.delay(10);
        }

        this.applyFeedbackLoops();
        this.checkThresholds();
    }

    private propagateEffect(node: PropagationNode): PropagationNode[] {
        const affectedNodes: PropagationNode[] = [];
        const rels = this.relationships.filter(r =>
            r.source === node.entityId || r.target === node.entityId
        );

        rels.forEach(rel => {
            const otherId = rel.source === node.entityId ? rel.target : rel.source;

            // [Refinement] Chaos Factor: Introduce ±15% variance to ensure every run is unique (Emergent Behavior)
            const chaosFactor = 0.85 + Math.random() * 0.30;
            let effectMultiplier = rel.strength * node.effectStrength * chaosFactor;

            if (rel.critical) effectMultiplier *= 1.5;

            if (rel.type === 'energy') {
                const targetCountry = this.getCountry(otherId);
                if (targetCountry) {
                    const impact = effectMultiplier * 15;
                    const oldStability = targetCountry.stability;
                    targetCountry.stability = Math.max(0, targetCountry.stability - impact);
                    targetCountry.economicPower = Math.max(0, targetCountry.economicPower - impact * 0.8);

                    if (impact > 5) {
                        this.logEvent({
                            type: 'effect',
                            description: `${targetCountry.name} affected by energy cascade`,
                            severity: impact > 15 ? 'high' : 'medium',
                            entities: [otherId],
                            changes: [{
                                entityId: otherId,
                                property: 'stability',
                                oldValue: oldStability,
                                newValue: targetCountry.stability,
                            }],
                        });
                    }
                }
            }

            if (rel.type === 'trade') {
                const targetCountry = this.getCountry(otherId);
                if (targetCountry) {
                    const impact = effectMultiplier * 10;
                    targetCountry.economicPower = Math.max(0, targetCountry.economicPower - impact);
                    targetCountry.stability = Math.max(0, targetCountry.stability - impact * 0.5);
                }
            }

            if (effectMultiplier > CONFIG.MIN_EFFECT_STRENGTH) {
                affectedNodes.push({
                    entityId: otherId,
                    depth: node.depth + 1,
                    effectStrength: effectMultiplier,
                    source: node.entityId,
                });
            }
        });

        return affectedNodes;
    }

    private checkThresholds(): void {
        this.countries.forEach(country => {
            const dynamicThreshold = this.calculateDynamicThreshold(country);
            const oldPhase = country.phase;
            const newPhase = getPhaseFromStability(country.stability);

            if (oldPhase !== newPhase) {
                country.phase = newPhase;

                // [LLM] Record major phase shifts for AI context
                const phaseEvent = `${country.name} transitioned to ${newPhase}`;
                this.recentEvents.unshift(phaseEvent);
                if (this.recentEvents.length > 5) this.recentEvents.pop();
                this.triggerAICoherenceUpdate(true);

                if (country.stability < dynamicThreshold && oldPhase !== 'COLLAPSED') {
                    const thresholdMsg = `${country.name} crossed collapse threshold (${country.stability.toFixed(1)}%)`;
                    this.logEvent({
                        type: 'threshold',
                        description: thresholdMsg,
                        severity: 'critical',
                        entities: [country.id],
                        changes: [],
                    });
                    this.triggerRegionalEffects(country);
                }
            }
        });
    }

    private calculateDynamicThreshold(country: Country): number {
        const shockPenalty = country.shockHistory * CONFIG.SHOCK_THRESHOLD_DECREASE;
        return Math.max(40, CONFIG.BASE_COLLAPSE_THRESHOLD - shockPenalty);
    }

    private triggerRegionalEffects(collapsedCountry: Country): void {
        this.entities
            .filter(e => e.parentCountry === collapsedCountry.id && e.layer === 'ethnic')
            .forEach(e => {
                e.revealed = true;
                e.influence += 20;
            });
    }

    private calculateCoherence(): number {
        // 1. Base network integrity (all relationships)
        const totalRels = this.relationships.length;
        if (totalRels === 0) return 100;

        const avgStrength = this.relationships.reduce((sum, r) => sum + r.strength, 0) / totalRels;

        // 2. Structural stress penalty (based on count of unstable/collapsed countries)
        const unstableCount = this.countries.filter(c => c.phase === 'UNSTABLE' || c.phase === 'COLLAPSED').length;
        const stabilityPenalty = unstableCount > 0
            ? 0.10 + (unstableCount / this.countries.length) * 0.60
            : 0;

        // 3. Shock penalty (increases with global shock history)
        const shockFactor = Math.min(0.25, this.globalShockHistory * 0.05);

        // 4. Global Trust linkage (low trust makes connections more brittle)
        const trustBonus = (this.globalTrust - 0.5) * 0.2; // -0.1 to +0.1

        // 5. Calculate formula-based coherence (0-100)
        let formulaCoherence = (avgStrength - stabilityPenalty - shockFactor + trustBonus) * 100;
        formulaCoherence = Math.max(2, Math.min(100, formulaCoherence));

        // 6. [LLM] Blend with AI-driven coherence (30% AI, 70% formula for physics-priority dynamism)
        const blendedCoherence = (this.aiCoherenceCache * 0.3) + (formulaCoherence * 0.7);

        // 7. Trigger async AI update (non-blocking)
        this.triggerAICoherenceUpdate();

        // Add a slight "breathing" jitter to make it feel alive
        const jitter = (Math.sin(this.currentTick * 0.5) * 0.5);

        return Math.max(0, Math.min(100, blendedCoherence + jitter));
    }

    private triggerAICoherenceUpdate(force: boolean = false): void {
        // Fire-and-forget async call to update cached AI coherence
        AICoherenceAnalyzer.analyze({
            countries: this.countries,
            relationships: this.relationships.map(r => ({ strength: r.strength, type: r.type })),
            globalTrust: this.globalTrust,
            recentEvents: this.recentEvents,
            force: force
        }).then(aiValue => {
            this.aiCoherenceCache = aiValue;
        }).catch(() => {
            // Silent failure, use cached value
        });
    }

    private applyFeedbackLoops(): void {
        this.relationships.forEach(rel => {
            const source = this.getCountry(rel.source);
            const target = this.getCountry(rel.target);
            if (!source || !target) return;

            // Drastic drop if either is collapsed
            if (source.phase === 'COLLAPSED' || target.phase === 'COLLAPSED') {
                rel.strength *= 0.98; // Small decay per tick instead of massive jump
            }
            // Progressive erosion if unstable
            else if (source.phase === 'UNSTABLE' || target.phase === 'UNSTABLE') {
                rel.strength *= 0.995; // Very subtle decay per tick
            }
        });
    }

    /**
     * applyMarketNoise - Injects system noise and feedback loops based on coherence
     */
    private applyMarketNoise(affected: string[]): void {
        const coherence = this.calculateCoherence();
        const dataDrift = Math.max(0, (100 - coherence) / 100);

        if (dataDrift < 0.2) return; // System is stable, no noise

        // Latent Volatility: Random fluctuations in stability
        this.countries.forEach(c => {
            // Chance of noise increases with drift
            if (Math.random() > 0.98 - (dataDrift * 0.05)) {
                const noise = (Math.random() - 0.5) * 2 * (dataDrift * 2.0);
                const oldStab = c.stability;
                c.stability = Math.max(0, Math.min(100, c.stability + noise));
                if (Math.abs(c.stability - oldStab) > 0.5) affected.push(c.id);
            }
        });

        // Market Hysteria: Cascade effects of low coherence
        if (coherence < 50 && Math.random() > 0.985) {
            const randomCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
            if (randomCountry && randomCountry.stability > 20) {
                randomCountry.stability -= 5 * dataDrift;
                affected.push(randomCountry.id);
                this.logEvent({
                    type: 'effect',
                    description: `Market hysteria triggering liquidation in ${randomCountry.name}`,
                    severity: 'high',
                    entities: [randomCountry.id],
                    changes: [],
                });
            }
        }
    }

    private checkRelationshipBreaks(threshold: number = CONFIG.RELATIONSHIP_BREAK_THRESHOLD): void {
        this.relationships.forEach(rel => {
            if (rel.strength < threshold && rel.strength > 0) {
                this.logEvent({
                    type: 'relationship_break',
                    description: `${rel.label || 'Relationship'} collapsed`,
                    severity: rel.critical ? 'critical' : 'high',
                    entities: [rel.source, rel.target],
                    changes: [],
                });
                rel.strength = 0;
            }
        });
    }

    private detectEmergentEntities(before: SystemSnapshot, after: SystemSnapshot): string[] {
        return this.entities.filter(e => e.revealed && e.influence > 30).map(e => e.id);
    }

    public getCountry(id: string): Country | undefined {
        return this.countries.find(c => c.id === id);
    }

    private captureSnapshot(): SystemSnapshot {
        const countryStabilities: Record<string, number> = {};
        let totalStability = 0;
        this.countries.forEach(country => {
            countryStabilities[country.id] = country.stability;
            totalStability += country.stability;
        });
        const globalStability = totalStability / this.countries.length;
        const coherence = this.calculateCoherence();
        const collapseThreshold = Math.max(40, CONFIG.BASE_COLLAPSE_THRESHOLD - (this.globalShockHistory * CONFIG.SHOCK_THRESHOLD_DECREASE));

        // [Refinement] Epistemic Drift Implementation
        const dataDrift = Math.max(0, (100 - coherence) / 100);

        // Jitter stability values if coherence is low (simulate "Fog of War")
        if (dataDrift > 0.4) {
            Object.keys(countryStabilities).forEach(id => {
                const jitter = (Math.random() - 0.5) * 2 * (dataDrift * 15);
                countryStabilities[id] = Math.max(0, Math.min(100, countryStabilities[id] + jitter));
            });
        }

        return {
            globalStability,
            countryStabilities,
            phase: getPhaseFromStability(globalStability),
            coherence,
            collapseThreshold,
            globalTrust: this.globalTrust,
            dataDrift,
        };
    }

    private applyDirectiveEffect(stabilityBoost: number, coherenceBoost: number, trustCost: number, affected: string[]): void {
        const efficacy = this.globalTrust; // [Refinement] Diminishing Returns

        this.countries.forEach(c => {
            const oldStab = c.stability;
            c.stability = Math.min(100, c.stability + (stabilityBoost * efficacy));
            if (c.stability !== oldStab) affected.push(c.id);
        });

        // Boost relationship strengths for coherence
        this.relationships.forEach(rel => {
            if (rel.type === 'trade' || rel.type === 'political') {
                rel.strength = Math.min(1.0, rel.strength + (coherenceBoost / 100 * efficacy));
            }
        });

        // Decay trust
        this.globalTrust = Math.max(0, this.globalTrust - trustCost);
    }

    private processShadowActors(affected: string[]): void {
        this.entities.filter(e => e.type === 'shadow_actor').forEach(actor => {
            if (actor.parentCountry) {
                const parent = this.getCountry(actor.parentCountry);
                if (parent && parent.stability < 40) {
                    // [Refinement] Autonomous Expansion
                    actor.influence = Math.min(100, actor.influence + 0.5);
                    actor.revealed = true;

                    // Stability Drain
                    parent.stability = Math.max(0, parent.stability - (actor.influence / 200));
                    affected.push(parent.id);
                }
            }
        });
    }

    private processRadicalization(affected: string[]): void {
        const collapsedIds = this.countries
            .filter(c => c.phase === 'UNSTABLE' || c.phase === 'COLLAPSED')
            .map(c => c.id);

        collapsedIds.forEach(sourceId => {
            // Find neighbors/partners
            const targets = this.relationships
                .filter(r => r.source === sourceId || r.target === sourceId)
                .map(r => r.source === sourceId ? r.target : r.source);

            targets.forEach(targetId => {
                const target = this.getCountry(targetId);
                if (target && target.stability > 10) {
                    // Bleed 0.1 stability per collapsed neighbor per tick
                    target.stability = Math.max(0, target.stability - 0.1);
                    if (Math.random() > 0.95) affected.push(targetId); // Randomly trigger cascade
                }
            });
        });
    }

    public handleCurrencyCollapse(countryId: string, severity: number): void {
        const country = this.getCountry(countryId);
        if (country) {
            // [Refinement] Economic Feedback Loopback
            const stabilityHit = severity * 2; // e.g., 15% drop = 30 stability hit
            const oldStability = country.stability;
            country.stability = Math.max(0, country.stability - stabilityHit);

            this.logEvent({
                type: 'effect',
                description: `Hyper-inflation bank run in ${country.name}`,
                severity: severity > 10 ? 'high' : 'medium',
                entities: [countryId],
                changes: [{
                    entityId: countryId,
                    property: 'stability',
                    oldValue: oldStability,
                    newValue: country.stability
                }]
            });
        }
    }

    private applyReciprocalImpacts(targetId: string, initialImpact: number, affected: string[], actorId?: string | null): void {
        // Find countries that TRADE WITH the target. If the target is sanctioned, 
        // these partners lose their export market or supply source.
        const tradePartners = this.relationships
            .filter(r => (r.source === targetId || r.target === targetId) && r.type === 'trade')
            .map(r => r.source === targetId ? r.target : r.source);

        tradePartners.forEach(partnerId => {
            const partner = this.getCountry(partnerId);
            if (!partner) return;

            // CRITICAL FIX: Skip reciprocal impacts if the partner is the ACTOR (sanctioner)
            if (actorId && partnerId === actorId) return;

            // Partner takes a hit because their trade partner is now toxic/sanctioned
            const partnerLoss = initialImpact * 12; // Moderate economic blowback
            partner.economicPower = Math.max(0, partner.economicPower - partnerLoss * 0.5);
            partner.stability = Math.max(0, partner.stability - partnerLoss * 0.2);

            if (partnerLoss > 2) affected.push(partnerId);
        });

        // Special logic for the sanctioned country losing REVENUE from its major buyers
        const target = this.getCountry(targetId);
        if (target) {
            const buyers = this.relationships
                .filter(r => r.source === targetId && (r.type === 'energy' || r.type === 'trade'))
                .map(r => r.target);

            // If major buyers like Germany or China are affected, target's economic power drops further
            const revenueLoss = buyers.length * 5;
            target.economicPower = Math.max(0, target.economicPower - revenueLoss);
        }
    }

    /**
     * [Refinement] AI Scenario Integration: 
     * Allows the engine to be biased by the specific narrative generated by the AI.
     */
    public injectScenarioMetadata(metadata: { intensity: number; affectedCountries: string[] }): void {
        const { intensity, affectedCountries } = metadata;

        affectedCountries.forEach(id => {
            const country = this.getCountry(id.toLowerCase());
            if (country) {
                // Pre-stress these countries so the cascade is more relevant to the AI's story
                country.stability = Math.max(30, country.stability - (intensity * 20));
                country.phase = getPhaseFromStability(country.stability);
            }
        });

        this.globalShockHistory += Math.floor(intensity * 5);
    }

    /**
     * [Refinement] Real-time AI Entropy Injection
     * Simulates the AI "probing" or "influencing" the system in real-time.
     */
    public injectAIEntropy(): void {
        const affected: string[] = [];
        const intensity = 0.5 + (Math.random() * 0.5);

        // Pick a random critical hub to "test"
        const hubs = this.countries.filter(c => c.isGlobalHub);
        const target = hubs[Math.floor(Math.random() * hubs.length)];

        if (target) {
            const oldStab = target.stability;
            // Small ripple: -0.5 to +0.2 Stability
            target.stability = Math.max(0, Math.min(100, target.stability + (Math.random() - 0.7) * 2));

            if (Math.abs(target.stability - oldStab) > 0.5) {
                this.logEvent({
                    type: 'effect',
                    description: `AI Observation: Real-time systemic ripple in ${target.name}`,
                    severity: 'low',
                    entities: [target.id],
                    changes: [{
                        entityId: target.id,
                        property: 'stability',
                        oldValue: oldStab,
                        newValue: target.stability
                    }]
                });
            }
        }

        // Jitter some relationships
        this.relationships.forEach(rel => {
            if (Math.random() > 0.98) {
                rel.strength = Math.max(0.1, Math.min(1.0, rel.strength + (Math.random() - 0.5) * 0.05));
            }
        });
    }

    private logEvent(event: Omit<CascadeEvent, 'id' | 'timestamp' | 'systemState'>): void {
        const fullEvent: CascadeEvent = {
            ...event,
            id: `event_${this.events.length}_${Date.now()}_${++this.eventCounter}`,
            timestamp: this.currentTick * CONFIG.TICK_INTERVAL,
            systemState: this.captureSnapshot(),
        };
        this.events.push(fullEvent);
    }

    private tick(): void {
        this.currentTick++;
        const state = this.captureSnapshot();
        this.tickCallbacks.forEach(cb => cb(state));
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getActionDescription(action: ActionType, targetId?: string): string {
        const targetName = targetId ? (this.getCountry(targetId)?.name || targetId) : 'Target';
        const descriptions: Record<ActionType, string> = {
            'SANCTION_RUSSIA': 'Massive economic sanctions applied to Russia',
            'SANCTION_CHINA': 'Trade restrictions imposed on Chinese manufacturing',
            'SANCTION_USA': 'Global decoupling from US financial hegemony',
            'SANCTION_IRAN': 'Energy export ban on Iranian reserves',
            'BLOCK_PIPELINE': 'Critical energy infrastructure sabotage',
            'DISSOLVE_ALLIANCE': 'Strategic military alliance collapse',
            'ECONOMIC_CRISIS': 'Global financial market flash crash',
            'MILITARY_TENSION': 'Escalating border conflicts and militarization',
            'ENERGY_CUTOFF': 'Retaliatory total energy export shutdown',
            'UK_EXIT': 'United Kingdom decouples from European union',
            'BLOCK_BOSPHORUS': 'Total maritime blockade of the Bosphorus strait',
            'SANCTION_COUNTRY': `Targeted individual sanctions against ${targetName}`,
            'DIRECTIVE_STIMULUS': 'Emergency G7 liquidity injection',
            'DIRECTIVE_LOCKDOWN': 'Domestic border stabilization protocols',
            'DIRECTIVE_ACCORD': 'Global summit for systemic restoration',
            'DIRECTIVE_NATIONALIZE': 'State seizure of critical resource flows'
        };
        return descriptions[action];
    }
}

// ============================================================================
// SINGLETON EXPORTS
// ============================================================================

let engineInstance: CascadeEngine | null = null;

/**
 * Get the global CascadeEngine instance
 */
export function getCascadeEngine(): CascadeEngine {
    if (!engineInstance) {
        engineInstance = new CascadeEngine();
    }
    return engineInstance;
}

/**
 * Reset and return a new CascadeEngine instance
 */
export function resetCascadeEngine(): CascadeEngine {
    engineInstance = new CascadeEngine();
    return engineInstance;
}

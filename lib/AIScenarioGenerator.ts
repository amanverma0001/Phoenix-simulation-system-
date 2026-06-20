"use client";

import { aiEngine } from './AIEngine';

/**
 * AIScenarioGenerator - Generates infinite unique geopolitical scenarios
 */

export interface GeneratedScenario {
    title: string;
    description: string;
    triggerEvent: string;
    affectedCountries: string[];
    primaryAction: {
        type: 'sanction' | 'blockade' | 'alliance_break' | 'cyber_attack' | 'economic_crisis';
        actor: string;
        target: string;
        intensity: number;
    };
    expectedOutcome: {
        winners: Array<{ country: string; reason: string }>;
        losers: Array<{ country: string; reason: string }>;
    };
    estimatedCascadeTime: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

// Fallback scenarios when AI is unavailable
const FALLBACK_SCENARIOS: GeneratedScenario[] = [
    {
        title: "Arctic Resource Rush",
        description: "Melting ice caps reveal massive rare earth deposits, triggering a scramble for control.",
        triggerEvent: "Russia plants flag on newly accessible Arctic shelf",
        affectedCountries: ["Russia", "Canada", "Norway", "United States", "China"],
        primaryAction: {
            type: "blockade",
            actor: "Russia",
            target: "Norway",
            intensity: 0.7
        },
        expectedOutcome: {
            winners: [{ country: "China", reason: "Diversifies supply chain during chaos" }],
            losers: [{ country: "Norway", reason: "Loses access to fishing grounds" }]
        },
        estimatedCascadeTime: 8.5,
        difficulty: "hard"
    },
    {
        title: "Digital Dollar Collapse",
        description: "A quantum computing breakthrough cracks major cryptocurrency networks overnight.",
        triggerEvent: "China demonstrates quantum supremacy attack on Bitcoin",
        affectedCountries: ["United States", "China", "Japan", "Germany", "Switzerland"],
        primaryAction: {
            type: "cyber_attack",
            actor: "China",
            target: "United States",
            intensity: 0.9
        },
        expectedOutcome: {
            winners: [{ country: "Switzerland", reason: "Gold reserves skyrocket in value" }],
            losers: [{ country: "United States", reason: "Tech sector crashes" }]
        },
        estimatedCascadeTime: 5.0,
        difficulty: "extreme"
    },
    {
        title: "Mediterranean Water Wars",
        description: "Severe drought triggers conflict over shared water resources in Southern Europe.",
        triggerEvent: "Spain diverts river flow from Portugal",
        affectedCountries: ["Spain", "Portugal", "France", "Italy", "Morocco"],
        primaryAction: {
            type: "sanction",
            actor: "Portugal",
            target: "Spain",
            intensity: 0.6
        },
        expectedOutcome: {
            winners: [{ country: "Morocco", reason: "Becomes desalination tech leader" }],
            losers: [{ country: "Spain", reason: "EU sanctions devastate economy" }]
        },
        estimatedCascadeTime: 10.0,
        difficulty: "medium"
    }
];

export class AIScenarioGenerator {
    private themes = [
        'energy crisis', 'cyber warfare', 'climate disaster',
        'economic collapse', 'technological disruption', 'pandemic',
        'space race', 'water shortage', 'rare earth crisis',
        'AI uprising', 'nuclear standoff', 'migration crisis'
    ];

    async generateRandomScenario(): Promise<GeneratedScenario> {
        const theme = this.themes[Math.floor(Math.random() * this.themes.length)];

        const prompt = `Generate a creative geopolitical collapse scenario about ${theme}.

Requirements:
- Must be plausible but dramatic
- Should involve 3-5 countries
- Clear trigger event
- Cascade effects
- Unexpected winners/losers

Respond with ONLY JSON:
{
  "title": "short catchy title",
  "description": "2-3 sentence description",
  "triggerEvent": "what starts it",
  "affectedCountries": ["country1", "country2"],
  "primaryAction": {
    "type": "sanction|blockade|alliance_break|cyber_attack|economic_crisis",
    "actor": "country",
    "target": "country",
    "intensity": 0.8
  },
  "expectedOutcome": {
    "winners": [{"country": "...", "reason": "..."}],
    "losers": [{"country": "...", "reason": "..."}]
  },
  "estimatedCascadeTime": 7.5,
  "difficulty": "easy|medium|hard|extreme"
}`;

        try {
            const result = await aiEngine.generateJson(prompt);
            return this.validateScenario(result);
        } catch (error) {
            console.warn('AI Scenario generation failed, using fallback:', error);
            return this.getRandomFallback();
        }
    }

    async generateFromPrompt(userPrompt: string): Promise<GeneratedScenario> {
        const prompt = `The user wants a scenario: "${userPrompt}"

Create a detailed geopolitical collapse scenario based on this.

Respond with ONLY JSON:
{
  "title": "short catchy title",
  "description": "2-3 sentence description",
  "triggerEvent": "what starts it",
  "affectedCountries": ["country1", "country2"],
  "primaryAction": {
    "type": "sanction|blockade|alliance_break|cyber_attack|economic_crisis",
    "actor": "country",
    "target": "country",
    "intensity": 0.8
  },
  "expectedOutcome": {
    "winners": [{"country": "...", "reason": "..."}],
    "losers": [{"country": "...", "reason": "..."}]
  },
  "estimatedCascadeTime": 7.5,
  "difficulty": "easy|medium|hard|extreme"
}`;

        try {
            const result = await aiEngine.generateJson(prompt);
            return this.validateScenario(result);
        } catch (error) {
            console.warn('Custom scenario generation failed:', error);
            return this.getRandomFallback();
        }
    }

    async generateDailyScenario(): Promise<GeneratedScenario> {
        const today = new Date().toISOString().split('T')[0];
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

        // Use day of year to select a consistent theme
        const theme = this.themes[dayOfYear % this.themes.length];

        const prompt = `Generate today's featured geopolitical scenario (${today}) about ${theme}.

Make it feel like a "daily challenge" that's topical and interesting.

Respond with ONLY JSON (same structure as before).`;

        try {
            const result = await aiEngine.generateJson(prompt);
            return this.validateScenario(result);
        } catch (error) {
            // Use day of year as index for consistent daily fallback
            return FALLBACK_SCENARIOS[dayOfYear % FALLBACK_SCENARIOS.length];
        }
    }

    private validateScenario(scenario: any): GeneratedScenario {
        // Ensure all required fields exist with defaults
        return {
            title: scenario.title || "Unknown Scenario",
            description: scenario.description || "A geopolitical event unfolds.",
            triggerEvent: scenario.triggerEvent || "Unknown trigger",
            affectedCountries: scenario.affectedCountries || ["Unknown"],
            primaryAction: {
                type: scenario.primaryAction?.type || "sanction",
                actor: scenario.primaryAction?.actor || "Unknown",
                target: scenario.primaryAction?.target || "Unknown",
                intensity: scenario.primaryAction?.intensity || 0.5
            },
            expectedOutcome: {
                winners: scenario.expectedOutcome?.winners || [],
                losers: scenario.expectedOutcome?.losers || []
            },
            estimatedCascadeTime: scenario.estimatedCascadeTime || 10,
            difficulty: scenario.difficulty || "medium"
        };
    }

    private getRandomFallback(): GeneratedScenario {
        return FALLBACK_SCENARIOS[Math.floor(Math.random() * FALLBACK_SCENARIOS.length)];
    }
}

export const aiScenarioGenerator = new AIScenarioGenerator();

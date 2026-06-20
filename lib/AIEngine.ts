/**
 * GeminiAIEngine - Core integration for Google Gemini API
 * Using native fetch for browser compatibility.
 */

// Simple in-memory cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60000; // Cache for 60 seconds

// Rate limiting state
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 2000; // Reduced to 2s for live dynamism

class GeminiAIEngine {
    private requestCount = 0;
    private quotaExhausted = false;
    private quotaResetTime = 0;

    private getCacheKey(prompt: string): string {
        return prompt.slice(0, 150).replace(/\s+/g, '_');
    }

    private getFromCache(key: string): any | null {
        const cached = responseCache.get(key);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return cached.data;
        }
        return null;
    }

    private setCache(key: string, data: any): void {
        responseCache.set(key, { data, timestamp: Date.now() });
    }

    private async throttle(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        const interval = MIN_REQUEST_INTERVAL_MS;

        if (timeSinceLastRequest < interval) {
            const waitTime = interval - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        lastRequestTime = Date.now();
    }

    private isQuotaAvailable(): boolean {
        if (!this.quotaExhausted) return true;
        if (Date.now() > this.quotaResetTime) {
            this.quotaExhausted = false;
            return true;
        }
        return false;
    }

    async generateJson<T>(prompt: string, fallback?: T, chaosLevel: number = 0): Promise<T> {
        const cacheKey = this.getCacheKey(prompt);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached as T;

        // Use Gemini 2.5 Flash API
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

        // If no API key, use fallback silently
        if (!apiKey) {
            console.warn("[Gemini] No API key found, using fallback");
            return (fallback ?? this.getFallbackJson()) as T;
        }

        console.log("[Gemini] API key found, making request...");

        if (!this.isQuotaAvailable()) {
            return (fallback ?? this.getFallbackJson()) as T;
        }

        await this.throttle();

        // Chaos-aware prompting - AI becomes more chaotic as stability drops
        const chaosContext = chaosLevel > 50
            ? `\n[SYSTEM STATE: CRITICAL INSTABILITY at ${100 - chaosLevel}% stability. Your response should reflect this chaos - be more dramatic, uncertain, and fragmented. Use shorter sentences. Express doubt. The system is breaking down.]`
            : chaosLevel > 30
                ? `\n[SYSTEM STATE: ELEVATED STRESS at ${100 - chaosLevel}% stability. Your analysis should convey tension and urgency.]`
                : '';

        // Increase temperature with chaos for more varied/unpredictable outputs
        const temperature = Math.min(0.7 + (chaosLevel * 0.005), 1.2);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: "user",
                            parts: [{
                                text: `You are a specialized geopolitical simulation AI. Respond ONLY with valid JSON, no markdown or explanation.${chaosContext}\n\n${prompt}`
                            }]
                        }],
                        generationConfig: {
                            temperature,
                            topP: 0.9,
                            maxOutputTokens: 2048
                        }
                    })
                }
            );

            if (!response.ok) {
                // If the key is expired or quota hit, treat as exhausted and use fallback silently
                if (response.status === 429 || response.status === 400) {
                    this.quotaExhausted = true;
                    this.quotaResetTime = Date.now() + 86400000; // 24 hours
                }
                // Do not spam console.error for auth/quota issues, just notify via warn
                console.warn(`[Gemini API] Restricted (Status ${response.status}). Using fallback.`);
                throw new Error(`Gemini API Restricted`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                // Clean potential markdown code blocks
                const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                // Safety check for empty response
                if (!cleanedText || cleanedText.length < 2) {
                    console.warn("[Gemini] Empty response, using fallback");
                    return (fallback ?? this.getFallbackJson()) as T;
                }

                try {
                    const parsed = JSON.parse(cleanedText);
                    this.setCache(cacheKey, parsed);
                    this.requestCount++;
                    return parsed as T;
                } catch (parseError) {
                    console.warn("[Gemini] JSON parse failed, using fallback");
                    return (fallback ?? this.getFallbackJson()) as T;
                }
            }
        } catch (e: any) {
            // Silently use fallback
        }


        return (fallback ?? this.getFallbackJson()) as T;
    }

    async generateText(prompt: string): Promise<string> {
        const cacheKey = 'text_' + this.getCacheKey(prompt);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        // Use Gemini 2.5 Flash API
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

        // Silent fallback if no key or quota exhausted
        if (!apiKey || !this.isQuotaAvailable()) {
            return this.getFallbackText();
        }

        await this.throttle();

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: "user",
                            parts: [{
                                text: `You are the AI interface for a geopolitical simulation. Be analytical and dramatic. Keep responses concise (2-3 sentences max).\n\n${prompt}`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.8,
                            topP: 0.9,
                            maxOutputTokens: 256
                        }
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 429 || response.status === 400) {
                    this.quotaExhausted = true;
                    this.quotaResetTime = Date.now() + 86400000;
                }
                throw new Error(`API unavailable`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

            if (text) {
                this.setCache(cacheKey, text);
                this.requestCount++;
                return text;
            }
        } catch (e: any) {
            // Silent fallback - no console spam
        }

        return this.getFallbackText();
    }

    // Gemini-specific method for AIOracle (separate from DeepSeek)
    async generateJsonWithGemini<T>(prompt: string, fallback?: T, chaosLevel: number = 0): Promise<T> {
        const cacheKey = 'gemini_' + this.getCacheKey(prompt);
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached as T;

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

        if (!apiKey || !this.isQuotaAvailable()) {
            return (fallback ?? this.getFallbackJson()) as T;
        }

        await this.throttle();

        const chaosContext = chaosLevel > 50
            ? `\n[SYSTEM STATE: CRITICAL INSTABILITY at ${100 - chaosLevel}% stability.]`
            : '';

        const temperature = Math.min(0.7 + (chaosLevel * 0.005), 1.2);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: "user",
                            parts: [{
                                text: `You are a specialized geopolitical simulation AI. Respond ONLY with valid JSON, no markdown.${chaosContext}\n\n${prompt}`
                            }]
                        }],
                        generationConfig: {
                            temperature,
                            topP: 0.9,
                            maxOutputTokens: 1024
                        }
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 429 || response.status === 400) {
                    this.quotaExhausted = true;
                    this.quotaResetTime = Date.now() + 86400000;
                }
                throw new Error(`Gemini API unavailable`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                const parsed = JSON.parse(cleanedText);
                this.setCache(cacheKey, parsed);
                this.requestCount++;
                return parsed as T;
            }
        } catch (e: any) {
            // Silent fallback
        }

        return (fallback ?? this.getFallbackJson()) as T;
    }

    private getFallbackJson(): any {
        return {
            trigger: "Analyzing cascading geopolitical instabilities...",
            cascadePath: ["Primary Impact", "Secondary Ripples", "Global Adjustment"],
            unexpectedWinners: [{ country: "Neutral Nations", reason: "Safe haven capital flows", gain: 15 }],
            unexpectedLosers: [{ country: "Dependent States", reason: "Supply chain disruption", loss: 20 }],
            timelineSeconds: 45,
            confidence: 72,
            reasoning: "The simulation is processing real-time geopolitical dynamics."
        };
    }

    private getFallbackText(): string {
        const fallbacks = [
            "Cascading instabilities detected across multiple sovereign boundaries.",
            "Geopolitical fault lines are shifting. Expect secondary tremors.",
            "The global order is recalibrating. New power dynamics emerging.",
            "System coherence degrading. Entropy accelerating across sectors.",
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    getStats() {
        return {
            requestCount: this.requestCount,
            quotaExhausted: this.quotaExhausted,
            cacheSize: responseCache.size
        };
    }
}

export const aiEngine = new GeminiAIEngine();

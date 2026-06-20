/**
 * Currency Exchange Service
 * Fetches real-time currency rates from free APIs
 */

export interface CurrencyRate {
    code: string
    name: string
    country: string
    flag: string
    rate: number
    previousRate: number
    change: number
    changePercent: number
    lastUpdated: Date
}

export interface CurrencyData {
    base: string
    rates: Record<string, number>
    timestamp: number
}

// Currency metadata
const CURRENCY_INFO: Record<string, { name: string; country: string; flag: string }> = {
    EUR: { name: 'Euro', country: 'EU', flag: '🇪🇺' },
    INR: { name: 'Indian Rupee', country: 'India', flag: '🇮🇳' },
    RUB: { name: 'Russian Ruble', country: 'Russia', flag: '🇷🇺' },
    CNY: { name: 'Chinese Yuan', country: 'China', flag: '🇨🇳' },
    GBP: { name: 'British Pound', country: 'UK', flag: '🇬🇧' },
    JPY: { name: 'Japanese Yen', country: 'Japan', flag: '🇯🇵' },
    CHF: { name: 'Swiss Franc', country: 'Switzerland', flag: '🇨🇭' },
    BRL: { name: 'Brazilian Real', country: 'Brazil', flag: '🇧🇷' },
    AUD: { name: 'Australian Dollar', country: 'Australia', flag: '🇦🇺' },
    CAD: { name: 'Canadian Dollar', country: 'Canada', flag: '🇨🇦' },
}

// Store previous rates for calculating change
let previousRates: Record<string, number> = {}

/**
 * Fetch real currency rates from exchangerate.host API
 * This API is free and requires no API key
 */
export async function fetchRealCurrencyRates(): Promise<CurrencyRate[]> {
    const symbols = Object.keys(CURRENCY_INFO).join(',')

    try {
        // Try exchangerate.host first (no API key required)
        const response = await fetch(
            `https://api.exchangerate.host/latest?base=USD&symbols=${symbols}`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        )

        if (!response.ok) {
            throw new Error('exchangerate.host failed')
        }

        const data: CurrencyData = await response.json()

        if (!data.rates) {
            throw new Error('No rates in response')
        }

        return processRates(data.rates)
    } catch (error) {
        console.warn('[CurrencyService] Primary API failed, trying backup...')

        try {
            // Backup: try a different free API
            const response = await fetch(
                `https://open.er-api.com/v6/latest/USD`
            )

            if (!response.ok) {
                throw new Error('Backup API failed')
            }

            const data = await response.json()
            return processRates(data.rates)
        } catch (backupError) {
            console.error('[CurrencyService] All APIs failed:', backupError)
            // Return fallback mock data
            return getFallbackRates()
        }
    }
}

function processRates(rates: Record<string, number>): CurrencyRate[] {
    const result: CurrencyRate[] = []

    for (const [code, rate] of Object.entries(rates)) {
        const info = CURRENCY_INFO[code]
        if (!info) continue

        const prevRate = previousRates[code] || rate
        const change = rate - prevRate
        const changePercent = prevRate > 0 ? (change / prevRate) * 100 : 0

        result.push({
            code,
            name: info.name,
            country: info.country,
            flag: info.flag,
            rate,
            previousRate: prevRate,
            change,
            changePercent,
            lastUpdated: new Date()
        })
    }

    // Update previous rates for next comparison
    previousRates = { ...rates }

    return result
}

/**
 * Get fallback rates if API fails
 */
function getFallbackRates(): CurrencyRate[] {
    const fallbackRates: Record<string, number> = {
        EUR: 0.92,
        INR: 83.12,
        RUB: 89.50,
        CNY: 7.24,
        GBP: 0.79,
        JPY: 149.80,
        CHF: 0.88,
        BRL: 4.97,
        AUD: 1.53,
        CAD: 1.36,
    }

    return Object.entries(fallbackRates).map(([code, rate]) => {
        const info = CURRENCY_INFO[code]
        const prevRate = previousRates[code] || rate
        // Add small random variation for visual interest
        const variance = rate * (Math.random() * 0.002 - 0.001)
        const newRate = rate + variance
        const change = newRate - prevRate
        const changePercent = prevRate > 0 ? (change / prevRate) * 100 : 0

        previousRates[code] = newRate

        return {
            code,
            name: info?.name || code,
            country: info?.country || 'Unknown',
            flag: info?.flag || '🏳️',
            rate: newRate,
            previousRate: prevRate,
            change,
            changePercent,
            lastUpdated: new Date()
        }
    })
}

/**
 * Apply simulation instability to rates
 * This modifies rates based on global stability for dramatic effect
 */
export function applyInstabilityToRates(
    rates: CurrencyRate[],
    globalStability: number,
    countryStabilities?: Record<string, number>
): CurrencyRate[] {
    return rates.map(rate => {
        // Base instability factor from global stability
        const instability = (100 - globalStability) / 100 // 0 to 1

        // Country-specific instability
        const countryStability = countryStabilities?.[rate.country] ?? globalStability
        const countryInstability = (100 - countryStability) / 100

        // Combine instabilities
        const totalInstability = (instability * 0.6 + countryInstability * 0.4)

        // Calculate volatility adjustment (dramatic during crisis)
        const volatilityMultiplier = 1 + (totalInstability * 0.15) // Up to 15% swing
        const randomSwing = (Math.random() - 0.5) * 2 * volatilityMultiplier

        const adjustedRate = rate.rate * (1 + randomSwing * 0.01)
        const change = adjustedRate - rate.previousRate
        const changePercent = rate.previousRate > 0 ? (change / rate.previousRate) * 100 : 0

        return {
            ...rate,
            rate: adjustedRate,
            change,
            changePercent
        }
    })
}

import { database } from './firebase';
import { ref, set, get, update, onValue, push, child } from 'firebase/database';

export interface GeopoliticalData {
    countries: Record<string, any>;
    cascade_triggers: Record<string, any>;
}

export class RealtimeDatabaseService {
    /**
     * Save the entire geopolitical dataset to the database
     */
    async saveGeopoliticalData(data: GeopoliticalData) {
        const dataRef = ref(database, 'geopolitical_data');
        try {
            await set(dataRef, data);
            console.log('Geopolitical data saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving geopolitical data:', error);
            throw error;
        }
    }

    /**
     * Fetch all country data
     */
    async getAllCountries() {
        const countriesRef = ref(database, 'geopolitical_data/countries');
        try {
            const snapshot = await get(countriesRef);
            return snapshot.val();
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw error;
        }
    }

    /**
     * Update specific country metrics
     */
    async updateCountryMetrics(countryId: string, metrics: any) {
        const metricsRef = ref(database, `geopolitical_data/countries/${countryId.toLowerCase()}/metrics`);
        try {
            await update(metricsRef, metrics);
            return true;
        } catch (error) {
            console.error(`Error updating metrics for ${countryId}:`, error);
            throw error;
        }
    }

    /**
     * Subscribe to real-time updates for a specific country
     */
    subscribeToCountry(countryId: string, callback: (data: any) => void) {
        const countryRef = ref(database, `geopolitical_data/countries/${countryId.toLowerCase()}`);
        return onValue(countryRef, (snapshot) => {
            callback(snapshot.val());
        });
    }

    /**
     * Save a simulation session result
     */
    async saveSimulationResult(sessionId: string, result: any) {
        const resultRef = ref(database, `simulation_results/${sessionId}`);
        try {
            await set(resultRef, {
                ...result,
                timestamp: Date.now()
            });
            return true;
        } catch (error) {
            console.error('Error saving simulation result:', error);
            throw error;
        }
    }

    /**
     * Fetch all cascade triggers
     */
    async getCascadeTriggers() {
        const triggersRef = ref(database, 'geopolitical_data/cascade_triggers');
        try {
            const snapshot = await get(triggersRef);
            return snapshot.val();
        } catch (error) {
            console.error('Error fetching cascade triggers:', error);
            throw error;
        }
    }
}

export const realtimeDb = new RealtimeDatabaseService();

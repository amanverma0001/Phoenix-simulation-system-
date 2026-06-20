/**
 * Database Seed Script
 * Run this to populate Firebase Realtime Database with all country data
 * 
 * Usage: 
 * 1. Import in a component or page
 * 2. Call seedCompleteDatabase() once
 * 
 * Or add a button in your app to trigger it
 */

'use client';

import { useState } from 'react';
import { seedCompleteDatabase } from '../lib/FirestoreCountryService';

export default function SeedDatabaseButton() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSeed = async () => {
        setIsSeeding(true);
        setStatus('idle');
        setMessage('');

        try {
            await seedCompleteDatabase();
            setStatus('success');
            setMessage('✅ Database seeded successfully with all countries and scenarios!');
        } catch (error) {
            setStatus('error');
            setMessage(`❌ Error seeding database: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="p-6 bg-slate-900 border border-cyan-500/30 rounded-xl">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">🔥 Firebase Database Seeder</h2>
            <p className="text-white/60 mb-4 text-sm">
                Click the button below to populate your Firebase Realtime Database with all 25+ countries and their relationships.
            </p>

            <button
                onClick={handleSeed}
                disabled={isSeeding}
                className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${isSeeding
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400'
                    }`}
            >
                {isSeeding ? '⏳ Seeding...' : '🚀 Seed Database'}
            </button>

            {message && (
                <div className={`mt-4 p-3 rounded-lg ${status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {message}
                </div>
            )}

            <div className="mt-6 text-xs text-white/40">
                <p className="font-bold text-white/60 mb-2">Data that will be seeded:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>25+ countries with full profiles</li>
                    <li>Neighbors, allies, rivals relationships</li>
                    <li>Trade partners and energy dependencies</li>
                    <li>Vulnerabilities and strengths</li>
                    <li>8 scenario impact configurations</li>
                </ul>
            </div>
        </div>
    );
}

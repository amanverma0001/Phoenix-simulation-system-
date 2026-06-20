'use client';

import { useEffect, useState } from 'react';
import { seedCompleteDatabase } from '../../lib/FirestoreCountryService';

export default function SeedPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Starting database seed...');

    useEffect(() => {
        const seed = async () => {
            try {
                setMessage('Seeding countries and scenarios to Firebase...');
                await seedCompleteDatabase();
                setStatus('success');
                setMessage('✅ Database seeded successfully! All 25+ countries and 8 scenarios are now in Firebase.');
            } catch (error) {
                setStatus('error');
                setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };

        seed();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
            <div className="max-w-lg w-full p-8 bg-slate-900 border border-cyan-500/30 rounded-2xl">
                <h1 className="text-2xl font-bold text-cyan-400 mb-4">🔥 Firebase Database Seeder</h1>

                <div className={`p-4 rounded-lg ${status === 'loading' ? 'bg-yellow-500/20 text-yellow-400' :
                        status === 'success' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                    }`}>
                    {status === 'loading' && <span className="animate-pulse">⏳ </span>}
                    {message}
                </div>

                {status === 'success' && (
                    <div className="mt-6 text-white/60 text-sm">
                        <p className="font-bold text-white mb-2">Data seeded:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>25+ countries with full profiles</li>
                            <li>Neighbors, allies, rivals relationships</li>
                            <li>Trade partners and energy dependencies</li>
                            <li>8 scenario impact configurations</li>
                        </ul>
                        <a href="/simulator" className="mt-4 inline-block px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400">
                            Go to Simulator →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

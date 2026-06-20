'use client';

import { useEffect, useState } from 'react';
import { seedDatabase } from '../../lib/seedRealtimeData';

export default function SeedRealtimePage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Starting Realtime Database seed...');

    useEffect(() => {
        const seed = async () => {
            try {
                setMessage('Seeding geopolitical data to Realtime Database...');
                const result = await seedDatabase();
                if (result.success) {
                    setStatus('success');
                    setMessage('✅ Realtime Database seeded successfully! Your simulation data is now live.');
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                setStatus('error');
                setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };

        seed();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 font-sans">
            <div className="max-w-lg w-full p-8 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/50">
                        <span className="text-xl">🔥</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Realtime DB Seeder</h1>
                </div>

                <div className={`p-4 rounded-xl border ${status === 'loading' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                    status === 'success' ? 'bg-green-500/11 border-green-500/30 text-green-400' :
                        'bg-red-500/10 border-red-500/30 text-red-400'
                    } transition-all duration-500`}>
                    <div className="flex items-center gap-3">
                        {status === 'loading' && (
                            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        )}
                        <p className="font-medium text-sm">{message}</p>
                    </div>
                </div>

                {status === 'success' && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3">Live Data Pipeline established:</p>
                            <ul className="space-y-2">
                                {[
                                    '14 Global Powers & Regional Hubs',
                                    'Energy Dependency Graph (Gas, Oil, Coal)',
                                    'Strategic Control Points (Bosphorus, etc.)',
                                    '3 Multi-stage Cascade Triggers'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                                        <span className="text-purple-400">⚡</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href="/simulator"
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-purple-500/20"
                            >
                                Launch Simulator
                            </a>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all"
                            >
                                Re-run Seeder
                            </button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}

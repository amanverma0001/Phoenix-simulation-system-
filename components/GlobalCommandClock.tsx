"use client";

/**
 * GlobalCommandClock - A multi-timezone monitoring clock
 * 
 * Shows current UTC and major geopolitical capital times
 * to enhance the "global monitoring station" aesthetic.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe } from 'lucide-react';

interface TimeStamp {
    label: string;
    time: string;
    offset: string;
}

interface GlobalCommandClockProps {
    compact?: boolean;
}

export default function GlobalCommandClock({ compact = false }: GlobalCommandClockProps) {
    const [times, setTimes] = useState<TimeStamp[]>([]);
    const [utcTime, setUtcTime] = useState('');

    useEffect(() => {
        const updateClocks = () => {
            const now = new Date();

            // UTC
            setUtcTime(now.toUTCString().split(' ')[4]);

            // Major Capitals
            const capitals = compact
                ? [
                    { label: 'WASH', tz: 'America/New_York' },
                    { label: 'LOND', tz: 'Europe/London' },
                    { label: 'BEIJ', tz: 'Asia/Shanghai' }
                ]
                : [
                    { label: 'WASH', tz: 'America/New_York' },
                    { label: 'LOND', tz: 'Europe/London' },
                    { label: 'MOSC', tz: 'Europe/Moscow' },
                    { label: 'BEIJ', tz: 'Asia/Shanghai' },
                    { label: 'TOKY', tz: 'Asia/Tokyo' },
                    { label: 'DELH', tz: 'Asia/Kolkata' }
                ];

            const updatedTimes = capitals.map(cap => {
                const timeStr = now.toLocaleTimeString('en-US', {
                    timeZone: cap.tz,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: compact ? undefined : '2-digit'
                });

                // Simplified offset calculation
                const tzDate = new Date(now.toLocaleString('en-US', { timeZone: cap.tz }));
                const offsetHours = Math.round((tzDate.getTime() - now.getTime()) / 3600000);
                const offsetStr = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`;

                return {
                    label: cap.label,
                    time: timeStr,
                    offset: offsetStr
                };
            });

            setTimes(updatedTimes);
        };

        updateClocks();
        const interval = setInterval(updateClocks, 1000);
        return () => clearInterval(interval);
    }, [compact]);

    if (compact) {
        return (
            <div className="flex items-center gap-4 py-1 px-3 bg-white/5 rounded-lg border border-white/10 font-mono">
                <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                    <Clock size={10} className="text-cyan-400 animate-pulse" />
                    <span className="text-[10px] text-white font-black">UTC {utcTime}</span>
                </div>
                <div className="flex items-center gap-4">
                    {times.map((t) => (
                        <div key={t.label} className="flex flex-col">
                            <span className="text-[7px] text-slate-500 uppercase">{t.label}</span>
                            <span className="text-[10px] text-slate-300 font-bold tracking-tight">{t.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-3 bg-black/40 backdrop-blur-md border-y border-white/5 font-mono">
            <div className="flex items-center justify-between mb-1 px-1">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-cyan-400 animate-pulse" />
                    <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold">Global Sync</span>
                </div>
                <div className="text-[12px] text-white font-black tracking-tighter">
                    UTC {utcTime}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-y-2 gap-x-4">
                {times.map((t, i) => (
                    <motion.div
                        key={t.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col border-l border-white/10 pl-2"
                    >
                        <div className="flex items-center justify-between text-[8px] text-slate-500 uppercase tracking-tighter">
                            <span>{t.label}</span>
                            <span>{t.offset}H</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-bold tracking-tight">
                            {t.time}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-1 flex items-center gap-2 px-1 text-[8px] text-cyan-500/40 uppercase tracking-[0.2em]">
                <Globe size={8} />
                <span>Planetary Rotation Active</span>
            </div>
        </div>
    );
}

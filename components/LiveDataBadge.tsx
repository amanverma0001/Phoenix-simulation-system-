"use client";

/**
 * LiveDataBadge - Shows real-time data indicator
 * 
 * A floating badge that shows users the data is live
 * with an auto-updating time display.
 */

import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { useTimeAgo } from '@/hooks/useAILiveData';

interface LiveDataBadgeProps {
    lastUpdated: Date | null;
    isLive: boolean;
    className?: string;
}

export default function LiveDataBadge({ lastUpdated, isLive, className = '' }: LiveDataBadgeProps) {
    const timeAgo = useTimeAgo(lastUpdated);

    return (
        <motion.div
            className={`fixed z-50 ${className}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md border ${isLive
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}>
                <motion.div
                    className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-yellow-500'}`}
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {isLive ? (
                    <Wifi className="text-green-400" size={12} />
                ) : (
                    <WifiOff className="text-yellow-400" size={12} />
                )}

                <span className={`text-xs font-bold ${isLive ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isLive ? 'LIVE' : 'CACHED'}
                </span>

                {timeAgo && (
                    <span className="text-[10px] text-slate-400 font-mono">
                        {timeAgo}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

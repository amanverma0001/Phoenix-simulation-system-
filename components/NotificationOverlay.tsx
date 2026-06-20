"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, Zap, DollarSign } from 'lucide-react';

export type NotificationType = 'profit' | 'damage' | 'emergence' | 'warning';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
}

export default function NotificationOverlay() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const addNotification = useCallback((notif: Omit<AppNotification, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [...prev, { ...notif, id }]);

        const duration = notif.duration || 5000;
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    }, []);

    // Expose to window for easy access from engine/other components
    useEffect(() => {
        (window as any).addAppNotification = addNotification;
        return () => { delete (window as any).addAppNotification; };
    }, [addNotification]);

    return (
        <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto p-4 rounded-lg border backdrop-blur-md shadow-lg flex items-start gap-3 ${n.type === 'profit' ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' :
                                n.type === 'damage' ? 'bg-red-900/40 border-red-500/50 text-red-100' :
                                    n.type === 'warning' ? 'bg-amber-900/40 border-amber-500/50 text-amber-100' :
                                        'bg-cyan-900/40 border-cyan-500/50 text-cyan-100'
                            }`}
                    >
                        <div className="mt-1">
                            {n.type === 'profit' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                            {n.type === 'damage' && <Zap className="w-5 h-5 text-red-400" />}
                            {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                            {n.type === 'emergence' && <Globe className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div>
                            <div className="font-bold text-sm uppercase tracking-wider font-mono">
                                {n.title}
                            </div>
                            <div className="text-xs opacity-80 mt-1">
                                {n.message}
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications(prev => prev.filter(p => p.id !== n.id))}
                            className="ml-auto opacity-40 hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

const Globe = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

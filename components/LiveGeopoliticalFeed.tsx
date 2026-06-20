"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Newspaper, Globe, Briefcase, Zap, ShieldAlert } from 'lucide-react';

interface NewsItem {
    id: string;
    category: 'sanctions' | 'energy' | 'economic' | 'diplomatic';
    title: string;
    content: string;
    timestamp: Date;
}

const INITIAL_NEWS: Omit<NewsItem, 'id' | 'timestamp'>[] = [
    {
        category: 'sanctions',
        title: 'EU Extends Russia Sanctions',
        content: 'Extended sanctions package for another 6 months targeting industrial exports.'
    },
    {
        category: 'energy',
        title: 'LNG Terminal Expansion',
        content: 'Germany opens new floating LNG terminal to secure winter energy supplies.'
    },
    {
        category: 'economic',
        title: 'Trade Tensions Rise',
        content: 'New tariffs announced on technology exports between major economic hubs.'
    },
    {
        category: 'diplomatic',
        title: 'Regional Summit Held',
        content: 'Middle East nations discuss energy cooperation and maritime security.'
    },
    {
        category: 'economic',
        title: 'Currency Volatility',
        content: 'Emerging market currencies under pressure due to shifting global interest rates.'
    }
];

const CATEGORY_ICONS = {
    sanctions: <ShieldAlert className="w-3 h-3 text-red-400" />,
    energy: <Zap className="w-3 h-3 text-yellow-400" />,
    economic: <Briefcase className="w-3 h-3 text-cyan-400" />,
    diplomatic: <Globe className="w-3 h-3 text-purple-400" />
};

export default function LiveGeopoliticalFeed() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Initialize with first few items
        const initialWithIds = INITIAL_NEWS.slice(0, 3).map((item, idx) => ({
            ...item,
            id: `init-${idx}`,
            timestamp: new Date(Date.now() - (idx * 300000))
        }));
        setNews(initialWithIds);
        setCurrentIndex(3);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextItem = INITIAL_NEWS[currentIndex % INITIAL_NEWS.length];
            const newItem: NewsItem = {
                ...nextItem,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date()
            };

            setNews(prev => [newItem, ...prev].slice(0, 5));
            setCurrentIndex(prev => prev + 1);
        }, 12000); // New item every 12 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-cyan-500/60" />
                    <span className="text-[10px] font-mono uppercase tracking-[.3em] text-cyan-500/60">Live Geopolitical Feed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1 h-1 rounded-full bg-red-500"
                    />
                    <span className="text-[8px] font-mono text-red-500/80 font-bold uppercase tracking-wider">Live</span>
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence initial={false} mode="popLayout">
                    {news.map((itemValue) => (
                        <motion.div
                            key={itemValue.id}
                            layout
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="group relative"
                        >
                            <div className="p-4 rounded-xl glass-premium border border-white/5 hover:border-cyan-500/20 transition-all duration-500 relative overflow-hidden">
                                {/* Subtle side bar of color */}
                                <div className={`absolute left-0 top-0 bottom-0 w-0.5 opacity-40 ${itemValue.category === 'sanctions' ? 'bg-red-500' :
                                        itemValue.category === 'energy' ? 'bg-yellow-500' :
                                            itemValue.category === 'economic' ? 'bg-cyan-500' : 'bg-purple-500'
                                    }`} />

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {CATEGORY_ICONS[itemValue.category]}
                                            <span className={`text-[8px] font-mono uppercase tracking-widest font-bold ${itemValue.category === 'sanctions' ? 'text-red-400/70' :
                                                    itemValue.category === 'energy' ? 'text-yellow-400/70' :
                                                        itemValue.category === 'economic' ? 'text-cyan-400/70' : 'text-purple-400/70'
                                                }`}>
                                                {itemValue.category}
                                            </span>
                                        </div>
                                        <span className="text-[8px] font-mono text-white/20">
                                            {itemValue.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-bold text-white/90 leading-tight uppercase tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                                            {itemValue.title}
                                        </h4>
                                        <p className="text-[9px] text-white/50 leading-relaxed font-medium">
                                            {itemValue.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Glitch lines on hover */}
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400 animate-glitch-line" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

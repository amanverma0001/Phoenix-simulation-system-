"use client";

/**
 * DataStreams - Ambient digital matrix rain for the background
 * 
 * Creates falling characters and data nodes to give the UI
 * a high-tech "running" feel.
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DataStreams() {
    const [streams, setStreams] = useState<any[]>([]);

    useEffect(() => {
        const createStream = () => {
            const id = Math.random().toString(36).substr(2, 9);
            const left = Math.random() * 100;
            const duration = 5 + Math.random() * 10;
            const opacity = 0.1 + Math.random() * 0.3;
            const fontSize = 8 + Math.random() * 6;
            const characters = "0101010101ABCDEF".split("");
            const content = Array.from({ length: 10 + Math.floor(Math.random() * 20) }).map(() => characters[Math.floor(Math.random() * characters.length)]).join("");

            const newStream = { id, left, duration, opacity, fontSize, content };
            setStreams(prev => [...prev, newStream]);

            setTimeout(() => {
                setStreams(prev => prev.filter(s => s.id !== id));
            }, duration * 1000);
        };

        const interval = setInterval(createStream, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
            {streams.map(s => (
                <motion.div
                    key={s.id}
                    className="absolute font-mono text-cyan-500 whitespace-pre"
                    style={{
                        left: `${s.left}%`,
                        fontSize: `${s.fontSize}px`,
                        opacity: s.opacity,
                        writingMode: 'vertical-rl'
                    }}
                    initial={{ y: -500 }}
                    animate={{ y: 2000 }}
                    transition={{ duration: s.duration, ease: 'linear' }}
                >
                    {s.content}
                </motion.div>
            ))}
        </div>
    );
}

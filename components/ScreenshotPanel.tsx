"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Share2, Download, Link, Check, X } from 'lucide-react';
import { screenshotSystem } from '@/lib/ScreenshotSystem';

interface ScreenshotPanelProps {
    currentState?: {
        scenario?: string;
        stability: number;
    };
}

export default function ScreenshotPanel({ currentState }: ScreenshotPanelProps) {
    const [isCapturing, setIsCapturing] = useState(false);
    const [lastScreenshot, setLastScreenshot] = useState<Blob | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const previewUrl = useRef<string | null>(null);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 2500);
    };

    const capture = async (includeUI: boolean = true) => {
        setIsCapturing(true);
        try {
            const blob = await screenshotSystem.captureCurrentState(includeUI);
            if (blob) {
                setLastScreenshot(blob);
                if (previewUrl.current) {
                    URL.revokeObjectURL(previewUrl.current);
                }
                previewUrl.current = URL.createObjectURL(blob);
                setShowPreview(true);
                showNotification('📸 Screenshot captured!');
            }
        } catch (error) {
            console.error('Screenshot failed:', error);
            showNotification('❌ Capture failed');
        } finally {
            setIsCapturing(false);
        }
    };

    const share = async () => {
        if (!lastScreenshot) return;
        const success = await screenshotSystem.shareOnSocial(lastScreenshot);
        if (success) {
            showNotification('📤 Shared successfully!');
        }
    };

    const download = () => {
        if (!lastScreenshot) return;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        screenshotSystem.downloadImage(lastScreenshot, `fractured-world-${timestamp}.png`);
        showNotification('💾 Downloaded!');
    };

    const copyLink = () => {
        if (!currentState) return;
        const url = screenshotSystem.generateShareableState(currentState);
        navigator.clipboard.writeText(url);
        setCopied(true);
        showNotification('🔗 Link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-4 left-1/2 z-[100] px-4 py-2 bg-slate-900/95 border border-cyan-500/30 
                       rounded-lg text-sm text-cyan-400 font-mono shadow-lg backdrop-blur-sm"
                    >
                        {notification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screenshot Preview Modal */}
            <AnimatePresence>
                {showPreview && previewUrl.current && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
                        onClick={() => setShowPreview(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[80vh] rounded-lg overflow-hidden border border-cyan-500/30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={previewUrl.current}
                                alt="Screenshot Preview"
                                className="max-w-full max-h-[70vh] object-contain"
                            />

                            {/* Actions */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={share}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white 
                               font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <Share2 size={16} />
                                        Share
                                    </button>
                                    <button
                                        onClick={download}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-white 
                               font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                    <button
                                        onClick={copyLink}
                                        className="px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-white 
                               font-bold flex items-center gap-2 transition-colors"
                                    >
                                        {copied ? <Check size={16} /> : <Link size={16} />}
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </button>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowPreview(false)}
                                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 rounded-full 
                           text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Screenshot Button */}
            <div className="fixed bottom-20 left-4 z-50 screenshot-ignore">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => capture(true)}
                    disabled={isCapturing}
                    className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500
                     disabled:from-slate-700 disabled:to-slate-700 rounded-xl text-white font-bold
                     shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                    <Camera size={18} className={isCapturing ? 'animate-pulse' : ''} />
                    <span className="text-sm">{isCapturing ? 'Capturing...' : 'Screenshot'}</span>
                </motion.button>
            </div>
        </>
    );
}

/**
 * MobileNav Component - Bottom tab navigation for mobile devices
 * 
 * Features:
 * - Fixed bottom position
 * - Touch-friendly (64px height)
 * - Four main tabs: Globe, Data, Events, More
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, BarChart3, Zap, MoreHorizontal, Layers, Settings, RotateCcw, Share } from 'lucide-react';

interface MobileNavProps {
    activeTab: 'globe' | 'data' | 'events' | 'more';
    onTabChange: (tab: 'globe' | 'data' | 'events' | 'more') => void;
    onToggleLayers?: () => void;
    onOpenSettings?: () => void;
    onReset?: () => void;
    onShare?: () => void;
}

interface TabItem {
    id: 'globe' | 'data' | 'events' | 'more';
    label: string;
    icon: React.ElementType;
}

const TABS: TabItem[] = [
    { id: 'globe', label: 'Globe', icon: Globe2 },
    { id: 'data', label: 'Data', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Zap },
    { id: 'more', label: 'More', icon: MoreHorizontal },
];

export default function MobileNav({
    activeTab,
    onTabChange,
    onToggleLayers,
    onOpenSettings,
    onReset,
    onShare,
}: MobileNavProps) {
    const [showMoreMenu, setShowMoreMenu] = React.useState(false);

    const handleTabPress = (tabId: typeof activeTab) => {
        if (tabId === 'more') {
            setShowMoreMenu(!showMoreMenu);
        } else {
            setShowMoreMenu(false);
            onTabChange(tabId);
        }
    };

    return (
        <>
            {/* More Menu Popup */}
            {showMoreMenu && (
                <motion.div
                    className="fixed bottom-20 right-4 z-50 rounded-xl overflow-hidden"
                    style={{
                        background: 'rgba(0, 10, 20, 0.95)',
                        border: '1px solid rgba(0, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px)',
                    }}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                >
                    <MenuButton icon={Layers} label="Toggle Layers" onClick={() => { onToggleLayers?.(); setShowMoreMenu(false); }} />
                    <MenuButton icon={Settings} label="Settings" onClick={() => { onOpenSettings?.(); setShowMoreMenu(false); }} />
                    <MenuButton icon={RotateCcw} label="Reset" onClick={() => { onReset?.(); setShowMoreMenu(false); }} />
                    <MenuButton icon={Share} label="Share" onClick={() => { onShare?.(); setShowMoreMenu(false); }} />
                </motion.div>
            )}

            {/* Bottom Navigation Bar */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
                style={{
                    height: '64px',
                    background: 'rgba(0, 10, 20, 0.95)',
                    borderTop: '1px solid rgba(0, 255, 255, 0.2)',
                    backdropFilter: 'blur(20px)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon: any = tab.icon;

                    return (
                        <motion.button
                            key={tab.id}
                            className="flex flex-col items-center justify-center flex-1 h-full"
                            onTap={() => handleTabPress(tab.id)}
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.div
                                animate={{
                                    color: isActive ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                                    scale: isActive ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon size={24} />
                            </motion.div>
                            <motion.span
                                className="text-[10px] font-mono mt-1"
                                animate={{
                                    color: isActive ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                                }}
                            >
                                {tab.label}
                            </motion.span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <motion.div
                                    className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400"
                                    layoutId="activeTab"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Safe area spacer */}
            <div className="h-16" />
        </>
    );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function MenuButton({
    icon: Icon,
    label,
    onClick,
}: {
    icon: any;
    label: string;
    onClick: () => void;
}) {
    return (
        <motion.button
            className="flex items-center gap-3 w-full px-4 py-3 text-white/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
        >
            <Icon size={20} />
            <span className="text-sm font-mono">{label}</span>
        </motion.button>
    );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    Building2,
    Shield,
    Radio,
    Activity,
    Sparkles,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    X,
    BarChart3,
    Globe2,
    Newspaper,
    Brain,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { GLOBAL_INTELLIGENCE } from "../lib/globalIntelligence";
import { getSanctionHiddenTruths } from "../lib/sanctionHiddenTruths";

interface Country {
    id: string;
    name: string;
    stability: number;
}

interface HiddenTruthsPanelProps {
    isVisible: boolean;
    globalStability: number;
    countries?: Country[];
    onClose?: () => void;
}

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
    russia: "🇷🇺",
    usa: "🇺🇸",
    china: "🇨🇳",
    germany: "🇩🇪",
    uk: "🇬🇧",
    france: "🇫🇷",
    japan: "🇯🇵",
    india: "🇮🇳",
    brazil: "🇧🇷",
    mexico: "🇲🇽",
    venezuela: "🇻🇪",
    turkey: "🇹🇷",
    iran: "🇮🇷",
    ukraine: "🇺🇦",
    poland: "🇵🇱",
    argentina: "🇦🇷",
    south_africa: "🇿🇦",
    nigeria: "🇳🇬",
    egypt: "🇪🇬",
    indonesia: "🇮🇩",
    thailand: "🇹🇭",
    vietnam: "🇻🇳",
    australia: "🇦🇺",
    canada: "🇨🇦",
    italy: "🇮🇹",
    spain: "🇪🇸",
    south_korea: "🇰🇷",
    saudi_arabia: "🇸🇦",
    netherlands: "🇳🇱",
    switzerland: "🇨🇭",
};

// Tabs for the panel
const tabs = [
    { id: "overview", label: "OVERVIEW", icon: BarChart3 },
    { id: "impact", label: "IMPACT", icon: Globe2 },
    { id: "intel", label: "INTEL", icon: Newspaper },
    { id: "oracle", label: "ORACLE", icon: Brain },
    { id: "timeline", label: "TIMELINE", icon: Clock },
];

// Shadow entities pool for dynamic selection
const SHADOW_ENTITIES_POOL = [
    {
        id: "glencore",
        name: "Glencore",
        title: "The Shadow Empire",
        icon: "🏢",
        description: "Influence exceeds 3 nation-states. Controls critical commodity routes across 7 countries.",
        influence: 87,
        type: "Commodity Trader",
    },
    {
        id: "blackrock",
        name: "BlackRock",
        title: "The Asset Sovereign",
        icon: "🏦",
        description: "Holds leverage over 12 sovereign debt markets. Managing more wealth than most G20 nations.",
        influence: 94,
        type: "Asset Manager",
    },
    {
        id: "trafigura",
        name: "Trafigura",
        title: "The Energy Broker",
        icon: "⛽",
        description: "Profiting from market chaos. 5 nations now dependent on their supply chain decisions.",
        influence: 72,
        type: "Energy Trader",
    },
    {
        id: "wagner",
        name: "Wagner PMC",
        title: "The Mercenary State",
        icon: "⚔️",
        description: "Securing mineral deposits in failed states in exchange for regime security.",
        influence: 82,
        type: "PMC",
    },
    {
        id: "vitol",
        name: "Vitol Group",
        title: "The Oil Baron",
        icon: "🛢️",
        description: "Rerouting sanctioned crude through grey market fleets to bypass blockades.",
        influence: 78,
        type: "Energy Trader",
    },
    {
        id: "palantir",
        name: "Palantir",
        title: "The All-Seeing Eye",
        icon: "👁️",
        description: "Processing surveillance data for interim governments to track dissent.",
        influence: 89,
        type: "Intel Contractor",
    },
    {
        id: "huawei",
        name: "Huawei",
        title: "The Digital Grid",
        icon: "📡",
        description: "Maintaining remaining connectivity infrastructure in collapsed zones.",
        influence: 85,
        type: "Tech Giant",
    },
    {
        id: "academi",
        name: "Academi",
        title: "The Private Shield",
        icon: "🛡️",
        description: "Contracted for executive protection in 15 capitals as police forces dissolve.",
        influence: 75,
        type: "PMC",
    },
];


// System status checks
const systemStatuses = [
    { id: "coherence", label: "Coherence Check", status: "PASSED", color: "green" as const },
    { id: "reality", label: "Reality Sync", status: "ACTIVE", color: "cyan" as const },
    { id: "cascade", label: "Cascade Vector", status: "DETECTED", color: "red" as const },
];

export default function HiddenTruthsPanel({
    isVisible,
    globalStability,
    countries = [],
    onClose,
}: HiddenTruthsPanelProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isExpanded, setIsExpanded] = useState(true);
    const [revealedEntities, setRevealedEntities] = useState<string[]>([]);
    const [expandedCascade, setExpandedCascade] = useState<string | null>(null);

    const [aiAnalysis, setAiAnalysis] = useState("Scanning global vectors...");

    useEffect(() => {
        if (isVisible) {
            const messages = [
                "Corporate power consolidating as state authority fragments.",
                "Shadow capital flows bypass traditional sanctions regime.",
                "Systemic fragility detected in key energy corridors.",
                "Proxy actors seizing control of critical infrastructure.",
                "Algorithmic governance overriding sovereign mandates.",
                "Resource scarcity triggering asymmetric alliance shifts."
            ];
            setAiAnalysis(messages[Math.floor(Math.random() * messages.length)]);
        }
    }, [isVisible]);

    // Get collapsed countries for Cascade Breakdown with per-session jitter
    const collapsedCountries = useMemo(() => {
        if (!isVisible) return [];
        // Add random variance so different countries appear in the breakdown each time
        const jittered = countries.map(c => ({
            ...c,
            stability: Math.max(0, c.stability + (Math.random() * 25 - 12.5))
        }));

        return jittered
            .filter((c) => c.stability < 70)
            .sort((a, b) => a.stability - b.stability)
            .slice(0, 3);
    }, [isVisible, countries]);

    // Progressively reveal entities based on instability
    const [dynamicEntities, setDynamicEntities] = useState<any[]>([]);

    useEffect(() => {
        if (isVisible) {
            const shuffled = [...SHADOW_ENTITIES_POOL].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3).map(e => ({
                ...e,
                influence: Math.floor(Math.min(99, Math.max(50, e.influence + (Math.random() * 20 - 10))))
            }));
            setDynamicEntities(selected);
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible && dynamicEntities.length > 0) {
            const timers: NodeJS.Timeout[] = [];
            dynamicEntities.forEach((entity, i) => {
                timers.push(
                    setTimeout(() => {
                        setRevealedEntities((prev) => [...prev, entity.id]);
                    }, 800 + i * 600)
                );
            });
            return () => timers.forEach(clearTimeout);
        } else if (!isVisible) {
            setRevealedEntities([]);
        }
    }, [isVisible, dynamicEntities]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed left-2 top-32 w-96 z-40 screenshot-ignore"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 20 }}
        >
            <div
                className="rounded-2xl overflow-hidden backdrop-blur-xl"
                style={{
                    background: "linear-gradient(135deg, rgba(15,10,30,0.95) 0%, rgba(30,20,50,0.9) 100%)",
                    boxShadow: "0 0 40px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    border: "1px solid rgba(168,85,247,0.3)",
                }}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-purple-500/20 bg-purple-950/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center"
                                animate={{
                                    boxShadow: [
                                        "0 0 10px rgba(168,85,247,0.4)",
                                        "0 0 20px rgba(168,85,247,0.6)",
                                        "0 0 10px rgba(168,85,247,0.4)",
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Eye className="text-purple-400" size={18} />
                            </motion.div>
                            <div>
                                <h3 className="text-sm font-bold text-purple-300">Hidden Truths Revealed</h3>
                                <p className="text-[10px] text-purple-400/60 font-mono">SHADOW ANALYSIS ACTIVE</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                            >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {onClose && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            {/* Tab Navigation */}
                            <div className="flex gap-1 px-3 py-2 border-b border-white/5 bg-black/20 overflow-x-auto">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all whitespace-nowrap ${isActive
                                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <Icon size={12} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>



                            {/* Shadow Entities */}
                            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto border-b border-white/5">
                                {dynamicEntities.map((entity) => {
                                    const isRevealed = revealedEntities.includes(entity.id);
                                    return (
                                        <AnimatePresence key={entity.id}>
                                            {isRevealed && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-3xl">{entity.icon}</span>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs text-purple-400 font-mono uppercase">
                                                                    {entity.title}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-bold text-white mb-2">{entity.name}</h4>
                                                            <p className="text-xs text-white/70 leading-relaxed">
                                                                {entity.description}
                                                            </p>
                                                            {/* Influence Bar */}
                                                            <div className="mt-3">
                                                                <div className="flex items-center justify-between text-[10px] mb-1">
                                                                    <span className="text-purple-300/60">Influence</span>
                                                                    <span className="text-purple-400 font-mono">{entity.influence}%</span>
                                                                </div>
                                                                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${entity.influence}%` }}
                                                                        transition={{ duration: 1, delay: 0.3 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    );
                                })}
                            </div>

                            {/* Cascade Breakdown */}
                            <div className="p-4">
                                <h3 className="text-xs font-mono text-orange-400/80 uppercase tracking-wider mb-3">
                                    Cascade Breakdown
                                </h3>
                                <div className="space-y-2">
                                    {collapsedCountries.length > 0 ? (
                                        collapsedCountries.map((country) => {
                                            const flag = countryFlags[country.id] || "🌍";
                                            const loss = (100 - country.stability).toFixed(0);
                                            const isExpanded = expandedCascade === country.id;

                                            return (
                                                <motion.div
                                                    key={country.id}
                                                    className="rounded-lg bg-red-500/5 border border-red-500/20 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => setExpandedCascade(isExpanded ? null : country.id)}
                                                        className="w-full p-2 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left"
                                                    >
                                                        <span className="text-lg">{flag}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-bold text-white flex justify-between">
                                                                <span>{country.name}</span>
                                                                <span className="text-red-400">-{loss}%</span>
                                                            </div>

                                                        </div>
                                                        <ChevronRight
                                                            size={16}
                                                            className={`text-white/40 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="border-t border-red-500/20"
                                                            >
                                                                <div className="p-3 space-y-2">
                                                                    <div className="text-[10px] text-white/50 font-mono lowercase mb-1">
                                                                        ID: {country.id}
                                                                    </div>

                                                                    {GLOBAL_INTELLIGENCE[country.id] && (
                                                                        <div className="flex gap-2 p-2 rounded bg-red-500/10 border border-red-500/20 mb-2">
                                                                            <AlertTriangle className="text-red-400 shrink-0" size={14} />
                                                                            <p className="text-[10px] text-red-200/80 italic leading-tight">
                                                                                {GLOBAL_INTELLIGENCE[country.id].why}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {/* Structural Hidden Truths */}
                                                                    {getSanctionHiddenTruths(country.name) && (
                                                                        <div className="space-y-2 p-2 rounded bg-purple-500/5 border border-purple-500/20 mb-2">
                                                                            <div className="text-[8px] text-purple-400 font-mono uppercase mb-1">Structural Weaknesses Detected</div>
                                                                            {[
                                                                                { label: "Economics", value: getSanctionHiddenTruths(country.name)?.economicDependency },
                                                                                { label: "Power", value: getSanctionHiddenTruths(country.name)?.powerStructure },
                                                                                { label: "Stability", value: getSanctionHiddenTruths(country.name)?.socialStability }
                                                                            ].map((t, idx) => (
                                                                                <div key={idx} className="flex flex-col gap-0.5">
                                                                                    <span className="text-[8px] text-white/40 uppercase leading-none">{t.label}</span>
                                                                                    <span className="text-[10px] text-white/80 leading-tight">{t.value}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    <button className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-colors">
                                                                        Inspect Failure Vectors
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-xs text-white/40 text-center py-4">
                                            No collapse chains detected
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Analysis Footer */}
                            <div className="px-4 py-3 border-t border-white/5 bg-black/20">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="text-purple-400" size={14} />
                                    <span className="text-[10px] text-purple-300/80 font-mono">
                                        AI ANALYSIS: {aiAnalysis}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// Status Indicator Component
function StatusIndicator({
    label,
    status,
    color,
}: {
    label: string;
    status: string;
    color: "green" | "cyan" | "red" | "yellow";
}) {
    const colors = {
        green: { dot: "bg-green-500", text: "text-green-400", glow: "rgba(34,197,94,0.6)" },
        cyan: { dot: "bg-cyan-500", text: "text-cyan-400", glow: "rgba(6,182,212,0.6)" },
        red: { dot: "bg-red-500", text: "text-red-400", glow: "rgba(239,68,68,0.6)" },
        yellow: { dot: "bg-yellow-500", text: "text-yellow-400", glow: "rgba(234,179,8,0.6)" },
    };

    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">{label}</span>
            <div className="flex items-center gap-2">
                <motion.div
                    className={`w-2 h-2 rounded-full ${colors[color].dot}`}
                    animate={{
                        boxShadow: [
                            `0 0 4px ${colors[color].glow}`,
                            `0 0 10px ${colors[color].glow}`,
                            `0 0 4px ${colors[color].glow}`,
                        ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className={`text-xs font-mono font-bold ${colors[color].text}`}>{status}</span>
            </div>
        </div>
    );
}

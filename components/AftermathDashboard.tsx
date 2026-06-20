"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    Globe2,
    Newspaper,
    Brain,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Trophy,
    Skull,
    Activity,
    Zap,
    X,
    Building2,
    Eye,
    Shield,
    Radio,
    ChevronRight,
    Sparkles,
    Volume2,
    MessageSquare,
    Send,
    Loader2,
    Wifi,
} from "lucide-react";
import { aiEngine } from "../lib/AIEngine";
import { LiveGeopoliticalData } from "../lib/LiveDataFetcher";
import { COUNTRY_PROFILES, getScenarioImpactedCountries, getMajorPowers, type CountryProfile } from "../lib/GeopoliticalDataset";
import { GLOBAL_INTELLIGENCE } from "../lib/globalIntelligence";
import { getSanctionHiddenTruths } from "../lib/sanctionHiddenTruths";


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
    australia: "🇦🇺",
    canada: "🇨🇦",
    italy: "🇮🇹",
    spain: "🇪🇸",
    mexico: "🇲🇽",
    south_korea: "🇰🇷",
    indonesia: "🇮🇩",
    turkey: "🇹🇷",
    saudi_arabia: "🇸🇦",
    argentina: "🇦🇷",
    south_africa: "🇿🇦",
    nigeria: "🇳🇬",
    egypt: "🇪🇬",
    iran: "🇮🇷",
    ukraine: "🇺🇦",
    poland: "🇵🇱",
    netherlands: "🇳🇱",
    switzerland: "🇨🇭",
    venezuela: "🇻🇪",
    thailand: "🇹🇭",
    vietnam: "🇻🇳",
};

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

import { Country } from "../lib/geopoliticalData";
import { EmergenceReport, InsightCard } from "../lib/EmergenceDetector";

interface SimulationEvent {
    id: string;
    type: string;
    description: string;
    timestamp: number;
    affectedCountries: string[];
}

interface AftermathDashboardProps {
    isVisible: boolean;
    onClose: () => void;
    countries: Country[];
    events: SimulationEvent[];
    globalStability: number;
    activeScenario: string | null;
    userOrigin: string | null;
    aiLiveData?: LiveGeopoliticalData | null;
    emergenceData?: EmergenceReport | null;
}

type TabId = "overview" | "impact" | "intel" | "oracle" | "timeline" | "truths" | "whatif" | "live";

const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "OVERVIEW", icon: BarChart3 },
    { id: "impact", label: "IMPACT", icon: Globe2 },
    { id: "truths", label: "HIDDEN TRUTHS", icon: Eye },
    { id: "live", label: "LIVE DATA", icon: Wifi },
    { id: "intel", label: "INTEL", icon: Newspaper },
    { id: "oracle", label: "ORACLE", icon: Brain },
    { id: "whatif", label: "WHAT IF", icon: MessageSquare },
    { id: "timeline", label: "TIMELINE", icon: Clock },
];

// Shadow entities data
const shadowEntities = [
    {
        name: "Glencore",
        icon: "🏢",
        description: "Controls critical commodity routes across 7 countries as governments falter.",
        influence: "Exceeds 3 nation-states",
    },
    {
        name: "BlackRock",
        icon: "🏦",
        description: "Asset management empire now holds leverage over 12 sovereign debt markets.",
        influence: "Controls $10T+ assets",
    },
    {
        name: "Trafigura",
        icon: "⛽",
        description: "Energy arbitrage operations profiting from market instability.",
        influence: "5 nations dependent",
    },
];

export default function AftermathDashboard({
    isVisible,
    onClose,
    countries,
    events,
    globalStability,
    activeScenario,
    userOrigin,
    aiLiveData,
    emergenceData,
}: AftermathDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [revealStage, setRevealStage] = useState(0);
    const [expandedCascade, setExpandedCascade] = useState<string | null>(null);
    const [isTabGlitching, setIsTabGlitching] = useState(false);

    const handleTabChange = (tabId: TabId) => {
        if (tabId === activeTab) return;
        setIsTabGlitching(true);
        setActiveTab(tabId);
        setTimeout(() => setIsTabGlitching(false), 200);
    };

    // Cinematic reveal sequence
    useEffect(() => {
        if (isVisible) {
            setRevealStage(0);
            const timers = [
                setTimeout(() => setRevealStage(1), 300),
                setTimeout(() => setRevealStage(2), 600),
                setTimeout(() => setRevealStage(3), 900),
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [isVisible]);

    // Calculate winners and losers with dynamic jitter for "realtime" feel
    const [liveJitter, setLiveJitter] = useState(0);
    const [refreshCounter, setRefreshCounter] = useState(0);

    // Live flicker effect for metrics + periodic data refresh
    useEffect(() => {
        if (!isVisible) return;
        const jitterInterval = setInterval(() => {
            setLiveJitter((Math.random() * 0.8) - 0.4);
        }, 2000);
        const refreshInterval = setInterval(() => {
            setRefreshCounter(c => c + 1); // Trigger recalculation
        }, 4000);
        return () => {
            clearInterval(jitterInterval);
            clearInterval(refreshInterval);
        };
    }, [isVisible]);

    const { winners, losers, chaosScore, affectedCount } = useMemo(() => {
        // If we have emergenceData from the simulation engine, use it first
        if (emergenceData) {
            const mapResultToCountry = (res: any): Country => {
                const simCountry = countries.find(c => c.id === res.entityId);

                // Construct a valid Country object satisfying the interface
                return {
                    // Spread original country if found
                    ...(simCountry || {
                        id: res.entityId,
                        position: { lat: 0, lng: 0 },
                        color: "#ffffff",
                        energyDependency: {},
                        phase: 'STABLE',
                        shockHistory: 0,
                        rivals: [],
                        beneficiaries: []
                    }),
                    // Map or override with emergence result data
                    id: res.entityId,
                    name: res.name.replace(/^[\u00a0-\u1fff\u2000-\u206f\u2070-\u209f\u2100-\u214f\u2150-\u218f\u2190-\u23ff\u2460-\u25ff\u2600-\u27bf\u2900-\u297f\u2b00-\u2bff\u2c60-\u2c7f\u2e00-\u2e7f\u3000-\u303f\u31c0-\u31ef\u3200-\u32ff\u3300-\u33ff\u4dc0-\u4dff\ua490-\ua4cf\uff00-\uffef\u{1F000}-\u{1F9FF}]{1,2}\s*/u, ''), // Improved flag removal regex
                    flag: res.flag || (simCountry?.flag) || "🌍",
                    stability: res.finalStability !== undefined ? res.finalStability * 100 : (simCountry?.stability || 50),
                    influence: res.finalInfluence !== undefined ? res.finalInfluence * 100 : (simCountry?.influence || 50),
                    economicPower: simCountry?.economicPower || 50,
                    militaryPower: simCountry?.militaryPower || 50,
                } as Country;
            };

            return {
                winners: emergenceData.winners.map(mapResultToCountry),
                losers: emergenceData.losers.map(mapResultToCountry),
                chaosScore: 100 - globalStability,
                affectedCount: countries.filter((c) => c.stability < 70).length
            };
        }

        // Fallback to scenario-based logic if emergenceData is missing
        const scenarioKey = activeScenario?.toUpperCase() || 'SANCTION_RUSSIA';
        const scenarioImpact = getScenarioImpactedCountries(scenarioKey);

        const findAndEnrich = (id: string) => {
            const simCountry = countries.find(c => c.id.toLowerCase() === id.toLowerCase());
            const profile = COUNTRY_PROFILES[id.toLowerCase()];
            if (simCountry && profile) {
                return { ...simCountry, profile };
            }
            return null;
        };

        const loserIds = [...scenarioImpact.primary.map(p => p.id), ...scenarioImpact.affected.map(a => a.id)];
        const loserCandidates = loserIds
            .map(id => findAndEnrich(id))
            .filter((c): c is Country & { profile: CountryProfile } => c !== null && c.stability <= 65)
            .sort((a, b) => a.stability - b.stability)
            .slice(0, 5);

        const majorPowers = getMajorPowers();
        const winnerIds = [...scenarioImpact.beneficiaries.map(b => b.id), ...majorPowers.map(m => m.id)];
        const winnerCandidates = winnerIds
            .map(id => findAndEnrich(id))
            .filter((c): c is Country & { profile: CountryProfile } => c !== null && c.stability > 50)
            .reduce((unique, c) => unique.find(u => u.id === c.id) ? unique : [...unique, c], [] as (Country & { profile: CountryProfile })[])
            .sort((a, b) => b.stability - a.stability)
            .slice(0, 5);

        return {
            winners: winnerCandidates,
            losers: loserCandidates,
            chaosScore: 100 - globalStability,
            affectedCount: countries.filter((c) => c.stability < 70).length
        };
    }, [isVisible, countries, globalStability, activeScenario, refreshCounter, emergenceData]);

    // Get status description from dataset
    const getStatusDescription = (countryId: string) => {
        const profile = COUNTRY_PROFILES[countryId.toLowerCase()];
        if (profile?.vulnerabilities.length > 0) {
            // Return first vulnerability as status
            const vuln = profile.vulnerabilities[0];
            return vuln.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        return "Systemic stress";
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop with cinematic effect */}
                <motion.div
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Red pulse overlay for drama */}
                <motion.div
                    className="absolute inset-0 bg-red-900/20"
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Main Dashboard Container */}
                <motion.div
                    className="relative w-[95vw] max-w-7xl h-[90vh] max-h-[900px] rounded-2xl overflow-hidden flex"
                    style={{
                        background: "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)",
                        boxShadow: "0 0 100px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                    }}
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                >
                    {/* Left Sidebar - System Status */}
                    <motion.div
                        className="hidden xl:flex w-72 border-r border-white/10 bg-black/30 flex-col"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: revealStage >= 2 ? 1 : 0, x: revealStage >= 2 ? 0 : -20 }}
                    >
                        {/* System Status Indicators */}
                        <div className="p-4 border-b border-white/10">
                            <h3 className="text-xs font-mono text-cyan-400/80 uppercase tracking-wider mb-4">
                                System Status
                            </h3>
                            <div className="space-y-3">
                                <StatusIndicator label="Coherence Check" status="PASSED" color="green" />
                                <StatusIndicator label="Reality Sync" status="ACTIVE" color="cyan" />
                                <StatusIndicator label="Cascade Vector" status="DETECTED" color="red" />
                            </div>
                        </div>

                        {/* AI Narration Status */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <Volume2 className="text-purple-400" size={16} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">AI Narration</div>
                                    <div className="text-xs text-green-400">Active</div>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="text-purple-400" size={14} />
                                    <span className="text-xs text-purple-300 font-mono uppercase">Hidden Truths Revealed</span>
                                </div>
                            </div>
                        </div>

                        {/* Cascade Breakdown */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <h3 className="text-xs font-mono text-orange-400/80 uppercase tracking-wider mb-4">
                                Cascade Breakdown
                            </h3>
                            <div className="space-y-2">
                                {losers.slice(0, 3).map((country) => {
                                    const flag = countryFlags[country.id] || "🌍";
                                    const loss = Math.round(100 - country.stability);
                                    const isExpanded = expandedCascade === country.id;

                                    return (
                                        <motion.div
                                            key={country.id}
                                            className="rounded-xl bg-red-500/5 border border-red-500/20 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setExpandedCascade(isExpanded ? null : country.id)}
                                                className="w-full p-3 flex items-center gap-3 hover:bg-red-500/10 transition-colors"
                                            >
                                                <span className="text-2xl">{flag}</span>
                                                <div className="flex-1 text-left">
                                                    <div className="text-sm font-bold text-white">{country.name}'s Collapse Chain</div>
                                                    <div className="text-xs text-red-300/60">
                                                        {flag} {country.name} suffered a {loss}% influence loss
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
                                                            <div className="text-xs text-white/60">
                                                                Through interconnected failures across economic, political, and social systems.
                                                            </div>
                                                            <button className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-colors">
                                                                Inspect Failure Vectors
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Animated border glow */}
                        <div className="absolute inset-0 rounded-2xl pointer-events-none">
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>


                        {/* Tab Navigation */}
                        <motion.div
                            className="flex items-center px-6 py-2 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: revealStage >= 2 ? 1 : 0 }}
                        >
                            {/* Tabs Area */}
                            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center pr-4">
                                <div className="flex gap-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <motion.button
                                                key={tab.id}
                                                onClick={() => handleTabChange(tab.id)}
                                                className={`relative px-4 py-2.5 rounded-lg flex items-center gap-2 font-mono text-[11px] whitespace-nowrap transition-all ${isActive
                                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Icon size={14} className={isActive ? "text-cyan-400" : "text-white/30"} />
                                                <span className="font-bold tracking-widest uppercase">{tab.label}</span>
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400"
                                                        layoutId="activeTabIndicator"
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="flex items-center pl-4 border-l border-white/10 shrink-0">
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all group shadow-lg"
                                    title="Close Analysis"
                                >
                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Tab Content */}
                        <motion.div
                            className="flex-1 overflow-y-auto p-8 relative"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: revealStage >= 3 ? (isTabGlitching ? 0.3 : 1) : 0,
                                x: isTabGlitching ? [0, -2, 2, 0] : 0
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {activeTab === "overview" && (
                                    <OverviewTab
                                        key="overview"
                                        winners={winners}
                                        losers={losers}
                                        globalStability={globalStability}
                                        userOrigin={userOrigin}
                                        getStatusDescription={getStatusDescription}
                                        aiLiveData={aiLiveData}
                                        countries={countries}
                                    />
                                )}
                                {activeTab === "impact" && <ImpactTab key="impact" countries={countries} />}
                                {activeTab === "truths" && (
                                    <HiddenTruthsTab
                                        key="truths"
                                        insights={emergenceData?.insights}
                                        activeScenario={activeScenario}
                                        events={events}
                                        countries={countries}
                                    />
                                )}
                                {activeTab === "intel" && <IntelTab key="intel" events={events} shadowEntities={shadowEntities} />}
                                {activeTab === "oracle" && (
                                    <OracleTab key="oracle" globalStability={globalStability} countries={countries} />
                                )}
                                {activeTab === "whatif" && (
                                    <WhatIfTab key="whatif" countries={countries} globalStability={globalStability} />
                                )}
                                {activeTab === "timeline" && <TimelineTab key="timeline" events={events} />}
                                {activeTab === "live" && (
                                    <motion.div
                                        key="live"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <AftermathLiveDataPanel aiLiveData={aiLiveData} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
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
        green: { bg: "bg-green-500/20", text: "text-green-400", glow: "rgba(34,197,94,0.6)" },
        cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", glow: "rgba(6,182,212,0.6)" },
        red: { bg: "bg-red-500/20", text: "text-red-400", glow: "rgba(239,68,68,0.6)" },
        yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400", glow: "rgba(234,179,8,0.6)" },
    };

    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">{label}</span>
            <div className="flex items-center gap-2">
                <motion.div
                    className={`w-2 h-2 rounded-full ${colors[color].bg}`}
                    style={{ backgroundColor: colors[color].glow.replace("0.6", "1") }}
                    animate={{
                        boxShadow: [`0 0 4px ${colors[color].glow}`, `0 0 8px ${colors[color].glow}`, `0 0 4px ${colors[color].glow}`],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className={`text-xs font-mono font-bold ${colors[color].text}`}>{status}</span>
            </div>
        </div>
    );
}

// Overview Tab Component
function OverviewTab({
    winners,
    losers,
    globalStability,
    userOrigin,
    getStatusDescription,
    aiLiveData,
    countries,
}: {
    winners: Country[];
    losers: Country[];
    globalStability: number;
    userOrigin: string | null;
    getStatusDescription: (id: string) => string;
    aiLiveData?: LiveGeopoliticalData | null;
    countries: Country[];
}) {
    // Dynamic system statuses for "live" feel
    const [systemStatuses] = useState(() => [
        { label: "Coherence Check", status: Math.random() > 0.3 ? "PASSED" : "STABLE", color: "green" as const },
        { label: "Reality Sync", status: Math.random() > 0.3 ? "ACTIVE" : "DRIFTING", color: "cyan" as const },
        { label: "Cascade Vector", status: Math.random() > 0.5 ? "DETECTED" : "ANALYZING", color: "red" as const },
    ]);

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            {aiLiveData && (
                <motion.div
                    className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <Wifi className="text-cyan-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-0.5">Live Intelligence Briefing</div>
                        <div className="text-sm text-cyan-100/80 truncate font-medium">
                            {aiLiveData.recentEvents[0]?.title || "Geopolitical shifts detected in " + aiLiveData.countries.length + " key sectors."}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* [NEW] Strategic Anchor Section (User Origin) */}
            {userOrigin && (
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="text-cyan-400" size={24} />
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">Strategic Anchor Status</h2>
                    </div>
                    {(() => {
                        const originCountry = countries.find(c => c.id.toLowerCase() === userOrigin?.toLowerCase());
                        if (!originCountry) return null;

                        // Check if already in winners or losers to avoid double display if preferred, 
                        // but here we display it prominently regardless for "Player Focus"
                        return (
                            <CountryCard
                                country={originCountry}
                                index={0}
                                type={originCountry.stability > 70 ? "winner" : "loser"}
                                isUserOrigin={true}
                                statusDescription={getStatusDescription(userOrigin)}
                            />
                        );
                    })()}
                </div>
            )}
            {/* Country Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Winners Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy className="text-green-400" size={24} />
                        <h2 className="text-xl font-black text-green-400 uppercase tracking-wider">Emerging Powers</h2>
                    </div>
                    {winners.length > 0 ? (
                        winners.map((country, i) => (
                            <CountryCard
                                key={country.id}
                                country={country}
                                index={i}
                                type="winner"
                                isUserOrigin={country.id === userOrigin}
                                statusDescription={getStatusDescription(country.id)}
                            />
                        ))
                    ) : (
                        <p className="text-white/40 text-center py-8">No clear winners emerged</p>
                    )}
                </div>

                {/* Losers Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <Skull className="text-red-400" size={24} />
                        <h2 className="text-xl font-black text-red-400 uppercase tracking-wider">Collapsed States</h2>
                    </div>
                    {losers.length > 0 ? (
                        losers.map((country, i) => (
                            <CountryCard
                                key={country.id}
                                country={country}
                                index={i}
                                type="loser"
                                isUserOrigin={country.id === userOrigin}
                                statusDescription={getStatusDescription(country.id)}
                            />
                        ))
                    ) : (
                        <p className="text-white/40 text-center py-8">No major collapses detected</p>
                    )}
                </div>
            </div>


        </motion.div>
    );
}

// Country Card Component with flag and details
function CountryCard({
    country,
    index,
    type,
    isUserOrigin,
    statusDescription,
}: {
    country: Country;
    index: number;
    type: "winner" | "loser";
    isUserOrigin: boolean;
    statusDescription: string;
}) {
    const flag = countryFlags[country.id] || "🌍";
    const isWinner = type === "winner";
    const change = isWinner ? `+${Math.round(country.stability - 50)}%` : `-${Math.round(100 - country.stability)}%`;

    return (
        <motion.div
            className={`p-4 rounded-xl border ${isWinner
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20"
                } ${isUserOrigin ? "ring-2 ring-cyan-400" : ""}`}
            initial={{ opacity: 0, x: isWinner ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div className="flex items-start gap-4">
                <span className="text-4xl">{flag}</span>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-lg">{country.name}</span>
                        {isUserOrigin && (
                            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">
                                YOUR NATION
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-white/50">{statusDescription}</p>
                </div>
                <div className="text-right">
                    <div
                        className={`text-2xl font-black ${isWinner ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {change}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                        {isWinner ? (
                            <TrendingUp className="text-green-400" size={14} />
                        ) : (
                            <TrendingDown className="text-red-400" size={14} />
                        )}
                        <span className={`text-xs font-mono ${isWinner ? "text-green-400/60" : "text-red-400/60"}`}>
                            {country.stability.toFixed(0)}%
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Impact Tab Component
function ImpactTab({ countries }: { countries: Country[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">
                Global Impact Assessment
            </h2>
            <div className="grid grid-cols-3 gap-4">
                {countries.map((country, i) => {
                    const flag = countryFlags[country.id] || "🌍";
                    return (
                        <motion.div
                            key={country.id}
                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{flag}</span>
                                <span className="font-bold text-white flex-1">{country.name}</span>
                                <span
                                    className={`font-mono font-bold ${country.stability > 70
                                        ? "text-green-400"
                                        : country.stability > 40
                                            ? "text-yellow-400"
                                            : "text-red-400"
                                        }`}
                                >
                                    {country.stability.toFixed(0)}%
                                </span>
                            </div>

                            {/* Intel Reason */}
                            {GLOBAL_INTELLIGENCE[country.id] && (
                                <p className="text-[10px] text-white/50 mb-3 italic leading-tight">
                                    {GLOBAL_INTELLIGENCE[country.id].why}
                                </p>
                            )}

                            <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${country.stability > 70
                                        ? "bg-green-500"
                                        : country.stability > 40
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${country.stability}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// Intel Tab Component with Hidden Truths
function IntelTab({
    events,
    shadowEntities,
}: {
    events: SimulationEvent[];
    shadowEntities: { name: string; icon: string; description: string; influence: string }[];
}) {
    // Enhanced shadow entities with influence percentages - dynamic selection
    const [enhancedEntities] = useState(() => {
        const shuffled = [...SHADOW_ENTITIES_POOL].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3).map(e => ({
            ...e,
            influence: Math.floor(Math.min(99, Math.max(50, e.influence + (Math.random() * 20 - 10))))
        }));
    });

    // System status indicators with dynamic randomization
    const [systemStatuses] = useState(() => [
        { label: "Coherence Check", status: Math.random() > 0.3 ? "PASSED" : "STABLE", color: "green" as const },
        { label: "Reality Sync", status: Math.random() > 0.3 ? "ACTIVE" : "DRIFTING", color: "cyan" as const },
        { label: "Cascade Vector", status: Math.random() > 0.5 ? "DETECTED" : "ANALYZING", color: "red" as const },
    ]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* System Status Section */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Eye className="text-purple-400" size={20} />
                    <span className="text-sm font-mono text-purple-400">SHADOW ANALYSIS ACTIVE</span>
                </div>
                <div className="space-y-2">
                    {systemStatuses.map((status) => (
                        <div key={status.label} className="flex items-center justify-between">
                            <span className="text-xs text-white/60">{status.label}</span>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className={`w-2 h-2 rounded-full ${status.color === "green" ? "bg-green-500" :
                                        status.color === "cyan" ? "bg-cyan-500" : "bg-red-500"
                                        }`}
                                    animate={{
                                        boxShadow: [
                                            `0 0 4px ${status.color === "green" ? "rgba(34,197,94,0.6)" : status.color === "cyan" ? "rgba(6,182,212,0.6)" : "rgba(239,68,68,0.6)"}`,
                                            `0 0 10px ${status.color === "green" ? "rgba(34,197,94,0.8)" : status.color === "cyan" ? "rgba(6,182,212,0.8)" : "rgba(239,68,68,0.8)"}`,
                                            `0 0 4px ${status.color === "green" ? "rgba(34,197,94,0.6)" : status.color === "cyan" ? "rgba(6,182,212,0.6)" : "rgba(239,68,68,0.6)"}`,
                                        ],
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span className={`text-xs font-mono font-bold ${status.color === "green" ? "text-green-400" :
                                    status.color === "cyan" ? "text-cyan-400" : "text-red-400"
                                    }`}>{status.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hidden Truths Section */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-purple-400" size={24} />
                    <h2 className="text-xl font-black text-purple-400 uppercase tracking-wider">
                        Hidden Truths Revealed
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {enhancedEntities.map((entity, i) => (
                        <motion.div
                            key={entity.name}
                            className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{entity.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-purple-400 font-mono uppercase">
                                            {entity.title}
                                        </span>
                                    </div>
                                    <div className="font-bold text-white text-lg mb-2">{entity.name}</div>
                                    <p className="text-sm text-white/70 leading-relaxed mb-4">
                                        {entity.description}
                                    </p>
                                    {/* Influence Bar */}
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-purple-300/60">Influence</span>
                                            <span className="text-purple-400 font-mono font-bold">{entity.influence}%</span>
                                        </div>
                                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${entity.influence}%` }}
                                                transition={{ duration: 1, delay: i * 0.2 + 0.3 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Analysis Footer */}
                <div className="mt-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-purple-400" size={14} />
                        <span className="text-xs text-purple-300/80 font-mono">
                            AI ANALYSIS: Corporate power rising as state authority fragments
                        </span>
                    </div>
                </div>
            </div>

            {/* Event Feed */}
            <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">
                    Intelligence Feed
                </h2>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {events.length > 0 ? (
                        events.map((event, i) => (
                            <motion.div
                                key={event.id}
                                className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="flex items-start gap-3">
                                    <Activity className="text-cyan-400 mt-1" size={16} />
                                    <div>
                                        <p className="text-white font-medium">{event.description}</p>
                                        <p className="text-cyan-300/60 text-sm mt-1">
                                            Affected: {event.affectedCountries?.join(", ") || "Global"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-white/40 text-center py-8">No events recorded</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Oracle Tab Component
function OracleTab({
    globalStability,
    countries,
}: {
    globalStability: number;
    countries: Country[];
}) {
    const criticalCountries = countries.filter((c) => c.stability < 40);
    const recoveringCountries = countries.filter((c) => c.stability > 70);

    const mainPrediction = globalStability < 30
        ? "CRITICAL SYSTEM FAILURE: Multiple state collapses imminent within 72 hours."
        : globalStability < 50
            ? "SEVERE INSTABILITY: Economic contagion spreading across interconnected markets."
            : "MODERATE DISRUPTION: Recovery possible with coordinated international response.";

    const predictions = [
        {
            icon: "⚠️",
            title: "Primary Assessment",
            content: mainPrediction,
            severity: globalStability < 30 ? "critical" : globalStability < 50 ? "warning" : "moderate",
        },
        {
            icon: "📊",
            title: "Nations at Risk",
            content: `${criticalCountries.length} nations at risk of complete economic collapse. ${recoveringCountries.length} nations showing resilience.`,
            severity: criticalCountries.length > 5 ? "critical" : criticalCountries.length > 2 ? "warning" : "moderate",
        },
        {
            icon: "🔮",
            title: "Cascade Probability",
            content: `AI models predict ${Math.round(67 + (100 - globalStability) * 0.3)}% probability of secondary cascade effects.`,
            severity: globalStability < 40 ? "critical" : "warning",
        },
        {
            icon: "📈",
            title: "Recovery Timeline",
            content: globalStability < 30
                ? "Estimated recovery: 12-24 months. Requires significant international intervention."
                : globalStability < 50
                    ? "Estimated recovery: 6-12 months. Economic restructuring needed."
                    : "Estimated recovery: 2-6 months. Market stabilization expected.",
            severity: "info",
        },
        {
            icon: "🏢",
            title: "Shadow Actors",
            content: "Non-state entities (Glencore, BlackRock, Trafigura) expected to gain 15-25% more influence over affected markets.",
            severity: "warning",
        },
    ];

    const getSeverityColors = (severity: string) => {
        switch (severity) {
            case "critical":
                return "bg-red-500/10 border-red-500/30 text-red-400";
            case "warning":
                return "bg-orange-500/10 border-orange-500/30 text-orange-400";
            case "moderate":
                return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
            default:
                return "bg-purple-500/10 border-purple-500/30 text-purple-400";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <Brain className="text-purple-400" size={24} />
                <h2 className="text-xl font-black text-purple-400 uppercase tracking-wider">
                    AI Oracle - Aftermath Analysis
                </h2>
                <motion.div
                    className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-mono"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    LIVE
                </motion.div>
            </div>

            {/* Stability Gauge */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">Global Stability Index</span>
                    <span className={`text-lg font-mono font-bold ${globalStability > 70 ? "text-green-400" :
                        globalStability > 40 ? "text-yellow-400" : "text-red-400"
                        }`}>
                        {globalStability.toFixed(1)}%
                    </span>
                </div>
                <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${globalStability > 70 ? "bg-green-500" :
                            globalStability > 40 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${globalStability}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </div>

            {/* Predictions Grid */}
            <div className="space-y-4">
                {predictions.map((prediction, i) => (
                    <motion.div
                        key={i}
                        className={`p-5 rounded-xl border ${getSeverityColors(prediction.severity)}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{prediction.icon}</span>
                            <div>
                                <div className="font-bold text-white mb-1">{prediction.title}</div>
                                <p className="text-white/80 leading-relaxed">{prediction.content}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Most Affected Countries */}
            {criticalCountries.length > 0 && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="text-sm font-bold text-red-400 mb-3">Critical Nations</div>
                    <div className="flex flex-wrap gap-2">
                        {criticalCountries.slice(0, 6).map((c) => (
                            <span
                                key={c.id}
                                className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-mono"
                            >
                                {countryFlags[c.id] || "🌍"} {c.name} ({c.stability.toFixed(0)}%)
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// Timeline Tab Component
function TimelineTab({ events }: { events: SimulationEvent[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">Event Timeline</h2>
            <div className="relative pl-8 border-l-2 border-cyan-500/30 space-y-6">
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        className="relative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                    >
                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-900" />
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-white font-medium">{event.description}</p>
                            <p className="text-cyan-400/60 text-sm mt-2 font-mono">
                                T+{Math.round((event.timestamp || i * 1000) / 1000)}s
                            </p>
                        </div>
                    </motion.div>
                ))}
                {events.length === 0 && (
                    <p className="text-white/40 text-center py-8">No timeline data available</p>
                )}
            </div>
        </motion.div>
    );
}

// Hidden Truths Tab Component
function HiddenTruthsTab({
    insights,
    activeScenario,
    events,
    countries
}: {
    insights?: InsightCard[] | null,
    activeScenario?: string | null,
    events?: SimulationEvent[],
    countries?: Country[]
}) {
    const [revealedEntities, setRevealedEntities] = useState<string[]>([]);

    // Detect sanctioned countries from events or scenario
    const sanctionedCountryIds = useMemo(() => {
        const ids = new Set<string>();

        // From active scenario strings
        if (activeScenario?.includes('SANCTION_')) {
            const countryId = activeScenario.replace('SANCTION_', '').toLowerCase();
            ids.add(countryId);
        }

        // From events
        events?.forEach(event => {
            if (event.type === 'action' && event.description.toLowerCase().includes('sanction')) {
                // Try to find country in description or affected list
                countries?.forEach(c => {
                    if (event.description.toLowerCase().includes(c.name.toLowerCase()) ||
                        event.description.toLowerCase().includes(c.id.toLowerCase())) {
                        ids.add(c.id);
                    }
                });
            }
        });

        return Array.from(ids);
    }, [activeScenario, events, countries]);

    // Generate sanction insights
    const sanctionInsights = useMemo(() => {
        const result: any[] = [];
        sanctionedCountryIds.forEach(id => {
            const country = countries?.find(c => c.id === id);
            const name = country?.name || id.charAt(0).toUpperCase() + id.slice(1);
            const truths = getSanctionHiddenTruths(name);

            if (truths) {
                result.push({
                    id: `sanction-truth-${id}`,
                    name: `${name} State Disclosure`,
                    title: "Sanctions Exposed Truth",
                    icon: country?.flag || "🏁",
                    type: "Structural Analysis",
                    severity: "critical",
                    influence: country?.influence || 50,
                    description: `Critical intelligence bypasses state media as sanctions take hold. Structural weaknesses exposed:`,
                    truths: [
                        { label: "Economic Dependency", value: truths.economicDependency },
                        { label: "Power Structure", value: truths.powerStructure },
                        { label: "Social Stability", value: truths.socialStability }
                    ]
                });
            }
        });
        return result;
    }, [sanctionedCountryIds, countries]);

    const displayInsights = useMemo(() => {
        // Combinte base insights with sanction-specific ones
        const baseInsights = insights && insights.length > 0 ? insights : [
            {
                id: "glencore",
                name: "Glencore",
                title: "The Shadow Empire",
                icon: "🏢",
                description: "Glencore's influence now exceeds 3 nation-states as governments falter. Their trading desks profit from the volatility currently destabilizing the triggered region.",
                influence: 87,
                type: "Commodity Trader",
            },
            {
                id: "blackrock",
                name: "BlackRock",
                title: "The Asset Sovereign",
                icon: "🏦",
                description: "Managing more wealth than most G20 nations combined. Their risk-adjustment algorithms are currently determining the bond yields of affected territories.",
                influence: 94,
                type: "Asset Manager",
            },
        ];

        return [...sanctionInsights, ...baseInsights];
    }, [insights, sanctionInsights]);

    const systemStatuses = [
        { id: "coherence", label: "Coherence Check", status: "PASSED", color: "green" as const },
        { id: "reality", label: "Reality Sync", status: "ACTIVE", color: "cyan" as const },
        { id: "cascade", label: "Cascade Vector", status: "DETECTED", color: "red" as const },
    ];

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        displayInsights.forEach((insight, i) => {
            timers.push(
                setTimeout(() => {
                    setRevealedEntities((prev) => [...prev, insight.id]);
                }, 400 + i * 400)
            );
        });
        return () => timers.forEach(clearTimeout);
    }, [displayInsights]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <motion.div
                    className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"
                    animate={{
                        boxShadow: [
                            "0 0 10px rgba(168,85,247,0.4)",
                            "0 0 25px rgba(168,85,247,0.7)",
                            "0 0 10px rgba(168,85,247,0.4)",
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Eye className="text-purple-400" size={24} />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-black text-purple-400 uppercase tracking-wider">
                        Hidden Truths Revealed
                    </h2>
                    <p className="text-sm text-purple-400/60 font-mono">SHADOW ANALYSIS ACTIVE • CORPORATE POWER MAPPING</p>
                </div>
            </div>

            {/* System Status Indicators */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-black/30 border border-white/10">
                {systemStatuses.map((status) => (
                    <div key={status.id} className="flex items-center justify-between">
                        <span className="text-sm text-white/60">{status.label}</span>
                        <div className="flex items-center gap-2">
                            <motion.div
                                className={`w-2.5 h-2.5 rounded-full ${status.color === "green" ? "bg-green-500" :
                                    status.color === "cyan" ? "bg-cyan-500" : "bg-red-500"
                                    }`}
                                animate={{
                                    boxShadow: [
                                        `0 0 4px ${status.color === "green" ? "rgba(34,197,94,0.6)" : status.color === "cyan" ? "rgba(6,182,212,0.6)" : "rgba(239,68,68,0.6)"}`,
                                        `0 0 12px ${status.color === "green" ? "rgba(34,197,94,0.9)" : status.color === "cyan" ? "rgba(6,182,212,0.9)" : "rgba(239,68,68,0.9)"}`,
                                        `0 0 4px ${status.color === "green" ? "rgba(34,197,94,0.6)" : status.color === "cyan" ? "rgba(6,182,212,0.6)" : "rgba(239,68,68,0.6)"}`,
                                    ],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className={`text-sm font-mono font-bold ${status.color === "green" ? "text-green-400" :
                                status.color === "cyan" ? "text-cyan-400" : "text-red-400"
                                }`}>{status.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Shadow Entities */}
            <div className="space-y-4">
                {displayInsights.map((insight: any, i) => {
                    const isRevealed = revealedEntities.includes(insight.id);
                    return (
                        <AnimatePresence key={insight.id}>
                            {isRevealed && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`p-6 rounded-xl border ${insight.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : 'bg-purple-500/10 border-purple-500/20'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-5xl">{insight.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-purple-400 font-mono uppercase tracking-wider">
                                                    {insight.title || insight.id.replace('_', ' ')}
                                                </span>
                                                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300">
                                                    {insight.type || 'ANALYSIS'}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-white text-xl mb-3">{insight.name || insight.title}</h4>
                                            <p className="text-sm text-white/70 leading-relaxed mb-4">
                                                {insight.description}
                                            </p>

                                            {/* Specialized Truths for Sanctions */}
                                            {insight.truths && (
                                                <div className="space-y-3 mb-4 p-3 rounded-lg bg-black/40 border border-red-500/20">
                                                    {insight.truths.map((t: any, idx: number) => (
                                                        <div key={idx} className="flex gap-3">
                                                            <span className="text-red-400 font-bold">{idx + 1}️⃣</span>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-red-300/60 uppercase font-mono">{t.label}</span>
                                                                <span className="text-xs text-white/90">{t.value}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Influence Bar */}
                                            <div>
                                                <div className="flex items-center justify-between text-xs mb-2">
                                                    <span className="text-purple-300/60">Global Influence Index</span>
                                                    <span className="text-purple-400 font-mono font-bold text-lg">
                                                        {insight.influence || (insight.severity === 'critical' ? 95 : insight.severity === 'major' ? 75 : 45)}%
                                                    </span>
                                                </div>
                                                <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${insight.influence || (insight.severity === 'critical' ? 95 : insight.severity === 'major' ? 75 : 45)}%` }}
                                                        transition={{ duration: 1.2, delay: 0.3 }}
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

            {/* AI Analysis Footer */}
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-purple-400" size={18} />
                    <span className="text-sm text-purple-300 font-mono">
                        AI ANALYSIS: Corporate power structures are consolidating as state authority fragments.
                        Non-state actors now control critical infrastructure in 23 nations.
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// What If Tab Component - Gemini-powered scenario translator
function WhatIfTab({
    countries,
    globalStability,
}: {
    countries: Country[];
    globalStability: number;
}) {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [history, setHistory] = useState<{ query: string; response: string }[]>([]);

    const examplePrompts = [
        "What if China and Iran form a secret energy pact?",
        "What if the US defaults on its debt?",
        "What if Russia cuts all gas supplies to Europe?",
        "What if a major cyberattack hits global banking?",
        "What if India and Pakistan enter armed conflict?",
    ];

    const handleSubmit = async () => {
        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setResponse(null);

        try {
            const contextPrompt = `You are a geopolitical simulation AI analyzing hypothetical scenarios.
Current global stability: ${globalStability.toFixed(1)}%
Number of nations in crisis: ${countries.filter(c => c.stability < 40).length}
Top stable nations: ${countries.filter(c => c.stability > 80).slice(0, 3).map(c => c.name).join(", ")}
Most unstable nations: ${countries.filter(c => c.stability < 40).slice(0, 3).map(c => c.name).join(", ")}

User asks: "${query}"

Analyze this "What If" scenario. Provide:
1. IMMEDIATE IMPACT (first 48 hours)
2. CASCADE EFFECTS (1-4 weeks)
3. LONG-TERM CONSEQUENCES (6-12 months)
4. SHADOW ACTORS who would benefit (corporations, non-state entities)
5. PROBABILITY ASSESSMENT (likelihood this could actually happen)

Be dramatic but grounded in real geopolitical dynamics. Format with headers.`;

            const result = await aiEngine.generateText(contextPrompt);
            setResponse(result);
            setHistory(prev => [...prev, { query, response: result }]);
            setQuery("");
        } catch (error) {
            setResponse("⚠️ Analysis failed. The Oracle is temporarily unavailable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <motion.div
                    className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center"
                    animate={{
                        boxShadow: [
                            "0 0 10px rgba(6,182,212,0.4)",
                            "0 0 25px rgba(6,182,212,0.7)",
                            "0 0 10px rgba(6,182,212,0.4)",
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <MessageSquare className="text-cyan-400" size={24} />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-wider">
                        Natural Language "What-If"
                    </h2>
                    <p className="text-sm text-cyan-400/60 font-mono">GEMINI-POWERED SCENARIO TRANSLATOR</p>
                </div>
            </div>

            {/* Input Section */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-cyan-500/20">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="e.g. 'What if China and Iran form a secret energy pact?'"
                        className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 font-mono text-sm"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !query.trim()}
                        className="px-6 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Send size={18} />
                        )}
                        ANALYZE
                    </button>
                </div>

                {/* Status Bar */}
                <div className="mt-3 flex items-center gap-4 text-xs text-white/40 font-mono">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-2 h-2 rounded-full bg-cyan-500"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        PROMPT ARCHITECTURE ACTIVE
                    </div>
                    <span>•</span>
                    <span>GEMINI 1.5 FLASH</span>
                    <span>•</span>
                    <span>LATENCY: ~800MS</span>
                </div>
            </div>

            {/* Example Prompts */}
            <div>
                <p className="text-xs text-white/40 font-mono uppercase mb-3">Quick Scenarios</p>
                <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => setQuery(prompt)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-white transition-all"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Response Section */}
            {(isLoading || response) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-black/30 border border-cyan-500/20"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-3 text-cyan-400">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="font-mono">Analyzing scenario parameters...</span>
                        </div>
                    ) : response && (
                        <div className="prose prose-invert max-w-none">
                            <div className="text-white/90 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                {response}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* History */}
            {history.length > 0 && !isLoading && !response && (
                <div className="space-y-4">
                    <p className="text-xs text-white/40 font-mono uppercase">Previous Analyses</p>
                    {history.slice(-3).reverse().map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                        >
                            <p className="text-cyan-400 font-mono text-sm mb-2">Q: {item.query}</p>
                            <p className="text-white/60 text-xs line-clamp-3">{item.response.slice(0, 200)}...</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// Aftermath Live Data Panel Component
function AftermathLiveDataPanel({ aiLiveData }: { aiLiveData?: any | null }) {
    if (!aiLiveData) return <div className="p-8 text-center text-white/20">Awaiting Reality Sync...</div>;
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-cyan-400 uppercase tracking-wider flex items-center gap-3">
                <Wifi size={24} /> Live Geopolitical Feed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiLiveData.recentEvents.map((e: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                        <div className="text-[10px] text-cyan-400 font-mono mb-1">{e.category}</div>
                        <div className="font-bold text-white text-sm mb-1">{e.title}</div>
                        <p className="text-xs text-white/50">{e.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MapContainer from "./MapContainer";
import EmergencePanel from "./EmergencePanel";
import LoadingScreen from "./LoadingScreen";
import InsightCards, { generateInsights, type Insight } from "./InsightCards";
import ScenarioSelector, { SCENARIOS } from "./ScenarioSelector";
import NewsBroadcast from "./NewsBroadcast";
import ShatterEffect from "./ShatterEffect";
import TutorialOverlay from "./TutorialOverlay";
import AchievementSystem from "./AchievementSystem";
import AIForecastPanel from "./AIForecastPanel";
import AIWhatIfInput from "./AIWhatIfInput";
import AINarrativeReport from "./AINarrativeReport";
import useScreenShake from "@/hooks/useScreenShake";
import useSound from "@/hooks/useSound";
import { useDynamicLighting } from "@/lib/useDynamicLighting";
import { useParallaxDepth } from "@/lib/useParallaxDepth";
import ChaosOverlay from "./ChaosOverlay";
import MatrixRain from "./MatrixRain";
import DeveloperView from "./DeveloperView";
import { useEasterEggs } from "@/hooks/useEasterEggs";
import AccessibilityPanel from "./AccessibilityPanel";
import KeyboardShortcuts from "./KeyboardShortcuts";
import CornerOrnaments from "./CornerOrnaments";

import { usePerformanceOptimizations } from "@/lib/usePerformanceOptimizations";
import useSimulation from "@/hooks/useSimulation";
import { type ActionType, type RoleType, getCascadeEngine } from "@/lib/CascadeEngine";
import { countries, getAllCountries } from "@/lib/geopoliticalData";
import { getSimulationHistory } from "@/lib/SimulationHistory";
import { useIsMobile } from "@/hooks/use-mobile";
import useLiveData from "@/hooks/useLiveData";
import useBreakpoint from "@/hooks/useBreakpoint";
import { useAICommentary } from "@/hooks/useAICommentary";
import MobileNav from "./MobileNav";
import IdentitySelector from "./IdentitySelector";
import NotificationOverlay from "./NotificationOverlay";


import ScenarioGeneratorPanel from "./ScenarioGeneratorPanel";
import { GeneratedScenario } from "@/lib/AIScenarioGenerator";
import { useAIVoice } from "@/hooks/useAIVoice";
import TemporalScrubber from "./TemporalScrubber";
import DiplomaticCouncil from "./DiplomaticCouncil";
import ExecutiveDirectives from "./ExecutiveDirectives";
import CinematicFinality from "./CinematicFinality";
import AmbientSoundController from "./AmbientSoundController";
import CurrencyMonitor from "./CurrencyMonitor";
import AftermathDashboard from "./AftermathDashboard";
import { useAILiveData } from "@/hooks/useAILiveData";
import LiveDataBadge from "./LiveDataBadge";
import DataStreams from "./DataStreams";
import GlobalImpactReport from "./GlobalImpactReport";
import { Eye, Brain, Zap, BarChart3 } from "lucide-react";
import EntropyOverlay from "./EntropyOverlay";
import { useEntropy } from "@/lib/EntropyContext";


export default function FracturedWorld() {
  const [simulationState, simulationActions] = useSimulation();
  const { data: aiLiveData, lastUpdated, isLive } = useAILiveData();
  const [layers, setLayers] = useState({
    energy: false,
    corporate: false,
    ethnic: false,
    shadow: false,
    finance: false,
    stress: false,
  });
  const [compareMode, setCompareMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeLayerToggles, setActiveLayerToggles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [mobileTab, setMobileTab] = useState<"globe" | "data" | "events" | "more">("globe");
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [showIdentitySelector, setShowIdentitySelector] = useState(false);
  const [userOrigin, setUserOrigin] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [highlightedEntities, setHighlightedEntities] = useState<string[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarView, setSidebarView] = useState<"intelligence" | "impact">("intelligence");
  const [showTutorial, setShowTutorial] = useState(false);
  const [forecastTarget, setForecastTarget] = useState<{ scenario: string, target?: string } | null>(null);
  const [showScenarioGenerator, setShowScenarioGenerator] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubbedSnapshot, setScrubbedSnapshot] = useState<any>(null);
  const [showFinality, setShowFinality] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showAftermathDashboard, setShowAftermathDashboard] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [lastActionTarget, setLastActionTarget] = useState<string | null>(null);
  const [lastActionType, setLastActionType] = useState<'sanction' | 'collapse' | 'none'>('none');
  const [showIntelligenceReport, setShowIntelligenceReport] = useState(false);
  const [showOracleModal, setShowOracleModal] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const countryStabilities = useMemo(() => {
    const stabilities: Record<string, number> = {};
    simulationState.countries.forEach((country) => {
      stabilities[country.id] = country.stability;
    });
    return stabilities;
  }, [simulationState.countries]);

  const homeStabilityValue = userOrigin ? countryStabilities[userOrigin] : undefined;
  const unstableCountriesList = useMemo(() =>
    simulationState.countries
      .filter(c => c.phase === 'UNSTABLE' || c.phase === 'COLLAPSED')
      .map(c => c.name),
    [simulationState.countries]
  );

  const { playSound, stopAmbience } = useSound(true);

  // Entropy context for System Collapse theme effects
  const { updateStability, recordCollapse, recordInteraction, chaosLevel, colorShift } = useEntropy();

  /* AI Voice Integration */
  const {
    isSupported,
    isSpeaking,
    speak,
    speakWelcome,
    speakHiddenNews,
    speakSanction,
    stop,
    isEnabled: voiceEnabled,
    setIsEnabled: setVoiceEnabled
  } = useAIVoice();

  // Sync simulation stability with entropy context
  useEffect(() => {
    updateStability(simulationState.globalStability);
  }, [simulationState.globalStability, updateStability]);

  // Record collapse for ghost traces
  useEffect(() => {
    if (simulationState.isCollapsed && simulationState.activeScenario) {
      const affectedCountries = simulationState.countries
        .filter(c => c.stability < 50)
        .map(c => c.name)
        .slice(0, 5);
      recordCollapse(
        simulationState.activeScenario,
        simulationState.globalStability,
        affectedCountries
      );
    }
  }, [simulationState.isCollapsed, simulationState.activeScenario, simulationState.globalStability, simulationState.countries, recordCollapse]);

  // Update session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger milestones (Side Effects)
  useEffect(() => {
    const triggers: Record<number, { type: string, title: string, message: string }> = {
      60: { type: 'emergence', title: 'System Synced', message: 'Optimal synchronization achieved. Intelligence stream stabilized.' },
      300: { type: 'profit', title: 'Analyst Veteran', message: '5 minutes of continuous monitoring. Strategic depth unlocked.' },
      600: { type: 'warning', title: 'Deep State Entry', message: 'Session duration threshold exceeded. Analyzing clandestine patterns.' }
    };

    if (triggers[sessionDuration]) {
      (window as any).addAppNotification?.(triggers[sessionDuration]);
    }
  }, [sessionDuration]);

  // Initial voice briefing
  useEffect(() => {
    if (mounted && voiceEnabled) {
      speakWelcome();
      setTimeout(speakHiddenNews, 6000);
    }
  }, [mounted, voiceEnabled, speakWelcome, speakHiddenNews]);

  // Autonomous Living System Commentary
  useEffect(() => {
    if (!aiLiveData || !mounted || !voiceEnabled) return;

    const triggerAutonomousCommentary = async () => {
      const topEvent = aiLiveData.recentEvents[0];
      const topTension = aiLiveData.globalTensions[0];

      let context = "";
      if (Math.random() > 0.5 && topEvent) {
        context = `Monitoring ${topEvent.title}. Implications for ${topEvent.affectedCountries.join(' and ')} are being analyzed.`;
      } else if (topTension) {
        context = `High tension levels detected between ${topTension.parties.join(' and ')}. Structural pressure is increasing.`;
      } else {
        context = `System state is currently ${simulationState.globalStability > 80 ? 'optimal' : 'stressed'}. Reality sync at 98 percent.`;
      }

      speak(context);
    };

    // Initial delay + periodic (every 2-3 minutes)
    const initialTimer = setTimeout(triggerAutonomousCommentary, 15000);
    const periodicTimer = setInterval(triggerAutonomousCommentary, 150 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(periodicTimer);
    };
  }, [aiLiveData, mounted, simulationState.globalStability, speak]);

  // Toggle handler for the new premium navbar
  const handleToggleModule = useCallback((module: string) => {
    setActiveModule(prev => prev === module ? null : module);
    playSound("toggle");
  }, [playSound]);


  const toggleVoice = () => setVoiceEnabled(!voiceEnabled);

  // Achievement tracking refs
  const actionCountRef = useRef(0);
  const lowStabilityStartTimeRef = useRef<number | null>(null);
  const prevIsCollapsedRef = useRef(false);

  useEffect(() => {
    if (simulationState.globalStability < 10 && !showFinality && !isLoading) {
      setShowFinality(true);
    }
  }, [simulationState.globalStability, showFinality, isLoading]);

  const handleExecuteDirective = (directive: any) => {
    // [Refinement] Bind specific directives to engine actions
    const actionMap: Record<string, ActionType> = {
      'stimulus': 'DIRECTIVE_STIMULUS',
      'lockdown': 'DIRECTIVE_LOCKDOWN',
      'accord': 'DIRECTIVE_ACCORD',
      'nationalize': 'DIRECTIVE_NATIONALIZE'
    };

    const actionType = actionMap[directive.id] || 'SANCTION_COUNTRY';
    simulationActions.executeAction(actionType, 'GLOBAL');

    // Close the panel after execution
    setActiveModule(null);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const titleClickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [tripleClickCount, setTripleClickCount] = useState(0);


  const { triggerShake: shake } = useScreenShake();
  useDynamicLighting(containerRef as any);
  const { registerLayer } = useParallaxDepth(containerRef as any);
  const { width, height } = useBreakpoint();
  const dimensions = { width, height };
  const liveData = useLiveData();
  const isMobile = useIsMobile();
  const { chaosMode, matrixMode, developerView, triggerMatrixMode, triggerDeveloperView } = useEasterEggs();

  useEffect(() => {
    if (simulationState.activeScenario) {
      const scenario = SCENARIOS.find(s => s.id === simulationState.activeScenario);
      const scenarioName = scenario ? scenario.title : simulationState.activeScenario;
      speak(`Tactical update: ${scenarioName} sequence initiated. Analyzing global ripple effects.`);
    }
  }, [simulationState.activeScenario, speak]);

  useEffect(() => {
    if (simulationState.isCollapsed && simulationState.globalStability < 50) {
      speak(`Warning: Global stability has fallen below critical levels. System coherence is failing.`, "urgent");
    }
  }, [simulationState.isCollapsed, simulationState.globalStability, speak]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleLayer = useCallback((layer: string) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer as keyof typeof prev] }));
    playSound("click");
  }, [playSound]);

  const handleActionClick = useCallback((action: string, targetId?: string) => {
    // [Fix] Map UI button IDs to formal ActionTypes
    let finalAction = action as ActionType;
    let finalTarget = targetId;

    if (action === "sanction") {
      finalAction = "SANCTION_RUSSIA";
      finalTarget = "russia";
    } else if (action === "sanction_china") {
      finalAction = "SANCTION_CHINA";
      finalTarget = "china";
    } else if (action === "sanction_usa") {
      finalAction = "SANCTION_USA";
      finalTarget = "usa";
    } else if (action === "alliance") {
      finalAction = "DIRECTIVE_ACCORD";
    } else if (action === "blockade") {
      finalAction = "ENERGY_CUTOFF";
      finalTarget = "russia"; // Russia is the source of the cutoff in engine
    }

    const target = finalAction.includes('SANCTION_') ? finalAction.split('_')[1].toLowerCase() : finalTarget;
    setLastActionTarget(target || null);
    setLastActionType(finalAction.includes('SANCTION') ? 'sanction' : 'none');

    if (finalAction.includes('SANCTION') && target) {
      const country = countries.find(c => c.id === target);
      if (country) speakSanction(country.name);
    }

    simulationActions.executeAction(finalAction, finalTarget, userOrigin);
    actionCountRef.current++;

    // Trigger "God Mode" achievement if 5+ actions taken
    if (actionCountRef.current >= 5 && (window as any).triggerAchievement) {
      (window as any).triggerAchievement('god_mode');
    }
    playSound("action");
  }, [simulationActions, userOrigin, speakSanction, playSound]);

  const handleScenarioSelect = useCallback((scenarioId: string) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario) {
      const target = scenario.id.includes('SANCTION_') ? scenario.id.split('_')[1].toLowerCase() : undefined;
      setLastActionTarget(target || null);
      setLastActionType(scenario.id.includes('SANCTION') ? 'sanction' : 'none');

      if (scenario.id.includes('SANCTION') && target) {
        const country = countries.find(c => c.id === target);
        if (country) speakSanction(country.name);
      }

      simulationActions.executeAction(scenario.id as ActionType, undefined, userOrigin);
      setShowScenarioSelector(false);
      playSound("impact" as any);

      // Trigger tutorial if first time
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        setTimeout(() => setShowTutorial(true), 1500);
      }

      // Trigger achievement for first fracture
      if ((window as any).triggerAchievement) {
        (window as any).triggerAchievement('first_shatter');
      }
    }
  }, [simulationActions, userOrigin, speakSanction, playSound]);

  const handleReset = useCallback(() => {
    simulationActions.reset();
    setShowScenarioSelector(true);
    playSound("reset");
  }, [simulationActions, playSound]);

  const handleIdentitySelectInternal = useCallback((countryId: string, role: string) => {
    setUserOrigin(countryId);
    // [Refinement] Inject Role into engine
    getCascadeEngine().setRole(role as RoleType);

    setShowIdentitySelector(false);
    playSound("click");
    setTimeout(() => setShowScenarioSelector(true), 500);
  }, [playSound]);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => setShowIdentitySelector(true), 500);
  }, []);

  const handleWhatIfExecute = (config: any) => {
    // Map AI-interpreted actions to real simulation engine calls
    config.actions.forEach((action: any) => {
      let type: ActionType = "ECONOMIC_CRISIS";
      if (action.type === 'sanction') type = 'SANCTION_COUNTRY';
      if (action.type === 'blockade') type = 'BLOCK_BOSPHORUS';
      if (action.type === 'military') type = 'MILITARY_TENSION';
      if (action.type === 'alliance') type = 'MILITARY_TENSION'; // Map closest approximation

      // Passes the 'actor' from the AI interpreted config as the anchorId (sanctioner)
      simulationActions.executeAction(type, action.target?.toLowerCase(), action.actor?.toLowerCase() || userOrigin);
    });

    playSound("impact" as any);
  };

  // Track if user manually dismissed the impact view during this collapse
  const impactDismissedRef = useRef(false);
  // Track if user manually dismissed the insights panel during this collapse
  const insightsDismissedRef = useRef(false);

  // Reset dismissed flags when simulation resets (not collapsed anymore)
  useEffect(() => {
    if (!simulationState.isCollapsed) {
      impactDismissedRef.current = false;
      insightsDismissedRef.current = false;
      setShowAftermathDashboard(false);
    }
  }, [simulationState.isCollapsed]);

  // Only auto-switch to impact view ONCE when collapse happens, respect user dismissal
  // NOTE: Aftermath dashboard NO LONGER auto-opens - user uses button to open it
  useEffect(() => {
    if (simulationState.isCollapsed && sidebarView !== "impact" && !impactDismissedRef.current) {
      setSidebarView("impact");
      // Dashboard now opens via button click, not automatically
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationState.isCollapsed]);

  // Handler for when user clicks RETURN from impact view
  const handleImpactDismiss = useCallback(() => {
    impactDismissedRef.current = true;
    setSidebarView("intelligence");
  }, []);


  const handleSanction = useCallback(async (countryId: string) => {
    playSound("alert");
    await simulationActions.executeAction("SANCTION_COUNTRY", countryId, userOrigin);
  }, [simulationActions, playSound, userOrigin]);

  const handleShatterComplete = () => {
    const data = simulationActions.getEmergenceData();
    const newInsights = generateInsights(simulationState.activeScenario || 'sanction_russia', data);
    setInsights(newInsights);
    // Only auto-show if user hasn't dismissed this session
    if (!insightsDismissedRef.current) {
      setShowInsights(true);
    }
  };

  const handleActiveInsightChange = (insight: Insight | null) => {
    if (insight) {
      setHighlightedEntities(insight.entities);
    } else {
      setHighlightedEntities([]);
    }
  };

  const handleMeterShiftClick = (e: React.MouseEvent) => {
    if (e.shiftKey) triggerDeveloperView();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !showAccessibility && !hideUI) {
        setShowShortcuts(true);
      }
      if ((e.key === "u" || e.key === "U") && e.ctrlKey && !showAccessibility && !showShortcuts) {
        setHideUI(!hideUI);
      }
      if (e.key === "Escape") {
        setShowShortcuts(false);
        setShowAccessibility(false);
        setShowScenarioGenerator(false);
      }
      // Toggle AI Scenario Generator with 'Shift + G'
      if ((e.key === "g" || e.key === "G") && e.shiftKey && !e.ctrlKey && !e.metaKey && !showAccessibility && !showShortcuts) {
        setShowScenarioGenerator(prev => !prev);
      }
      // Toggle Temporal Scrubber with 'Shift + T'
      if ((e.key === "t" || e.key === "T") && e.shiftKey && !e.ctrlKey && !e.metaKey && simulationState.isCollapsed) {
        setIsScrubbing(prev => !prev);
      }
      // Toggle Diplomatic Council with 'Shift + D'
      if ((e.key === "d" || e.key === "D") && e.shiftKey && !e.ctrlKey && !e.metaKey && !showAccessibility && !showShortcuts) {
        setActiveModule(prev => prev === 'diplomacy' ? null : 'diplomacy');
        playSound("click");
      }
      // Toggle Executive Directives with 'Shift + E'
      if ((e.key === "e" || e.key === "E") && e.shiftKey && !e.ctrlKey && !e.metaKey && !showAccessibility && !showShortcuts) {
        setActiveModule(prev => prev === 'directives' ? null : 'directives');
        playSound("panel");
      }
      // Toggle Currency Monitor with 'Shift + C'
      if ((e.key === "c" || e.key === "C") && e.shiftKey && !e.ctrlKey && !e.metaKey && !showAccessibility && !showShortcuts) {
        setActiveModule(prev => prev === 'currency' ? null : 'currency');
        playSound("click");
      }
      // Toggle Aftermath Dashboard with 'Shift + A' (only after collapse)
      if ((e.key === "a" || e.key === "A") && e.shiftKey && !e.ctrlKey && !e.metaKey && simulationState.isCollapsed) {
        setShowAftermathDashboard(prev => !prev);
        playSound("click");
      }
      // Toggle Intelligence Report with 'Shift + I'
      if ((e.key === "i" || e.key === "I") && e.shiftKey && !e.ctrlKey && !e.metaKey && !showAccessibility && !showShortcuts) {
        setShowIntelligenceReport(prev => !prev);
        playSound("click");
      }

    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAccessibility, hideUI, showShortcuts, simulationState.isCollapsed, playSound]);

  // Monitor Achievements
  useEffect(() => {
    const trigger = (window as any).triggerAchievement;
    if (!trigger) return;

    // 1. Chaos Architect (Instability for 60s)
    if (simulationState.globalStability < 50) {
      if (!lowStabilityStartTimeRef.current) {
        lowStabilityStartTimeRef.current = Date.now();
      } else if (Date.now() - lowStabilityStartTimeRef.current > 60000) {
        trigger('chaos_architect');
      }
    } else {
      lowStabilityStartTimeRef.current = null;
    }

    // 2. The Kissinger (Avert collapse)
    if (prevIsCollapsedRef.current && !simulationState.isCollapsed && simulationState.globalStability > 80) {
      trigger('diplomat');
    }
    prevIsCollapsedRef.current = simulationState.isCollapsed;

    // 3. Black Swan (Extreme surprise)
    if (simulationState.emergence?.mostSurprising) {
      if (simulationState.emergence.mostSurprising.surpriseScore > 8.5) {
        trigger('black_swan');
      }
    }
  }, [simulationState.globalStability, simulationState.isCollapsed, simulationState.emergence]);

  if (!mounted) {
    return (
      <div className="relative w-screen h-screen bg-black text-white font-sans overflow-hidden">
        <LoadingScreen key="loader" onLoadComplete={() => { }} />
      </div>
    );
  }

  const shatterActive = simulationState.isCollapsed && !showInsights;
  const emergenceData = simulationActions.getEmergenceData();

  const getShatterPattern = (): any => {
    switch (simulationState.activeScenario) {
      case 'ECONOMIC_CRISIS': return 'implosion';
      case 'SANCTION_RUSSIA': return 'explosion';
      case 'UK_EXIT': return 'wave';
      case 'MILITARY_TENSION': return 'chaos';
      case 'BLOCK_BOSPHORUS': return 'vortex';
      default: return 'explosion';
    }
  };

  // Get survivor hubs for magnetic re-ordering
  const winnerHubs = simulationState.countries
    .filter(c => c.stability > 70)
    .sort((a, b) => b.stability - a.stability)
    .slice(0, 3)
    .map(c => ({
      x: (c.position.lng + 180) * (dimensions.width / 360),
      y: (90 - c.position.lat) * (dimensions.height / 180)
    }));

  return (
    <div className="relative w-screen h-screen bg-black text-white font-sans overflow-hidden">
      <NotificationOverlay />
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen key="loader" onLoadComplete={handleLoadComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIdentitySelector && (
          <IdentitySelector
            isVisible={showIdentitySelector}
            onSelect={handleIdentitySelectInternal}
            onSkip={() => {
              setShowIdentitySelector(false);
              setShowScenarioSelector(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScenarioSelector && (
          <ScenarioSelector
            isVisible={showScenarioSelector}
            onSelect={handleScenarioSelect}
            onClose={() => setShowScenarioSelector(false)}
          />
        )}
      </AnimatePresence>

      <ChaosOverlay active={chaosMode} />
      <MatrixRain active={matrixMode} />
      <DeveloperView active={developerView} />

      {/* Entropy-driven visual effects for System Collapse theme */}
      <EntropyOverlay />

      <AccessibilityPanel
        open={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
      <KeyboardShortcuts
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <div
        ref={containerRef}
        className="flex flex-col w-full h-full relative z-10"
      >
        <div className="vignette z-0 pointer-events-none" />
        <div className="noise-texture z-0 pointer-events-none" />
        <DataStreams />

        <AnimatePresence mode="wait">
          {!hideUI && !isLoading && !showIdentitySelector && !showScenarioSelector && (
            <motion.div
              key="ui-interface"
              className="flex flex-col w-full h-full origin-center"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                rotate: simulationState.globalStability < 40 ? (Math.random() * 0.4 - 0.2) * (1 - simulationState.globalStability / 40) : 0,
                skewX: simulationState.globalStability < 30 ? (Math.random() * 0.2 - 0.1) * (1 - simulationState.globalStability / 30) : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                rotate: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                skewX: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              <LiveDataBadge
                lastUpdated={lastUpdated}
                isLive={isLive}
                className="top-20 left-1/2 -translate-x-1/2"
              />

              {/* Floating Command Center - Left Side of Globe */}
              {/* Hide when any report/modal is open OR during shatter effect */}
              {!showAftermathDashboard && !showIntelligenceReport && !shatterActive && (
                <div className="fixed bottom-8 left-[420px] z-[60] flex flex-col gap-3 items-start">
                  {/* Detailed Analysis Button - Opens Aftermath Dashboard */}
                  <AnimatePresence>
                    {activeModule !== 'oracle' && simulationState.activeScenario && (
                      <motion.button
                        key="analysis-trigger"
                        onClick={() => setShowAftermathDashboard(true)}
                        className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass-premium border border-red-500/30 text-red-400 font-mono text-[10px] font-black tracking-widest hover:border-red-400 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                      >
                        <div className="relative">
                          <BarChart3 className="w-5 h-5 animate-pulse" />
                          <div className="absolute inset-0 bg-red-400/20 blur-lg rounded-full" />
                        </div>
                        <div className="flex flex-col items-start leading-none gap-1">
                          <span className="text-white/40 text-[8px]">DETAILED</span>
                          <span className="text-white">ANALYSIS</span>
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {activeModule !== 'oracle' && (
                      <motion.button
                        key="intel-handle"
                        onClick={() => setShowIntelligenceReport(true)}
                        className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass-premium border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-black tracking-widest hover:border-cyan-400 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                      >
                        <div className="relative">
                          <Eye className="w-5 h-5 animate-pulse" />
                          <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full" />
                        </div>
                        <div className="flex flex-col items-start leading-none gap-1">
                          <span className="text-white/40 text-[8px]">STRATEGIC</span>
                          <span className="text-white">INTEL HANDBOOK</span>
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {activeModule !== 'oracle' && (
                      <motion.button
                        key="oracle-trigger"
                        onClick={() => {
                          handleToggleModule('oracle');
                          setShowIntelligenceReport(false);
                        }}
                        className="group flex items-center gap-3 px-4 py-4 rounded-2xl glass-premium border border-purple-500/30 text-purple-400 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      >
                        <div className="relative">
                          <Brain className="w-6 h-6 animate-pulse" />
                          <div className="absolute inset-0 bg-purple-400/20 blur-lg rounded-full" />
                        </div>
                        <div className="flex flex-col items-start leading-none gap-1">
                          <span className="text-[10px] font-black tracking-[0.2em] font-mono">ORACLE AI</span>
                          <span className="text-white/60">PREDICT VECTORS</span>
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
              <Header
                soundEnabled={soundEnabled}
                onToggleSound={() => {
                  setSoundEnabled(!soundEnabled);
                  playSound("toggle");
                }}
                onToggleCompare={() => {
                  setCompareMode(!compareMode);
                  playSound("toggle");
                }}
                onReset={handleReset}
                onOpenAccessibility={() => {
                  setShowAccessibility(true);
                  playSound("panel");
                }}
                liveData={liveData}
                isMobile={isMobile}
                onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
                activeModule={activeModule}
                onToggleModule={handleToggleModule}
                voiceEnabled={voiceEnabled}
                onToggleVoice={toggleVoice}
              />

              {/* [NEW] Global Glitch Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
                style={{
                  opacity: Math.min(0.8, simulationState.dataDrift * 1.5), // Scale opacity with drift
                  display: simulationState.dataDrift > 0.05 ? 'block' : 'none'
                }}
              >
                {/* CRT Scanlines */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-[length:100%_4px] animate-scanlines" />

                {/* Chromatic Aberration Simulation (CSS) */}
                <div className="absolute inset-0 mix-blend-screen opacity-30 animate-pulse"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,0,0,0.2), rgba(0,255,0,0.2), rgba(0,0,255,0.2))',
                    transform: `translate(${(Math.random() - 0.5) * 15 * simulationState.dataDrift}px, ${(Math.random() - 0.5) * 15 * simulationState.dataDrift}px)`,
                    filter: `blur(${simulationState.dataDrift * 2}px)`
                  }}
                />
              </div>

              <div className={`flex flex-1 overflow-hidden relative z-20 ${isMobile ? 'flex-col-reverse' : 'flex-row'}`}>
                <Sidebar
                  stability={simulationState.globalStability}
                  coherence={simulationState.coherence}
                  isCollapsed={simulationState.isCollapsed}
                  onActionClick={handleActionClick}
                  layers={layers}
                  onToggleLayer={handleToggleLayer}
                  enableLayerToggles={activeLayerToggles}
                  userOrigin={userOrigin}
                  homeStability={homeStabilityValue}
                  className="max-h-full"
                  emergenceData={emergenceData}
                  showEmergence={sidebarView === "impact"}
                  onToggleView={handleImpactDismiss}
                  onActionHover={(id) => setForecastTarget(id ? { scenario: id.toUpperCase() } : null)}
                  onWhatIfExecute={handleWhatIfExecute}
                  voiceEnabled={voiceEnabled}
                  onToggleVoice={toggleVoice}
                  globalTrust={simulationState.globalTrust}
                  dataDrift={simulationState.dataDrift}
                  unstableCountries={unstableCountriesList}
                  hoveredCountry={hoveredCountry}
                />

                <div className="flex-1 flex flex-col relative z-10">
                  <MapContainer
                    isCollapsed={simulationState.isCollapsed}
                    compareMode={compareMode}
                    activeLayers={layers}
                    countryStabilities={countryStabilities}
                    onMeterShiftClick={handleMeterShiftClick}
                    playSound={playSound}
                    highlightedEntities={highlightedEntities}
                    onCountryHover={setHoveredCountry}
                    onSanction={handleSanction}
                    userOrigin={userOrigin}
                    countries={simulationState.countries}
                    events={simulationState.events}
                    dataDrift={simulationState.dataDrift}
                  />

                  {/* News Broadcast - Moved to top-right corner, compact */}
                  <div className="absolute top-4 right-4 z-30 max-w-sm">
                    <NewsBroadcast
                      events={simulationState.events}
                      isCollapsed={simulationState.isCollapsed}
                      stability={simulationState.globalStability}
                    />
                  </div>


                  <InsightCards
                    insights={insights}
                    onClose={() => {
                      insightsDismissedRef.current = true;
                      setShowInsights(false);
                      setHighlightedEntities([]);
                    }}
                    isVisible={showInsights && simulationState.isCollapsed}
                    onActiveInsightChange={(insight) => handleActiveInsightChange(insight)}
                  />
                </div>
              </div>

              <AnimatePresence>
                {simulationState.globalStability < 75 && !simulationState.isCollapsed && (
                  <motion.div
                    className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: (1 - simulationState.globalStability / 75) * 0.4,
                      backgroundColor: ["rgba(255,0,0,0)", "rgba(255,0,0,0.1)", "rgba(255,0,0,0)"]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      backgroundColor: { duration: 0.2, repeat: Infinity },
                      opacity: { duration: 0.5 }
                    }}
                  >
                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <ShatterEffect
          active={shatterActive}
          pattern={getShatterPattern()}
          onComplete={handleShatterComplete}
          width={dimensions.width}
          height={dimensions.height}
          playSound={playSound}
          stopSounds={stopAmbience}
          winners={winnerHubs}
        />

        {hideUI && (
          <div className="absolute inset-0 z-0">
            <MapContainer
              isCollapsed={simulationState.isCollapsed}
              compareMode={compareMode}
              activeLayers={layers}
              countryStabilities={countryStabilities}
              onMeterShiftClick={handleMeterShiftClick}
              playSound={playSound}
            />
          </div>
        )}

        <div className="pointer-events-none z-50">
          <CornerOrnaments />
        </div>

        {isMobile && (
          <MobileNav
            activeTab={mobileTab}
            onTabChange={setMobileTab}
            onToggleLayers={() => setActiveLayerToggles(!activeLayerToggles)}
            onOpenSettings={() => setShowAccessibility(true)}
            onReset={handleReset}
          />
        )}

        <AnimatePresence>
          {showIntelligenceReport && (
            <GlobalImpactReport
              isVisible={showIntelligenceReport}
              onClose={() => setShowIntelligenceReport(false)}
            />
          )}
        </AnimatePresence>

        <TutorialOverlay
          isActive={showTutorial}
          onComplete={() => setShowTutorial(false)}
        />

        <AchievementSystem
          playSound={playSound as any}
        />

        <AIForecastPanel
          isVisible={!!forecastTarget && !shatterActive}
          activeScenario={forecastTarget?.scenario || null}
          actionTarget={forecastTarget?.target || null}
        />

        {/* What-If Panel (replaced AI Oracle) */}
        {activeModule === 'oracle' && (
          <motion.div
            className="fixed bottom-6 right-4 z-50 w-[calc(100vw-32px)] md:w-[400px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-4 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-purple-400 uppercase tracking-widest">AI WHAT-IF</span>
                <button onClick={() => setActiveModule(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <AIWhatIfInput onExecute={(config) => handleWhatIfExecute(config)} onClose={() => setActiveModule(null)} />
            </div>
          </motion.div>
        )}

        <AINarrativeReport
          isVisible={activeModule === 'narrative'}
          scenario={simulationState.activeScenario || ""}
          events={simulationState.events}
          emergenceData={simulationState.emergence}
          onClose={() => setActiveModule(null)}
        />





        <TemporalScrubber
          isVisible={isScrubbing}
          historyLength={getSimulationHistory().length}
          onScrub={(pct) => {
            const snapshot = getSimulationHistory().getSnapshotAtPosition(pct);
            if (snapshot) setScrubbedSnapshot(snapshot);
          }}
          onExit={() => setIsScrubbing(false)}
        />

        <DiplomaticCouncil
          isVisible={activeModule === 'diplomacy'}
          onClose={() => setActiveModule(null)}
        />

        <ExecutiveDirectives
          isVisible={activeModule === 'directives'}
          onClose={() => setActiveModule(null)}
          onExecute={handleExecuteDirective}
          globalStability={simulationState.globalStability}
        />

        <CinematicFinality
          isActive={showFinality}
          stability={simulationState.globalStability}
          onRestart={handleReset}
        />

        <CurrencyMonitor
          isVisible={activeModule === 'currency'}
          onClose={() => setActiveModule(null)}
          globalStability={simulationState.globalStability}
          countryStabilities={Object.fromEntries(
            simulationState.countries.map(c => [c.id, c.stability])
          )}
        />



        {/* AI Scenario Generator (Toggle with G key) */}
        <AnimatePresence>
          {showScenarioGenerator && (
            <div className="fixed bottom-4 right-4 z-50">
              <ScenarioGeneratorPanel
                onRunScenario={(scenario: GeneratedScenario) => {
                  // [Refinement] AI Scenario Integration: Bias the engine with scenario specifics
                  const engine = getCascadeEngine();
                  engine.injectScenarioMetadata({
                    intensity: scenario.primaryAction.intensity,
                    affectedCountries: scenario.affectedCountries
                  });

                  // Map generated scenario to action
                  const actionMap: Record<string, any> = {
                    'sanction': 'SANCTION_COUNTRY',
                    'blockade': 'BLOCK_BOSPHORUS',
                    'cyber_attack': 'MILITARY_TENSION',
                    'economic_crisis': 'ECONOMIC_CRISIS',
                    'alliance_break': 'UK_EXIT'
                  };
                  const action = actionMap[scenario.primaryAction.type] || 'ECONOMIC_CRISIS';
                  simulationActions.executeAction(action as any);
                  setShowScenarioGenerator(false);
                  playSound("impact" as any);
                }}
                isVisible={showScenarioGenerator}
                onClose={() => setShowScenarioGenerator(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Aftermath Dashboard - Shows after collapse */}
        <AftermathDashboard
          isVisible={showAftermathDashboard}
          onClose={() => setShowAftermathDashboard(false)}
          countries={simulationState.countries as any}
          events={simulationState.events as any}
          globalStability={simulationState.globalStability}
          activeScenario={simulationState.activeScenario}
          userOrigin={userOrigin}
          aiLiveData={aiLiveData}
          emergenceData={simulationState.emergence}
        />


      </div>
    </div>
  );
}

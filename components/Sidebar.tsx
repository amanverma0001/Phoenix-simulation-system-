"use client"
import SystemCoherenceMeter from "./SystemCoherenceMeter"
import LiveGeopoliticalFeed from "./LiveGeopoliticalFeed"
import StabilityMeter from "./StabilityMeter"
import ActionButtons from "./ActionButtons"
import LayerToggles from "./LayerToggles"
import AIWhatIfInput from "./AIWhatIfInput"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { useHolographicEffect } from "@/lib/useHolographicEffect"
import { useIsMobile } from "@/hooks/use-mobile"
import { ChevronUp, ChevronDown, Activity, Shield, MapPin, Mic, MicOff, Info } from "lucide-react"
import { getAllCountries } from "@/lib/geopoliticalData"
import GlobalCommandClock from "./GlobalCommandClock"
import NeighborMoodMeter from "./NeighborMoodMeter"

interface SidebarProps {
  stability: number
  coherence: number
  isCollapsed: boolean
  onActionClick: (action: string) => void
  layers: Record<string, boolean>
  onToggleLayer: (layer: string) => void
  enableLayerToggles: boolean
  userOrigin?: string | null
  homeStability?: number
  className?: string
  emergenceData?: any
  showEmergence?: boolean
  onToggleView?: (view: "intelligence" | "impact") => void
  onActionHover?: (actionId: string | null) => void
  onWhatIfExecute?: (config: any) => void
  voiceEnabled?: boolean
  onToggleVoice?: () => void
  lastActionTarget?: string | null
  lastActionType?: 'sanction' | 'collapse' | 'none'
  globalTrust?: number
  dataDrift?: number         // [Refinement] Epistemic Drift
  unstableCountries?: string[]
  hoveredCountry?: string | null
}

export default function Sidebar({
  stability,
  coherence,
  isCollapsed,
  onActionClick,
  layers,
  onToggleLayer,
  enableLayerToggles,
  userOrigin,
  homeStability,
  className = "",
  emergenceData,
  showEmergence = false,
  onToggleView,
  onActionHover,
  onWhatIfExecute,
  voiceEnabled = true,
  onToggleVoice,
  lastActionTarget = null,
  lastActionType = 'none',
  globalTrust = 1.0,
  dataDrift = 0,
  unstableCountries = [],
  hoveredCountry = null,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(false)

  useHolographicEffect(sidebarRef as any)

  useEffect(() => {
    if (isMobile) return // Skip data streams on mobile for performance

    const createDataStream = () => {
      if (!sidebarRef.current) return

      const stream = document.createElement("div")
      stream.className = "data-stream"
      stream.style.left = Math.random() * 100 + "%"
      stream.style.top = "-20px"
      stream.textContent = Math.random() > 0.5 ? "01010101" : "FEDCBA98"

      sidebarRef.current.appendChild(stream)

      setTimeout(() => stream.remove(), 8000)
    }

    const interval = setInterval(createDataStream, 2000)
    return () => clearInterval(interval)
  }, [isMobile])

  return (
    <motion.aside
      ref={sidebarRef}
      className={`relative flex breathing rim-light shrink-0 z-30 transition-all duration-500 ${isMobile
        ? `fixed bottom-16 left-0 right-0 z-50 border-t border-cyan-500/20 bg-black/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,255,255,0.15)]`
        : 'w-full md:w-[320px] lg:w-[400px] h-full flex-col border-r border-cyan-500/20 bg-black/30 backdrop-blur-xl'
        } ${className}`}
      animate={isMobile ? {
        height: isExpanded ? '70vh' : '80px'
      } : {
        opacity: 1
      }}
      initial={isMobile ? { height: '80px' } : { opacity: 0 }}
    >
      {/* Glow effect for drawer edge on mobile */}
      {isMobile && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-500/40 rounded-full mt-2" />
      )}

      {!isMobile && (
        <>
          <div className="absolute inset-0 glass-premium rounded-none z-[-1]" />
          <div className="absolute inset-0 scanline-overlay opacity-20 z-[-1]" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />
        </>
      )}

      {/* Mobile Toggle Bar */}
      {isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-6 py-4"
        >
          <div className="flex items-center gap-3">
            <Activity size={18} className="text-cyan-400" />
            <span className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Simulation Intelligence
            </span>
          </div>
          {isExpanded ? <ChevronDown className="text-cyan-400" /> : <ChevronUp className="text-cyan-400" />}
        </button>
      )}

      {/* Inner Scroll Container */}
      <div className={`w-full ${isMobile
        ? `overflow-y-auto px-6 py-4 transition-opacity duration-300 ${isExpanded ? 'opacity-100 h-full' : 'opacity-0 h-0 pointer-events-none'}`
        : 'flex flex-col gap-6 overflow-y-auto px-6 py-8 pb-48 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent'
        }`}>

        {/* Combined Intelligence + Impact View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          {/* System Coherence Meter - Real-time animated */}
          <div className="shrink-0 flex justify-center">
            <SystemCoherenceMeter
              stability={coherence}
              isAnimating={stability < 100}
              compact={false}
              unstableCountries={unstableCountries}
              targetCountryId={hoveredCountry}
            />
          </div>

          {/* [Refinement] Epistemic Drift Warning */}
          <AnimatePresence>
            {dataDrift > 0.4 && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="mx-6 mb-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 flex items-start gap-2 overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              >
                <div className="relative mt-0.5">
                  <Activity className="w-4 h-4 text-red-400 animate-pulse" />
                  <div className="absolute inset-0 bg-red-400/20 blur-md rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-tighter text-red-400 font-mono">WARNING: DATA INTEGRITY CRITICAL</span>
                  <span className="text-[8px] text-white/50 leading-tight">System decoherence detected. Simulation indices may exhibit erratic jitter.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* [Refinement] Systemic Exhaustion Meter */}
          <div className="shrink-0 p-4 rounded-xl glass-premium-accent border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${globalTrust < 0.3 ? 'bg-red-500 animate-pulse' : 'bg-cyan-400'}`} />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-500/80">Global Trust Capital</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white">{(globalTrust * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${globalTrust < 0.3 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${globalTrust * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-[9px] text-gray-500 italic">Directive effectiveness decreases as trust capital is exhausted.</p>
          </div>

          {/* Strategic Anchor Status - Shows when emergence data is available */}
          {userOrigin && emergenceData?.anchorImpact && showEmergence && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-yellow-500/70">Strategic Anchor Status</span>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl glass-premium-accent border border-yellow-500/20 relative overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.4)]"
              >
                {/* Background glow streak */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -mr-16 -mt-16" />

                <div className="absolute top-0 right-0 p-3">
                  <div className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold ${homeStability && homeStability < 50
                    ? 'border-red-500/40 text-red-100 bg-red-500/20'
                    : 'border-yellow-500/40 text-yellow-100 bg-yellow-500/20'
                    }`}>
                    {homeStability && homeStability < 50 ? 'CRITICAL RISK' : 'STABLE VORTEX'}
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-white/80">{getAllCountries().find(c => c.id === userOrigin)?.id.toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-black text-white uppercase tracking-wider">{emergenceData.anchorImpact.name.replace(emergenceData.anchorImpact.flag || '', '').trim()}</h4>
                    <p className="text-[10px] font-mono text-yellow-500/80 uppercase tracking-widest mt-0.5">{emergenceData.anchorImpact.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black font-mono tracking-tighter ${emergenceData.anchorImpact.influenceChange >= 0 ? 'text-cyan-400' : 'text-red-500'}`}>
                      {emergenceData.anchorImpact.influenceChange >= 0 ? '+' : ''}{emergenceData.anchorImpact.percentageChange.toFixed(0)}%
                    </div>
                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Volatility</div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Calculated Stability</span>
                    <span className={`text-sm font-mono font-black ${homeStability && homeStability < 50 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {homeStability?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className={`h-full ${homeStability && homeStability < 50 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${homeStability}%` }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      style={{ boxShadow: `0 0 10px ${homeStability && homeStability < 50 ? '#ef4444' : '#06b6d4'}` }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Geopolitical Anchor - Shows when no emergence data yet */}
          {userOrigin && (!emergenceData?.anchorImpact || !showEmergence) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 rounded-2xl glass-premium-accent border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 transition-opacity">
                <Shield size={16} className="text-cyan-400" />
              </div>

              <div className="flex items-center gap-3.5 mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white/60">{getAllCountries().find(c => c.id === userOrigin)?.id.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-500/50">Geopolitical Anchor</p>
                  <h4 className="font-bold text-white text-lg leading-tight tracking-wide">
                    {getAllCountries().find(c => c.id === userOrigin)?.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Stability</span>
                  <span className={`text-xl font-mono font-black ${homeStability && homeStability < 50 ? 'text-red-500' : 'text-cyan-400'}`}>
                    {homeStability?.toFixed(1)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Vector</span>
                  <p className="text-[10px] font-mono text-white/90 font-bold">{homeStability && homeStability < 70 ? 'DEGRADING' : 'REMAINING'}</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-3 leading-relaxed font-medium">
                Localized simulation metrics. Regional collapse vectors are currently <span className={homeStability && homeStability < 60 ? 'text-red-400' : 'text-cyan-400'}>{homeStability && homeStability < 60 ? 'ACTIVE' : 'MONITORED'}</span>.
              </p>
            </motion.div>
          )}

          {/* Emergent Beneficiaries - Shows when emergence data available */}
          {showEmergence && emergenceData?.winners && emergenceData.winners.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-500/70">Emergent Beneficiaries</span>
              </div>

              <div className="space-y-3">
                {emergenceData.winners.slice(0, 3).map((winner: any, i: number) => (
                  <motion.div
                    key={winner.entityId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, ease: "easeOut" }}
                    className="p-4 rounded-xl glass-premium-accent border border-cyan-500/10 hover:border-cyan-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="flex items-center gap-4 relative z-10">
                      <span className="text-xl font-black text-white/60">{winner.entityId?.toUpperCase().slice(0, 2)}</span>
                      <div className="flex-1 overflow-hidden min-w-0">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <p className="text-sm font-bold text-white truncate tracking-wide">{winner.name.replace(winner.flag || '', '').trim()}</p>
                          {userOrigin === winner.entityId && (
                            <span className="px-1 py-0.5 rounded-[2px] bg-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-tighter border border-cyan-500/30 shrink-0">PLAYER</span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-cyan-400/60 truncate uppercase tracking-widest mt-0.5">{winner.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-cyan-400 font-mono tracking-tighter">+{winner.percentageChange.toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Failure Vectors - Shows when emergence data has losers */}
          {showEmergence && emergenceData?.losers && emergenceData.losers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500/70">Secondary Failure Vectors</span>
              </div>

              <div className="space-y-3">
                {emergenceData.losers.slice(0, 3).map((loser: any, i: number) => (
                  <motion.div
                    key={loser.entityId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, ease: "easeOut" }}
                    className="p-4 rounded-xl glass-premium-accent border border-red-500/10 hover:border-red-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="flex items-center gap-4 relative z-10">
                      <span className="text-xl font-black text-white/60">{loser.entityId?.toUpperCase().slice(0, 2)}</span>
                      <div className="flex-1 overflow-hidden min-w-0">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <p className="text-sm font-bold text-white truncate tracking-wide">{loser.name.replace(loser.flag || '', '').trim()}</p>
                          {userOrigin === loser.entityId && (
                            <span className="px-1 py-0.5 rounded-[2px] bg-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-tighter border border-red-500/30 shrink-0">PLAYER</span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-red-400/60 truncate uppercase tracking-widest mt-0.5">{loser.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-red-500 font-mono tracking-tighter">-{Math.abs(loser.percentageChange).toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Neighbor Mood Meter */}
          {showEmergence && (
            <NeighborMoodMeter
              targetCountryId={lastActionTarget}
              eventType={lastActionType}
              isVisible={showEmergence}
            />
          )}

          {/* [Refinement] Live Geopolitical Feed - Moved below impact sections */}
          <LiveGeopoliticalFeed />

          {/* Action Buttons */}
          <div className="shrink-0 w-full mt-2">
            <ActionButtons
              onActionClick={(action) => {
                onActionClick(action);
                if (isMobile) setIsExpanded(false);
              }}
              isDisabled={isCollapsed}
              onActionHover={onActionHover}
            />
          </div>

          {/* Layer Toggles */}
          <div className="shrink-0 w-full mt-4">
            <LayerToggles layers={layers} onToggleLayer={onToggleLayer} enabled={enableLayerToggles} />
          </div>

          {/* AI Natural Language Input */}
          {!isMobile && (
            <div className="shrink-0 w-full mt-2">
              <AIWhatIfInput onExecute={(config) => onWhatIfExecute?.(config)} />
            </div>
          )}



          {/* System Diagnostics */}
          {showEmergence && (
            <div className="mt-4 p-4 rounded-xl border border-white/5 bg-black/40 font-mono text-[9px] uppercase tracking-tighter text-gray-500 flex flex-col gap-1">
              <div className="flex justify-between"><span>Coherence Check</span><span className="text-cyan-400">PASSED</span></div>
              <div className="flex justify-between"><span>Reality Sync</span><span className="text-cyan-400">ACTIVE</span></div>
              <div className="flex justify-between"><span>Cascade Vector</span><span className="text-purple-400">DETECTED</span></div>
            </div>
          )}
        </motion.div>


        {/* Extra spacer for mobile scroll */}
        {isMobile && <div className="h-20" />}
      </div>

      {/* Footer / Meta Data */}
      <div className="mt-auto p-4 border-t border-cyan-500/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-lg transition-all ${voiceEnabled
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            title={voiceEnabled ? "Disable AI Commentary" : "Enable AI Commentary"}
          >
            {voiceEnabled ? <Mic size={16} className="animate-pulse" /> : <MicOff size={16} />}
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/70">AI Narration</span>
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase">{voiceEnabled ? 'Active' : 'Offline'}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-cyan-500/40 uppercase">System Status</div>
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-tighter">Nominal Operation</div>
        </div>
      </div>
    </motion.aside>
  )
}

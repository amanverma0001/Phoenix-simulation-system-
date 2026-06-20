"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Building2, Map, Eye, Activity } from "lucide-react"

interface LayerTogglesProps {
  layers: Record<string, boolean>
  onToggleLayer: (layer: string) => void
  enabled: boolean
}

const layerOptions = [
  { id: "energy", icon: Zap, label: "ENERGY NETWORKS", color: "#ff8800" },
  { id: "corporate", icon: Building2, label: "CORPORATE TERRITORIES", color: "#00ffff" },
  { id: "ethnic", icon: Map, label: "ETHNIC BOUNDARIES", color: "#00ff00" },
  { id: "shadow", icon: Eye, label: "SHADOW ACTORS", color: "#ff0040" },
  { id: "finance", icon: Building2, label: "FINANCE HUBS", color: "#00ffcc" },
  { id: "stress", icon: Activity, label: "GEOPOLITICAL STRESS", color: "#ff3300" },
]

export default function LayerToggles({ layers, onToggleLayer, enabled }: LayerTogglesProps) {
  return (
    <div className="w-full space-y-4">
      <AnimatePresence>
        {enabled && (
          <motion.p
            className="text-xs uppercase tracking-widest text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Hidden Layers Revealed
          </motion.p>
        )}
      </AnimatePresence>

      {layerOptions.map((layer) => {
        const Icon = layer.icon
        const isActive = layers[layer.id]

        return (
          <motion.div key={layer.id} className="relative group" initial={false}>
            <button
              onClick={() => onToggleLayer(layer.id)}
              disabled={!enabled}
              className="w-full py-3 px-4 rounded-lg font-mono text-xs uppercase transition-all
                flex items-center justify-between gap-2 overflow-hidden"
              style={{
                background: enabled
                  ? isActive
                    ? `${layer.color}15`
                    : "rgba(255, 255, 255, 0.05)"
                  : "rgba(255, 255, 255, 0.02)",
                border: `2px solid ${isActive ? layer.color : "rgba(255, 255, 255, 0.1)"}`,
                boxShadow: isActive
                  ? `0 0 20px ${layer.color}, inset 0 0 10px ${layer.color}15`
                  : "0 4px 15px rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                opacity: enabled ? 1 : 0.5,
                cursor: enabled ? "pointer" : "not-allowed",
              }}
            >
              {/* Icon side */}
              <div className="flex items-center gap-2 min-w-0">
                <motion.div
                  className="flex-shrink-0"
                  animate={{
                    color: isActive ? layer.color : "#666666",
                    filter: isActive ? `drop-shadow(0 0 8px ${layer.color})` : "none",
                  }}
                >
                  <Icon size={16} />
                </motion.div>
                <span className="truncate" style={{ color: isActive ? layer.color : "#999999" }}>{layer.label}</span>
              </div>

              {/* Physical switch component */}
              <motion.div
                className="relative w-14 h-8 rounded-full transition-colors"
                style={{
                  backgroundColor: isActive ? layer.color : "#404040",
                  boxShadow: isActive
                    ? `0 0 15px ${layer.color}, inset 0 2px 4px rgba(0, 0, 0, 0.3)`
                    : "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Switch knob */}
                <motion.div
                  className="absolute top-1 w-6 h-6 rounded-full bg-white"
                  animate={{
                    x: isActive ? 24 : 0,
                    rotateZ: isActive ? 180 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  style={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                    left: 2,
                  }}
                />

                {/* ON/OFF text */}
                <motion.span
                  className="absolute inset-0 flex items-center justify-center text-[8px] font-bold"
                  style={{
                    color: isActive ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.3)",
                  }}
                  animate={{ opacity: isActive ? [0, 1] : [1, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  {isActive ? "ON" : "OFF"}
                </motion.span>
              </motion.div>

              {/* Badge */}
              <motion.div
                className="px-2 py-1 rounded-full text-[8px] font-bold uppercase"
                style={{
                  background: isActive ? `${layer.color}30` : "rgba(255, 255, 255, 0.05)",
                  color: isActive ? layer.color : "#999999",
                  border: `1px solid ${isActive ? layer.color : "rgba(255, 255, 255, 0.1)"}`,
                }}
              >
                {isActive ? "REVEALED" : "HIDDEN"}
              </motion.div>
            </button>

            {/* Particle effect on toggle */}
            <AnimatePresence>
              {isActive && (
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full pointer-events-none"
                      style={{ background: layer.color }}
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

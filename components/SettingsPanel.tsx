"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useState } from "react"

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

interface ThemeOption {
  name: string
  colors: { primary: string; secondary: string }
}

const themes: ThemeOption[] = [
  { name: "Cyberpunk (Default)", colors: { primary: "#00ffff", secondary: "#ff0080" } },
  { name: "Matrix", colors: { primary: "#00ff00", secondary: "#003300" } },
  { name: "Fire", colors: { primary: "#ff6600", secondary: "#ff0000" } },
  { name: "Vaporwave", colors: { primary: "#ff00ff", secondary: "#00ffff" } },
]

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [volume, setVolume] = useState(70)
  const [uiVolume, setUiVolume] = useState(80)
  const [ambienceVolume, setAmbienceVolume] = useState(30)
  const [particleCount, setParticleCount] = useState(50)
  const [effectsIntensity, setEffectsIntensity] = useState(100)
  const [selectedTheme, setSelectedTheme] = useState(0)

  const handleReset = () => {
    setVolume(70)
    setUiVolume(80)
    setAmbienceVolume(30)
    setParticleCount(50)
    setEffectsIntensity(100)
    setSelectedTheme(0)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-black border-2 border-cyan-400 rounded-lg p-8 max-w-lg space-y-8 font-mono overflow-y-auto max-h-[80vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400">SYSTEM SETTINGS</h2>
              <motion.button
                onClick={onClose}
                className="text-cyan-400 hover:text-cyan-300"
                whileHover={{ scale: 1.2 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Audio Controls */}
            <div className="space-y-4">
              <div className="text-cyan-400 font-bold text-sm">AUDIO CONTROL</div>

              <div className="space-y-3">
                <label className="flex flex-col gap-2">
                  <span className="text-cyan-300">Master Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-cyan-400/60 text-xs">{volume}%</span>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-cyan-300">UI Sounds</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={uiVolume}
                    onChange={(e) => setUiVolume(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-cyan-400/60 text-xs">{uiVolume}%</span>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-cyan-300">Ambient Sounds</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ambienceVolume}
                    onChange={(e) => setAmbienceVolume(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-cyan-400/60 text-xs">{ambienceVolume}%</span>
                </label>
              </div>
            </div>

            {/* Visual Effects */}
            <div className="space-y-4">
              <div className="text-cyan-400 font-bold text-sm">VISUAL EFFECTS</div>

              <label className="flex flex-col gap-2">
                <span className="text-cyan-300">Effects Intensity</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={effectsIntensity}
                  onChange={(e) => setEffectsIntensity(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-cyan-400/60 text-xs">{effectsIntensity}%</span>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-cyan-300">Particle Count</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={particleCount}
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-cyan-400/60 text-xs">{particleCount}%</span>
              </label>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
              <div className="text-cyan-400 font-bold text-sm">COLOR THEME</div>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedTheme(idx)}
                    className={`p-3 rounded text-xs text-center transition-all ${
                      selectedTheme === idx
                        ? "border-2 border-cyan-400 bg-cyan-400/10"
                        : "border-2 border-cyan-400/20 hover:border-cyan-400/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex gap-1 justify-center mb-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.colors.secondary }} />
                    </div>
                    <div className="text-cyan-300">{theme.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-cyan-400/20">
              <motion.button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border-2 border-cyan-400/50 text-cyan-300 text-xs hover:border-cyan-400 hover:text-cyan-400 transition-all rounded"
                whileHover={{ scale: 1.05 }}
              >
                RESET DEFAULTS
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 text-xs hover:bg-cyan-400/20 transition-all rounded"
                whileHover={{ scale: 1.05 }}
              >
                CLOSE
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

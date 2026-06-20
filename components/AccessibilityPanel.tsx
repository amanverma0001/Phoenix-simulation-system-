"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useAccessibility } from "@/hooks/useAccessibility"

interface AccessibilityPanelProps {
  open: boolean
  onClose: () => void
}

export default function AccessibilityPanel({ open, onClose }: AccessibilityPanelProps) {
  const { settings, setSetting } = useAccessibility()

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
            className="bg-black border-2 border-cyan-400 rounded-lg p-6 max-w-sm space-y-6 font-mono"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400">ACCESSIBILITY</h2>
              <motion.button
                onClick={onClose}
                className="text-cyan-400 hover:text-cyan-300"
                whileHover={{ scale: 1.2 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Reduce Motion */}
            <label className="flex items-center gap-3 text-cyan-300 cursor-pointer hover:text-cyan-200">
              <input
                type="checkbox"
                checked={settings.reduceMotion}
                onChange={(e) => setSetting("reduceMotion", e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
              <span>Reduce Animations</span>
            </label>

            {/* High Contrast */}
            <label className="flex items-center gap-3 text-cyan-300 cursor-pointer hover:text-cyan-200">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => setSetting("highContrast", e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
              <span>High Contrast Mode</span>
            </label>

            {/* Large Text */}
            <label className="flex items-center gap-3 text-cyan-300 cursor-pointer hover:text-cyan-200">
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => setSetting("largeText", e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
              <span>Large Text</span>
            </label>

            {/* Screen Reader Mode */}
            <label className="flex items-center gap-3 text-cyan-300 cursor-pointer hover:text-cyan-200">
              <input
                type="checkbox"
                checked={settings.screenReaderMode}
                onChange={(e) => setSetting("screenReaderMode", e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
              <span>Screen Reader Mode</span>
            </label>

            <div className="text-xs text-cyan-400/60 pt-2">Press ? for keyboard shortcuts</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

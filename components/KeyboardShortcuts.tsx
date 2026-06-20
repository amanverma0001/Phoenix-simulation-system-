"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface KeyboardShortcutsProps {
  open: boolean
  onClose: () => void
}

const shortcuts = [
  { key: "↑ ↑ ↓ ↓ ← → ← → B A", description: "Unlock Chaos Mode" },
  { key: "Triple-click title", description: "Toggle Matrix Mode" },
  { key: "Shift + Click meter", description: "Developer View" },
  { key: "Type FRACTURE", description: "Instant Collapse" },
  { key: "? (Question mark)", description: "Show this menu" },
  { key: "E", description: "Presidential Command Terminal" },
  { key: "C", description: "Currency Exchange Monitor" },
  { key: "D", description: "Diplomatic Council" },
  { key: "G", description: "AI Scenario Generator" },
  { key: "T", description: "Temporal Scrubber (after collapse)" },
  { key: "Shift + I", description: "Strategic Intel Handbook (195 Countries)" },
  { key: "Esc", description: "Close panels" },
]

export default function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
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
            className="bg-black border-2 border-cyan-400 rounded-lg p-8 max-w-2xl space-y-4 font-mono"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">KEYBOARD SHORTCUTS</h2>
              <motion.button
                onClick={onClose}
                className="text-cyan-400 hover:text-cyan-300"
                whileHover={{ scale: 1.2 }}
              >
                <X size={28} />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {shortcuts.map((shortcut, idx) => (
                <motion.div
                  key={idx}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="text-cyan-300 font-bold text-sm">{shortcut.key}</div>
                  <div className="text-cyan-400/60 text-xs">{shortcut.description}</div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t border-cyan-400/20 text-xs text-cyan-400/50">Press Esc to close</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { motion } from "framer-motion"
import { Github } from "lucide-react"

export default function FooterCredit() {
  return (
    <motion.footer
      className="fixed bottom-8 left-8 font-mono text-xs text-cyan-400/60 space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <div>Built for System Collapse Hackathon 2025</div>
      <motion.a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors"
        whileHover={{ x: 4 }}
      >
        <Github size={14} />
        Open Source
      </motion.a>
      <div>Made with fire and chaos theory</div>
    </motion.footer>
  )
}

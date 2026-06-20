"use client"

import { useEffect, useState } from "react"

export interface AccessibilitySettings {
  reduceMotion: boolean
  highContrast: boolean
  screenReaderMode: boolean
  largeText: boolean
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    highContrast: false,
    screenReaderMode: false,
    largeText: false,
  })

  // Detect system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const highContrastQuery = window.matchMedia("(prefers-contrast: more)")

    setSettings((prev) => ({
      ...prev,
      reduceMotion: mediaQuery.matches,
      highContrast: highContrastQuery.matches,
    }))

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({
        ...prev,
        reduceMotion: e.matches,
      }))
    }

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({
        ...prev,
        highContrast: e.matches,
      }))
    }

    mediaQuery.addEventListener("change", handleMotionChange)
    highContrastQuery.addEventListener("change", handleContrastChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange)
      highContrastQuery.removeEventListener("change", handleContrastChange)
    }
  }, [])

  // Apply CSS classes based on accessibility settings
  useEffect(() => {
    if (settings.reduceMotion) {
      document.documentElement.style.setProperty("--motion-safe", "0")
    } else {
      document.documentElement.style.setProperty("--motion-safe", "1")
    }

    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast-mode")
    } else {
      document.documentElement.classList.remove("high-contrast-mode")
    }

    if (settings.largeText) {
      document.documentElement.style.fontSize = "18px"
    } else {
      document.documentElement.style.fontSize = "16px"
    }
  }, [settings])

  return {
    settings,
    setSetting: (key: keyof AccessibilitySettings, value: boolean) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
  }
}

# Changelog

All notable changes to the Fractured World Simulator.

## [1.0.0] - 2026-01-31 (Hackathon Release)

### 🌍 Core Simulation
- Implemented **Cascade Engine** with real-time country stability propagation
- Added **Global Hub** mechanic - critical nodes whose failure halves recovery rates
- Created **Epistemic Drift** system - data reliability degrades as chaos increases
- Built **Trust Capital** mechanic - overusing actions exhausts global trust

### 🧠 AI Integration
- Integrated **Google Gemini 1.5 Flash** for natural language scenario interpretation
- Added **AI Oracle** for predictive analysis with chaos-aware prompting
- Implemented **AI Live Commentator** with voice synthesis (TTS)
- Built **What-If Bar** for natural language scenario execution

### 🎨 Visual Effects
- Created **Shatter Effect** with 5 patterns: explosion, implosion, wave, chaos, vortex
- Added **CRT/Glitch Overlay** that intensifies with data drift
- Implemented **Matrix Rain** and **Chaos Mode** easter eggs
- Built **Entropy-driven color shifts** affecting entire UI during collapse

### 🔊 Audio
- Added **Ambient Sound Controller** with adaptive tension levels
- Implemented **AI Voice Narration** for events and sanctions
- Created **Impact sounds** for major geopolitical events

### 📊 Analytics
- Built **Aftermath Dashboard** with winner/loser analysis
- Added **Emergence Panel** showing unexpected beneficiaries
- Created **Neighbor Mood Meter** for regional sentiment
- Implemented **Global Impact Report** with strategic intelligence

### 🎮 User Experience
- Added **Identity Selector** for geopolitical anchor selection
- Created **Scenario Selector** with 8 preset crisis scenarios
- Built **Temporal Scrubber** for post-collapse analysis
- Added **Keyboard Shortcuts** and **Accessibility Panel**

---

## Iteration Notes

### Design Evolution
1. Started with static map → Added 3D globe with Three.js
2. Simple stability bars → Premium glassmorphism UI with holographic effects
3. Manual scenarios → AI-powered natural language interpretation
4. Visual-only → Added audio layer with TTS and ambient sounds
5. Fixed rules → Dynamic rule drift based on trust/chaos

### Technical Decisions
- **Next.js 15** for server components and optimized builds
- **Framer Motion** for buttery smooth 60fps animations
- **Gemini API** for AI (switched from 2.0 to 1.5-flash for stability)
- **Client-side simulation** for instant feedback

### What Surprised Us
- The AI Oracle giving unexpectedly insightful predictions
- Cascade effects creating genuine "black swan" moments
- Users finding creative scenarios we never anticipated
- The visual chaos at low stability being genuinely unsettling

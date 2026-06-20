"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, Sparkles } from 'lucide-react'

interface TutorialStep {
    id: string
    title: string
    description: string
    target?: string // CSS selector
    position: 'center' | 'top' | 'bottom' | 'left' | 'right'
    highlight?: boolean
}

const TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to Fractured World',
        description: 'You\'re about to see what happens when political maps... fracture. Every action has consequences that ripple across the globe.',
        position: 'center'
    },
    {
        id: 'stability',
        title: 'System Stability',
        description: 'This meter shows global coherence. When it drops below 70%, hidden fault lines reveal themselves. Below 50%... reality shatters.',
        target: '.stability-meter',
        position: 'right',
        highlight: true
    },
    {
        id: 'globe',
        title: 'The Surface Reality',
        description: 'This globe shows what we\'re told to see: clean borders, unified nations. But underneath lie hidden power structures, ethnic tensions, and corporate empires.',
        target: '.globe-container',
        position: 'left'
    },
    {
        id: 'layers',
        title: 'Reveal Hidden Layers',
        description: 'Toggle these layers to expose what maps don\'t show: energy dependencies, shadow actors, ethnic fault lines, and corporate control.',
        target: '.layer-toggles',
        position: 'right',
        highlight: true
    },
    {
        id: 'action',
        title: 'Apply Pressure',
        description: 'Choose an action to destabilize the system. Watch as sanctions cause cascading effects through invisible dependencies.',
        target: '.action-buttons',
        position: 'top',
        highlight: true
    },
    {
        id: 'ready',
        title: 'You\'re Ready',
        description: 'Trigger a cascade and watch the world fracture. Pay attention to emergent winners and unexpected losers. Reality is more fragile than it appears.',
        position: 'center'
    }
]

interface TutorialOverlayProps {
    isActive: boolean
    onComplete: () => void
}

export default function TutorialOverlay({ isActive, onComplete }: TutorialOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    const step = TUTORIAL_STEPS[currentStep]

    // Find target element position
    useEffect(() => {
        if (!isActive || !step?.target) {
            setTargetRect(null)
            return
        }

        const updateRect = () => {
            const element = document.querySelector(step.target!)
            if (element) {
                setTargetRect(element.getBoundingClientRect())
            }
        }

        updateRect()
        window.addEventListener('resize', updateRect)
        return () => window.removeEventListener('resize', updateRect)
    }, [isActive, step?.target])

    const handleNext = useCallback(() => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            onComplete()
            localStorage.setItem('hasSeenTutorial', 'true')
        }
    }, [currentStep, onComplete])

    const handleSkip = useCallback(() => {
        onComplete()
        localStorage.setItem('hasSeenTutorial', 'true')
    }, [onComplete])

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                handleNext()
            } else if (e.key === 'Escape') {
                handleSkip()
            }
        }

        if (isActive) {
            window.addEventListener('keydown', handleKey)
            return () => window.removeEventListener('keydown', handleKey)
        }
    }, [isActive, handleNext, handleSkip])

    if (!isActive) return null

    return (
        <div className="fixed inset-0 z-[9998]">
            {/* Overlay with spotlight */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80"
            >
                {/* Spotlight cutout for target element */}
                {targetRect && (
                    <svg className="w-full h-full">
                        <defs>
                            <mask id="spotlight-mask">
                                <rect width="100%" height="100%" fill="white" />
                                <motion.rect
                                    x={targetRect.left - 12}
                                    y={targetRect.top - 12}
                                    width={targetRect.width + 24}
                                    height={targetRect.height + 24}
                                    rx="12"
                                    fill="black"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </mask>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            fill="rgba(0, 0, 0, 0.8)"
                            mask="url(#spotlight-mask)"
                        />
                    </svg>
                )}
            </motion.div>

            {/* Highlight ring around target */}
            {targetRect && step?.highlight && (
                <motion.div
                    className="absolute rounded-xl border-2 border-cyan-400 pointer-events-none"
                    style={{
                        left: targetRect.left - 8,
                        top: targetRect.top - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.02, 1],
                        boxShadow: [
                            '0 0 20px rgba(6, 182, 212, 0.5)',
                            '0 0 40px rgba(6, 182, 212, 0.8)',
                            '0 0 20px rgba(6, 182, 212, 0.5)'
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            {/* Tooltip */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed z-[9999] max-w-md ${getTooltipPosition(step.position, targetRect)}`}
                >
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/50 rounded-xl p-6 shadow-2xl shadow-cyan-500/20">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-cyan-400">
                                <Sparkles size={16} />
                                <span className="text-xs font-mono uppercase tracking-widest">
                                    Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                                </span>
                            </div>
                            <button
                                onClick={handleSkip}
                                className="text-slate-500 hover:text-white transition-colors p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-white mb-3">
                            {step.title}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-6">
                            {step.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            {/* Progress dots */}
                            <div className="flex gap-1.5">
                                {TUTORIAL_STEPS.map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === currentStep
                                                ? 'bg-cyan-400'
                                                : i < currentStep
                                                    ? 'bg-cyan-600'
                                                    : 'bg-slate-700'
                                            }`}
                                        animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                ))}
                            </div>

                            {/* Next button */}
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-white font-bold transition-all hover:scale-105"
                            >
                                {currentStep === TUTORIAL_STEPS.length - 1 ? 'Start Exploring' : 'Next'}
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Keyboard hint */}
                        <div className="mt-4 pt-3 border-t border-slate-700 text-[10px] text-slate-500 font-mono">
                            Press ENTER to continue • ESC to skip
                        </div>
                    </div>

                    {/* Arrow pointing to target */}
                    {targetRect && step.position !== 'center' && (
                        <TutorialArrow position={step.position} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

function getTooltipPosition(position: string, targetRect: DOMRect | null): string {
    if (!targetRect || position === 'center') {
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    }

    switch (position) {
        case 'top':
            return `left-1/2 -translate-x-1/2`
        case 'bottom':
            return `left-1/2 -translate-x-1/2`
        case 'left':
            return `top-1/2 -translate-y-1/2 left-8`
        case 'right':
            return `top-1/2 -translate-y-1/2 right-8`
        default:
            return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    }
}

function TutorialArrow({ position }: { position: string }) {
    const arrowStyles = {
        top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-cyan-500',
        bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-cyan-500',
        left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-r-transparent border-l-cyan-500',
        right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-l-transparent border-r-cyan-500'
    }

    return (
        <div
            className={`absolute w-0 h-0 border-8 ${arrowStyles[position as keyof typeof arrowStyles] || ''}`}
        />
    )
}

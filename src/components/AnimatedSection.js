'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'

/**
 * AnimatedSection - A reusable, performance-optimized scroll animation component
 * 
 * Features:
 * - GPU-friendly transforms (opacity, transform)
 * - Respects prefers-reduced-motion
 * - Responsive motion values for mobile/tablet/desktop
 * - Replays animations on scroll up/down
 * - Zero layout shifts
 * 
 * @param {React.ReactNode} children - Content to animate
 * @param {string} variant - Animation variant: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale'
 * @param {number} delay - Initial delay in seconds (default: 0)
 * @param {number} duration - Animation duration in seconds (default: 0.6)
 * @param {string} className - Additional CSS classes
 * @param {object} customVariants - Custom animation variants (optional)
 */
export default function AnimatedSection({
    children,
    variant = 'fadeUp',
    delay = 0,
    duration = 0.6,
    className = '',
    customVariants,
    ...props
}) {
    const prefersReducedMotion = useReducedMotion()
    const [motionValues, setMotionValues] = useState({
        y: 30,
        x: 30,
        scale: 0.95,
    })

    // Responsive motion values based on screen size
    useEffect(() => {
        const updateMotionValues = () => {
            if (typeof window === 'undefined') return

            // Mobile: smaller movements
            if (window.innerWidth < 768) {
                setMotionValues({
                    y: 20,
                    x: 20,
                    scale: 0.97,
                })
            }
            // Tablet: medium movements
            else if (window.innerWidth < 1024) {
                setMotionValues({
                    y: 25,
                    x: 25,
                    scale: 0.96,
                })
            }
            // Desktop: standard movements
            else {
                setMotionValues({
                    y: 30,
                    x: 30,
                    scale: 0.95,
                })
            }
        }

        updateMotionValues()
        window.addEventListener('resize', updateMotionValues)
        return () => window.removeEventListener('resize', updateMotionValues)
    }, [])

    // Animation variants
    const variants = useMemo(() => {
        // If reduced motion is preferred, use minimal animations
        if (prefersReducedMotion) {
            return {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        duration: 0.3,
                        delay,
                        ease: 'easeOut',
                    },
                },
            }
        }

        // Default variants
        const baseVariants = {
            fadeUp: {
                hidden: {
                    opacity: 0,
                    y: motionValues.y,
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth feel
                    },
                },
            },
            fadeLeft: {
                hidden: {
                    opacity: 0,
                    x: motionValues.x,
                },
                visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                        duration,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            },
            fadeRight: {
                hidden: {
                    opacity: 0,
                    x: -motionValues.x,
                },
                visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                        duration,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            },
            scale: {
                hidden: {
                    opacity: 0,
                    scale: motionValues.scale,
                },
                visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                        duration,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1],
                    },
                },
            },
        }

        // Use custom variants if provided, otherwise use default
        return customVariants || baseVariants[variant] || baseVariants.fadeUp
    }, [variant, delay, duration, motionValues, prefersReducedMotion, customVariants])

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: false, // Replay animation when scrolling back up
                amount: 0.2, // Trigger when 20% of element is visible
                margin: '0px 0px -100px 0px', // Small margin for earlier trigger
            }}
            variants={variants}
            className={className}
            style={{
                willChange: prefersReducedMotion ? 'auto' : 'transform, opacity', // GPU hint
            }}
            {...props}
        >
            {children}
        </motion.div>
    )
}

/**
 * AnimatedStaggerContainer - Container for staggered child animations
 * 
 * Use this to animate multiple children with a stagger effect
 * 
 * @param {React.ReactNode} children - Child elements to stagger
 * @param {number} staggerDelay - Delay between each child (default: 0.1)
 * @param {string} className - Additional CSS classes
 */
export function AnimatedStaggerContainer({
    children,
    staggerDelay = 0.1,
    className = '',
    ...props
}) {
    const prefersReducedMotion = useReducedMotion()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
                delayChildren: 0.1,
            },
        },
    }

    const childVariants = {
        hidden: {
            opacity: prefersReducedMotion ? 0 : 0,
            y: prefersReducedMotion ? 0 : 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: false,
                amount: 0.2,
                margin: '0px 0px -100px 0px',
            }}
            variants={containerVariants}
            className={className}
            style={{
                willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
            }}
            {...props}
        >
            {children}
        </motion.div>
    )
}

/**
 * AnimatedStaggerItem - Individual item for staggered animations
 * 
 * Wrap children of AnimatedStaggerContainer with this component
 */
export function AnimatedStaggerItem({ children, className = '', ...props }) {
    const prefersReducedMotion = useReducedMotion()

    const variants = {
        hidden: {
            opacity: prefersReducedMotion ? 0 : 0,
            y: prefersReducedMotion ? 0 : 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    }

    return (
        <motion.div
            variants={variants}
            className={className}
            style={{
                willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
            }}
            {...props}
        >
            {children}
        </motion.div>
    )
}


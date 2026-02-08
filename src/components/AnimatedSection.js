'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

/**
 * AnimatedSection - A reusable animation wrapper component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.direction - Animation direction: "up", "down", "left", "right" (default: "up")
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 * @param {number} props.duration - Animation duration in seconds (default: 0.6)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.once - Whether to animate only once (default: true)
 * @param {number} props.amount - Viewport threshold for triggering animation (default: 0.2)
 */
export default function AnimatedSection({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  style = {},
  once = true,
  amount = 0.2,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate initial and animate positions based on direction
  const variants = useMemo(() => {
    // Disable animations on mobile
    if (isMobile) {
      return {
        initial: { opacity: 1, y: 0, x: 0 },
        animate: { opacity: 1, y: 0, x: 0 },
      };
    }

    const distance = 50; // pixels to move
    const opacity = { initial: 0, animate: 1 };

    const directionMap = {
      up: {
        initial: { opacity: opacity.initial, y: distance },
        animate: { opacity: opacity.animate, y: 0 },
      },
      down: {
        initial: { opacity: opacity.initial, y: -distance },
        animate: { opacity: opacity.animate, y: 0 },
      },
      left: {
        initial: { opacity: opacity.initial, x: distance },
        animate: { opacity: opacity.animate, x: 0 },
      },
      right: {
        initial: { opacity: opacity.initial, x: -distance },
        animate: { opacity: opacity.animate, x: 0 },
      },
    };

    return directionMap[direction] || directionMap.up;
  }, [direction, isMobile]);

  // On mobile, just render children without animation
  if (isMobile) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth animation
      }}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

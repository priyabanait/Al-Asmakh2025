'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingOverlay({ isLoading }) {
  const scrollPositionRef = useRef(0);

  /* --------------------------------------------------------------
     1. Lock scroll while loading is visible
     -------------------------------------------------------------- */
  useEffect(() => {
    if (isLoading) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      
      // Lock scroll on both body and html
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Prevent scroll on touch devices without causing jump
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // Always restore scroll when loading is hidden
      const body = document.body;
      const html = document.documentElement;
      
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      
      // Restore scroll position after a brief delay to ensure styles are applied
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    }
    
    return () => {
      // Cleanup: always restore scroll on unmount
      const body = document.body;
      const html = document.documentElement;
      
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      
      // Restore scroll position on cleanup
      if (scrollPositionRef.current > 0) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      }
    };
  }, [isLoading]);

  /* --------------------------------------------------------------
     2. Render
     -------------------------------------------------------------- */
  if (!isLoading) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#eeeeee] flex items-center justify-center"
        >
          {/* Loading SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src="/loading/loading.svg"
              alt="Loading"
              width={200}
              height={200}
              className="w-auto h-auto max-w-[300px] max-h-[300px]"
              priority
              unoptimized
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeVideo() {
  /* --------------------------------------------------------------
     1. Show / hide the whole overlay
     -------------------------------------------------------------- */
  const [show, setShow] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false); // 2-sec timer guard
  const [videoEnded, setVideoEnded] = useState(false); // Track when video ends

  const videoRef = useRef(null);
  const scrollPositionRef = useRef(0);

  /* --------------------------------------------------------------
     2. Force a fresh video element on every hard refresh
        (sessionStorage is cleared on a full page reload)
     -------------------------------------------------------------- */
  const [videoKey] = useState(() => {
    const fresh = Date.now();
    try {
      sessionStorage.setItem('welcomeVideoKey', fresh.toString());
    } catch (_) {}
    return fresh;
  });

  /* --------------------------------------------------------------
     3. Mobile detection (once)
     -------------------------------------------------------------- */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const videoSrc = '/video/mobile.mp4'; // Mobile video
  const gifSrc = '/video/Intro.gif'; // Desktop GIF

  /* --------------------------------------------------------------
     4. Desktop GIF: Show for 2 seconds, then hide
     -------------------------------------------------------------- */
  useEffect(() => {
    if (!show || isMobile) return; // Only for desktop

    // Desktop: Show GIF for exactly 2 seconds
    const gifTimer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(gifTimer);
    };
  }, [show, isMobile]);

  /* --------------------------------------------------------------
     5. Mobile Video: Play → start 2-sec timer → hide
     -------------------------------------------------------------- */
  useEffect(() => {
    if (!show || !isMobile) return; // Only for mobile

    const video = videoRef.current;
    if (!video) return;

    let hideTimer = null;

    // Start 2-second timer immediately when video can play
    const onCanPlay = () => {
      if (!hasPlayed) {
        setHasPlayed(true);
        
        // ---- 2-second auto-hide -------------------------------------------------
        hideTimer = setTimeout(() => {
          video.pause();
          setShow(false);
        }, 2000);
      }
    };

    // Optimized play function - start muted for autoplay
    const tryPlay = async () => {
      if (video.paused) {
        try {
          video.muted = true;
          await video.play();
        } catch (e) {
          console.warn('autoplay blocked', e);
        }
      }
    };

    // Use canplay for faster loading - fires when enough data is loaded to start
    const handleCanPlay = () => {
      onCanPlay();
      tryPlay();
    };
    
    const handleLoadedMetadata = () => {
      tryPlay();
    };
    
    const handleLoadedData = () => {
      tryPlay();
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    video.addEventListener('loadeddata', handleLoadedData, { once: true });

    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [show, hasPlayed, videoKey, isMobile]);


  /* --------------------------------------------------------------
     6. Lock scroll while overlay is visible
     -------------------------------------------------------------- */
  useEffect(() => {
    if (show) {
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
      // Always restore scroll when overlay is hidden
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
  }, [show]);

  /* --------------------------------------------------------------
     7. Handlers
     -------------------------------------------------------------- */
  const handleSkip = () => {
    videoRef.current?.pause();
    setShow(false);
  };

  const handleEnded = () => {
    setVideoEnded(true);
    // Delay hiding to allow animation to play
    setTimeout(() => {
      setShow(false);
    }, 500);
  };

  /* --------------------------------------------------------------
     8. Render
     -------------------------------------------------------------- */
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: videoEnded ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black"
        >
          {/* ---------- Desktop: GIF (2 seconds) ---------- */}
          {!isMobile && (
            <motion.img
              src={gifSrc}
              alt="Welcome animation"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          )}

          {/* ---------- Mobile: Video ---------- */}
          {isMobile && (
            <motion.video
              key={videoKey}
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={videoEnded ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              playsInline
              muted={true}
              autoPlay
              preload="auto"
              onEnded={handleEnded}
              onError={(e) => console.error('Video error →', e)}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support video.
            </motion.video>
          )}

          {/* ---------- Animated content after video ends (mobile only) ---------- */}
          {isMobile && videoEnded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              {/* You can add any content here that should appear after video ends */}
            </motion.div>
          )}

          {/* ---------- Skip button (optional - commented out) ---------- */}
          {/* <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white px-5 py-2 rounded-lg font-medium transition backdrop-blur-sm"
            aria-label="Skip intro"
          >
            Skip
          </button> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

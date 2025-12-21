  'use client'

import Header from '../components/Header'
import Hero from '../components/Hero'
import PrivilegeProgram from '../components/PrivilegeProgram'
import AlAsmakhTower from '../components/AlAsmakhTower'
import PrivilegePartners from '../components/PrivilegePartners'
import SignIn from '../components/SignIn'
import Footer from '../components/Footer'
import {useEffect} from 'react'
export default function Home() {
  // Add script to detect screen size and apply appropriate scaling
  useEffect(() => {
    // Add 'js' class to html element to enable JS-dependent styles
    document.documentElement.classList.add('js');
    
    // Function to set CSS variables based on screen size
    const setFigmaScale = () => {
      const width = window.innerWidth;
      
      // For HP Victus laptop (1200px - 1600px)
      if (width >= 1200 && width <= 1600) {
        document.documentElement.style.setProperty('--figma-scale', '0.95');
        document.documentElement.style.setProperty('--figma-width', '1440px');
      }
      // For large monitors (1601px - 1919px)
      else if (width >= 1601 && width <= 1919) {
        document.documentElement.style.setProperty('--figma-scale', '1');
        document.documentElement.style.setProperty('--figma-width', '1440px');
      }
      // For very large screens (1920px+) - Mac-like displays
      else if (width >= 1920 && width < 2560) {
        document.documentElement.style.setProperty('--figma-scale', '1');
        document.documentElement.style.setProperty('--figma-width', '1600px');
      }
      // For ultra-wide screens (2560px+)
      else if (width >= 2560 && width < 3840) {
        document.documentElement.style.setProperty('--figma-scale', '1');
        document.documentElement.style.setProperty('--figma-width', '1920px');
      }
      // For 4K screens (3840px+)
      else if (width >= 3840) {
        document.documentElement.style.setProperty('--figma-scale', '1');
        document.documentElement.style.setProperty('--figma-width', '2560px');
      }
      // Default for smaller screens
      else {
        document.documentElement.style.setProperty('--figma-scale', '1');
        document.documentElement.style.setProperty('--figma-width', '1440px');
      }
    };
    
    // Set initial scale
    setFigmaScale();
    
    // Update on resize with debounce for performance
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setFigmaScale, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <main className="min-h-screen relative">
      <Header />
      <Hero />
      <PrivilegeProgram />
      <AlAsmakhTower />
      <PrivilegePartners />
      {/* <SignIn /> */}
      <Footer />
    </main>
  )
}

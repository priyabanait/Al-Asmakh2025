'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, GitCompare } from 'lucide-react';

export default function ShareButton({ 
  propertyTitle, 
  propertyLocation, 
  propertyUrl,
  className = '',
  size = 'default'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  const shareUrl = propertyUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${propertyTitle} - ${propertyLocation}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: propertyTitle,
        text: shareText,
        url: shareUrl,
      }).catch((err) => console.log('Error sharing', err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
    setIsOpen(false);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Add your favorite logic here
    console.log('Property favorited:', propertyTitle);
  };

  const handleCompare = () => {
    setIsCompared(!isCompared);
    // Add your compare logic here
    console.log('Property added to compare:', propertyTitle);
  };

  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`bg-white/90 hover:bg-white backdrop-blur-sm rounded-full ${buttonSize} shadow-lg hover:shadow-xl transition-all duration-300 z-10`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Share property"
      >
        <Share2 size={iconSize} className="text-[#001730]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Action Icons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-full right-0 mb-2 flex gap-2 z-50"
            >
              {/* Share */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Share property"
              >
                <Share2 size={18} className="text-[#001730]" />
              </motion.button>

              {/* Heart (Favorite) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite();
                }}
                className={`rounded-full p-2 shadow-lg hover:shadow-xl transition-all ${
                  isFavorited ? 'bg-red-50' : 'bg-white'
                }`}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add to favorites"
              >
                <Heart 
                  size={18} 
                  className={isFavorited ? 'text-red-500 fill-red-500' : 'text-[#001730]'} 
                />
              </motion.button>

              {/* Compare */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompare();
                }}
                className={`rounded-full p-2 shadow-lg hover:shadow-xl transition-all ${
                  isCompared ? 'bg-blue-50' : 'bg-white'
                }`}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add to compare"
              >
                <GitCompare 
                  size={18} 
                  className={isCompared ? 'text-blue-500' : 'text-[#001730]'} 
                />
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


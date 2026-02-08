'use client';

import { motion } from 'framer-motion';
import { GitCompare, X } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';

export default function CompareButton() {
  const { compareProperties, setShowCompareModal } = useCompare();

  if (compareProperties.length === 0) {
    return null;
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onClick={() => setShowCompareModal(true)}
      className="fixed bottom-6 right-6 z-40 bg-[#001730] text-white rounded-full px-6 py-3 shadow-2xl hover:bg-[#002d52] transition-colors flex items-center gap-3 group"
    >
      <GitCompare size={20} />
      <span className="font-semibold">
        Compare ({compareProperties.length}/2)
      </span>
      <div className="bg-white/20 rounded-full px-2 py-1 text-xs font-bold">
        {compareProperties.length}
      </div>
    </motion.button>
  );
}


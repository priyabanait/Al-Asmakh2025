"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlertModal({ message, type = "error", onClose, autoClose = true, duration = 4000 }) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (message && autoClose) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, autoClose, duration, onClose]);

  if (!message) return null;

  const isError = type === "error";
  const iconColor = isError ? "text-red-400" : "text-green-400";
  const iconBg = isError ? "bg-red-500/20" : "bg-green-500/20";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] pointer-events-none"
        >
          <div
            className="bg-[#1C1E21] text-white rounded-xl shadow-2xl max-w-sm w-[calc(100vw-2rem)] md:w-auto md:max-w-md pointer-events-auto border border-gray-700/50"
            style={{
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="flex items-start gap-3 p-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}>
                {isError ? (
                  <svg
                    className={`w-5 h-5 ${iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className={`w-5 h-5 ${iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm text-gray-200 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, X, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpeechToTextModal({
  isOpen,
  onClose,
  onSearch,
  searchQuery = "",
  onQueryChange,
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      switch (event.error) {
        case "no-speech":
          setError("No speech detected. Please try again.");
          break;
        case "audio-capture":
          setError("No microphone found. Please check your microphone.");
          break;
        case "not-allowed":
          setError("Microphone permission denied. Please allow microphone access.");
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setError("");
        setTranscript("");
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting recognition:", err);
        setError("Failed to start speech recognition. Please try again.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSearch = () => {
    if (transcript.trim()) {
      if (onQueryChange) {
        onQueryChange(transcript.trim());
      }
      if (onSearch) {
        onSearch(transcript.trim());
      }
      onClose();
    }
  };

  const handleClose = () => {
    stopListening();
    setTranscript("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-6 z-10"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#001730] mb-2">
              Voice Search
            </h2>
            <p className="text-gray-600 text-sm">
              Click the microphone and speak to search for properties
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Transcript Display */}
          <div className="mb-6 min-h-[120px] p-4 bg-gray-50 rounded-lg border border-gray-200">
            {transcript ? (
              <p className="text-gray-800 text-base leading-relaxed">
                {transcript}
              </p>
            ) : (
              <p className="text-gray-400 text-sm italic text-center py-8">
                {isListening
                  ? "Listening... Speak now"
                  : "Click the microphone to start"}
              </p>
            )}
          </div>

          {/* Microphone Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-[#001730] hover:bg-[#022d5e]"
              } shadow-lg`}
            >
              <Mic
                size={32}
                className="text-white"
                style={{
                  animation: isListening ? "pulse 1.5s infinite" : "none",
                }}
              />
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
              )}
            </button>
          </div>

          {/* Status Text */}
          <div className="text-center mb-6">
            {isListening ? (
              <div className="flex items-center justify-center gap-2 text-red-500">
                <Volume2 size={20} className="animate-pulse" />
                <span className="font-medium">Listening...</span>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Click microphone to start voice search
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSearch}
              disabled={!transcript.trim()}
              className="flex-1 px-4 py-2 bg-[#001730] text-white rounded-md hover:bg-[#022d5e] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Search Properties
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareProperties, setCompareProperties] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('compareProperties');
      if (saved) {
        try {
          setCompareProperties(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading compare properties:', e);
        }
      }
    }
  }, []);

  // Save to localStorage whenever compareProperties changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compareProperties', JSON.stringify(compareProperties));
    }
  }, [compareProperties]);

  const addToCompare = (property) => {
    setCompareProperties((prev) => {
      // Check if property already exists
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev; // Don't add if already exists
      }

      // Limit to 2 properties
      if (prev.length >= 2) {
        // Remove first property and add new one
        return [prev[1], property];
      }

      return [...prev, property];
    });
  };

  const removeFromCompare = (propertyId) => {
    setCompareProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const isInCompare = (propertyId) => {
    return compareProperties.some((p) => p.id === propertyId);
  };

  const clearCompare = () => {
    setCompareProperties([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareProperties,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        showCompareModal,
        setShowCompareModal,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}


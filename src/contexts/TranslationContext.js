'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const TranslationContext = createContext()

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCache, setTranslationCache] = useState({})

  // Load saved language preference on mount and apply immediately
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language')
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage)
        // Apply settings immediately
        document.documentElement.lang = savedLanguage
        document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
        if (savedLanguage === 'ar') {
          document.documentElement.classList.add('arabic-font')
        } else {
          document.documentElement.classList.remove('arabic-font')
        }
      }
    }
  }, [])

  // Save language preference and update document direction
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language)
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      
      // Add/remove Arabic font class
      if (language === 'ar') {
        document.documentElement.classList.add('arabic-font')
      } else {
        document.documentElement.classList.remove('arabic-font')
      }
    }
  }, [language])

  const translateText = async (text, targetLang = 'ar') => {
    if (!text || text.trim() === '') return text
    
    // Create cache key
    const cacheKey = `${text}_${targetLang}`
    
    // Check cache first
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey]
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          target: targetLang
        })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      const translatedText = data.translatedText

      // Cache the translation
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }))

      return translatedText
    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original text if translation fails
    }
  }

  const translateElement = async (element, originalTexts) => {
    if (!element) return

    const textNodes = []
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip empty text nodes and those that are just whitespace
          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT
          }
          // Skip script and style elements
          const parent = node.parentElement
          if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
            return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT
        }
      }
    )

    let node
    while (node = walker.nextNode()) {
      textNodes.push(node)
    }

    // Store original texts if not already stored
    if (language === 'en' && !originalTexts.has(element)) {
      const texts = textNodes.map(node => node.textContent)
      originalTexts.set(element, texts)
    }

    if (language === 'ar') {
      // Translate to Arabic
      for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i]
        const originalText = node.textContent.trim()
        if (originalText) {
          const translatedText = await translateText(originalText, 'ar')
          node.textContent = translatedText
        }
      }
    } else {
      // Restore original English text
      const originalTexts_arr = originalTexts.get(element)
      if (originalTexts_arr) {
        for (let i = 0; i < textNodes.length && i < originalTexts_arr.length; i++) {
          textNodes[i].textContent = originalTexts_arr[i]
        }
      }
    }
  }

  const translatePage = async () => {
    if (isTranslating) return
    
    setIsTranslating(true)
    
    try {
      // Get all elements that contain text (excluding script, style, etc.)
      const elements = document.querySelectorAll('body *:not(script):not(style):not(noscript)')
      const originalTexts = new Map()

      // Process elements in batches to avoid blocking the UI
      const batchSize = 10
      for (let i = 0; i < elements.length; i += batchSize) {
        const batch = Array.from(elements).slice(i, i + batchSize)
        
        await Promise.all(
          batch.map(element => translateElement(element, originalTexts))
        )
        
        // Small delay to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    } catch (error) {
      console.error('Page translation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const switchLanguage = async (newLanguage) => {
    if (newLanguage === language || isTranslating) return
    
    setLanguage(newLanguage)
    
    // Trigger page translation after language change
    setTimeout(() => {
      translatePage()
    }, 100)
  }

  // Auto-translate page when language changes and it's Arabic
  useEffect(() => {
    if (language === 'ar' && typeof window !== 'undefined') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        translatePage()
      }, 500)
    }
  }, [language])

  const value = {
    language,
    isTranslating,
    switchLanguage,
    translateText,
    translatePage
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

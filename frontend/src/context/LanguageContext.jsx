import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TRANSLATIONS, getTranslation, translateText, translationCache } from '../utils/translator';
import { SUPPORTED_LANGUAGES } from '../data/mockProfiles';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('pmajay_selected_lang') || 'hi';
  });

  // Version counter to trigger re-renders when async translations arrive from LibreTranslate
  const [, setCacheVersion] = useState(0);
  const pendingTranslationsRef = useRef(new Set());

  const setLanguage = (langCode) => {
    setSelectedLang(langCode);
    localStorage.setItem('pmajay_selected_lang', langCode);
  };

  /**
   * Synchronous translation getter with asynchronous LibreTranslate background fetching:
   * 1. If key or text exists in TRANSLATIONS dictionary -> return native translation immediately.
   * 2. If cached in translationCache -> return cached translation.
   * 3. Otherwise return fallback/key, and schedule backend LibreTranslate fetch in background.
   */
  const t = useCallback((keyOrText, fallback) => {
    if (!keyOrText || typeof keyOrText !== 'string') return keyOrText || '';
    if (selectedLang === 'en') return fallback || keyOrText;

    // Check direct dictionary
    const dictMatch = getTranslation(keyOrText, selectedLang);
    if (dictMatch && dictMatch !== keyOrText) {
      return dictMatch;
    }

    // Check fallback in dictionary
    if (fallback) {
      const fallbackMatch = getTranslation(fallback, selectedLang);
      if (fallbackMatch && fallbackMatch !== fallback) {
        return fallbackMatch;
      }
    }

    // Check cache
    const cacheKey = `${selectedLang}:${keyOrText.trim()}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    // Asynchronously fetch from LibreTranslate via backend if not pending
    if (!pendingTranslationsRef.current.has(cacheKey)) {
      pendingTranslationsRef.current.add(cacheKey);
      translateText(keyOrText.trim(), selectedLang)
        .then((translated) => {
          pendingTranslationsRef.current.delete(cacheKey);
          if (translated && translated !== keyOrText.trim()) {
            setCacheVersion(v => v + 1);
          }
        })
        .catch(() => {
          pendingTranslationsRef.current.delete(cacheKey);
        });
    }

    return fallback || keyOrText;
  }, [selectedLang]);

  const translate = useCallback(async (text) => {
    return await translateText(text, selectedLang);
  }, [selectedLang]);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      selectedLang,
      language: selectedLang,
      setLanguage,
      t,
      translate,
      currentLangObj,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const ctx = useLanguage();
  return {
    t: ctx.t,
    language: ctx.selectedLang,
    setLanguage: ctx.setLanguage,
    translate: ctx.translate,
    supportedLanguages: ctx.supportedLanguages,
    currentLangObj: ctx.currentLangObj
  };
}

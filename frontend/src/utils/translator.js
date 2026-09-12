import { TRANSLATIONS, getTranslation } from './translations';

// In-memory cache for dynamic translations
const translationCache = new Map();

// Load cached translations from localStorage on init
try {
  const stored = localStorage.getItem('pmajay_translations_cache');
  if (stored) {
    const parsed = JSON.parse(stored);
    Object.entries(parsed).forEach(([k, v]) => translationCache.set(k, v));
  }
} catch (e) {
  console.warn("Could not read translation cache:", e);
}

const saveCacheToStorage = () => {
  try {
    const obj = {};
    translationCache.forEach((v, k) => { obj[k] = v; });
    localStorage.setItem('pmajay_translations_cache', JSON.stringify(obj));
  } catch (e) {}
};

/**
 * Translates text via the backend self-hosted LibreTranslate endpoint:
 * React Frontend -> My Backend (/api/v1/translate) -> Self-hosted LibreTranslate
 * With multi-tier caching (RAM + localStorage) and dictionary fallback.
 */
export async function translateText(text, targetLang = 'hi', sourceLang = 'en') {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (targetLang === 'en') return text;

  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // Check built-in dictionary first for instantaneous response
  const dictMatch = getTranslation(trimmed, targetLang);
  if (dictMatch && dictMatch !== trimmed) {
    translationCache.set(cacheKey, dictMatch);
    saveCacheToStorage();
    return dictMatch;
  }

  try {
    // Forward to backend which proxies to self-hosted LibreTranslate
    const res = await fetch('http://localhost:8000/api/v1/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: trimmed,
        source: sourceLang,
        target: targetLang
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.translatedText) {
        const result = data.translatedText;
        translationCache.set(cacheKey, result);
        saveCacheToStorage();
        return result;
      }
    }
  } catch (err) {
    console.warn("Backend LibreTranslate gateway error, using dictionary fallback:", err);
  }

  // Fallback to dictionary or original string
  return dictMatch || text;
}

export { TRANSLATIONS, getTranslation, translationCache };

import { createContext, useContext, useEffect } from 'react'
import translations from './translations'

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  // Language switching parked — site is English-only for now
  const lang = 'en'

  useEffect(() => {
    try { localStorage.removeItem('tm_lang') } catch {}
  }, [])

  const switchLang = () => {}

  const t = (section, key) => {
    const sectionData = translations[lang]?.[section]
    if (!sectionData) return key
    if (key === undefined) return sectionData
    return sectionData[key] ?? translations['en']?.[section]?.[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t, LANGS }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

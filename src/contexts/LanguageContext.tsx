'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en')

  // Hydrate from cookie on mount to persist selection across reloads
  useEffect(() => {
    if (typeof document === 'undefined') return
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith('language='))
    const cookieLang = match?.split('=')[1]
    if (cookieLang) {
      setLanguage(cookieLang)
    }
  }, [])

  // Persist selection for server-rendered routes
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    if (typeof document !== 'undefined') {
      document.cookie = `language=${lang}; path=/; max-age=31536000`
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

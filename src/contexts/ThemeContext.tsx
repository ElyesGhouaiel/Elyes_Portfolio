'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Retourner un contexte par défaut au lieu de lancer une erreur
    return {
      theme: 'light' as Theme,
      setTheme: () => {},
      toggleTheme: () => {}
    }
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Récupérer le thème depuis localStorage ou utiliser le thème clair par défaut
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Utiliser le thème clair par défaut
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Appliquer le thème à la racine du document
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    // Sauvegarder le thème dans localStorage
    localStorage.setItem('theme', theme)
  }, [theme, isMounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
} 
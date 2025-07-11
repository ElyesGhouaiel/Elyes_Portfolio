'use client'

import { useEffect } from 'react'

// Composant pour gérer le scroll automatique
export function ScrollHandler() {
  useEffect(() => {
    // Gérer le scroll automatique si il y a un hash dans l'URL
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.getElementById(hash.substring(1))
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }
    }

    // Exécuter au chargement
    handleHashChange()
    
    // Écouter les changements d'URL
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return null
} 
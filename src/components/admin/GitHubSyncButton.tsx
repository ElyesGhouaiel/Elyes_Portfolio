'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function GitHubSyncButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [results, setResults] = useState<any>(null)

  const handleSync = async () => {
    setIsLoading(true)
    setStatus('loading')
    
    try {
      const response = await fetch('/api/sync-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setResults(data.results)
        setTimeout(() => {
          setStatus('idle')
          setResults(null)
        }, 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <RefreshCw className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Synchronisation en cours...'
      case 'success':
        return 'Synchronisé avec succès !'
      case 'error':
        return 'Erreur de synchronisation'
      default:
        return 'Synchroniser GitHub'
    }
  }

  const getButtonClass = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30'
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30'
      default:
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30'
    }
  }

  return (
    <div className="space-y-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handleSync}
          disabled={isLoading}
          className={`w-full transition-all duration-300 ${getButtonClass()}`}
          variant="outline"
        >
          {getStatusIcon()}
          <span className="ml-2">{getStatusText()}</span>
        </Button>
      </motion.div>

      {results && status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
        >
          <div className="text-green-300 text-sm space-y-2">
            <div className="font-medium">Résultats de la synchronisation :</div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-green-400">{results.created}</span> créés
              </div>
              <div>
                <span className="text-blue-400">{results.updated}</span> mis à jour
              </div>
              <div>
                <span className="text-red-400">{results.errors}</span> erreurs
              </div>
            </div>
            <div className="text-green-400/80">
              Total : {results.total} repositories traités
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 
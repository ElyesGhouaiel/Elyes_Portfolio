'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Upload, 
  HardDrive, 
  Save,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'

interface UploadSettingsProps {
  currentMaxSize: number
  onUpdate?: () => void
}

export function UploadSettings({ currentMaxSize, onUpdate }: UploadSettingsProps) {
  const [maxSizeMB, setMaxSizeMB] = useState(Math.floor(currentMaxSize / (1024 * 1024)))
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    setIsSaving(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/admin/upload-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxFileSizeMB: maxSizeMB
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      setStatus('success')
      if (onUpdate) {
        onUpdate()
      }
      
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Paramètres sauvegardés !'
      case 'error':
        return 'Erreur lors de la sauvegarde'
      default:
        return 'Paramètres d\'upload'
    }
  }

  const getButtonClass = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-300'
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-300'
      default:
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30'
    }
  }

  return (
    <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Settings className="w-5 h-5 mr-2 text-purple-400" />
          Configuration Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Taille maximale */}
        <div className="space-y-3">
          <Label htmlFor="maxSize" className="text-purple-300">
            Taille maximale par fichier
          </Label>
          <div className="flex items-center space-x-3">
            <Input
              id="maxSize"
              type="number"
              min="1"
              max="1000"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(parseInt(e.target.value) || 100)}
              className="bg-black/50 border-purple-500/30 text-white w-24"
            />
            <span className="text-purple-300">MB</span>
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              {formatBytes(maxSizeMB * 1024 * 1024)}
            </Badge>
          </div>
          <p className="text-xs text-purple-300/60">
            Limite recommandée : 100-500MB. Maximum : 1GB
          </p>
        </div>

        {/* Informations système */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300">Types acceptés :</span>
            <Badge variant="outline" className="border-green-500/30 text-green-300">
              ZIP
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Upload className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300">Upload multiple :</span>
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              Activé
            </Badge>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full transition-all duration-300 ${getButtonClass()}`}
            variant="outline"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                {getStatusIcon()}
                <span className="ml-2">{getStatusText()}</span>
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}

// Fonction utilitaire pour formater les bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 
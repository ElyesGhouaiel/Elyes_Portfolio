'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Code, 
  Play, 
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield
} from 'lucide-react'

interface CodePreviewProps {
  projectId: string
  projectTitle: string
  isOpen: boolean
  onClose: () => void
}

interface FileInfo {
  name: string
  path: string
  content: string
  language: string
  size: number
}

export function CodePreview({ projectId, projectTitle, isOpen, onClose }: CodePreviewProps) {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && projectId) {
      loadProjectFiles()
    }
  }, [isOpen, projectId])

  // Empêcher la copie du code
  useEffect(() => {
    const preventCopy = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const preventSelect = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    if (isOpen) {
      document.addEventListener('keydown', preventCopy, true)
      document.addEventListener('contextmenu', preventContextMenu, true)
      document.addEventListener('selectstart', preventSelect, true)
      document.addEventListener('dragstart', preventSelect, true)
    }

    return () => {
      document.removeEventListener('keydown', preventCopy, true)
      document.removeEventListener('contextmenu', preventContextMenu, true)
      document.removeEventListener('selectstart', preventSelect, true)
      document.removeEventListener('dragstart', preventSelect, true)
    }
  }, [isOpen])

  const loadProjectFiles = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/projects/${projectId}/files`)
      if (!response.ok) {
        throw new Error('Impossible de charger les fichiers du projet')
      }
      
      const data = await response.json()
      setFiles(data.files || [])
      setCurrentFileIndex(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'py': 'python',
      'java': 'java',
      'cs': 'csharp',
      'php': 'php',
      'md': 'markdown',
      'txt': 'text',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'ini': 'ini',
      'cfg': 'ini'
    }
    return languageMap[ext || ''] || 'text'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (['html', 'htm'].includes(ext || '')) return <FileText className="w-4 h-4 text-blue-400" />
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext || '')) return <Code className="w-4 h-4 text-yellow-400" />
    if (['css', 'scss', 'sass'].includes(ext || '')) return <Code className="w-4 h-4 text-pink-400" />
    if (['json'].includes(ext || '')) return <Code className="w-4 h-4 text-green-400" />
    if (['md'].includes(ext || '')) return <FileText className="w-4 h-4 text-purple-400" />
    return <FileText className="w-4 h-4 text-gray-400" />
  }

  const currentFile = files[currentFileIndex]

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-purple-500/30 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">{projectTitle}</h2>
              <p className="text-sm text-purple-300/60">Aperçu du code (Lecture seule)</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Protégé
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-purple-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Liste des fichiers */}
          <div className="w-80 border-r border-purple-500/20 bg-slate-800/50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-purple-300 mb-3">Fichiers du projet</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-sm text-purple-300/60 mt-2">Chargement...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-400">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadProjectFiles}
                    className="mt-2 border-purple-500/50 text-purple-300"
                  >
                    Réessayer
                  </Button>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-purple-300/60">Aucun fichier trouvé</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {files.map((file, index) => (
                    <button
                      key={file.path}
                      onClick={() => setCurrentFileIndex(index)}
                      className={`w-full text-left p-2 rounded-md transition-colors ${
                        index === currentFileIndex
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-purple-300/80 hover:bg-purple-500/10 hover:text-purple-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{file.name}</p>
                          <p className="text-xs text-purple-300/50 truncate">{file.path}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-purple-500/30">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main content - Code viewer */}
          <div className="flex-1 flex flex-col">
            {currentFile ? (
              <>
                {/* File header */}
                <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-slate-800/30">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(currentFile.name)}
                    <div>
                      <h3 className="text-sm font-medium text-white">{currentFile.name}</h3>
                      <p className="text-xs text-purple-300/60">{currentFile.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs border-purple-500/30">
                      {getLanguageFromExtension(currentFile.name)}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-purple-500/30">
                      {formatFileSize(currentFile.size)}
                    </Badge>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between p-2 bg-slate-800/20 border-b border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                      disabled={currentFileIndex === 0}
                      className="text-purple-300 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-purple-300/60">
                      {currentFileIndex + 1} / {files.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentFileIndex(Math.min(files.length - 1, currentFileIndex + 1))}
                      disabled={currentFileIndex === files.length - 1}
                      className="text-purple-300 hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Temporairement commenté - Demo à implémenter plus tard
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                      onClick={() => window.open(`/api/projects/${projectId}/demo`, '_blank')}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Demo
                    </Button>
                    */}
                  </div>
                </div>

                {/* Code content - PROTÉGÉ */}
                <div 
                  className="flex-1 overflow-auto bg-slate-900"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                >
                  <pre className="p-4 text-sm text-gray-300 font-mono leading-relaxed">
                    <code>{currentFile.content}</code>
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Code className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
                  <p className="text-purple-300/60">Sélectionnez un fichier pour voir son contenu</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 
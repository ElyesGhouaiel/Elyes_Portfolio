'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileArchive, X, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadedFile {
  file: File
  preview?: string
}

export function ProjectUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const validFiles = Array.from(selectedFiles).filter(file => {
      // Accepter seulement les fichiers ZIP et limiter la taille
      const isValidType = file.type === 'application/zip' || file.name.endsWith('.zip')
      const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB max
      
      if (!isValidType) {
        alert('Seuls les fichiers ZIP sont acceptés.')
        return false
      }
      
      if (!isValidSize) {
        alert('Le fichier doit faire moins de 50MB.')
        return false
      }
      
      return true
    })

    const newFiles = validFiles.map(file => ({ file }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadStatus('idle')

    try {
      for (const { file } of files) {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload-project', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Erreur d'upload: ${response.statusText}`)
        }
      }

      setUploadStatus('success')
      setFiles([])
      setTimeout(() => setUploadStatus('idle'), 3000)
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      setUploadStatus('error')
      setTimeout(() => setUploadStatus('idle'), 3000)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <motion.div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-purple-400 bg-purple-500/10' 
            : 'border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
      >
        <FileArchive className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <p className="text-purple-300 mb-2">
          Glissez-déposez vos fichiers ZIP ici ou
        </p>
        <Button
          type="button"
          variant="outline"
          className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choisir des fichiers
        </Button>
        <p className="text-xs text-purple-300/60 mt-2">
          Fichiers ZIP uniquement, max 50MB par fichier
        </p>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,application/zip"
        multiple
        className="hidden"
        title="Sélectionner des fichiers ZIP"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Liste des fichiers sélectionnés */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-purple-300 font-medium">Fichiers sélectionnés :</h4>
            {files.map((fileData, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <FileArchive className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {fileData.file.name}
                    </p>
                    <p className="text-purple-300/60 text-xs">
                      {formatFileSize(fileData.file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton d'upload */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className={`w-full transition-all duration-300 ${
              uploadStatus === 'success'
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : uploadStatus === 'error'
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30'
            }`}
            variant="outline"
          >
            {isUploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 mr-2"
                >
                  <Upload className="w-4 h-4" />
                </motion.div>
                Upload en cours...
              </>
            ) : uploadStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Upload réussi !
              </>
            ) : uploadStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Erreur d'upload
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Uploader {files.length} fichier{files.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  )
} 
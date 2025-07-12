'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { X, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Technology {
  id: string
  name: string
  category: string
}

interface ProjectTechnology {
  technology: Technology
}

interface Project {
  id: string
  title: string
  description: string | null
  githubUrl: string | null
  liveUrl: string | null
  type: string
  category: string
  language: string | null
  stars: number | null
  forks: number | null
  featured: boolean
  status: string
  createdAt: Date
  updatedAt: Date
  technologies: ProjectTechnology[]
}

interface ProjectFormData {
  title?: string
  description?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  category?: string
  featured?: boolean
  status?: string
  technologies?: string[]
}

interface ProjectEditModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProject: ProjectFormData) => Promise<void>
}

export function ProjectEditModal({ project, isOpen, onClose, onSave }: ProjectEditModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({})
  const [newTechnology, setNewTechnology] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        category: project.category,
        featured: project.featured,
        status: project.status,
        technologies: project.technologies.map(pt => pt.technology.name)
      })
    }
  }, [project])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies?.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(tech => tech !== techToRemove) || []
    }))
  }

  const handleSave = async () => {
    if (!project) return

    setIsLoading(true)
    setStatus('idle')

    try {
      await onSave(formData)
      setStatus('success')
      setTimeout(() => {
        onClose()
        setStatus('idle')
      }, 1000)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTechnology()
    }
  }

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/90 border-purple-500/30 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-purple-400" />
            Modifier le projet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-purple-300">Titre</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50"
              placeholder="Titre du projet"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-[100px]"
              placeholder="Description du projet"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-purple-300">URL GitHub</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl || ''}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl" className="text-purple-300">URL Live</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl || ''}
                onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Catégorie et Statut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-purple-300">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30">
                  <SelectItem value="professional" className="text-purple-300">Professionnel</SelectItem>
                  <SelectItem value="personal" className="text-purple-300">Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-purple-300">Statut</Label>
              <Select value={formData.status} onValueChange={(value: string) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30">
                  <SelectItem value="active" className="text-purple-300">Actif</SelectItem>
                  <SelectItem value="archived" className="text-purple-300">Archivé</SelectItem>
                  <SelectItem value="draft" className="text-purple-300">Brouillon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mis en avant */}
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked: boolean) => handleInputChange('featured', checked)}
            />
            <Label htmlFor="featured" className="text-purple-300">Mis en avant</Label>
          </div>

          {/* Technologies */}
          <div className="space-y-3">
            <Label className="text-purple-300">Technologies</Label>
            <div className="flex space-x-2">
              <Input
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50"
                placeholder="Ajouter une technologie"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTechnology}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {formData.technologies?.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechnology(tech)}
                        className="h-auto p-0 ml-1 text-purple-300 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className={`transition-all duration-300 ${
                status === 'success'
                  ? 'bg-green-500/20 border-green-500/50 text-green-300'
                  : status === 'error'
                  ? 'bg-red-500/20 border-red-500/50 text-red-300'
                  : 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30'
              }`}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sauvegardé !
                </>
              ) : status === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Erreur
                </>
              ) : (
                'Sauvegarder'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
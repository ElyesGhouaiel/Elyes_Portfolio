'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Star, GitFork, Calendar, Eye, Globe } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string | null
    content: string | null
    githubUrl: string | null
    liveUrl: string | null
    demoUrl: string | null
    stars: number | null
    forks: number | null
    language: string | null
    type: string
    category: string
    status: string
    featured: boolean
    startDate: Date | null
    updatedAt: Date
    technologies: {
      technology: {
        id: string
        name: string
        category: string
        icon: string | null
        color: string | null
      }
    }[]
  }
  index: number
  showFullDetails?: boolean
}

export function ProjectCard({ project, index, showFullDetails = false }: ProjectCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  }

  // Fonction pour ouvrir les URLs de manière sécurisée
  const openUrl = (url: string, type: string) => {
    try {
      console.log(`🔗 Opening ${type} URL:`, url)
      // Vérifier que l'URL est valide
      if (!url || typeof url !== 'string') {
        console.error(`❌ Invalid ${type} URL:`, url)
        return
      }
      
      // Ouvrir l'URL dans un nouvel onglet
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (!newWindow) {
        console.error(`❌ Failed to open ${type} URL - popup blocked?`)
        // Fallback : essayer avec window.location
        window.location.href = url
      }
    } catch (error) {
      console.error(`❌ Error opening ${type} URL:`, error)
    }
  }

  // Générer des URLs de démonstration pour les projets GitHub
  const getDemoUrl = (project: any) => {
    if (project.demoUrl) return project.demoUrl
    if (project.liveUrl) return project.liveUrl
    
    // Générer des URLs de démonstration basées sur le type de projet
    if (project.githubUrl) {
      const repoName = project.githubUrl.split('/').pop()
      if (repoName) {
        // Pour les projets web, essayer GitHub Pages
        if (project.technologies.some((t: any) => 
          ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript'].includes(t.technology.name)
        )) {
          return `https://elyesghouaiel.github.io/${repoName}`
        }
        // Pour les autres projets, lien vers le README
        return `${project.githubUrl}#readme`
      }
    }
    
    return null
  }

  const demoUrl = getDemoUrl(project)

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative h-full"
    >
      <Card className="h-full project-card relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25">
        {/* Effet de brillance au hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="project-title group-hover:text-purple-300 transition-colors duration-300">
                  {project.title}
                </CardTitle>
                {project.featured && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                    ⭐ Mis en avant
                  </Badge>
                )}
              </div>
              <CardDescription className="project-description line-clamp-2 group-hover:text-slate-100 transition-colors duration-300">
                {project.description}
              </CardDescription>
            </div>
          </div>

          {/* Statistiques GitHub */}
          {project.type === 'github' && (project.stars || project.forks) && (
            <div className="flex items-center gap-4 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              {project.stars !== null && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{project.stars}</span>
                </div>
              )}
              {project.forks !== null && (
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4 text-blue-400" />
                  <span>{project.forks}</span>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0 relative z-10">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, showFullDetails ? 10 : 4).map((tech) => (
              <Badge 
                key={tech.technology.id}
                className="project-tech-badge hover:scale-105 transition-transform duration-200"
                style={{
                  borderColor: tech.technology.color || '#8b5cf6',
                  color: tech.technology.color || '#c4b5fd'
                }}
              >
                {tech.technology.icon} {tech.technology.name}
              </Badge>
            ))}
            {project.technologies.length > (showFullDetails ? 10 : 4) && (
              <Badge className="project-tech-badge hover:scale-105 transition-transform duration-200">
                +{project.technologies.length - (showFullDetails ? 10 : 4)}
              </Badge>
            )}
          </div>

          {/* Contenu détaillé */}
          {showFullDetails && project.content && (
            <div className="mb-4 p-3 bg-black/20 rounded-lg border border-purple-500/20 group-hover:bg-black/30 transition-colors duration-300">
              <p className="text-sm text-gray-300 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
                {project.content}
              </p>
            </div>
          )}

          {/* Date */}
          {project.startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(project.startDate).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            {project.githubUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-black/20 border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openUrl(project.githubUrl!, 'GitHub')
                }}
              >
                <Github className="w-4 h-4 mr-2" />
                Code
              </Button>
            )}
            
            {project.liveUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-black/20 border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-400 text-blue-300 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openUrl(project.liveUrl!, 'Live Site')
                }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Live
              </Button>
            )}
            
            {demoUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-black/20 border-green-500/30 hover:bg-green-500/30 hover:border-green-400 text-green-300 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openUrl(demoUrl, 'Demo')
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Demo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, Star, Code } from 'lucide-react'
import Link from 'next/link'
import { CodePreview } from '@/components/admin/CodePreview'

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
  technologies: Array<{
    technology: {
      id: string
      name: string
      category: string
    }
  }>
}

interface ProjectsGridProps {
  featuredProjects: Project[]
  allProjects: Project[]
}

export function ProjectsGrid({ featuredProjects, allProjects }: ProjectsGridProps) {
  const [codePreviewProject, setCodePreviewProject] = useState<Project | null>(null)
  const [isCodePreviewOpen, setIsCodePreviewOpen] = useState(false)

  const handleOpenCodePreview = (project: Project) => {
    setCodePreviewProject(project)
    setIsCodePreviewOpen(true)
  }

  const handleCloseCodePreview = () => {
    setIsCodePreviewOpen(false)
    setCodePreviewProject(null)
  }

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mes Projets
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto dark:text-purple-200/80">
            Découvrez une sélection de mes réalisations les plus récentes et innovantes
          </p>
        </motion.div>

        {/* Grille de projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 6)).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="project-card h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="project-title">{project.title}</h3>
                    {project.featured && (
                      <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30">
                        ⭐ Mis en avant
                      </Badge>
                    )}
                  </div>

                  {project.description && (
                    <p className="project-description text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge
                        key={tech.technology.id}
                        className="project-tech-badge text-xs"
                      >
                        {tech.technology.name}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge
                        className="project-tech-badge text-xs"
                      >
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-purple-300/60">
                      {project.language && (
                        <span>📝 {project.language}</span>
                      )}
                      {project.stars !== null && (
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          {project.stars}
                        </span>
                      )}
                    </div>
                    <Badge className={`
                      ${project.category === 'professional' 
                        ? 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30' 
                        : 'bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30'
                      }
                    `}>
                      {project.category === 'professional' ? 'Pro' : 'Perso'}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 text-purple-600 hover:bg-purple-500/10 hover:text-purple-700 transition-colors flex-1 dark:border-purple-500/50 dark:text-purple-300 dark:hover:bg-purple-500/10 dark:hover:text-white"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Opening GitHub URL:', project.githubUrl)
                          window.open(project.githubUrl!, '_blank', 'noopener,noreferrer')
                        }}
                      >
                        <Github className="w-3 h-3 mr-1" />
                        GitHub
                      </Button>
                    )}
                    {project.type === 'manual' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700 transition-colors flex-1 dark:border-blue-500/50 dark:text-blue-300 dark:hover:bg-blue-500/10 dark:hover:text-white"
                        onClick={(e) => {
                          e.preventDefault()
                          handleOpenCodePreview(project)
                        }}
                      >
                        <Code className="w-3 h-3 mr-1" />
                        Code
                      </Button>
                    )}
                    {/* Temporairement commenté - Demo à implémenter plus tard
                    {project.liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-700 transition-colors flex-1 dark:border-green-500/50 dark:text-green-300 dark:hover:bg-green-500/10 dark:hover:text-white"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Opening Live URL:', project.liveUrl)
                          window.open(project.liveUrl!, '_blank', 'noopener,noreferrer')
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo
                      </Button>
                    )}
                    */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bouton voir plus */}
        {allProjects.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/projects">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/30 text-purple-600 hover:bg-purple-500/10 hover:text-purple-700 px-8 py-4 dark:border-purple-500/50 dark:text-purple-300 dark:hover:bg-purple-500/10"
            >
              Voir tous les projets ({allProjects.length})
            </Button>
            </Link>
          </motion.div>
        )}

        {/* Modal d'aperçu du code */}
        <CodePreview
          projectId={codePreviewProject?.id || ''}
          projectTitle={codePreviewProject?.title || ''}
          isOpen={isCodePreviewOpen}
          onClose={handleCloseCodePreview}
        />
      </div>
    </section>
  )
} 
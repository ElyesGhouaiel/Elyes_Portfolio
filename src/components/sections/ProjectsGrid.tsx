'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, Star } from 'lucide-react'

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
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
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
              <Card className="bg-black/20 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    {project.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        ⭐ Mis en avant
                      </Badge>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-purple-200/80 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge
                        key={tech.technology.id}
                        variant="outline"
                        className="text-xs border-purple-500/30 text-purple-300"
                      >
                        {tech.technology.name}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-purple-500/30 text-purple-300"
                      >
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 text-sm text-purple-300/60">
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
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                        : 'bg-green-500/20 text-green-300 border-green-500/30'
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
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 flex-1"
                        onClick={() => window.open(project.githubUrl!, '_blank')}
                      >
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500/50 text-green-300 hover:bg-green-500/10 flex-1"
                        onClick={() => window.open(project.liveUrl!, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo
                      </Button>
                    )}
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
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4"
            >
              Voir tous les projets ({allProjects.length})
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
} 
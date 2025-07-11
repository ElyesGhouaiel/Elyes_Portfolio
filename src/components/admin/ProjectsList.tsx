'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  Settings
} from 'lucide-react'

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

interface ProjectsListProps {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'personal':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-purple-300/60 mb-4">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Aucun projet trouvé</p>
          <p className="text-sm">Synchronisez GitHub ou uploadez des projets pour commencer.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-black/20 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Header du projet */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(project.type)}
                      <h3 className="text-lg font-semibold text-white truncate">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          ⭐ Mis en avant
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-purple-300/80 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Métadonnées */}
                  <div className="flex items-center space-x-4 mb-3 text-xs">
                    <Badge className={getCategoryColor(project.category)}>
                      {project.category === 'professional' ? 'Professionnel' : 'Personnel'}
                    </Badge>
                    
                    {project.language && (
                      <span className="text-purple-300/60">
                        📝 {project.language}
                      </span>
                    )}

                    {project.type === 'github' && (
                      <div className="flex items-center space-x-3">
                        {project.stars !== null && (
                          <span className="flex items-center text-purple-300/60">
                            <Star className="w-3 h-3 mr-1" />
                            {project.stars}
                          </span>
                        )}
                        {project.forks !== null && (
                          <span className="flex items-center text-purple-300/60">
                            <GitFork className="w-3 h-3 mr-1" />
                            {project.forks}
                          </span>
                        )}
                      </div>
                    )}

                    <span className="flex items-center text-purple-300/60">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(project.updatedAt)}
                    </span>
                  </div>

                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.slice(0, 6).map((tech) => (
                        <Badge
                          key={tech.technology.id}
                          variant="outline"
                          className="text-xs border-purple-500/30 text-purple-300"
                        >
                          {tech.technology.name}
                        </Badge>
                      ))}
                      {project.technologies.length > 6 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-purple-500/30 text-purple-300"
                        >
                          +{project.technologies.length - 6} autres
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Liens */}
                  <div className="flex items-center space-x-2">
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                        onClick={() => window.open(project.githubUrl!, '_blank')}
                      >
                        <Github className="w-3 h-3 mr-1" />
                        GitHub
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                        onClick={() => window.open(project.liveUrl!, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 
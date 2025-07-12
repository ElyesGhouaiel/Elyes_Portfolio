'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { ProjectsFilter } from './ProjectsFilter'
import { Loader2 } from 'lucide-react'

interface ProjectsListProps {
  projects: any[]
  technologies: any[]
}

export function ProjectsList({ projects, technologies }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)

  // Fonction de filtrage des projets
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Filtre par recherche
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.technologies.some((tech: any) => 
          tech.technology.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

      // Filtre par catégorie
      const matchesCategory = !selectedCategory || 
        selectedCategory === 'all' ||
        (selectedCategory === 'professional' && project.category === 'professional') ||
        (selectedCategory === 'personal' && project.category === 'personal') ||
        (selectedCategory === 'github' && project.type === 'github') ||
        (selectedCategory === 'featured' && project.featured)

      // Filtre par technologie
      const matchesTechnology = !selectedTechnology ||
        project.technologies.some((tech: any) => tech.technology.id === selectedTechnology)

      return matchesSearch && matchesCategory && matchesTechnology
    }).sort((a, b) => {
      // Tri par ordre : mis en avant d'abord, puis par étoiles, puis par date
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      if (a.stars && b.stars && a.stars !== b.stars) return b.stars - a.stars
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [projects, searchTerm, selectedCategory, selectedTechnology])

  // Fonction pour mettre à jour les filtres
  const updateFilters = (filters: {
    searchTerm?: string
    selectedCategory?: string | null
    selectedTechnology?: string | null
  }) => {
    setIsFiltering(true)
    
    // Petit délai pour montrer l'indicateur de chargement
    setTimeout(() => {
      if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm)
      if (filters.selectedCategory !== undefined) setSelectedCategory(filters.selectedCategory)
      if (filters.selectedTechnology !== undefined) setSelectedTechnology(filters.selectedTechnology)
      setIsFiltering(false)
    }, 100)
  }

  return (
    <div>
      {/* Filtres */}
      <ProjectsFilter 
        projects={projects}
        technologies={technologies}
        filters={{
          searchTerm,
          selectedCategory,
          selectedTechnology
        }}
        onFiltersChange={updateFilters}
      />

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{filteredProjects.length}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">
            {filteredProjects.length === projects.length ? 'Tous les projets' : 'Projets filtrés'}
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredProjects.filter(p => p.type === 'github').length}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">GitHub</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{filteredProjects.filter(p => p.featured).length}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">Mis en avant</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {new Set(filteredProjects.flatMap(p => p.technologies.map((t: any) => t.technology.id))).size}
          </div>
          <div className="text-sm text-slate-600 dark:text-gray-400">Technologies utilisées</div>
        </div>
      </div>

      {/* Grille de projets */}
      <AnimatePresence mode="wait">
        {isFiltering ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className="text-slate-600 dark:text-gray-300">Filtrage en cours...</span>
            </div>
          </motion.div>
        ) : filteredProjects.length > 0 ? (
          <motion.div 
            key={`projects-${searchTerm}-${selectedCategory}-${selectedTechnology}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                index={index}
                showFullDetails={true}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="no-projects"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 dark:text-gray-300">
              Aucun projet trouvé
            </h3>
            <p className="text-slate-600 dark:text-gray-400 mb-4">
              {searchTerm || selectedCategory || selectedTechnology 
                ? "Aucun projet ne correspond à vos critères de recherche."
                : "Les projets seront bientôt disponibles."
              }
            </p>
            {(searchTerm || selectedCategory || selectedTechnology) && (
              <button
                onClick={() => updateFilters({ 
                  searchTerm: '', 
                  selectedCategory: null, 
                  selectedTechnology: null 
                })}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Effacer tous les filtres
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
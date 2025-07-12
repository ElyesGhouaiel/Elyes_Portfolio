'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
import { Search, Filter, X } from 'lucide-react'

interface ProjectsFilterProps {
  projects: any[]
  technologies: any[]
  filters: {
    searchTerm: string
    selectedCategory: string | null
    selectedTechnology: string | null
  }
  onFiltersChange: (filters: {
    searchTerm?: string
    selectedCategory?: string | null
    selectedTechnology?: string | null
  }) => void
}

export function ProjectsFilter({ projects, technologies, filters, onFiltersChange }: ProjectsFilterProps) {
  const { searchTerm, selectedCategory, selectedTechnology } = filters

  const categories = [
    { id: 'all', name: 'Tous', count: projects.length },
    { id: 'professional', name: 'Professionnel', count: projects.filter(p => p.category === 'professional').length },
    { id: 'personal', name: 'Personnel', count: projects.filter(p => p.category === 'personal').length },
    { id: 'github', name: 'GitHub', count: projects.filter(p => p.type === 'github').length },
    { id: 'featured', name: 'Mis en avant', count: projects.filter(p => p.featured).length },
  ]

  const topTechnologies = technologies
    .filter(tech => tech.projects.length > 0)
    .sort((a, b) => b.projects.length - a.projects.length)
    .slice(0, 10)

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedCategory: null,
      selectedTechnology: null
    })
  }

  const hasActiveFilters = searchTerm || selectedCategory || selectedTechnology

  return (
    <div className="mb-8">
      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFiltersChange({ searchTerm: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-white/80 border border-slate-300/60 text-slate-700 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-800/80 dark:border-slate-600/60 dark:text-slate-200 dark:placeholder-slate-400 backdrop-blur-sm transition-all duration-200"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Catégories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ selectedCategory: selectedCategory === category.id ? null : category.id })}
              className={`${
                selectedCategory === category.id 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500' 
                  : 'bg-white/80 border-slate-300/60 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-600/60 dark:hover:bg-slate-700/80 dark:text-slate-200 dark:hover:text-white'
              } transition-all duration-200 backdrop-blur-sm`}
            >
              {category.name}
              <Badge variant="secondary"               className={`ml-2 ${
                selectedCategory === category.id 
                  ? 'bg-white/30 text-white' 
                  : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300'
              }`}>
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Filtres par technologie */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Technologies populaires</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTechnologies.map((tech) => (
            <Button
              key={tech.id}
              variant={selectedTechnology === tech.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ selectedTechnology: selectedTechnology === tech.id ? null : tech.id })}
              className={`${
                selectedTechnology === tech.id 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500' 
                  : 'bg-white/80 border-slate-300/60 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-600/60 dark:hover:bg-slate-700/80 dark:text-slate-200 dark:hover:text-white'
              } transition-all duration-200 backdrop-blur-sm`}
              style={{
                borderColor: selectedTechnology === tech.id ? undefined : tech.color,
                color: selectedTechnology === tech.id ? undefined : tech.color
              }}
            >
              {tech.icon} {tech.name}
              <Badge variant="secondary"               className={`ml-2 ${
                selectedTechnology === tech.id 
                  ? 'bg-white/30 text-white' 
                  : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300'
              }`}>
                {tech.projects.length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Bouton pour effacer les filtres */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="bg-white/80 border-slate-300/60 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-600/60 dark:hover:bg-slate-700/80 dark:text-slate-200 dark:hover:text-white transition-all duration-200 backdrop-blur-sm"
          >
            <X className="w-4 h-4 mr-2" />
            Effacer les filtres
          </Button>
          <span className="text-sm text-slate-500 dark:text-gray-400">
            {searchTerm && `Recherche: "${searchTerm}"`}
            {selectedCategory && ` • Catégorie: ${categories.find(c => c.id === selectedCategory)?.name}`}
            {selectedTechnology && ` • Technologie: ${topTechnologies.find(t => t.id === selectedTechnology)?.name}`}
          </span>
        </div>
      )}
    </div>
  )
} 
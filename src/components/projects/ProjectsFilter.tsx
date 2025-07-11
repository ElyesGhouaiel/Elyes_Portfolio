'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
import { Search, Filter, X } from 'lucide-react'

interface ProjectsFilterProps {
  projects: any[]
  technologies: any[]
}

export function ProjectsFilter({ projects, technologies }: ProjectsFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null)

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
    setSearchTerm('')
    setSelectedCategory(null)
    setSelectedTechnology(null)
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 glass-card border border-purple-500/20 bg-black/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">Catégories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`${
                selectedCategory === category.id 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'bg-black/20 border-purple-500/30 hover:bg-purple-500/20'
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-white/20">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Filtres par technologie */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-300">Technologies populaires</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTechnologies.map((tech) => (
            <Button
              key={tech.id}
              variant={selectedTechnology === tech.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTechnology(selectedTechnology === tech.id ? null : tech.id)}
              className={`${
                selectedTechnology === tech.id 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'bg-black/20 border-purple-500/30 hover:bg-purple-500/20'
              }`}
              style={{
                borderColor: selectedTechnology === tech.id ? undefined : tech.color,
                color: selectedTechnology === tech.id ? undefined : tech.color
              }}
            >
              {tech.icon} {tech.name}
              <Badge variant="secondary" className="ml-2 bg-white/20">
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
            className="bg-black/20 border-gray-500/30 hover:bg-gray-500/20"
          >
            <X className="w-4 h-4 mr-2" />
            Effacer les filtres
          </Button>
          <span className="text-sm text-gray-400">
            {searchTerm && `Recherche: "${searchTerm}"`}
            {selectedCategory && ` • Catégorie: ${categories.find(c => c.id === selectedCategory)?.name}`}
            {selectedTechnology && ` • Technologie: ${topTechnologies.find(t => t.id === selectedTechnology)?.name}`}
          </span>
        </div>
      )}
    </div>
  )
} 
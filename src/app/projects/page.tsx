import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { FloatingNav } from '@/components/ui/FloatingNav'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectsFilter } from '@/components/projects/ProjectsFilter'
import { Loader2 } from 'lucide-react'

export default async function ProjectsPage() {
  // Récupérer tous les projets
  const allProjects = await prisma.project.findMany({
    where: { status: 'active' },
    include: {
      technologies: {
        include: { technology: true }
      }
    },
    orderBy: [
      { featured: 'desc' },
      { stars: 'desc' },
      { updatedAt: 'desc' }
    ]
  })

  // Récupérer les technologies pour le filtre
  const technologies = await prisma.technology.findMany({
    include: {
      projects: {
        include: { project: true }
      }
    }
  })

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Effets de fond animés */}
      <BackgroundEffects />
      
      {/* Navigation flottante */}
      <FloatingNav />

      {/* Contenu principal */}
      <main className="relative z-10 pt-24">
        <div className="container mx-auto px-4">
          {/* En-tête de la page */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Tous mes Projets
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez l'ensemble de mes réalisations, des projets professionnels aux expérimentations personnelles.
            </p>
          </div>

          {/* Filtres */}
          <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>}>
            <ProjectsFilter 
              projects={allProjects}
              technologies={technologies}
            />
          </Suspense>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{allProjects.length}</div>
              <div className="text-sm text-gray-400">Projets</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{allProjects.filter(p => p.type === 'github').length}</div>
              <div className="text-sm text-gray-400">GitHub</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{allProjects.filter(p => p.featured).length}</div>
              <div className="text-sm text-gray-400">Mis en avant</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{technologies.length}</div>
              <div className="text-sm text-gray-400">Technologies</div>
            </div>
          </div>

          {/* Grille de projets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                index={index}
                showFullDetails={true}
              />
            ))}
          </div>

          {/* Message si aucun projet */}
          {allProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Aucun projet trouvé</h3>
              <p className="text-gray-400">Les projets seront bientôt disponibles.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { FloatingNav } from '@/components/ui/FloatingNav'
import { ProjectsList } from '@/components/projects/ProjectsList'
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
            <p className="text-xl text-slate-600 max-w-2xl mx-auto dark:text-gray-300">
              Découvrez l'ensemble de mes réalisations, des projets professionnels aux expérimentations personnelles.
            </p>
            <div className="mt-4 text-sm text-slate-500 dark:text-gray-400">
              {allProjects.length} projet{allProjects.length > 1 ? 's' : ''} disponible{allProjects.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Liste des projets avec filtres */}
          <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>}>
            <ProjectsList 
              projects={allProjects}
              technologies={technologies}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
} 
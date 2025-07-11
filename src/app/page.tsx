import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsGrid } from '@/components/sections/ProjectsGrid'
import { TechnologiesCloud } from '@/components/sections/TechnologiesCloud'
import { StatsSection } from '@/components/sections/StatsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { FloatingNav } from '@/components/ui/FloatingNav'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { ScrollHandler } from '@/components/utils/ScrollHandler'

export default async function HomePage() {
  // Récupérer les projets mis en avant
  const featuredProjects = await prisma.project.findMany({
    where: { 
      featured: true,
      status: 'active'
    },
    include: {
      technologies: {
        include: { technology: true }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: 6
  })

  // Récupérer tous les projets pour les statistiques
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

  // Récupérer les technologies les plus utilisées
  const technologies = await prisma.technology.findMany({
    include: {
      projects: {
        include: { project: true }
      }
    }
  })

  // Calculer les statistiques
  const stats = {
    totalProjects: allProjects.length,
    githubProjects: allProjects.filter(p => p.type === 'github').length,
    totalStars: allProjects.reduce((sum, p) => sum + (p.stars || 0), 0),
    technologies: technologies.length,
    yearsOfExperience: new Date().getFullYear() - 2020 // Ajustez selon votre expérience
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gestionnaire de scroll */}
      <ScrollHandler />
      
      {/* Effets de fond animés */}
      <BackgroundEffects />
      
      {/* Navigation flottante */}
      <FloatingNav />

      {/* Contenu principal */}
      <main className="relative z-10">
        {/* Section Hero avec animation 3D */}
        <section id="hero">
          <HeroSection stats={stats} />
        </section>

        {/* Section Projets */}
        <section id="projects">
          <ProjectsGrid 
            featuredProjects={featuredProjects}
            allProjects={allProjects}
          />
        </section>

        {/* Nuage de technologies interactif */}
        <section id="about">
          <TechnologiesCloud technologies={technologies} />
        </section>

        {/* Statistiques animées */}
        <StatsSection stats={stats} />

        {/* Section Contact */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>

      {/* Effets de parallax et particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50" />
        
        {/* Grille futuriste animée */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />
        </div>

        {/* Lignes d'énergie */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent animate-pulse delay-2000" />
      </div>
    </div>
  )
}

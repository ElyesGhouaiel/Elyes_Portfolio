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


    </div>
  )
}

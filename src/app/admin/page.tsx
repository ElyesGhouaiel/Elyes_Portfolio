import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  await requireAdmin()

  // Statistiques du dashboard
  const stats = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { type: 'github' } }),
    prisma.project.count({ where: { type: 'manual' } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.technology.count(),
    prisma.project.aggregate({
      _sum: { stars: true }
    })
  ])

  const [
    totalProjects,
    githubProjects,
    manualProjects,
    featuredProjects,
    totalTechnologies,
    totalStars
  ] = stats

  const recentProjects = await prisma.project.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: {
      technologies: {
        include: { technology: true }
      }
    }
  })

  const initialStats = {
    totalProjects,
    githubProjects,
    manualProjects,
    featuredProjects,
    totalTechnologies,
    totalStars: totalStars._sum.stars || 0
  }

  return <AdminDashboard initialStats={initialStats} initialProjects={recentProjects} />
} 
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        githubProjects,
        manualProjects,
        featuredProjects,
        totalTechnologies,
        totalStars: totalStars._sum.stars || 0
      },
      projects: recentProjects
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    }, { status: 500 })
  }
} 
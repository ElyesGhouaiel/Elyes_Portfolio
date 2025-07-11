import { NextRequest, NextResponse } from 'next/server'
import { GitHubService } from '@/lib/github'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification (optionnel : ajouter une clé API)
    const authHeader = request.headers.get('authorization')
    // Ici vous pouvez ajouter une vérification d'authentification

    const githubService = new GitHubService()
    
    // Récupérer tous les repositories
    console.log('Récupération des repositories GitHub...')
    const repos = await githubService.getRepositories()
    
    const syncResults = {
      total: repos.length,
      created: 0,
      updated: 0,
      errors: 0,
      details: [] as any[]
    }

    // Traiter chaque repository
    for (const repo of repos) {
      try {
        // Obtenir les détails complets du repository
        const details = await githubService.getRepositoryDetails(
          repo.full_name.split('/')[0],
          repo.name
        )

        if (!details.repo) {
          syncResults.errors++
          syncResults.details.push({
            repo: repo.name,
            status: 'error',
            message: 'Impossible de récupérer les détails du repository'
          })
          continue
        }

        // Analyser les technologies
        const technologies = githubService.analyzeRepositoryTechnologies(
          details.languages,
          details.topics
        )

        // Déterminer la catégorie
        const category = githubService.determineProjectCategory(details.repo, details.topics)

        // Vérifier si le projet existe déjà
        const existingProject = await prisma.project.findUnique({
          where: { githubId: repo.id }
        })

        const projectData = {
          title: repo.name,
          description: repo.description || '',
          content: details.readme || '',
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || null,
          githubId: repo.id,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          type: 'github' as const,
          category,
          startDate: new Date(repo.created_at),
          updatedAt: new Date(repo.updated_at)
        }

        if (existingProject) {
          // Mettre à jour le projet existant
          await prisma.project.update({
            where: { id: existingProject.id },
            data: projectData
          })

          // Supprimer les anciennes technologies
          await prisma.projectTechnology.deleteMany({
            where: { projectId: existingProject.id }
          })

          syncResults.updated++
          syncResults.details.push({
            repo: repo.name,
            status: 'updated',
            technologies: technologies.length
          })
        } else {
          // Créer un nouveau projet
          const newProject = await prisma.project.create({
            data: projectData
          })

          syncResults.created++
          syncResults.details.push({
            repo: repo.name,
            status: 'created',
            technologies: technologies.length
          })
        }

        // Gérer les technologies
        for (const techName of technologies) {
          // Créer ou récupérer la technologie
          let technology = await prisma.technology.findUnique({
            where: { name: techName }
          })

          if (!technology) {
            technology = await prisma.technology.create({
              data: {
                name: techName,
                category: categorizeTechnology(techName)
              }
            })
          }

          // Créer la relation project-technology
          const project = await prisma.project.findUnique({
            where: { githubId: repo.id }
          })

          if (project) {
            await prisma.projectTechnology.upsert({
              where: {
                projectId_technologyId: {
                  projectId: project.id,
                  technologyId: technology.id
                }
              },
              update: {},
              create: {
                projectId: project.id,
                technologyId: technology.id
              }
            })
          }
        }

      } catch (error) {
        console.error(`Erreur lors du traitement de ${repo.name}:`, error)
        syncResults.errors++
        syncResults.details.push({
          repo: repo.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        })
      }
    }

    console.log('Synchronisation GitHub terminée:', syncResults)

    return NextResponse.json({
      success: true,
      message: 'Synchronisation GitHub terminée avec succès',
      results: syncResults
    })

  } catch (error) {
    console.error('Erreur lors de la synchronisation GitHub:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la synchronisation GitHub',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Retourner le statut de la dernière synchronisation
    const totalProjects = await prisma.project.count({
      where: { type: 'github' }
    })

    const recentProjects = await prisma.project.findMany({
      where: { type: 'github' },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        title: true,
        updatedAt: true,
        stars: true,
        language: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalGitHubProjects: totalProjects,
        recentProjects
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du statut GitHub:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération du statut GitHub'
    }, { status: 500 })
  }
}

// Fonction utilitaire pour catégoriser les technologies
function categorizeTechnology(techName: string): string {
  const categories: Record<string, string[]> = {
    'frontend': ['React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Bootstrap', 'Sass'],
    'backend': ['Node.js', 'Express.js', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP'],
    'database': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite'],
    'tool': ['Docker', 'Kubernetes', 'Webpack', 'Vite', 'Git'],
    'cloud': ['AWS', 'Vercel', 'Netlify', 'Azure', 'Google Cloud'],
    'language': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby']
  }

  for (const [category, techs] of Object.entries(categories)) {
    if (techs.includes(techName)) {
      return category
    }
  }

  return 'other'
} 
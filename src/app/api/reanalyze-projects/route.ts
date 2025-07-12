import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { analyzeProject, extractZip } from '@/lib/project-analyzer'

// Fonction pour déterminer la catégorie d'une technologie
function getTechnologyCategory(techName: string): string {
  const techCategories: Record<string, string> = {
    // Frontend
    'React': 'frontend',
    'Vue.js': 'frontend',
    'Angular': 'frontend',
    'Next.js': 'frontend',
    'HTML': 'frontend',
    'CSS': 'frontend',
    'Tailwind CSS': 'frontend',
    'Bootstrap': 'frontend',
    'Sass': 'frontend',
    
    // Backend
    'Python': 'backend',
    'Node.js': 'backend',
    'Express.js': 'backend',
    'Django': 'backend',
    'Flask': 'backend',
    'FastAPI': 'backend',
    'Java': 'backend',
    'C#': 'backend',
    'PHP': 'backend',
    
    // Base de données
    'MongoDB': 'database',
    'PostgreSQL': 'database',
    'MySQL': 'database',
    'SQLite': 'database',
    'Redis': 'database',
    
    // Outils
    'Docker': 'tool',
    'Git': 'tool',
    'Webpack': 'tool',
    'Vite': 'tool',
    'npm': 'tool',
    'yarn': 'tool',
    'pip': 'tool',
    
    // Cloud
    'AWS': 'cloud',
    'Vercel': 'cloud',
    'Netlify': 'cloud',
    'Heroku': 'cloud',
    
    // Langages
    'TypeScript': 'language',
    'JavaScript': 'language',
  }
  
  return techCategories[techName] || 'other'
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Début de la réanalyse des projets...')
    
    // Vérifier l'authentification admin
    await requireAdmin()

    // Récupérer tous les projets manuels qui ont un fichier ZIP
    const projects = await prisma.project.findMany({
      where: {
        type: 'manual',
        zipFilePath: { not: null }
      },
      include: {
        technologies: {
          include: {
            technology: true
          }
        }
      }
    })

    console.log(`📋 ${projects.length} projets trouvés pour réanalyse`)

    const results = []

    for (const project of projects) {
      try {
        console.log(`🔍 Réanalyse du projet: ${project.title}`)
        
        if (!project.zipFilePath) {
          console.log(`⚠️ Pas de fichier ZIP pour ${project.title}`)
          continue
        }

        // Construire le chemin complet du fichier ZIP
        const zipPath = path.join(process.cwd(), 'public', project.zipFilePath)
        
        if (!existsSync(zipPath)) {
          console.log(`⚠️ Fichier ZIP introuvable: ${zipPath}`)
          continue
        }

        // Créer le dossier d'extraction
        const extractPath = path.join(process.cwd(), 'public', 'uploads', 'projects', 'extracted', project.title)
        
        // Extraire le ZIP
        console.log(`📦 Extraction de ${project.title}...`)
        await extractZip(zipPath, extractPath)
        
        // Analyser le projet
        console.log(`🔍 Analyse de ${project.title}...`)
        const analysis = await analyzeProject(extractPath)
        
        console.log(`✅ Analyse terminée pour ${project.title}: ${analysis.technologies.length} technologies détectées`)

        // Supprimer les anciennes technologies liées
        await prisma.projectTechnology.deleteMany({
          where: { projectId: project.id }
        })

        // Créer les nouvelles technologies détectées
        for (const techName of analysis.technologies) {
          let technology = await prisma.technology.findUnique({
            where: { name: techName }
          })

          if (!technology) {
            technology = await prisma.technology.create({
              data: {
                name: techName,
                category: getTechnologyCategory(techName)
              }
            })
          }

          // Lier la technologie au projet
          await prisma.projectTechnology.create({
            data: {
              projectId: project.id,
              technologyId: technology.id
            }
          })
        }

        // Mettre à jour le projet avec les nouvelles informations
        await prisma.$executeRaw`
          UPDATE projects 
          SET description = ${analysis.description},
              content = ${analysis.readmeContent || project.content || ''},
              mainFiles = ${JSON.stringify(analysis.mainFiles)},
              previewFiles = ${JSON.stringify(analysis.previewFiles)},
              extractedPath = ${extractPath}
          WHERE id = ${project.id}
        `

        results.push({
          id: project.id,
          title: project.title,
          status: 'success',
          technologies: analysis.technologies,
          description: analysis.description
        })

        console.log(`✅ Projet ${project.title} mis à jour avec succès`)

      } catch (error) {
        console.error(`❌ Erreur lors de la réanalyse de ${project.title}:`, error)
        results.push({
          id: project.id,
          title: project.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Réanalyse terminée pour ${projects.length} projets`,
      results
    })

  } catch (error) {
    console.error('Erreur lors de la réanalyse:', error)
    
    if (error instanceof Error && error.message.includes('unauthorized')) {
      return NextResponse.json({
        success: false,
        message: 'Accès non autorisé'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la réanalyse des projets',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    await requireAdmin()

    // Récupérer les projets manuels avec leurs informations
    const projects = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.zipFilePath,
        p.mainFiles,
        p.previewFiles,
        p.createdAt,
        GROUP_CONCAT(t.name) as technologies
      FROM projects p
      LEFT JOIN project_technologies pt ON p.id = pt.projectId
      LEFT JOIN technologies t ON pt.technologyId = t.id
      WHERE p.type = 'manual'
      GROUP BY p.id
      ORDER BY p.createdAt DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        projects: (projects as any[]).map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          hasZipFile: !!project.zipFilePath,
          hasAnalysis: !!(project.mainFiles && project.previewFiles),
          technologies: project.technologies ? project.technologies.split(',') : [],
          createdAt: project.createdAt
        })),
        total: (projects as any[]).length
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des projets'
    }, { status: 500 })
  }
} 
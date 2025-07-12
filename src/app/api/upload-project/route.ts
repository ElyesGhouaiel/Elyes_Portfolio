import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { config, isValidFile } from '@/lib/config'
import { extractZip, analyzeProject, detectTechnologies } from '@/lib/project-analyzer'

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
    console.log('🚀 Début de l\'upload de projet...')
    
    // Vérifier l'authentification admin
    console.log('🔐 Vérification de l\'authentification...')
    await requireAdmin()
    console.log('✅ Authentification OK')

    const formData = await request.formData()
    const file = formData.get('file') as File
    console.log(`📁 Fichier reçu: ${file?.name} (${file?.size} bytes)`)

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Aucun fichier fourni'
      }, { status: 400 })
    }

    // Vérifier le fichier avec la configuration centralisée
    console.log('🔍 Validation du fichier...')
    const validation = isValidFile(file)
    if (!validation.valid) {
      console.log(`❌ Validation échouée: ${validation.error}`)
      return NextResponse.json({
        success: false,
        message: validation.error
      }, { status: 400 })
    }
    console.log('✅ Validation OK')

    // Créer le dossier uploads s'il n'existe pas
    console.log('📂 Vérification du dossier uploads...')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    if (!existsSync(uploadsDir)) {
      console.log('📂 Création du dossier uploads...')
      await mkdir(uploadsDir, { recursive: true })
      console.log('✅ Dossier uploads créé')
    } else {
      console.log('✅ Dossier uploads existe déjà')
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${sanitizedName}`
    const filePath = path.join(uploadsDir, fileName)

    // Sauvegarder le fichier
    console.log('💾 Sauvegarde du fichier...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
    console.log(`✅ Fichier sauvegardé: ${filePath}`)

    // Extraire le nom du projet du nom de fichier
    const projectName = sanitizedName.replace('.zip', '').replace(/_/g, ' ')
    
    // Extraire et analyser le projet
    console.log('📦 Extraction et analyse du projet...')
    const extractPath = path.join(process.cwd(), 'public', 'uploads', 'projects', 'extracted', projectName)
    
    let project: any
    
    try {
      // Extraire le ZIP
      const extractedFiles = await extractZip(filePath, extractPath)
      
      // Analyser le projet
      const analysis = await analyzeProject(extractPath)
      
      console.log(`🔍 Analyse terminée: ${analysis.technologies.length} technologies détectées`)
      
      // Créer le projet dans la base de données avec les informations analysées
      console.log('🗄️ Création du projet dans la base de données...')
      project = await prisma.project.create({
        data: {
          title: projectName,
          description: analysis.description,
          type: 'manual',
          category: 'personal', // Peut être modifié ensuite
          status: 'active',
          zipFilePath: `/uploads/projects/${fileName}`,
          featured: false,
          content: analysis.readmeContent || '',
          mainFiles: JSON.stringify(analysis.mainFiles),
          previewFiles: JSON.stringify(analysis.previewFiles)
        }
      })

      // Créer les technologies détectées
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

      console.log(`✅ Projet créé avec succès: ${project.title} (ID: ${project.id})`)
      console.log(`✅ Technologies ajoutées: ${analysis.technologies.join(', ')}`)
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse:', error)
      
      // Créer le projet sans analyse en cas d'erreur
      project = await prisma.project.create({
        data: {
          title: projectName,
          description: `Projet uploadé depuis ${file.name}`,
          type: 'manual',
          category: 'personal',
          status: 'active',
          zipFilePath: `/uploads/projects/${fileName}`,
          featured: false
        }
      })
      
      console.log(`✅ Projet créé sans analyse: ${project.title} (ID: ${project.id})`)
    }

    return NextResponse.json({
      success: true,
      message: 'Projet uploadé avec succès',
      project: {
        id: project.id,
        title: project.title,
        filePath: project.zipFilePath
      }
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    
    // Gérer les erreurs d'authentification
    if (error instanceof Error && error.message.includes('unauthorized')) {
      return NextResponse.json({
        success: false,
        message: 'Accès non autorisé'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur lors de l\'upload du projet',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Retourner la liste des projets uploadés
    const manualProjects = await prisma.project.findMany({
      where: { type: 'manual' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        zipFilePath: true,
        createdAt: true,
        status: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        projects: manualProjects,
        total: manualProjects.length
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des projets'
    }, { status: 500 })
  }
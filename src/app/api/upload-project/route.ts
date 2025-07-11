import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Aucun fichier fourni'
      }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.name.endsWith('.zip') && file.type !== 'application/zip') {
      return NextResponse.json({
        success: false,
        message: 'Seuls les fichiers ZIP sont acceptés'
      }, { status: 400 })
    }

    // Vérifier la taille du fichier (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: 'Le fichier est trop volumineux (50MB maximum)'
      }, { status: 400 })
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${sanitizedName}`
    const filePath = path.join(uploadsDir, fileName)

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Extraire le nom du projet du nom de fichier
    const projectName = sanitizedName.replace('.zip', '').replace(/_/g, ' ')

    // Créer le projet dans la base de données
    const project = await prisma.project.create({
      data: {
        title: projectName,
        description: `Projet uploadé depuis ${file.name}`,
        type: 'manual',
        category: 'personal', // Par défaut, peut être modifié ensuite
        status: 'active',
        zipFilePath: `/uploads/projects/${fileName}`,
        featured: false
      }
    })

    console.log(`Projet créé avec succès: ${project.title} (ID: ${project.id})`)

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
} 
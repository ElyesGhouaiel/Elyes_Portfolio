import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const projectId = params.id

    // Récupérer le projet avec SQL direct
    const projects = await prisma.$queryRaw`
      SELECT id, title, extractedPath, zipFilePath
      FROM projects 
      WHERE id = ${projectId}
    `
    
    const project = (projects as any[])[0]

    if (!project) {
      return NextResponse.json({
        success: false,
        message: 'Projet non trouvé'
      }, { status: 404 })
    }

    if (!project.extractedPath || !existsSync(project.extractedPath)) {
      return NextResponse.json({
        success: false,
        message: 'Fichiers du projet non trouvés. Veuillez réanalyser le projet.'
      }, { status: 404 })
    }

    // Chercher le fichier index.html principal
    const indexFiles = await findIndexFiles(project.extractedPath)
    
    if (indexFiles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Aucun fichier de démo trouvé (index.html, app.html, etc.)'
      }, { status: 404 })
    }

    // Prendre le premier index.html trouvé
    const demoFile = indexFiles[0]
    const demoPath = path.join(project.extractedPath, demoFile)
    
    try {
      const content = await readFile(demoPath, 'utf-8')
      
      // Retourner le contenu HTML avec les bonnes headers
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        }
      })
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier de démo:', error)
      return NextResponse.json({
        success: false,
        message: 'Erreur lors de la lecture du fichier de démo'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Erreur lors de la récupération de la démo:', error)
    
    if (error instanceof Error && error.message.includes('unauthorized')) {
      return NextResponse.json({
        success: false,
        message: 'Accès non autorisé'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération de la démo'
    }, { status: 500 })
  }
}

async function findIndexFiles(dir: string, baseDir: string = ''): Promise<string[]> {
  const indexFiles: string[] = []
  const items = await readdir(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relativePath = path.join(baseDir, item.name)
    
    if (item.isDirectory()) {
      // Ignorer certains dossiers
      if (!['node_modules', '.git', '__pycache__', '.vscode', '.idea', '.next', 'dist', 'build'].includes(item.name)) {
        const subFiles = await findIndexFiles(fullPath, relativePath)
        indexFiles.push(...subFiles)
      }
    } else {
      // Chercher les fichiers HTML principaux
      const fileName = item.name.toLowerCase()
      if (['index.html', 'app.html', 'main.html', 'demo.html', 'home.html'].includes(fileName)) {
        indexFiles.push(relativePath)
      }
    }
  }
  
  return indexFiles
} 
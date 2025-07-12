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

    // Récupérer la liste des fichiers
    const files = await getAllFiles(project.extractedPath)
    
    // Lire le contenu des fichiers importants
    const fileInfos = []
    for (const file of files.slice(0, 20)) { // Limiter à 20 fichiers pour les performances
      try {
        const filePath = path.join(project.extractedPath, file)
        const stats = await stat(filePath)
        
        if (stats.isFile() && stats.size < 100 * 1024) { // Limiter à 100KB par fichier
          const content = await readFile(filePath, 'utf-8')
          fileInfos.push({
            name: path.basename(file),
            path: file,
            content: content,
            language: getLanguageFromExtension(file),
            size: stats.size
          })
        }
      } catch (error) {
        console.warn(`Impossible de lire le fichier ${file}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      files: fileInfos
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error)
    
    if (error instanceof Error && error.message.includes('unauthorized')) {
      return NextResponse.json({
        success: false,
        message: 'Accès non autorisé'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des fichiers'
    }, { status: 500 })
  }
}

async function getAllFiles(dir: string, baseDir: string = ''): Promise<string[]> {
  const files: string[] = []
  const items = await readdir(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relativePath = path.join(baseDir, item.name)
    
    if (item.isDirectory()) {
      // Ignorer certains dossiers
      if (!['node_modules', '.git', '__pycache__', '.vscode', '.idea', '.next', 'dist', 'build'].includes(item.name)) {
        const subFiles = await getAllFiles(fullPath, relativePath)
        files.push(...subFiles)
      }
    } else {
      files.push(relativePath)
    }
  }
  
  return files
}

function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'py': 'python',
    'java': 'java',
    'cs': 'csharp',
    'php': 'php',
    'md': 'markdown',
    'txt': 'text',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'ini': 'ini',
    'cfg': 'ini'
  }
  return languageMap[ext || ''] || 'text'
} 
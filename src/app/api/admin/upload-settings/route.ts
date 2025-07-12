import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'src', 'lib', 'config.ts')

export async function GET() {
  try {
    await requireAdmin()

    // Lire la configuration actuelle
    const configContent = await readFile(CONFIG_FILE, 'utf-8')
    
    // Extraire la taille maximale actuelle
    const maxSizeMatch = configContent.match(/maxFileSize:\s*(\d+)\s*\*\s*1024\s*\*\s*1024/)
    const maxSizeMBMatch = configContent.match(/maxFileSizeMB:\s*(\d+)/)
    
    const currentMaxSize = maxSizeMatch ? parseInt(maxSizeMatch[1]) : 100
    const currentMaxSizeMB = maxSizeMBMatch ? parseInt(maxSizeMBMatch[1]) : 100

    return NextResponse.json({
      success: true,
      data: {
        maxFileSize: currentMaxSize * 1024 * 1024,
        maxFileSizeMB: currentMaxSizeMB
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des paramètres'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { maxFileSizeMB } = body

    // Validation
    if (!maxFileSizeMB || maxFileSizeMB < 1 || maxFileSizeMB > 1000) {
      return NextResponse.json({
        success: false,
        message: 'La taille maximale doit être entre 1MB et 1000MB'
      }, { status: 400 })
    }

    // Lire la configuration actuelle
    let configContent = await readFile(CONFIG_FILE, 'utf-8')
    
    // Mettre à jour les valeurs
    configContent = configContent.replace(
      /maxFileSize:\s*\d+\s*\*\s*1024\s*\*\s*1024/,
      `maxFileSize: ${maxFileSizeMB} * 1024 * 1024`
    )
    
    configContent = configContent.replace(
      /maxFileSizeMB:\s*\d+/,
      `maxFileSizeMB: ${maxFileSizeMB}`
    )

    // Sauvegarder la nouvelle configuration
    await writeFile(CONFIG_FILE, configContent, 'utf-8')

    console.log(`Configuration upload mise à jour: ${maxFileSizeMB}MB`)

    return NextResponse.json({
      success: true,
      message: 'Configuration upload mise à jour avec succès',
      data: {
        maxFileSize: maxFileSizeMB * 1024 * 1024,
        maxFileSizeMB
      }
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la mise à jour des paramètres'
    }, { status: 500 })
  }
} 
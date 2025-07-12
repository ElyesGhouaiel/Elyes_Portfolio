import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// Récupérer un projet spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        technologies: {
          include: { technology: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json({
        success: false,
        message: 'Projet non trouvé'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: project
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération du projet'
    }, { status: 500 })
  }
}

// Mettre à jour un projet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { title, description, category, featured, status, technologies } = body

    // Vérifier si le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json({
        success: false,
        message: 'Projet non trouvé'
      }, { status: 404 })
    }

    // Mettre à jour le projet
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: title || existingProject.title,
        description: description || existingProject.description,
        category: category || existingProject.category,
        featured: featured !== undefined ? featured : existingProject.featured,
        status: status || existingProject.status,
        updatedAt: new Date()
      }
    })

    // Mettre à jour les technologies si fournies
    if (technologies && Array.isArray(technologies)) {
      // Supprimer les anciennes relations
      await prisma.projectTechnology.deleteMany({
        where: { projectId: params.id }
      })

      // Créer les nouvelles relations
      for (const techName of technologies) {
        let technology = await prisma.technology.findUnique({
          where: { name: techName }
        })

        if (!technology) {
          technology = await prisma.technology.create({
            data: {
              name: techName,
              category: 'other'
            }
          })
        }

        await prisma.projectTechnology.create({
          data: {
            projectId: params.id,
            technologyId: technology.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Projet mis à jour avec succès',
      data: updatedProject
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la mise à jour du projet'
    }, { status: 500 })
  }
}

// Supprimer un projet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    // Vérifier si le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json({
        success: false,
        message: 'Projet non trouvé'
      }, { status: 404 })
    }

    // Supprimer les relations technologies
    await prisma.projectTechnology.deleteMany({
      where: { projectId: params.id }
    })

    // Supprimer le projet
    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Projet supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la suppression du projet'
    }, { status: 500 })
  }
} 
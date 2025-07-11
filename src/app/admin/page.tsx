import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GitHubSyncButton } from '@/components/admin/GitHubSyncButton'
import { ProjectUpload } from '@/components/admin/ProjectUpload'
import { ProjectsList } from '@/components/admin/ProjectsList'
import { 
  FolderOpen, 
  Github, 
  Upload, 
  BarChart3, 
  Star,
  Eye,
  Settings
} from 'lucide-react'

export default async function AdminDashboard() {
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
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: {
      technologies: {
        include: { technology: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Administration
              </h1>
              <p className="text-purple-300/80 mt-1">
                Gestion de votre portfolio moderne
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                Total Projets
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalProjects}</div>
              <p className="text-xs text-purple-300/70 mt-1">
                {githubProjects} GitHub • {manualProjects} Manuels
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                Projets GitHub
              </CardTitle>
              <Github className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{githubProjects}</div>
              <p className="text-xs text-purple-300/70 mt-1">
                Synchronisés automatiquement
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                Étoiles GitHub
              </CardTitle>
              <Star className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalStars._sum.stars || 0}</div>
              <p className="text-xs text-purple-300/70 mt-1">
                Total sur tous les projets
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                Technologies
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalTechnologies}</div>
              <p className="text-xs text-purple-300/70 mt-1">
                Détectées automatiquement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Synchronisation GitHub */}
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Github className="w-5 h-5 mr-2 text-purple-400" />
                Synchronisation GitHub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-purple-300/80 text-sm">
                Synchronisez automatiquement vos repositories GitHub publics avec votre portfolio.
              </p>
              <GitHubSyncButton />
            </CardContent>
          </Card>

          {/* Upload de projet */}
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Upload className="w-5 h-5 mr-2 text-purple-400" />
                Ajouter un Projet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-purple-300/80 text-sm">
                Ajoutez un projet personnalisé en uploadant un fichier ZIP.
              </p>
              <ProjectUpload />
            </CardContent>
          </Card>
        </div>

        {/* Liste des projets */}
        <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Eye className="w-5 h-5 mr-2 text-purple-400" />
              Projets Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectsList projects={recentProjects} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GitHubSyncButton } from '@/components/admin/GitHubSyncButton'
import { ProjectUpload } from '@/components/admin/ProjectUpload'
import { ProjectsList } from '@/components/admin/ProjectsList'
import { LogoutButton } from '@/components/admin/LogoutButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UploadSettings } from '@/components/admin/UploadSettings'
import { 
  FolderOpen, 
  Github, 
  Upload, 
  BarChart3, 
  Star,
  Eye,
  Settings,
  RefreshCw,
  Loader2,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Technology {
  id: string
  name: string
  category: string
}

interface ProjectTechnology {
  technology: Technology
}

interface Project {
  id: string
  title: string
  description: string | null
  githubUrl: string | null
  liveUrl: string | null
  type: string
  category: string
  language: string | null
  stars: number | null
  forks: number | null
  featured: boolean
  status: string
  createdAt: Date
  updatedAt: Date
  technologies: ProjectTechnology[]
}

interface Stats {
  totalProjects: number
  githubProjects: number
  manualProjects: number
  featuredProjects: number
  totalTechnologies: number
  totalStars: number
}

interface AdminDashboardProps {
  initialStats: Stats
  initialProjects: Project[]
}

export function AdminDashboard({ initialStats, initialProjects }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats>(initialStats)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isReanalyzing, setIsReanalyzing] = useState(false)

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      // Recharger les données depuis le serveur
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleProjectUpdate = () => {
    refreshData()
  }

  const handleReanalyzeProjects = async () => {
    setIsReanalyzing(true)
    try {
      const response = await fetch('/api/reanalyze-projects', {
        method: 'POST'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Réanalyse terminée:', result)
        // Rafraîchir les données après la réanalyse
        await refreshData()
      } else {
        console.error('Erreur lors de la réanalyse')
      }
    } catch (error) {
      console.error('Erreur lors de la réanalyse:', error)
    } finally {
      setIsReanalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-slate-50 light:via-purple-50 light:to-slate-50">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg dark:bg-black/20 light:bg-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Administration
              </h1>
              <p className="text-purple-300/80 dark:text-purple-300/80 light:text-purple-600/80 mt-1">
                Gestion de votre portfolio moderne
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                variant="outline" 
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Rafraîchir
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-600">
                  Total Projets
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white dark:text-white light:text-gray-900">{stats.totalProjects}</div>
                <p className="text-xs text-purple-300/70 dark:text-purple-300/70 light:text-purple-600/70 mt-1">
                  {stats.githubProjects} GitHub • {stats.manualProjects} Manuels
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-600">
                  Projets GitHub
                </CardTitle>
                <Github className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white dark:text-white light:text-gray-900">{stats.githubProjects}</div>
                <p className="text-xs text-purple-300/70 dark:text-purple-300/70 light:text-purple-600/70 mt-1">
                  Synchronisés automatiquement
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-600">
                  Étoiles GitHub
                </CardTitle>
                <Star className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white dark:text-white light:text-gray-900">{stats.totalStars}</div>
                <p className="text-xs text-purple-300/70 dark:text-purple-300/70 light:text-purple-600/70 mt-1">
                  Total sur tous les projets
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300 dark:text-purple-300 light:text-purple-600">
                  Technologies
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white dark:text-white light:text-gray-900">{stats.totalTechnologies}</div>
                <p className="text-xs text-purple-300/70 dark:text-purple-300/70 light:text-purple-600/70 mt-1">
                  Détectées automatiquement
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Colonne gauche */}
          <div className="space-y-8">
            {/* Synchronisation GitHub */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white dark:text-white light:text-gray-900">
                    <Github className="w-5 h-5 mr-2 text-purple-400" />
                    Synchronisation GitHub
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-300/80 dark:text-purple-300/80 light:text-purple-600/80 text-sm">
                    Synchronisez automatiquement vos repositories GitHub publics avec votre portfolio.
                  </p>
                  <GitHubSyncButton />
                </CardContent>
              </Card>
            </motion.div>

            {/* Upload de projet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white dark:text-white light:text-gray-900">
                    <Upload className="w-5 h-5 mr-2 text-purple-400" />
                    Ajouter un Projet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-300/80 dark:text-purple-300/80 light:text-purple-600/80 text-sm">
                    Ajoutez un projet personnalisé en uploadant un fichier ZIP.
                  </p>
                  <ProjectUpload />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-8">
            {/* Réanalyse des projets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white dark:text-white light:text-gray-900">
                    <Zap className="w-5 h-5 mr-2 text-purple-400" />
                    Réanalyse des Projets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-300/80 dark:text-purple-300/80 light:text-purple-600/80 text-sm">
                    Réanalysez les projets ZIP existants pour extraire les technologies et générer les descriptions automatiquement.
                  </p>
                  <Button 
                    onClick={handleReanalyzeProjects}
                    disabled={isReanalyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isReanalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Réanalyse en cours...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Réanalyser les Projets
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Configuration Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <UploadSettings 
                currentMaxSize={100 * 1024 * 1024} // 100MB par défaut
                onUpdate={refreshData}
              />
            </motion.div>
          </div>
        </div>

        {/* Liste des projets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-lg dark:bg-black/30 light:bg-white/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white dark:text-white light:text-gray-900">
                <Eye className="w-5 h-5 mr-2 text-purple-400" />
                Projets Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectsList projects={projects} onProjectUpdate={handleProjectUpdate} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
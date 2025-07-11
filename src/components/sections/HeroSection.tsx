'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowDown, 
  Github, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Code, 
  Rocket 
} from 'lucide-react'

interface Stats {
  totalProjects: number
  githubProjects: number
  totalStars: number
  technologies: number
  yearsOfExperience: number
}

interface HeroSectionProps {
  stats: Stats
}

export function HeroSection({ stats }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Fond interactif qui suit la souris */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)`
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto text-center"
      >
        {/* Badge animé */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>
          <span className="text-purple-300 text-sm font-medium">
            Portfolio Moderne • Développeur Full Stack
          </span>
        </motion.div>

        {/* Titre principal avec effet de machine à écrire */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Créateur
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              d'Expériences
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Numériques
            </span>
          </h1>
        </motion.div>

        {/* Sous-titre */}
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-purple-200/80 max-w-4xl mx-auto mb-12 leading-relaxed"
        >
          Je conçois et développe des applications web modernes, performantes et innovantes, 
          en alliant créativité technique et excellence utilisateur.
        </motion.p>

        {/* Statistiques flottantes */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {[
            { value: stats.totalProjects, label: "Projets", icon: Code },
            { value: stats.yearsOfExperience, label: "Années d'expérience", icon: Rocket },
            { value: stats.totalStars, label: "GitHub Stars", icon: Github },
            { value: stats.technologies, label: "Technologies", icon: Sparkles }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              style={{ animationDelay: `${index * 0.5}s` }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}+
              </div>
              <div className="text-purple-300/80 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Boutons d'action */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/25 px-8 py-4 text-lg font-semibold"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Voir mes projets
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 backdrop-blur-lg px-8 py-4 text-lg font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              Me contacter
            </Button>
          </motion.div>
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center"
        >
          <p className="text-purple-300/60 text-sm mb-4">Découvrez mon travail</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="p-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-lg"
          >
            <ArrowDown className="w-6 h-6 text-purple-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cercles lumineux flottants */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    </section>
  )
} 
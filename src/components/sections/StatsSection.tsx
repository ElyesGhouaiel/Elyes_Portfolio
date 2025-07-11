'use client'

import { motion } from 'framer-motion'
import { Code, Github, Star, Award } from 'lucide-react'

interface Stats {
  totalProjects: number
  githubProjects: number
  totalStars: number
  technologies: number
  yearsOfExperience: number
}

interface StatsSectionProps {
  stats: Stats
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statsData = [
    {
      icon: Code,
      value: stats.totalProjects,
      label: "Projets Réalisés",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Github,
      value: stats.githubProjects,
      label: "Repositories GitHub",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: Star,
      value: stats.totalStars,
      label: "GitHub Stars",
      color: "from-yellow-400 to-orange-400"
    },
    {
      icon: Award,
      value: stats.yearsOfExperience,
      label: "Années d'Expérience",
      color: "from-green-400 to-teal-400"
    }
  ]

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              En Chiffres
            </span>
          </h2>
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Quelques statistiques qui reflètent mon parcours et mon engagement
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="bg-black/20 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 text-center hover:border-purple-500/40 transition-all duration-300">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                  className="inline-block mb-4"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  {stat.value}+
                </motion.div>

                <p className="text-purple-300/80 font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
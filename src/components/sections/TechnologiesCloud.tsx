'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface Technology {
  id: string
  name: string
  category: string
  projects: Array<{
    project: any
  }>
}

interface TechnologiesCloudProps {
  technologies: Technology[]
}

export function TechnologiesCloud({ technologies }: TechnologiesCloudProps) {
  const getRandomSize = () => Math.random() * 0.5 + 0.8
  const getRandomPosition = () => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  })

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            Les outils et technologies que j'utilise pour créer des expériences exceptionnelles
          </p>
        </motion.div>

        <div className="relative h-96 mb-16">
          {technologies.slice(0, 20).map((tech, index) => (
            <motion.div
              key={tech.id}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: getRandomPosition().x + '%',
                y: getRandomPosition().y + '%'
              }}
              whileInView={{ 
                opacity: 1, 
                scale: getRandomSize()
              }}
              whileHover={{ 
                scale: getRandomSize() * 1.2,
                zIndex: 10
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${20 + (index % 5) * 15}%`,
                top: `${20 + Math.floor(index / 5) * 20}%`
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                <Badge
                  className={`
                    px-4 py-2 text-sm font-medium cursor-pointer backdrop-blur-lg
                    ${tech.category === 'frontend' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      tech.category === 'backend' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      tech.category === 'database' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      tech.category === 'tool' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'}
                    hover:shadow-lg transition-all duration-300
                  `}
                >
                  {tech.name}
                  {tech.projects.length > 0 && (
                    <span className="ml-2 text-xs opacity-70">
                      ({tech.projects.length})
                    </span>
                  )}
                </Badge>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
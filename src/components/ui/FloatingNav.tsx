'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, User, Briefcase, Mail, Github, Settings } from 'lucide-react'

export function FloatingNav() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center space-x-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
              <Home className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
              <User className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
              <Briefcase className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
              <Mail className="w-4 h-4" />
            </Button>
          </motion.div>

          <div className="w-px h-6 bg-purple-500/30" />

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
              <Github className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
              <Settings className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
} 
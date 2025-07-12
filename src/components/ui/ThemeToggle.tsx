'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { Button } from './button'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-300/60 hover:bg-slate-100/80 dark:bg-slate-800/80 dark:border-slate-600/60 dark:hover:bg-slate-700/80 transition-all duration-300"
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : 180
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Sun className="w-4 h-4 text-yellow-400" />
        </motion.div>
        
        <motion.div
          animate={{ 
            scale: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : -180
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Moon className="w-4 h-4 text-purple-400" />
        </motion.div>
      </div>
      
      <span className="sr-only">
        {theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
      </span>
    </Button>
  )
} 
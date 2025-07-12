import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { FloatingNav } from '@/components/ui/FloatingNav'
import { Shield, Home, Lock } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Effets de fond animés */}
      <BackgroundEffects />
      
      {/* Navigation flottante */}
      <FloatingNav />

      {/* Contenu principal */}
      <main className="relative z-10 flex items-center justify-center min-h-screen pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/90 backdrop-blur-lg border border-slate-300/60 dark:bg-black/30 dark:border-purple-500/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                Accès Refusé
              </CardTitle>
              <p className="text-slate-600 dark:text-purple-300/80 mt-2">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-purple-300/80">
                  Cette zone est réservée aux administrateurs uniquement.
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25">
                    <Home className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </Link>
                
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-600 hover:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30 dark:hover:bg-purple-500/10">
                    <Lock className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
} 
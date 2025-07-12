'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BackgroundEffects } from '@/components/effects/BackgroundEffects'
import { FloatingNav } from '@/components/ui/FloatingNav'
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin'
      })

      console.log('🔐 Résultat de la connexion:', result)

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else if (result?.ok) {
        // Rediriger vers la page admin
        router.push('/admin')
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

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
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                Connexion Admin
              </CardTitle>
              <p className="text-slate-600 dark:text-purple-300/80 mt-2">
                Accédez à votre espace d'administration
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-purple-300">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      className="pl-10 bg-white/80 border-slate-300/60 text-slate-800 placeholder-slate-500 focus:border-purple-500 dark:bg-black/30 dark:border-purple-500/30 dark:text-white dark:placeholder-purple-300/50"
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-purple-300">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/80 border-slate-300/60 text-slate-800 placeholder-slate-500 focus:border-purple-500 dark:bg-black/30 dark:border-purple-500/30 dark:text-white dark:placeholder-purple-300/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-purple-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <Alert className="border-red-500/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500/30">
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Bouton de connexion */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>

                {/* Lien vers la page d'accueil */}
                <div className="text-center">
                  <Link 
                    href="/"
                    className="text-sm text-slate-600 hover:text-slate-800 dark:text-purple-300/80 dark:hover:text-purple-200 transition-colors"
                  >
                    ← Retour à l'accueil
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
} 
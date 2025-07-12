'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Github, Linkedin, MessageCircle, Send } from 'lucide-react'

export function ContactSection() {
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
            <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              Travaillons Ensemble
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto dark:text-purple-200/80">
            Vous avez un projet en tête ? N'hésitez pas à me contacter pour en discuter
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg border border-slate-300/60 dark:bg-black/20 dark:border-purple-500/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 dark:text-white">
                  Envoyez-moi un message
                </h3>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-slate-700 text-sm font-medium mb-2 dark:text-purple-300">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/80 border border-slate-300/60 rounded-lg text-slate-800 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors dark:bg-black/30 dark:border-purple-500/30 dark:text-white dark:placeholder-purple-300/50"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-medium mb-2 dark:text-purple-300">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/80 border border-slate-300/60 rounded-lg text-slate-800 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors dark:bg-black/30 dark:border-purple-500/30 dark:text-white dark:placeholder-purple-300/50"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-sm font-medium mb-2 dark:text-purple-300">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-300/60 rounded-lg text-slate-800 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors resize-none dark:bg-black/30 dark:border-purple-500/30 dark:text-white dark:placeholder-purple-300/50"
                      placeholder="Décrivez votre projet ou votre demande..."
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/25"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 dark:text-white">
                Contactez-moi directement
              </h3>
              <p className="text-slate-600 mb-8 dark:text-purple-200/80">
                Préférez-vous un contact direct ? Voici mes différents canaux de communication.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "elyesghouaiel@gmail.com",
                  href: "mailto:elyesghouaiel@gmail.com",
                  color: "from-red-400 to-pink-400"
                },
                {
                  icon: Github,
                  title: "GitHub",
                  value: "github.com/ElyesGhouaiel",
                  href: "https://github.com/ElyesGhouaiel",
                  color: "from-gray-400 to-slate-400"
                },
                {
                  icon: Linkedin,
                  title: "LinkedIn",
                  value: "linkedin.com/in/elyes-ghouaiel",
                  href: "https://linkedin.com/in/elyes-ghouaiel",
                  color: "from-blue-400 to-cyan-400"
                }
              ].map((contact, index) => (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => window.open(contact.href, '_blank')}
                >
                  <Card className="bg-white/80 backdrop-blur-lg border border-slate-300/60 hover:border-purple-500/40 transition-all duration-300 dark:bg-black/20 dark:border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${contact.color} flex items-center justify-center`}>
                          <contact.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-slate-800 font-semibold dark:text-white">{contact.title}</h4>
                          <p className="text-slate-600 text-sm group-hover:text-slate-800 transition-colors dark:text-purple-300/80 dark:group-hover:text-purple-200">{contact.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
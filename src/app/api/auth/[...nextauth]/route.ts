import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 Tentative de connexion pour:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credentials manquants')
          return null
        }

        // Utiliser une requête SQL directe pour éviter les problèmes de types
        const users = await prisma.$queryRaw`
          SELECT id, email, name, role, password 
          FROM users 
          WHERE email = ${credentials.email}
        `
        
        const user = Array.isArray(users) ? users[0] : null

        if (!user || !user.password) {
          console.log('User not found or no password:', credentials.email)
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        console.log('🔍 Vérification du mot de passe:', isPasswordValid)

        if (!isPasswordValid) {
          console.log('❌ Mot de passe incorrect')
          return null
        }

        console.log('✅ Connexion réussie pour:', user.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
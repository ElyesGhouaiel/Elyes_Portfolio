import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        // Ajouter le rôle depuis la base de données
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { role: true }
        })
        session.user.role = dbUser?.role || 'user'
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Vérifier si c'est le propriétaire du portfolio (vous)
      const isOwner = user.email === process.env.OWNER_EMAIL
      
      if (isOwner) {
        // Mettre à jour le rôle en admin si c'est le propriétaire
        await prisma.user.upsert({
          where: { email: user.email! },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            role: 'admin'
          },
          update: {
            role: 'admin'
          }
        })
      }
      
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
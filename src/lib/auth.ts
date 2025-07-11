import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  if (session.user?.role !== 'admin') {
    redirect('/unauthorized')
  }
  
  return session
}

export function isAdmin(user: any): boolean {
  return user?.role === 'admin'
} 
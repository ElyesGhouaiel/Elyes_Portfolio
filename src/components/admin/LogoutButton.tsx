'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="border-red-500/50 text-red-300 hover:bg-red-500/10 hover:text-red-200"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Déconnexion
    </Button>
  )
} 
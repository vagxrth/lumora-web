'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Google } from '@/components/icons/google'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const data = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
      })
      
      if (data.error) {
        toast.error("Failed to sign in with Google")
        console.error(data.error)
      }
    } catch (error) {
      toast.error("An error occurred during sign in")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-colors"
      variant="outline"
    >
      <Google className="w-5 h-5" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  )
} 
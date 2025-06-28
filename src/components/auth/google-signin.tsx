'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Google } from '@/components/icons/google'
import { useSearchParams } from 'next/navigation'

export function GoogleSignInButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const handleGoogleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl || "/dashboard",
    });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-2"
      variant="outline"
    >
      <Google className="w-5 h-5" />
      Continue with Google
    </Button>
  )
} 
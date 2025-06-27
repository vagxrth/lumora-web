import React from 'react'
import { GoogleSignInButton } from '@/components/auth/google-signin'

type Props = {}

const SignInPage = (props: Props) => {
  return (
    <div className="flex-1 py-36 md:px-16 w-full">
      <div className="flex flex-col h-full gap-3 items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Welcome back to Lumora
            </p>
          </div>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  )
}

export default SignInPage
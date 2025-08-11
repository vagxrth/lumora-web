import React from 'react'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col py-10 px-10 xl:px-0 container">
      <nav className="w-full flex justify-end">
        <Link
          href="/auth/signin"
          className="px-6 py-2 text-sm font-semibold rounded-full border-2 border-white text-white hover:bg-white/10"
        >
          Sign In
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default Layout
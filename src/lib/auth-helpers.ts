import { auth } from './auth'
import { headers } from 'next/headers'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const getCurrentUser = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    return session?.user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
})

export const getValidatedSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    return session || null
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
})

export const requireAuth = async () => {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export const requireValidSession = async () => {
  const session = await getValidatedSession()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }
  
  return session
}

export const validateApiRequest = async () => {
  const session = await getValidatedSession()
  
  if (!session?.user) {
    return { 
      error: 'Unauthorized', 
      status: 401,
      user: null,
      session: null
    } as const
  }
  
  return {
    error: null,
    status: 200,
    user: session.user!,
    session: session
  } as const
} 
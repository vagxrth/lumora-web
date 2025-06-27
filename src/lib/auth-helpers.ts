import { auth } from './auth'
import { headers } from 'next/headers'
import { cache } from 'react'

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

export const requireAuth = async () => {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
} 
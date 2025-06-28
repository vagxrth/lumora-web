import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { client } from '@/lib/prisma'

// Define the type for the update data object used in Prisma operations
interface UserUpdateData {
  subscription?: {
    create: {
      plan: 'FREE' | 'PRO'
    }
  }
  workspace?: {
    create: {
      name: string
      type: 'PERSONAL' | 'PUBLIC'
    }
  }
  studio?: {
    create: Record<string, never> // empty object
  }
}

const AuthCallbackPage = async () => {
  try {
    console.log('🔄 Auth callback triggered')
    
    // Get session using Better Auth
    const session = await auth.api.getSession({
      headers: await headers()
    })

    console.log('📊 Session data:', session ? 'Session found' : 'No session found')

    if (session?.user) {
      console.log('👤 User found:', session.user.email)
      
      // Find user's workspace and subscription
      const userWithData = await client.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          workspace: true,
          subscription: true,
          studio: true,
        },
      })

      console.log('🏢 User workspace count:', userWithData?.workspace?.length || 0)

      // If user has workspace, redirect to it
      if (userWithData?.workspace && userWithData.workspace.length > 0) {
        console.log('✅ Redirecting to existing workspace:', userWithData.workspace[0].id)
        return redirect(`/dashboard/${userWithData.workspace[0].id}`)
      } 
      
      // If user exists but has no workspace/subscription, create them
      if (userWithData) {
        console.log('🔧 Creating missing user data...')
        const updateData: UserUpdateData = {}
        
        // Create subscription if it doesn't exist
        if (!userWithData.subscription) {
          console.log('📝 Creating subscription')
          updateData.subscription = {
            create: {
              plan: 'FREE'
            }
          }
        }
        
        // Create workspace if none exists
        if (!userWithData.workspace || userWithData.workspace.length === 0) {
          console.log('🏗️ Creating workspace')
          updateData.workspace = {
            create: {
              name: `${session.user.name || 'User'}'s Workspace`,
              type: 'PERSONAL'
            }
          }
        }
        
        // Create studio if it doesn't exist
        if (!userWithData.studio) {
          console.log('🎬 Creating studio')
          updateData.studio = {
            create: {}
          }
        }

        if (Object.keys(updateData).length > 0) {
          const updatedUser = await client.user.update({
            where: {
              id: session.user.id,
            },
            data: updateData,
            include: {
              workspace: true,
            },
          })
          
          console.log('✅ User data created successfully')
          
          if (updatedUser.workspace && updatedUser.workspace.length > 0) {
            console.log('✅ Redirecting to new workspace:', updatedUser.workspace[0].id)
            return redirect(`/dashboard/${updatedUser.workspace[0].id}`)
          }
        }
      }
      
      // If we get here, redirect to dashboard home
      console.log('🏠 Redirecting to dashboard home')
      return redirect('/dashboard')
    }

    console.log('❌ No session found, redirecting to signin')
    return redirect('/auth/signin')
  } catch (error) {
    console.error('🔴 Auth callback error:', error)
    return redirect('/auth/signin')
  }
}

export default AuthCallbackPage
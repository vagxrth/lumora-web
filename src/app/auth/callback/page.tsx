import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { client } from '@/lib/prisma'

const AuthCallbackPage = async () => {
  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user) {
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

      // If user has workspace, redirect to it
      if (userWithData?.workspace && userWithData.workspace.length > 0) {
        return redirect(`/dashboard/${userWithData.workspace[0].id}`)
      } 
      
      // If user exists but has no workspace/subscription, create them
      if (userWithData) {
        const updateData: any = {}
        
        // Create subscription if it doesn't exist
        if (!userWithData.subscription) {
          updateData.subscription = {
            create: {
              plan: 'FREE'
            }
          }
        }
        
        // Create workspace if none exists
        if (!userWithData.workspace || userWithData.workspace.length === 0) {
          updateData.workspace = {
            create: {
              name: `${session.user.name || 'User'}'s Workspace`,
              type: 'PERSONAL'
            }
          }
        }
        
        // Create studio if it doesn't exist
        if (!userWithData.studio) {
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
          
          if (updatedUser.workspace && updatedUser.workspace.length > 0) {
            return redirect(`/dashboard/${updatedUser.workspace[0].id}`)
          }
        }
      }
      
      // If we get here, redirect to dashboard home
      return redirect('/dashboard')
    }

    return redirect('/auth/signin')
  } catch (error) {
    console.error('Auth callback error:', error)
    return redirect('/auth/signin')
  }
}

export default AuthCallbackPage
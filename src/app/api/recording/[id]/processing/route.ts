import { client } from '@/lib/prisma'
import { validateApiRequest } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate session
    const validation = await validateApiRequest()
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error }, 
        { status: validation.status }
      )
    }

    const body = await req.json()
    const { id } = await params

    // Verify the authenticated user matches the requested user ID
    if (validation.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot process videos for another user' }, 
        { status: 403 }
      )
    }

    const personalworkspaceId = await client.user.findUnique({
      where: {
        id,
      },
      select: {
        workspace: {
          where: {
            type: 'PERSONAL',
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
    const startProcessingVideo = await client.workSpace.update({
      where: {
        id: personalworkspaceId?.workspace[0].id,
      },
      data: {
        videos: {
          create: {
            source: body.filename,
            userId: id,
          },
        },
      },
      select: {
        User: {
          select: {
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    })

    if (startProcessingVideo) {
      return NextResponse.json({
        status: 200,
        plan: startProcessingVideo.User?.subscription?.plan,
      })
    }
    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('🔴 Error in processing video', error)
  }
}
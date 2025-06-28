import { client } from '@/lib/prisma'
import { validateApiRequest } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate session
  const validation = await validateApiRequest()
  if (validation.error) {
    return NextResponse.json(
      { error: validation.error }, 
      { status: validation.status }
    )
  }

  const { id } = await params
  const body = await req.json()

  // Verify the authenticated user matches the requested user ID
  if (validation.user.id !== id) {
    return NextResponse.json(
      { error: 'Forbidden: Cannot update studio settings for another user' }, 
      { status: 403 }
    )
  }

  const studio = await client.user.update({
    where: {
      id,
    },
    data: {
      studio: {
        update: {
          screen: body.screen,
          mic: body.audio,
          preset: body.preset,
        },
      },
    },
  })

  if (studio)
    return NextResponse.json({ status: 200, message: 'Studio updated!' })

  return NextResponse.json({
    status: '400',
    message: 'Oops! something went wrong',
  })
}
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

  const body = await req.json()
  const { id } = await params

  // Verify the authenticated user owns this video
  if (validation.user.id !== id) {
    return NextResponse.json(
      { error: 'Forbidden: Cannot modify videos for another user' }, 
      { status: 403 }
    )
  }

  const completeProcessing = await client.video.update({
    where: {
      userId: id,
      source: body.filename,
    },
    data: {
      processing: false,
    },
  })
  
  if (completeProcessing) {
    return NextResponse.json({ status: 200 })
  }

  return NextResponse.json({ status: 400 })
}
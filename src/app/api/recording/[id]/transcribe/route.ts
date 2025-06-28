import { client } from '@/lib/prisma'
import { validateApiRequest } from '@/lib/auth-helpers'
import axios from 'axios'
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

  //WIRE UP AI AGENT
  const body = await req.json()
  const { id } = await params

  // Verify the authenticated user owns this video
  if (validation.user.id !== id) {
    return NextResponse.json(
      { error: 'Forbidden: Cannot transcribe videos for another user' }, 
      { status: 403 }
    )
  }

  const content = JSON.parse(body.content)

  const transcribed = await client.video.update({
    where: {
      userId: id,
      source: body.filename,
    },
    data: {
      title: content.title,
      description: content.summary,
      summary: body.transcript,
    },
  })
  if (transcribed) {
    console.log('🟢 Transcribed')
    const options = {
      method: 'POST',
      url: process.env.VOICEFLOW_KNOWLEDGE_BASE_API,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: process.env.VOICEFLOW_API_KEY,
      },
      data: {
        data: {
          schema: {
            searchableFields: ['title', 'transcript'],
            metadataFields: ['title', 'transcript'],
          },
          name: content.title,
          items: [
            {
              title: content.title,
              transcript: body.transcript,
            },
          ],
        },
      },
    }

    const updateKB = await axios.request(options)

    if (updateKB.status === 200 || updateKB.status !== 200) {
      console.log(updateKB.data)
      return NextResponse.json({ status: 200 })
    }
  }
  console.log('🔴 Transcription went wrong')

  return NextResponse.json({ status: 400 })
}
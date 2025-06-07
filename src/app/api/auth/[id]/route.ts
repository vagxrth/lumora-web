import { client } from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('Endpoint hit ✅')

  try {
    const userProfile = await client.user.findUnique({
      where: {
        clerkid: id,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    if (userProfile)
      return NextResponse.json({ status: 200, user: userProfile })

    // Get the current user from Clerk
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const createUser = await client.user.create({
      data: {
        clerkid: id,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstname: clerkUser.firstName,
        lastname: clerkUser.lastName,
        studio: {
          create: {},
        },
        workspace: {
          create: {
            name: `${clerkUser.firstName}'s Workspace`,
            type: 'PERSONAL',
          },
        },
        subscription: {
          create: {},
        },
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    if (createUser) return NextResponse.json({ status: 201, user: createUser })

    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('ERROR', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
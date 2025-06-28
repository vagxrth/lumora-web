'use server'

import { client } from '@/lib/prisma'
import { getCurrentUser, requireAuth } from '@/lib/auth-helpers'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string)

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  })

  const mailOptions = {
    to,
    subject,
    text,
    html,
  }
  return { transporter, mailOptions }
}

export const onAuthenticateUser = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { status: 403 }
    }

    // First, check if user exists with all required relations
    const existingUser = await client.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        workspace: true,
        subscription: true,
        studio: true,
      },
    })

    // If user exists and has workspace, return them
    if (existingUser && existingUser.workspace.length > 0) {
      return { status: 200, user: existingUser }
    }

    // If user exists but doesn't have workspace/subscription/studio, create them
    if (existingUser) {
      const updatedUser = await client.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...(existingUser.workspace.length === 0 && {
            workspace: {
              create: {
                name: `${user.name || user.email?.split('@')[0] || 'User'}'s Workspace`,
                type: 'PERSONAL',
              },
            },
          }),
          ...(!existingUser.subscription && {
            subscription: {
              create: {
                plan: 'FREE',
              },
            },
          }),
          ...(!existingUser.studio && {
            studio: {
              create: {},
            },
          }),
        },
        include: {
          workspace: true,
          subscription: true,
          studio: true,
        },
      })
      return { status: 201, user: updatedUser }
    }

    // If user doesn't exist at all (shouldn't happen with Better Auth, but handle it)
    // Better Auth should have created the user record, so this is a fallback
    console.warn('User not found in database after Better Auth session. This should not happen.')
    return { status: 404 }
    
  } catch (error) {
    console.log('🔴 ERROR in onAuthenticateUser:', error)
    return { status: 500 }
  }
}

export const getNotifications = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return { status: 404 }
    const notifications = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    })

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications }
    return { status: 404, data: [] }
  } catch (error) {
    return { status: 400, data: [] }
  }
}

export const searchUsers = async (query: string) => {
  try {
    const user = await getCurrentUser()
    if (!user) return { status: 404 }

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ id: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    })

    if (users && users.length > 0) {
      return { status: 200, data: users }
    }

    return { status: 404, data: undefined }
  } catch (error) {
    return { status: 500, data: undefined }
  }
}

type PaymentHistoryItem = {
  planType: 'PRO' | 'FREE'
  amount: number
  billingPeriod: string
  createdAt: string
}

type PaymentData = {
  data?: {
    subscription?: {
      plan: 'PRO' | 'FREE'
      payments: PaymentHistoryItem[]
    }
  }
  status: number
}

export const getPaymentInfo = async (): Promise<PaymentData> => {
  try {
    const user = await getCurrentUser()
    if (!user) return { status: 404, data: undefined }

    const payment = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        subscription: {
          select: { 
            plan: true,
            payments: {
              orderBy: {
                createdAt: 'desc'
              },
              select: {
                planType: true,
                amount: true,
                billingPeriod: true,
                createdAt: true
              }
            }
          },
        },
      },
    })
    
    if (payment?.subscription) {
      return { 
        status: 200, 
        data: {
          subscription: {
            plan: payment.subscription.plan as 'FREE' | 'PRO',
            payments: payment.subscription.payments.map(p => ({
              ...p,
              planType: p.planType as 'FREE' | 'PRO',
              createdAt: p.createdAt.toISOString()
            }))
          }
        }
      }
    }
    return { status: 404, data: undefined }
  } catch (error) {
    return { status: 400, data: undefined }
  }
}

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await getCurrentUser()

    if (!user) return { status: 404 }

    const view = await client.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstView: state,
      },
    })

    if (view) {
      return { status: 200, data: 'Setting updated' }
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const getFirstView = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return { status: 404 }
    const userData = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        firstView: true,
      },
    })
    if (userData) {
      return { status: 200, data: userData.firstView }
    }
    return { status: 400, data: false }
  } catch (error) {
    return { status: 400 }
  }
}

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      })
      if (reply) {
        return { status: 200, data: 'Reply posted' }
      }
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    })
    if (newComment) return { status: 200, data: 'New comment added' }
  } catch (error) {
    return { status: 400 }
  }
}

export const getUserProfile = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return { status: 404 }
    const profileIdAndImage = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    })

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage }
  } catch (error) {
    return { status: 400 }
  }
}

export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    })

    return { status: 200, data: comments }
  } catch (error) {
    return { status: 400 }
  }
}

export const inviteMembers = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const user = await getCurrentUser()
    if (!user) return { status: 404 }
    const senderInfo = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    })
    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      })
      if (workspace) {
        const invitation = await client.invite.create({
          data: {
            senderId: senderInfo.id,
            recieverId,
            workSpaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        })

        await client.user.update({
          where: {
            id: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.name || 'User'} invited ${senderInfo.firstname} into ${workspace.name}`,
              },
            },
          },
        })
        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            email,
            'You got an invitation',
            `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          )

          transporter.sendMail(mailOptions, (error: Error | null) => {
            if (error) {
              console.log('🔴', error.message)
            } else {
              console.log('✅ Email send')
            }
          })
          return { status: 200, data: 'Invite sent' }
        }
        return { status: 400, data: 'invitation failed' }
      }
      return { status: 404, data: 'workspace not found' }
    }
    return { status: 404, data: 'recipient not found' }
  } catch (error) {
    console.log(error)
    return { status: 400, data: 'Oops! something went wrong' }
  }
}

export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await getCurrentUser()
    if (!user)
      return {
        status: 404,
      }
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        reciever: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!invitation || user.id !== invitation.reciever?.id) return { status: 401 }
    const acceptInvite = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    })

    const updateMember = client.user.update({
      where: {
        id: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    })

    const membersTransaction = await client.$transaction([
      acceptInvite,
      updateMember,
    ])

    if (membersTransaction) {
      return { status: 200 }
    }
    return { status: 400 }
  } catch (error) {
    return { status: 400 }
  }
}

const getBillingPeriodFromSession = (session: Stripe.Checkout.Session): 'annual' | 'monthly' => {
  const lineItems = session.line_items?.data || []
  for (const item of lineItems) {
    const interval = item.price?.recurring?.interval
    if (interval === 'year') return 'annual'
  }
  return 'monthly'
}

export const completeSubscription = async (session_id: string) => {
  try {
    const user = await getCurrentUser()
    if (!user) return { status: 404 }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.recurring']
    })
    if (session) {
      const customer = await client.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: 'PRO',
                payments: {
                  create: {
                    planType: 'PRO',
                    amount: session.amount_total ? session.amount_total / 100 : 29,
                    billingPeriod: getBillingPeriodFromSession(session)
                  }
                }
              },
            },
          },
        },
      })
      if (customer) {
        return { status: 200 }
      }
    }
    return { status: 404 }
  } catch (error) {
    return { status: 400 }
  }
}
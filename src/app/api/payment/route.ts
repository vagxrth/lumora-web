import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string)

export async function GET() {
  const authSession = await auth.api.getSession({
    headers: await headers()
  })
  if (!authSession?.user) return NextResponse.json({ status: 404 })
  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID
  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?cancel=true`,
  })

  if (stripeSession) {
    return NextResponse.json({
      status: 200,
      session_url: stripeSession.url,
      customer_id: stripeSession.customer,
    })
  }

  return NextResponse.json({ status: 400 })
}
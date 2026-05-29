import Stripe from 'stripe'

import env from '#start/env'

let client: Stripe | null = null

export function getStripe() {
  const secretKey = env.get('STRIPE_SECRET_KEY')
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  client ??= new Stripe(secretKey)
  return client
}

export function requireWebhookSecret() {
  const secret = env.get('STRIPE_WEBHOOK_SECRET')
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }
  return secret
}

import env from '#start/env'

export type PlanId = 'pro'

export const PLANS = {
  pro: {
    id: 'pro' as const,
    name: 'Pro',
    description: 'Full access to all features',
    priceLabel: '$19/mo',
    priceId: () => env.get('STRIPE_PRICE_PRO'),
  },
} satisfies Record<
  PlanId,
  {
    id: PlanId
    name: string
    description: string
    priceLabel: string
    priceId: () => string | undefined
  }
>

export function isActiveSubscription(status: string | null) {
  return status === 'active' || status === 'trialing'
}

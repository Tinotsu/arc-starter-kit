import type Stripe from 'stripe'

import { HttpContext } from '@adonisjs/core/http'

import User from '#identity/models/user'
import env from '#start/env'
import { PLANS, type PlanId } from '../config/plans.js'
import { checkoutValidator } from '../validators/billing.js'
import { getStripe, requireWebhookSecret } from '../services/stripe_service.js'

export default class BillingController {
  async checkout({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { plan } = await request.validateUsing(checkoutValidator)
    const stripe = getStripe()
    const priceId = PLANS[plan].priceId()

    if (!priceId) {
      throw new Error(`Stripe price is not configured for plan "${plan}"`)
    }

    const customerId = await this.ensureCustomer(stripe, user)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.get('FRONTEND_URL')}/dashboard?checkout=success`,
      cancel_url: `${env.get('FRONTEND_URL')}/pricing?checkout=canceled`,
      metadata: {
        userId: user.id,
        plan,
      },
    })

    if (!session.url) {
      throw new Error('Failed to create Stripe checkout session')
    }

    return { url: session.url }
  }

  async portal({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const stripe = getStripe()
    const customerId = await this.ensureCustomer(stripe, user)

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.get('FRONTEND_URL')}/dashboard`,
    })

    return { url: session.url }
  }

  async webhook({ request, response }: HttpContext) {
    const stripe = getStripe()
    const signature = request.header('stripe-signature')
    const rawBody = await request.raw()

    if (!signature || !rawBody) {
      return response.badRequest({ error: 'Missing Stripe signature or body' })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, requireWebhookSecret())
    } catch {
      return response.badRequest({ error: 'Invalid Stripe webhook signature' })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
    }

    return { received: true }
  }

  private async ensureCustomer(stripe: Stripe, user: User) {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId
    }

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName ?? undefined,
      metadata: { userId: user.id },
    })

    user.stripeCustomerId = customer.id
    await user.save()

    return customer.id
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId
    const plan = session.metadata?.plan as PlanId | undefined

    if (!userId) {
      return
    }

    const user = await User.find(userId)
    if (!user) {
      return
    }

    if (typeof session.customer === 'string') {
      user.stripeCustomerId = session.customer
    }

    if (typeof session.subscription === 'string') {
      user.stripeSubscriptionId = session.subscription
    }

    if (plan && plan in PLANS) {
      user.plan = plan
    }

    await user.save()

    if (typeof session.subscription === 'string') {
      const stripe = getStripe()
      const subscription = await stripe.subscriptions.retrieve(session.subscription)
      await this.syncSubscription(user, subscription)
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const user = await this.findUserForSubscription(subscription)
    if (!user) {
      return
    }

    await this.syncSubscription(user, subscription)
  }

  private async findUserForSubscription(subscription: Stripe.Subscription) {
    const customerId =
      typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

    const user = await User.query().where('stripe_customer_id', customerId).first()
    if (user) {
      return user
    }

    const userId = subscription.metadata.userId
    if (userId) {
      return User.find(userId)
    }

    return null
  }

  private async syncSubscription(user: User, subscription: Stripe.Subscription) {
    user.stripeSubscriptionId = subscription.id
    user.subscriptionStatus = subscription.status

    const priceId = subscription.items.data[0]?.price.id
    const plan = (Object.keys(PLANS) as PlanId[]).find(id => PLANS[id].priceId() === priceId)
    if (plan) {
      user.plan = plan
    }

    await user.save()
  }
}

import type { NextFn } from '@adonisjs/core/types/http'
import type { HttpContext } from '@adonisjs/core/http'

import { isActiveSubscription } from '../config/plans.js'

export default class RequireSubscriptionMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.getUserOrFail()

    if (!isActiveSubscription(user.subscriptionStatus)) {
      return response.status(402).send({
        error: 'An active subscription is required',
      })
    }

    return next()
  }
}

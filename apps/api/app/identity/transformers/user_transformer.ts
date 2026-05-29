import { BaseTransformer } from '@adonisjs/core/transformers'

import { isActiveSubscription } from '#billing/config/plans'

import type User from '../models/user.ts'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const user = this.pick(this.resource, [
      'id',
      'fullName',
      'email',
      'plan',
      'subscriptionStatus',
      'createdAt',
      'updatedAt',
    ])

    return {
      ...user,
      isSubscribed: isActiveSubscription(this.resource.subscriptionStatus),
    }
  }
}

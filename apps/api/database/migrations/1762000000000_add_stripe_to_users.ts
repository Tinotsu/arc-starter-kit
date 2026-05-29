import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, table => {
      table.string('stripe_customer_id').nullable()
      table.string('stripe_subscription_id').nullable()
      table.string('subscription_status').nullable()
      table.string('plan').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('stripe_customer_id')
      table.dropColumn('stripe_subscription_id')
      table.dropColumn('subscription_status')
      table.dropColumn('plan')
    })
  }
}

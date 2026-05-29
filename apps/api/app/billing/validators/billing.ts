import vine from '@vinejs/vine'

export const checkoutValidator = vine.compile(
  vine.object({
    plan: vine.enum(['pro']),
  }),
)

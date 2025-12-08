import router from '@adonisjs/core/services/router'
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

const {
  identity: { controllers: identity },
} = controllers

router
  .group(() => {
    router.post('register', [identity.Auth, 'register'])
    router.post('login', [identity.Auth, 'login'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [identity.Auth, 'logout'])
    router.get('me', [identity.Auth, 'getMe'])
  })
  .use(middleware.auth())

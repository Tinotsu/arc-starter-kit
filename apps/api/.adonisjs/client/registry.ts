/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'

import type { ApiDefinition } from './registry.schema.tree.d.ts'
import type { Registry } from './registry.schema.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ['POST'],
    pattern: '/register',
    tokens: [{ old: '/register', type: 0, val: 'register', end: '' }],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.login': {
    methods: ['POST'],
    pattern: '/login',
    tokens: [{ old: '/login', type: 0, val: 'login', end: '' }],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.logout': {
    methods: ['POST'],
    pattern: '/logout',
    tokens: [{ old: '/logout', type: 0, val: 'logout', end: '' }],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'auth.get_me': {
    methods: ['GET', 'HEAD'],
    pattern: '/me',
    tokens: [{ old: '/me', type: 0, val: 'me', end: '' }],
    types: placeholder as Registry['auth.get_me']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}

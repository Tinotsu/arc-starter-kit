export const controllers = {
  identity: {
    controllers: {
      Auth: () => import('#app/identity/controllers/auth_controller'),
    },
  },
}

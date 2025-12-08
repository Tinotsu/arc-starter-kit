export const controllers = {
  core: {
    controllers: {
      HealthChecks: () => import('#app/core/controllers/health_checks_controller'),
    },
  },
  identity: {
    controllers: {
      Auth: () => import('#app/identity/controllers/auth_controller'),
    },
  },
}

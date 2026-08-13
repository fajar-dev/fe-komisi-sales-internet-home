export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { state } = useAuth()

    if (!state.token && to.path !== '/sign-in') {
      return navigateTo('/sign-in')
    }

    if (to.path.startsWith('/sumarry') && !state.user?.is_admin) {
      useToast().add({ title: 'Access denied', description: 'Summary dashboard is admin-only.', color: 'error' })
      return navigateTo('/')
    }
})
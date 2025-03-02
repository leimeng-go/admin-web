import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// Add the persistedstate plugin if needed
pinia.use(createPersistedState({
  storage: localStorage,
  key: (id) => `admin-web-${id}`
}))

export default pinia

// Don't export all stores here to prevent circular dependencies
// Instead, import stores directly where needed 
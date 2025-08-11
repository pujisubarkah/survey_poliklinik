import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user: any) {
      this.user = user
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },
    hydrate() {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          this.user = JSON.parse(userStr)
        }
      }
    },
    logout() {
      this.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    }
  }
})
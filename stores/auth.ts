
import { defineStore } from 'pinia'
import helpers from '@/utils/helpers'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: typeof localStorage !== 'undefined' ? localStorage.getItem('admin-token') : null,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async login(payload: any) {
            this.loading = true
            this.error = null

            // Use helpers.apiCall which handles the fetch wrapper
            // passing 'json' option ensures Content-Type is application/json
            const { ok, json } = await helpers.apiCall('/admin/auth/login', {
                method: 'POST',
                json: payload,
                sendToken: false
            })

            this.loading = false
            console.log(json,"json ")
            if (ok) {
                const { token } = json
                this.token = token
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('admin-token', token)
                }

                // Fetch profile to populate data store
                await helpers.fetchProfile()
                return true
            } else {
                this.error = json.message || 'Login failed'
                return false
            }
        },

        logout() {
            this.token = null
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('admin-token')
            }
            helpers.logout()
        }
    }
})

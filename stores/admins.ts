import { defineStore } from 'pinia'
import helpers from '@/utils/helpers'

export const useAdminsStore = defineStore('admins', {
    state: () => ({
        admins: [] as any[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchAdmins() {
            this.loading = true
            this.error = null
            // The user provided API is GET /admin which returns { admins: [...] }
            const { ok, json } = await helpers.apiCall('/admin', {
                method: 'GET'
            })
            this.loading = false
            if (ok) {
                // API response: { admins: [...] }
                this.admins = json.admins || []
            } else {
                this.error = json.message || 'Failed to fetch admins'
            }
        },

        async createAdmin(payload: any) {
            this.loading = true
            this.error = null

            // The user provided API is POST /admin/auth/register
            const response = await helpers.apiCall('/admin/auth/register', {
                method: 'POST',
                json: payload
            })

            this.loading = false

            if (response.ok) {
                await this.fetchAdmins() // Refresh list
                return { success: true, message: response.json.message }
            } else {
                this.error = response.json.message || 'Failed to create admin'
                return { success: false, message: this.error }
            }
        }
    }
})

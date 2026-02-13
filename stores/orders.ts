import { defineStore } from 'pinia'
import helpers from '~/utils/helpers'

export interface UserDetails {
    name: string
    email: string
    phone: string
    country: string
    state?: string
    timezone: number
}

export interface Pricing {
    country: string
    value: number
}

export interface ProductSnapshot {
    _id: string
    label: string
    parent: string
    root: string
    minimumDelayInDays?: number
    pricings: Pricing[]
    photos: any[]
    stripeLink: string
    createdAt: string
    updatedAt: string
}

export interface Address {
    country: string
    state?: string
    city: string
    line1: string
    line2?: string
    pin: string
}

export interface PersonDetails {
    name: string
    age: number
    photo: string
    address: Address
    relation?: string
}

export interface OrderData {
    productSnapshot: ProductSnapshot
    personDetails: PersonDetails | PersonDetails[]
}

export interface Order {
    _id: string
    userDetails: UserDetails
    product: string
    date: string
    time: string
    data: OrderData
    userComment?: string
    paymentLink: string
    amount: number
    currency: string
    paymentStatus: string
    status: string
    files: string[]
    createdAt: string
    updatedAt: string
}

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [] as Order[],
        totalCount: 0,
        isLoading: false,
        currentOrder: null as Order | null
    }),

    actions: {
        async fetchOrders(page: number = 1, limit: number = 10) {
            this.isLoading = true
            try {
                const { ok, json } = await helpers.apiCall(`/admin/orders?page=${page}&limit=${limit}`)
                if (ok) {
                    this.orders = json.orders
                    this.totalCount = json.count
                } else {
                    useSnackStore().error('Failed to fetch orders')
                }
            } catch (error) {
                console.error('Error fetching orders:', error)
                useSnackStore().error('An error occurred while fetching orders')
            } finally {
                this.isLoading = false
            }
        },

        async fetchOrderById(id: string) {
            const existingOrder = this.orders.find(o => o._id === id)
            if (existingOrder) {
                this.currentOrder = existingOrder
            }

            this.isLoading = true
            try {
                // The direct ID endpoint /admin/orders/:id is not allowing GET (405)
                // So we fallback to searching the list.
                const { ok, json } = await helpers.apiCall(`/admin/orders?limit=1&page=1&search=${id}`)

                if (ok && json.orders && json.orders.length > 0) {
                    // Find exact match just in case search is fuzzy
                    const match = json.orders.find((o: Order) => o._id === id)

                    if (match) {
                        this.currentOrder = match
                        return match
                    }
                }

                if (existingOrder) return existingOrder
                useSnackStore().error('Order not found')
                return null
            } catch (error) {
                console.error('Error fetching order:', error)
                useSnackStore().error('An error occurred while fetching order details')
                return null
            } finally {
                this.isLoading = false
            }
        },

        async fetchCheckoutSessions(email: string, limit: number = 20, starting_after?: string) {
            const query = new URLSearchParams({ email, limit: limit.toString() })
            if (starting_after) query.append('starting_after', starting_after)

            return await helpers.apiCall(`/admin/orders/checkout-sessions?${query.toString()}`)
        },

        async completePayment(id: string) {
            const { ok, json } = await helpers.apiCall(`/admin/orders/${id}/complete-payment`, { method: 'POST' })
            if (ok) {
                useSnackStore().success(json.message)
                await this.fetchOrderById(id)
            } else {
                useSnackStore().error(json.message || 'Failed to complete payment')
            }
            return ok
        },

        async failPayment(id: string) {
            const { ok, json } = await helpers.apiCall(`/admin/orders/${id}/fail-payment`, { method: 'POST' })
            if (ok) {
                useSnackStore().success(json.message)
                await this.fetchOrderById(id)
            } else {
                useSnackStore().error(json.message || 'Failed to fail payment')
            }
            return ok
        },

        async refundOrder(id: string, refundAmount: number, comments: string) {
            const { ok, json } = await helpers.apiCall(`/admin/orders/${id}/refund`, {
                method: 'POST',
                json: { refundAmount, comments }
            })
            if (ok) {
                useSnackStore().success(json.message)
                await this.fetchOrderById(id)
            } else {
                useSnackStore().error(json.message || 'Failed to refund order')
            }
            return ok
        },

        async scheduleOrder(id: string, schedule: string) {
            const { ok, json } = await helpers.apiCall(`/admin/orders/${id}/schedule`, {
                method: 'POST',
                json: { schedule }
            })
            if (ok) {
                useSnackStore().success(json.message)
                await this.fetchOrderById(id)
            } else {
                useSnackStore().error(json.message || 'Failed to schedule order')
            }
            return ok
        },

        async appointAdmin(id: string, adminId: string, comments: string) {
            const { ok, json } = await helpers.apiCall(`/admin/orders/${id}/appoint-admin`, {
                method: 'POST',
                json: { admin: adminId, comments }
            })
            if (ok) {
                useSnackStore().success(json.message)
                await this.fetchOrderById(id)
            } else {
                useSnackStore().error(json.message || 'Failed to appoint admin')
            }
            return ok
        },

        async completeOrder(id: string, finalComments: string) {
            const { ok, json } = await helpers.apiCall(`/admin/orders/${id}/complete`, {
                method: 'POST',
                json: { finalComments }
            })
            if (ok) {
                useSnackStore().success(json.message)
                await this.fetchOrderById(id)
            } else {
                useSnackStore().error(json.message || 'Failed to complete order')
            }
            return ok
        }
    }
})

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
            // First check if the order is already in the list
            const existingOrder = this.orders.find(o => o._id === id)
            if (existingOrder) {
                this.currentOrder = existingOrder
                return existingOrder
            }

            this.isLoading = true
            try {
                // Try fetching specific order if endpoint exists, otherwise we might need to rely on the list
                // Since user didn't provide specific ID endpoint, I'll assume /admin/orders/:id might work or I filtered from list if permitted
                // But for now, let's try to fetch the list and find it if API doesn't support direct ID fetch yet
                // OR, let's assume standard REST pattern /admin/orders/:id exists.
                // If it fails, I'll have to fetch the list and filter (which is inefficient but valid fallback).
                // Actually, let's try to fetch all or a large list if needed? No, that's bad.
                // usage: /api/admin/orders/:id
                const { ok, json } = await helpers.apiCall(`/admin/orders/${id}`)
                if (ok) {
                    this.currentOrder = json
                    return json
                } else {
                    // Fallback or error
                    useSnackStore().error('Failed to fetch order details')
                    return null
                }
            } catch (error) {
                console.error('Error fetching order:', error)
                useSnackStore().error('An error occurred while fetching order details')
                return null
            } finally {
                this.isLoading = false
            }
        }
    }
})

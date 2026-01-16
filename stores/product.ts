import { defineStore } from 'pinia'

export interface Product {
    id: string
    name: string
    category: string
    price: number
    description: string
    status: 'Active' | 'Inactive'
    image?: string
    hasOrders: boolean // Mock property to test deletion logic
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [
            {
                id: '1',
                name: 'Personalized Astrology Report',
                category: 'Astrology',
                price: 1000,
                description: 'Detailed analysis of your birth chart.',
                status: 'Active',
                hasOrders: true
            },
            {
                id: '2',
                name: 'Ganesh Yagya',
                category: 'Yagya',
                price: 5000,
                description: 'Powerful ritual for removing obstacles.',
                status: 'Active',
                hasOrders: false
            },
            {
                id: '3',
                name: 'Crystal Healing Session',
                category: 'Healings',
                price: 2500,
                description: 'Rebalance your energy with crystals.',
                status: 'Inactive',
                hasOrders: true
            },
            {
                id: '4',
                name: 'Home Vastu Consultation',
                category: 'Vaastu',
                price: 15000,
                description: 'Expert advice for your home layout.',
                status: 'Active',
                hasOrders: false
            }
        ] as Product[]
    }),

    actions: {
        addProduct(product: Omit<Product, 'id' | 'hasOrders'>) {
            const newId = (this.products.length + 1).toString()
            this.products.push({
                ...product,
                id: newId,
                hasOrders: false // New products have no orders initially
            })
        },

        updateProduct(id: string, updatedData: Partial<Product>) {
            const index = this.products.findIndex(p => p.id === id)
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...updatedData }
            }
        },

        deleteProduct(id: string): { success: boolean, message: string } {
            const product = this.products.find(p => p.id === id)
            if (!product) return { success: false, message: 'Product not found' }

            if (product.hasOrders) {
                return { success: false, message: 'Cannot delete product associated with existing orders.' }
            }

            this.products = this.products.filter(p => p.id !== id)
            return { success: true, message: 'Product deleted successfully.' }
        },

        getProductById(id: string) {
            return this.products.find(p => p.id === id)
        }
    }
})

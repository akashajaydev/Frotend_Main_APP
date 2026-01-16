import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
    const drawer = ref(false)

    function toggleDrawer() {
        drawer.value = !drawer.value
    }

    return {
        drawer,
        toggleDrawer
    }
})

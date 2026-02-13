<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

const ordersStore = useOrdersStore()
const search = ref('')
const page = ref(1)
const itemsPerPage = ref(10)

// Initial fetch is handled by @update:options on mount or we can toggle it manually if needed, 
// but usually the table triggers it efficiently. 
// However, to be safe and explicit:
onMounted(() => {
    loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
})

function loadItems({ page: newPage, itemsPerPage: newItemsPerPage }: { page: number, itemsPerPage: number }) {
    page.value = newPage
    itemsPerPage.value = newItemsPerPage
    ordersStore.fetchOrders(newPage, newItemsPerPage)
}

const headers = [
    { title: 'S.No', key: 'sno', align: 'start', sortable: false },
    { title: 'Order ID', key: '_id', align: 'start' },
    { title: 'Customer', key: 'userDetails.name', align: 'start' },
    { title: 'Date', key: 'date', align: 'start' },
    { title: 'Amount', key: 'amount', align: 'end' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
] as const

function viewOrder(item: any) {
    navigateTo(`/orders/${item._id}`)
}

function formatDate(dateString: string) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency || 'INR'
    }).format(amount)
}

function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
        case 'completed': return 'success'
        case 'processing': return 'warning'
        case 'cancelled': return 'error'
        case 'pending': return 'info'
        case 'payment-pending': return 'warning'
        default: return 'grey'
    }
}
</script>

<template>
    <v-container fluid class="pa-6">
        <div class="mb-6 d-flex justify-space-between align-center">
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">Orders</h1>
                <p class="text-subtitle-1 text-grey">Manage and view all customer orders</p>
            </div>
            <v-btn
                icon
                color="primary"
                variant="tonal"
                @click="loadItems({ page, itemsPerPage })"
                :loading="ordersStore.isLoading"
            >
                <v-icon>mdi-refresh</v-icon>
                <v-tooltip activator="parent" location="bottom">Refresh Orders</v-tooltip>
            </v-btn>
        </div>

        <v-card elevation="2" rounded="xl">
            <v-card-title class="pa-4">
                <v-row align="center">
                    <v-col cols="12" sm="4">
                        <v-text-field
                            v-model="search"
                            prepend-inner-icon="mdi-magnify"
                            label="Search Orders"
                            single-line
                            hide-details
                            variant="outlined"
                            density="compact"
                            rounded="lg"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>
            
            <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                v-model:page="page"
                :headers="headers"
                :items-length="ordersStore.totalCount"
                :items="ordersStore.orders"
                :search="search"
                :loading="ordersStore.isLoading"
                hover
                class="pa-2"
                @update:options="loadItems"
            >
                <!-- Custom Slot for S.No -->
                <template v-slot:item.sno="{ index }">
                    <span class="text-grey-darken-1 font-weight-medium">
                        {{ (page - 1) * itemsPerPage + index + 1 }}
                    </span>
                </template>

                <!-- Custom Slot for Status -->
                <template v-slot:item.status="{ item }">
                    <v-chip
                        :color="getStatusColor(item.status)"
                        size="small"
                        label
                        variant="tonal"
                        class="font-weight-medium"
                    >
                        {{ item.status }}
                    </v-chip>
                </template>

                 <!-- Custom Slot for Actions -->
                 <template v-slot:item.actions="{ item }">
                    <v-btn
                        icon
                        variant="text"
                        color="primary"
                        size="small"
                        @click="viewOrder(item)"
                    >
                        <v-icon>mdi-eye</v-icon>
                        <v-tooltip activator="parent" location="top">View Details</v-tooltip>
                    </v-btn>
                </template>

                <!-- Custom Slot for Amount -->
                <template v-slot:item.amount="{ item }">
                    <span class="font-weight-bold text-grey-darken-2">{{ formatCurrency(item.amount, item.currency) }}</span>
                </template>

                 <!-- Custom Slot for Order ID -->
                 <template v-slot:item.id="{ item }">
                    <span class="font-weight-medium text-primary">#{{ item._id.slice(-6).toUpperCase() }}</span>
                </template>

                <!-- Custom Slot for Date -->
                <template v-slot:item.date="{ item }">
                    {{ formatDate(item.date) }}
                </template>

            </v-data-table-server>
        </v-card>
    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>

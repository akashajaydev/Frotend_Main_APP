<script setup lang="ts">
const orders = ref([
    {
        id: '#ORD-7829',
        customer: 'John Doe',
        date: '2023-10-25',
        amount: '₹12,000',
        status: 'Completed',
        statusColor: 'success'
    },
    {
        id: '#ORD-7828',
        customer: 'Jane Smith',
        date: '2023-10-24',
        amount: '₹8,550',
        status: 'Processing',
        statusColor: 'warning'
    },
    {
        id: '#ORD-7827',
        customer: 'Michael Brown',
        date: '2023-10-24',
        amount: '₹24,000',
        status: 'Completed',
        statusColor: 'success'
    },
    {
        id: '#ORD-7826',
        customer: 'Emily Davis',
        date: '2023-10-23',
        amount: '₹5,000',
        status: 'Cancelled',
        statusColor: 'error'
    },
    {
        id: '#ORD-7825',
        customer: 'Chris Wilson',
        date: '2023-10-23',
        amount: '₹17,500',
        status: 'Processing',
        statusColor: 'warning'
    },
    {
        id: '#ORD-7824',
        customer: 'Sarah Johnson',
        date: '2023-10-22',
        amount: '₹9,200',
        status: 'Pending',
        statusColor: 'info'
    },
    {
        id: '#ORD-7823',
        customer: 'David Lee',
        date: '2023-10-22',
        amount: '₹15,000',
        status: 'Completed',
        statusColor: 'success'
    },
    {
        id: '#ORD-7822',
        customer: 'Lisa Taylor',
        date: '2023-10-21',
        amount: '₹6,800',
        status: 'Failed',
        statusColor: 'error'
    }
])

const headers = [
    { title: 'Order ID', key: 'id', align: 'start' },
    { title: 'Customer', key: 'customer', align: 'start' },
    { title: 'Date', key: 'date', align: 'start' },
    { title: 'Amount', key: 'amount', align: 'end' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
] as const

const search = ref('')

function viewOrder(item: any) {
    navigateTo(`/orders/${item.id.replace('#', '')}`)
}
</script>

<template>
    <v-container fluid class="pa-6">
        <div class="mb-6 d-flex justify-space-between align-center">
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">Orders</h1>
                <p class="text-subtitle-1 text-grey">Manage and view all customer orders</p>
            </div>
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
            
            <v-data-table
                :headers="headers"
                :items="orders"
                :search="search"
                hover
                class="pa-2"
            >
                <!-- Custom Slot for Status -->
                <template v-slot:item.status="{ item }">
                    <v-chip
                        :color="item.statusColor"
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
                    <span class="font-weight-bold text-grey-darken-2">{{ item.amount }}</span>
                </template>

                 <!-- Custom Slot for Order ID -->
                 <template v-slot:item.id="{ item }">
                    <span class="font-weight-medium text-primary">{{ item.id }}</span>
                </template>

            </v-data-table>
        </v-card>
    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>

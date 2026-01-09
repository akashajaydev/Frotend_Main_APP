<script setup lang="ts">
const stats = [
    {
        title: 'Total Sales',
        value: '$120,450',
        icon: 'mdi-currency-usd',
        color: 'success',
        trend: '+12%',
        trendColor: 'success'
    },
    {
        title: 'Total Orders',
        value: '3,450',
        icon: 'mdi-cart',
        color: 'primary',
        trend: '+5%',
        trendColor: 'success'
    },
    {
        title: 'New Users',
        value: '1,230',
        icon: 'mdi-account-group',
        color: 'info',
        trend: '+18%',
        trendColor: 'success'
    },
    {
        title: 'Pending Issues',
        value: '24',
        icon: 'mdi-alert-circle',
        color: 'warning',
        trend: '-2%',
        trendColor: 'error'
    }
]

const recentOrders = [
    {
        id: '#ORD-7829',
        customer: 'John Doe',
        date: '2023-10-25',
        amount: '$120.00',
        status: 'Completed',
        statusColor: 'success'
    },
    {
        id: '#ORD-7828',
        customer: 'Jane Smith',
        date: '2023-10-24',
        amount: '$85.50',
        status: 'Processing',
        statusColor: 'warning'
    },
    {
        id: '#ORD-7827',
        customer: 'Michael Brown',
        date: '2023-10-24',
        amount: '$240.00',
        status: 'Completed',
        statusColor: 'success'
    },
    {
        id: '#ORD-7826',
        customer: 'Emily Davis',
        date: '2023-10-23',
        amount: '$50.00',
        status: 'Cancelled',
        statusColor: 'error'
    },
    {
        id: '#ORD-7825',
        customer: 'Chris Wilson',
        date: '2023-10-23',
        amount: '$175.00',
        status: 'Processing',
        statusColor: 'warning'
    }
]
</script>

<template>
    <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Dashboard</h1>
            <p class="text-subtitle-1 text-grey">Overview of your store's performance</p>
        </div>

        <!-- Stats Cards -->
        <v-row>
            <v-col cols="12" sm="6" lg="3" v-for="(stat, index) in stats" :key="index">
                <v-card elevation="2" rounded="xl" class="pa-4">
                    <div class="d-flex justify-space-between align-start">
                        <div>
                            <p class="text-caption text-uppercase font-weight-bold text-grey">{{ stat.title }}</p>
                            <h2 class="text-h4 font-weight-bold mt-1 text-grey-darken-3">{{ stat.value }}</h2>
                        </div>
                        <v-avatar :color="stat.color" variant="tonal" rounded="lg">
                            <v-icon :icon="stat.icon" size="large"></v-icon>
                        </v-avatar>
                    </div>
                    <div class="d-flex align-center mt-4">
                        <v-chip size="x-small" :color="stat.trendColor" class="font-weight-bold me-2" label>
                            {{ stat.trend }}
                        </v-chip>
                        <span class="text-caption text-grey">since last month</span>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Charts & Tables -->
        <v-row class="mt-4">
            <!-- Sales Overview (Chart Placeholder) -->
            <v-col cols="12" lg="8">
                <v-card elevation="2" rounded="xl" height="400">
                    <v-card-title class="d-flex justify-space-between align-center pa-4">
                        <span class="text-h6 font-weight-medium">Sales Overview</span>
                        <v-btn icon="mdi-dots-vertical" variant="text" size="small" color="grey"></v-btn>
                    </v-card-title>
                    <v-card-text class="d-flex align-center justify-center fill-height pb-12">
                         <div class="text-center text-grey">
                            <v-icon icon="mdi-chart-bar" size="64" class="mb-2 opacity-50"></v-icon>
                            <p>Chart Visualization Component Placeholder</p>
                         </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Recent Orders -->
            <v-col cols="12" lg="4">
                <v-card elevation="2" rounded="xl" height="400">
                    <v-card-title class="pa-4">
                        <span class="text-h6 font-weight-medium">Recent Orders</span>
                    </v-card-title>
                    <v-table density="compact" class="pa-2">
                        <thead>
                            <tr>
                                <th class="text-left text-grey">Order ID</th>
                                <th class="text-center text-grey">Status</th>
                                <th class="text-right text-grey">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in recentOrders" :key="order.id">
                                <td class="font-weight-medium text-grey-darken-2">{{ order.id }}</td>
                                <td class="text-center">
                                    <v-chip size="x-small" :color="order.statusColor" class="font-weight-bold" label variant="flat">
                                        {{ order.status }}
                                    </v-chip>
                                </td>
                                <td class="text-right font-weight-bold text-grey-darken-1">{{ order.amount }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <v-divider></v-divider>
                    <v-card-actions class="justify-center pa-2">
                        <v-btn variant="text" color="primary" size="small" append-icon="mdi-arrow-right">View All Orders</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>
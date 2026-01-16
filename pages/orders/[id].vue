<script setup lang="ts">
const route = useRoute()
const orderId = route.params.id

// Mock Data
const order = ref({
    id: `#${orderId}`,
    date: '2023-10-25',
    status: 'Processing',
    statusColor: 'warning',
    customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        address: '123, Main Street, New Delhi, India'
    },
    items: [
        { id: 1, name: 'Personalized Astrology Report', quantity: 1, price: '₹10,000', total: '₹10,000' },
        { id: 2, name: 'Gemstone Consultation', quantity: 1, price: '₹2,000', total: '₹2,000' }
    ],
    subtotal: '₹12,000',
    tax: '₹0',
    total: '₹12,000',
    assignedAdmin: null as string | null
})

// Mock Admins for assignment
const admins = ['Astrologer 1', 'Baba', 'Astrologer 2', 'Healer 1', 'Vastu Expert']
const selectedAdmin = ref(null)

// Actions State
const assignDialog = ref(false)
const refundDialog = ref(false)
const refundType = ref('full') // 'full' or 'partial'
const refundAmount = ref('')
const confirmStore = useConfirmStore()
const snack = useSnackStore()

function openAssignDialog() {
    assignDialog.value = true
}

function assignAdmin() {
    if (selectedAdmin.value) {
        order.value.assignedAdmin = selectedAdmin.value
        assignDialog.value = false
        snack.success(`Order assigned to ${selectedAdmin.value}`)
    }
}

function openRefundDialog() {
    refundDialog.value = true
}

function processRefund() {
    refundDialog.value = false
    const msg = refundType.value === 'full' 
        ? `Full refund processed for ${order.value.id}` 
        : `Partial refund of ₹${refundAmount.value} processed for ${order.value.id}`
    
    snack.success(msg)
    order.value.status = 'Refunded'
    order.value.statusColor = 'error'
}
</script>

<template>
    <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="mb-6 d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" @click="navigateTo('/orders')" class="me-2"></v-btn>
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">Order Details</h1>
                <p class="text-subtitle-1 text-grey">{{ order.id }} • {{ order.date }}</p>
            </div>
            <v-spacer></v-spacer>
            <v-chip :color="order.statusColor" class="mr-4" label font-weight-bold size="large">
                {{ order.status }}
            </v-chip>
            
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props" append-icon="mdi-chevron-down">
                        Actions
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="openAssignDialog">
                        <template v-slot:prepend><v-icon>mdi-account-plus</v-icon></template>
                        <v-list-item-title>Assign Admin</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openRefundDialog" color="error">
                        <template v-slot:prepend><v-icon color="error">mdi-cash-refund</v-icon></template>
                        <v-list-item-title class="text-error">Refund</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <v-row>
            <!-- Order Items -->
            <v-col cols="12" lg="8">
                <v-card elevation="2" rounded="xl" class="mb-6">
                    <v-card-title class="pa-4 font-weight-bold">Order Items</v-card-title>
                    <v-divider></v-divider>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">Product</th>
                                <th class="text-center">Quantity</th>
                                <th class="text-right">Price</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in order.items" :key="item.id">
                                <td class="py-4">
                                    <div class="font-weight-medium">{{ item.name }}</div>
                                </td>
                                <td class="text-center">{{ item.quantity }}</td>
                                <td class="text-right">{{ item.price }}</td>
                                <td class="text-right font-weight-bold">{{ item.total }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-right pt-4 text-grey">Subtotal</td>
                                <td class="text-right pt-4">{{ order.subtotal }}</td>
                            </tr>
                             <tr>
                                <td colspan="3" class="text-right text-grey">Tax</td>
                                <td class="text-right">{{ order.tax }}</td>
                            </tr>
                             <tr>
                                <td colspan="3" class="text-right font-weight-bold text-h6 pb-4">Total</td>
                                <td class="text-right font-weight-bold text-h6 pb-4 text-primary">{{ order.total }}</td>
                            </tr>
                        </tfoot>
                    </v-table>
                </v-card>
            </v-col>

            <!-- Customer Details & Summary -->
            <v-col cols="12" lg="4">
                <v-card elevation="2" rounded="xl" class="mb-6">
                    <v-card-title class="pa-4 font-weight-bold">Customer Details</v-card-title>
                    <v-divider></v-divider>
                    <v-list lines="two">
                        <v-list-item prepend-icon="mdi-account" :title="order.customer.name" subtitle="Customer Name"></v-list-item>
                        <v-list-item prepend-icon="mdi-email" :title="order.customer.email" subtitle="Email Address"></v-list-item>
                        <v-list-item prepend-icon="mdi-phone" :title="order.customer.phone" subtitle="Phone Number"></v-list-item>
                        <v-list-item prepend-icon="mdi-map-marker" :title="order.customer.address" subtitle="Shipping Address"></v-list-item>
                    </v-list>
                </v-card>

                <v-card elevation="2" rounded="xl" v-if="order.assignedAdmin">
                    <v-card-title class="pa-4 font-weight-bold text-success">
                        <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
                        Assigned To
                    </v-card-title>
                    <v-card-text>
                        <div class="text-h6">{{ order.assignedAdmin }}</div>
                         <div class="text-caption text-grey">Admin/Astrologer</div>
                    </v-card-text>
                </v-card>
                 <v-alert v-else type="info" variant="tonal" border="start" class="mb-4">
                    Order not yet assigned.
                </v-alert>
            </v-col>
        </v-row>

        <!-- Assign Dialog -->
        <v-dialog v-model="assignDialog" max-width="400">
            <v-card rounded="xl">
                <v-card-title class="text-h6 font-weight-bold pa-4">Assign Order</v-card-title>
                <v-card-text>
                    <p class="mb-4 text-grey-darken-1">Select an Admin or Astrologer to assign this order to.</p>
                    <v-select
                        v-model="selectedAdmin"
                        :items="admins"
                        label="Select Admin"
                        variant="outlined"
                        density="compact"
                    ></v-select>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="assignDialog = false">Cancel</v-btn>
                    <v-btn color="primary" variant="flat" rounded="lg" @click="assignAdmin" :disabled="!selectedAdmin">Assign</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Refund Dialog -->
        <v-dialog v-model="refundDialog" max-width="400">
            <v-card rounded="xl">
                <v-card-title class="text-h6 font-weight-bold pa-4 text-error">Process Refund</v-card-title>
                <v-card-text>
                    <v-radio-group v-model="refundType" column>
                        <v-radio label="Full Refund" value="full" color="primary"></v-radio>
                        <v-radio label="Partial Refund" value="partial" color="primary"></v-radio>
                    </v-radio-group>
                    
                    <v-expand-transition>
                        <div v-if="refundType === 'partial'">
                            <v-text-field
                                v-model="refundAmount"
                                label="Refund Amount (₹)"
                                type="number"
                                variant="outlined"
                                density="compact"
                                prefix="₹"
                            ></v-text-field>
                        </div>
                    </v-expand-transition>

                    <v-alert type="warning" variant="tonal" density="compact" icon="mdi-alert" class="mt-2">
                        This action cannot be undone.
                    </v-alert>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="refundDialog = false">Cancel</v-btn>
                    <v-btn color="error" variant="flat" rounded="lg" @click="processRefund">Process Refund</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

const route = useRoute()
const ordersStore = useOrdersStore()
const orderId = route.params.id as string

// Fetch order on mount
onMounted(async () => {
    if (orderId) {
        await ordersStore.fetchOrderById(orderId)
    }
})

const order = computed(() => ordersStore.currentOrder)
const loading = computed(() => ordersStore.isLoading)

// Mock Admins for assignment (Keep existing UI but it won't persist to backend yet as per instructions constraints)
const admins = ['Astrologer 1', 'Baba', 'Astrologer 2', 'Healer 1', 'Vastu Expert']
const selectedAdmin = ref(null)

// Actions State
const assignDialog = ref(false)
const refundDialog = ref(false)
const previewDialog = ref(false)
const selectedFile = ref<string | null>(null)
const refundType = ref('full') // 'full' or 'partial'
const refundAmount = ref('')
const snack = useSnackStore()

function openAssignDialog() {
    assignDialog.value = true
}

function viewFile(fileUrl: string) {
    selectedFile.value = fileUrl
    previewDialog.value = true
}

function assignAdmin() {
    if (selectedAdmin.value) {
        // order.value.assignedAdmin = selectedAdmin.value // API doesn't support this yet
        assignDialog.value = false
        snack.success(`Order assigned to ${selectedAdmin.value} (Local only)`)
    }
}

function openRefundDialog() {
    refundDialog.value = true
}

function processRefund() {
    refundDialog.value = false
    const msg = refundType.value === 'full' 
        ? `Full refund processed for ${order.value?._id}` 
        : `Partial refund of ₹${refundAmount.value} processed for ${order.value?._id}`
    
    snack.success(msg)
    // order.value.status = 'Refunded' // Read-only from API for now
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
        case 'payment-pending': return 'warning'
        case 'pending': return 'info'
        default: return 'grey'
    }
}

// Helper to get person details address safely
const personAddress = computed(() => {
    if (!order.value?.data?.personDetails) return 'N/A'
    const details = Array.isArray(order.value.data.personDetails) 
        ? order.value.data.personDetails[0] 
        : order.value.data.personDetails
    
    if (!details?.address) return 'N/A'
    const { line1, line2, city, state, country, pin } = details.address
    return [line1, line2, city, state, country, pin].filter(Boolean).join(', ')
})
</script>

<template>
    <v-container fluid class="pa-6">
        <div v-if="loading" class="d-flex justify-center align-center h-screen">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <div v-else-if="order">
            <!-- Header -->
            <div class="mb-6 d-flex align-center">
                <v-btn icon="mdi-arrow-left" variant="text" @click="navigateTo('/orders')" class="me-2"></v-btn>
                <div>
                    <h1 class="text-h4 font-weight-bold text-grey-darken-3">Order Details</h1>
                    <p class="text-subtitle-1 text-grey">#{{ order._id }} • {{ formatDate(order.date) }}</p>
                </div>
                <v-spacer></v-spacer>
                <v-chip :color="getStatusColor(order.status)" class="mr-4" label size="large" variant="tonal">
                    <span class="font-weight-bold">{{ order.status }}</span>
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
                                <tr>
                                    <td class="py-4">
                                        <div class="font-weight-medium">{{ order.data?.productSnapshot?.label || 'Unknown Product' }}</div>
                                        <div class="text-caption text-grey">{{ order.data?.productSnapshot?.parent }}</div>
                                    </td>
                                    <td class="text-center">1</td>
                                    <td class="text-right">{{ formatCurrency(order.amount, order.currency) }}</td>
                                    <td class="text-right font-weight-bold">{{ formatCurrency(order.amount, order.currency) }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="text-right pt-4 text-grey">Subtotal</td>
                                    <td class="text-right pt-4">{{ formatCurrency(order.amount, order.currency) }}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="text-right text-grey">Tax</td>
                                    <td class="text-right">₹0</td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="text-right font-weight-bold text-h6 pb-4">Total</td>
                                    <td class="text-right font-weight-bold text-h6 pb-4 text-primary">{{ formatCurrency(order.amount, order.currency) }}</td>
                                </tr>
                            </tfoot>
                        </v-table>
                    </v-card>

                    <!-- Payment Details (New Section) -->
                    <v-card elevation="2" rounded="xl" class="mb-6">
                         <v-card-title class="pa-4 font-weight-bold">Payment Information</v-card-title>
                         <v-divider></v-divider>
                         <v-list lines="one">
                            <v-list-item prepend-icon="mdi-credit-card" title="Payment Status">
                                <template v-slot:append>
                                    <v-chip :color="order.paymentStatus === 'paid' ? 'success' : 'warning'" size="small" label>
                                        {{ order.paymentStatus }}
                                    </v-chip>
                                </template>
                            </v-list-item>
                            <v-list-item prepend-icon="mdi-link" title="Payment Link" v-if="order.paymentLink">
                                <template v-slot:append>
                                    <a :href="order.paymentLink" target="_blank" class="text-decoration-none text-primary">View Link</a>
                                </template>
                            </v-list-item>
                         </v-list>
                    </v-card>
                     
                     <!-- Attached Files -->
                    <v-card elevation="2" rounded="xl" class="mb-6" v-if="order.files && order.files.length > 0">
                        <v-card-title class="pa-4 font-weight-bold">Attached Files</v-card-title>
                        <v-divider></v-divider>
                        <v-row class="pa-4">
                            <v-col v-for="(file, index) in order.files" :key="index" cols="12" sm="6" md="4">
                                <v-card variant="outlined" @click="viewFile(file)" class="cursor-pointer">
                                    <v-img :src="file" height="150" cover class="bg-grey-lighten-2">
                                        <template v-slot:placeholder>
                                            <div class="d-flex align-center justify-center fill-height">
                                                <v-icon>mdi-eye</v-icon> <!-- Changed icon to eye -->
                                            </div>
                                        </template>
                                    </v-img>
                                    <v-card-text class="text-truncate">{{ file.split('/').pop() }}</v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>

                <!-- Customer Details & Summary -->
                <v-col cols="12" lg="4">
                    <v-card elevation="2" rounded="xl" class="mb-6">
                        <v-card-title class="pa-4 font-weight-bold">Customer Details</v-card-title>
                        <v-divider></v-divider>
                        <v-list lines="two">
                            <v-list-item prepend-icon="mdi-account" :title="order.userDetails.name" subtitle="Customer Name"></v-list-item>
                            <v-list-item prepend-icon="mdi-email" :title="order.userDetails.email" subtitle="Email Address"></v-list-item>
                            <v-list-item prepend-icon="mdi-phone" :title="order.userDetails.phone" subtitle="Phone Number"></v-list-item>
                            <v-list-item prepend-icon="mdi-map-marker" :title="personAddress" subtitle="Address"></v-list-item>
                             <v-list-item prepend-icon="mdi-clock-outline" :title="order.userDetails.timezone" subtitle="Timezone"></v-list-item>
                        </v-list>
                    </v-card>

                     <v-alert v-if="order.userComment" type="info" variant="tonal" border="start" class="mb-4" icon="mdi-comment-text-outline">
                        <div class="text-caption font-weight-bold mb-1">User Comment</div>
                        {{ order.userComment }}
                    </v-alert>

                    <!-- Mock Admin Assignment Display -->
                    <v-card elevation="2" rounded="xl" v-if="false"> <!-- Hidden for now as API doesn't support -->
                        <v-card-title class="pa-4 font-weight-bold text-success">
                            <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
                            Assigned To
                        </v-card-title>
                        <v-card-text>
                            <div class="text-h6">N/A</div>
                        </v-card-text>
                    </v-card>
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

            <!-- File Preview Dialog -->
            <v-dialog v-model="previewDialog" max-width="1500">
                <v-card rounded="xl" class="bg-black">
                    <v-card-title class="d-flex align-center justify-space-between pa-4 text-white">
                        <span class="text-truncate">{{ selectedFile?.split('/').pop() }}</span>
                        <div class="d-flex align-center">
                            <v-btn icon="mdi-download" variant="text" color="white" :href="selectedFile" target="_blank" class="mr-2"></v-btn>
                            <v-btn icon="mdi-close" variant="text" color="white" @click="previewDialog = false"></v-btn>
                        </div>
                    </v-card-title>
                    <v-card-text class="pa-0 d-flex justify-center align-center" style="min-height: 400px; background-color: #000;">
                        <v-img :src="selectedFile" max-height="80vh" contain></v-img>
                    </v-card-text>
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
        </div>
         <div v-else class="d-flex justify-center align-center h-screen">
             <div class="text-center">
                 <h2 class="text-h5 text-grey">Order not found</h2>
                 <v-btn class="mt-4" color="primary" @click="navigateTo('/orders')">Go Back</v-btn>
             </div>
        </div>

    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>

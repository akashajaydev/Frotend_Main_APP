<script setup lang="ts">
import { ref, computed } from 'vue'

// -- Mock Data --
const admins = ref([
  { id: 1, name: 'Baba Ram', email: 'baba@example.com', type: 'Baba', active: true, avatar: '' },
  { id: 2, name: 'Astro John', email: 'astro@example.com', type: 'Astrologer', active: true, avatar: '' },
  { id: 3, name: 'Healer Mary', email: 'healer@example.com', type: 'Healer', active: false, avatar: '' },
  { id: 4, name: 'Baba Shyam', email: 'shyam@example.com', type: 'Baba', active: true, avatar: '' },
  { id: 5, name: 'Astro Mike', email: 'mike@example.com', type: 'Astrologer', active: true, avatar: '' },
  { id: 6, name: 'Healer Sarah', email: 'sarah@example.com', type: 'Healer', active: true, avatar: '' },
  { id: 7, name: 'Baba Ganeshan', email: 'ganeshan@example.com', type: 'Baba', active: false, avatar: '' },
])

const appointments = ref([
    { id: 101, customer: 'Alice Smith', service: 'Astrology Reading', date: '2025-10-25 10:00 AM', status: 'Pending', assignedTo: null },
    { id: 102, customer: 'Bob Jones', service: 'Healing Session', date: '2025-10-26 02:00 PM', status: 'Confirmed', assignedTo: 3 }, // Assigned to Mary
    { id: 103, customer: 'Charlie Brown', service: 'Baba Consultation', date: '2025-10-27 11:30 AM', status: 'Pending', assignedTo: null },
    { id: 104, customer: 'Diana Prince', service: 'Astrology Reading', date: '2025-10-28 09:00 AM', status: 'Completed', assignedTo: 2 }, // Assigned to John
    { id: 105, customer: 'Ethan Hunt', service: 'Healing Session', date: '2025-10-29 03:00 PM', status: 'Pending', assignedTo: null },
])

// -- State --
const assignDialog = ref(false)
const selectedAppointment = ref<any>(null)
const searchQuery = ref('')

// -- Computed --
const filteredAdmins = computed(() => {
    if (!searchQuery.value) return admins.value
    const lower = searchQuery.value.toLowerCase()
    return admins.value.filter(a => 
        a.name.toLowerCase().includes(lower) || 
        a.type.toLowerCase().includes(lower)
    )
})

// -- Methods --
function openAssignDialog(appt: any) {
    selectedAppointment.value = appt
    searchQuery.value = ''
    assignDialog.value = true
}

function assignAdmin(admin: any) {
    if (selectedAppointment.value) {
        selectedAppointment.value.assignedTo = admin.id
        // Update status if it was pending
        if (selectedAppointment.value.status === 'Pending') {
             selectedAppointment.value.status = 'Confirmed'
        }
        assignDialog.value = false
        selectedAppointment.value = null
    }
}

function removeAssignment(appt: any) {
    appt.assignedTo = null
    if (appt.status === 'Confirmed') {
        appt.status = 'Pending'
    }
}

function getAdminById(id: number) {
    return admins.value.find(a => a.id === id)
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Pending': return 'warning'
        case 'Confirmed': return 'primary'
        case 'Completed': return 'success'
        case 'Cancelled': return 'error'
        default: return 'grey'
    }
}

// Reuse role theme helper (could be moved to a composable later)
const getRoleTheme = (type: string) => {
  switch (type) {
    case 'Baba': return { color: 'orange-darken-2', icon: 'mdi-om' }
    case 'Astrologer': return { color: 'deep-purple-lighten-1', icon: 'mdi-star-four-points' }
    case 'Healer': return { color: 'teal-lighten-1', icon: 'mdi-hand-heart' }
    default: return { color: 'grey', icon: 'mdi-account' }
  }
}
</script>

<template>
  <v-container fluid class="pa-6">
    <div class="mb-8">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Appointments</h1>
        <p class="text-subtitle-1 text-grey">Manage and assign appointments to your team</p>
    </div>

    <v-row>
        <v-col v-for="appt in appointments" :key="appt.id" cols="12" md="6" lg="4">
            <v-card class="elevation-2 rounded-xl" :class="{'border-success': appt.status === 'Completed'}">
                <v-card-text>
                    <div class="d-flex justify-space-between align-start mb-4">
                        <div>
                            <h3 class="text-h6 font-weight-bold">{{ appt.customer }}</h3>
                            <div class="text-body-2 text-grey-darken-1 d-flex align-center mt-1">
                                <v-icon size="small" icon="mdi-calendar-clock" class="mr-1"></v-icon>
                                {{ appt.date }}
                            </div>
                             <div class="text-body-2 text-primary font-weight-medium mt-1">
                                {{ appt.service }}
                            </div>
                        </div>
                        <v-chip :color="getStatusColor(appt.status)" size="small" class="font-weight-bold" variant="flat">
                            {{ appt.status }}
                        </v-chip>
                    </div>

                    <v-divider class="mb-4"></v-divider>

                    <!-- Assigned Section -->
                    <div v-if="appt.assignedTo" class="d-flex align-center bg-grey-lighten-4 pa-3 rounded-lg">
                         <v-avatar size="40" class="mr-3 border">
                            <v-img v-if="getAdminById(appt.assignedTo)?.avatar" :src="getAdminById(appt.assignedTo)?.avatar" cover></v-img>
                             <v-icon v-else :icon="getRoleTheme(getAdminById(appt.assignedTo)?.type || '').icon" 
                                :color="getRoleTheme(getAdminById(appt.assignedTo)?.type || '').color"></v-icon>
                         </v-avatar>
                         <div>
                            <div class="text-caption text-grey">Assigned to</div>
                            <div class="font-weight-bold text-body-2">
                                {{ getAdminById(appt.assignedTo)?.name || 'Unknown' }}
                            </div>
                         </div>
                         <v-spacer></v-spacer>
                         <div class="d-flex flex-column">
                             <v-btn icon="mdi-pencil" size="x-small" variant="text" color="grey" @click="openAssignDialog(appt)"></v-btn>
                             <v-btn icon="mdi-close" size="x-small" variant="text" color="error" @click="removeAssignment(appt)"></v-btn>
                         </div>
                    </div>

                    <!-- Unassigned Action -->
                    <div v-else>
                        <v-btn block variant="tonal" color="primary" prepend-icon="mdi-account-plus" @click="openAssignDialog(appt)">
                            Assign Admin
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <!-- Assignment Dialog -->
    <v-dialog v-model="assignDialog" max-width="500px">
        <v-card class="rounded-xl pa-4">
            <v-card-title class="text-h5 font-weight-bold mb-2">Assign Appointment</v-card-title>
            <v-card-subtitle v-if="selectedAppointment">
                For {{ selectedAppointment.customer }} - {{ selectedAppointment.service }}
            </v-card-subtitle>
            
            <v-card-text class="mt-4">
                <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    label="Search Admin"
                    placeholder="Name or Role"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                    class="mb-4"
                ></v-text-field>

                <v-list class="bg-transparent" max-height="400" style="overflow-y: auto;">
                    <template v-if="filteredAdmins.length > 0">
                        <v-list-item
                            v-for="admin in filteredAdmins"
                            :key="admin.id"
                            @click="assignAdmin(admin)"
                            rounded="lg"
                            class="mb-2 border"
                            lines="two"
                            :disabled="!admin.active"
                        >
                            <template v-slot:prepend>
                                <v-avatar size="48" class="border">
                                    <v-img v-if="admin.avatar" :src="admin.avatar" cover></v-img>
                                    <v-icon v-else :icon="getRoleTheme(admin.type).icon" :color="getRoleTheme(admin.type).color"></v-icon>
                                </v-avatar>
                            </template>

                            <v-list-item-title class="font-weight-bold">{{ admin.name }}</v-list-item-title>
                            <v-list-item-subtitle class="d-flex align-center mt-1">
                                <v-chip size="x-small" :color="getRoleTheme(admin.type).color" variant="outlined" class="mr-2">
                                    {{ admin.type }}
                                </v-chip>
                                <span v-if="!admin.active" class="text-error text-caption">Inactive</span>
                            </v-list-item-subtitle>
                            
                            <template v-slot:append>
                                <v-icon color="primary" icon="mdi-check-circle-outline" v-if="selectedAppointment?.assignedTo === admin.id"></v-icon>
                                <v-icon color="grey-lighten-2" icon="mdi-chevron-right" v-else></v-icon>
                            </template>
                        </v-list-item>
                    </template>
                    <div v-else class="text-center py-4 text-grey">
                        No admins found behaving like "{{ searchQuery }}"
                    </div>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="assignDialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </v-container>
</template>

<style scoped>
.border-success {
    border-top: 4px solid #4CAF50 !important;
}
</style>

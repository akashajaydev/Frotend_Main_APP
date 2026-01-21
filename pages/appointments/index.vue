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
  <v-container fluid class="fill-height dark-page pa-6 align-start">
    <div class="w-100">
        <!-- Header Section -->
        <div class="d-flex flex-column flex-md-row justify-space-between align-center mb-8">
            <div>
                <h1 class="text-h3 font-weight-black text-grey-darken-3 mb-2">
                    <v-icon icon="mdi-calendar-check" start color="primary" class="mr-2"></v-icon>
                    Appointments
                </h1>
                <p class="text-subtitle-1 text-grey-darken-5">
                    Manage schedule, assign staff, and track appointment status.
                </p>
            </div>
             <!-- Quick Stats -->
            <div class="d-flex gap-4 mt-4 mt-md-0">
                 <v-sheet class="px-6 py-3 rounded-xl elevation-2 text-center d-flex align-center">
                    <v-icon icon="mdi-calendar-today" color="primary" class="mr-3" size="large"></v-icon>
                    <div class="text-left">
                        <div class="text-caption font-weight-bold text-grey">Total</div>
                        <div class="text-h6 font-weight-black">{{ appointments.length }}</div>
                    </div>
                 </v-sheet>
                 <v-sheet class="px-6 py-3 rounded-xl elevation-2 text-center d-flex align-center ml-3">
                    <v-icon icon="mdi-timer-sand" color="warning" class="mr-3" size="large"></v-icon>
                    <div class="text-left">
                        <div class="text-caption font-weight-bold text-grey">Pending</div>
                        <div class="text-h6 font-weight-black">{{ appointments.filter(a => a.status === 'Pending').length }}</div>
                    </div>
                 </v-sheet>
            </div>
        </div>

        <v-divider class="mb-8 border-opacity-75"></v-divider>

        <!-- Appointment Grid -->
        <v-row>
            <v-col v-for="appt in appointments" :key="appt.id" cols="12" md="6" lg="4" xl="3">
                <v-hover v-slot="{ isHovering, props }">
                    <v-card 
                        v-bind="props"
                        class="appointment-card rounded-xl overflow-visible" 
                        :elevation="isHovering ? 8 : 2"
                        :class="{'on-hover': isHovering}"
                    >
                        <!-- Status Badge -->
                        <div class="status-badge">
                            <v-chip :color="getStatusColor(appt.status)" class="font-weight-bold elevation-1 text-uppercase" size="small" label>
                                {{ appt.status }}
                            </v-chip>
                        </div>

                        <v-card-text class="pt-8 pb-4 px-6">
                            <!-- Service Icon & Title -->
                            <div class="d-flex align-start mb-4">
                                <v-avatar color="primary" variant="tonal" rounded="lg" size="50" class="mr-4">
                                     <v-icon icon="mdi-sparkles" size="28" color="primary"></v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-overline text-primary font-weight-bold mb-n1 text-truncate" style="max-width: 150px;">{{ appt.service }}</div>
                                    <h3 class="text-h6 font-weight-bold text-grey-darken-3 text-truncate" style="max-width: 180px;">{{ appt.customer }}</h3>
                                </div>
                            </div>

                            <!-- Date info -->
                            <div class="d-flex align-center bg-grey-lighten-5 pa-3 rounded-lg mb-4 text-grey-darken-2">
                                 <v-icon icon="mdi-calendar-range" start size="small"></v-icon>
                                 <span class="text-body-2 font-weight-medium">{{ appt.date }}</span>
                            </div>

                            <v-divider class="mb-4 border-dashed"></v-divider>

                            <!-- Assignment Section -->
                            <div v-if="appt.assignedTo">
                                <div class="text-caption text-grey font-weight-bold mb-2 text-uppercase letter-spacing-1">Assigned Specialist</div>
                                <div class="assigned-card d-flex align-center pa-2 rounded-lg border bg-white transition-swing">
                                     <v-avatar size="44" class="mr-3 border cursor-pointer">
                                        <v-img v-if="getAdminById(appt.assignedTo)?.avatar" :src="getAdminById(appt.assignedTo)?.avatar" cover></v-img>
                                         <v-icon v-else :icon="getRoleTheme(getAdminById(appt.assignedTo)?.type || '').icon" 
                                            :color="getRoleTheme(getAdminById(appt.assignedTo)?.type || '').color"></v-icon>
                                     </v-avatar>
                                     <div class="flex-grow-1 overflow-hidden">
                                        <div class="font-weight-bold text-subtitle-2 text-truncate">
                                            {{ getAdminById(appt.assignedTo)?.name || 'Unknown' }}
                                        </div>
                                        <div class="text-caption text-grey text-truncate">
                                            {{ getAdminById(appt.assignedTo)?.type }}
                                        </div>
                                     </div>
                                     
                                     <!-- Actions -->
                                     <div class="d-flex flex-column ml-2">
                                         <v-btn
                                            icon
                                            size="x-small"
                                            density="comfortable"
                                            variant="plain"
                                            color="grey-darken-3"
                                            @click="openAssignDialog(appt)"
                                        >
                                            <v-icon icon="mdi-pencil-outline" />
                                            <v-tooltip activator="parent" location="top">Change</v-tooltip>
                                        </v-btn>

                                        <v-btn
                                            icon
                                            size="x-small"
                                            density="comfortable"
                                            variant="plain"
                                            color="error"
                                            @click="removeAssignment(appt)"
                                        >
                                            <v-icon icon="mdi-close-circle-outline" />
                                            <v-tooltip activator="parent" location="top">Remove</v-tooltip>
                                        </v-btn>
                                     </div>
                                </div>
                            </div>

                            <!-- Unassigned State -->
                            <div v-else class="unassigned-state rounded-lg pa-4 text-center border border-opacity-50 border-primary bg-blue-grey-lighten-5">
                                <!-- <div class="text-body-2 text-grey-darken-1 mb-2">No specialist assigned yet</div> -->
                                <v-btn 
                                    block 
                                    rounded="lg" 
                                    color="primary" 
                                    variant="flat" 
                                    elevation="1"
                                    prepend-icon="mdi-account-plus" 
                                    @click="openAssignDialog(appt)"
                                    class="text-none font-weight-bold"
                                >
                                    Assign Now
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </div>

    <!-- Assignment Dialog -->
    <v-dialog v-model="assignDialog" max-width="550px" transition="dialog-bottom-transition">
        <v-card class="rounded-xl overflow-hidden bg-white">
            <v-toolbar color="primary" class="px-4">
                 <v-icon icon="mdi-account-search" class="mr-2"></v-icon>
                 <v-toolbar-title class="text-h6 font-weight-bold">Assign Specialist</v-toolbar-title>
                 <v-btn icon="mdi-close" variant="text" @click="assignDialog = false"></v-btn>
            </v-toolbar>

            <div class="pa-5 bg-grey-lighten-5">
                 <div v-if="selectedAppointment" class="mb-4 d-flex align-center">
                    <v-avatar color="white" class="elevation-1 mr-3">
                        <v-icon icon="mdi-calendar-check" color="primary"></v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-caption text-grey font-weight-bold">Target Appointment</div>
                        <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ selectedAppointment.customer }} <span class="text-grey mx-1">•</span> {{ selectedAppointment.service }}</div>
                    </div>
                 </div>

                <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    label="Search available staff..."
                    placeholder="Type name or role (e.g. 'Baba')"
                    variant="solo"
                    density="comfortable"
                    bg-color="white"
                    rounded="lg"
                    hide-details
                    class="elevation-1"
                ></v-text-field>
            </div>
            
            <v-divider></v-divider>

            <v-list class="pa-2 bg-white" max-height="400" style="overflow-y: auto;">
                <div class="text-caption font-weight-bold text-grey ml-4 mt-2 mb-2">AVAILABLE STAFF</div>
                <template v-if="filteredAdmins.length > 0">
                    <v-list-item
                        v-for="admin in filteredAdmins"
                        :key="admin.id"
                        @click="assignAdmin(admin)"
                        rounded="lg"
                        class="mb-2 admin-list-item mx-2 border-thin"
                        lines="two"
                        :disabled="!admin.active"
                        :base-color="admin.active ? 'white' : 'grey-lighten-4'"
                    >
                        <template v-slot:prepend>
                             <v-badge 
                                dot 
                                :color="admin.active ? 'success' : 'grey'"
                                location="bottom right"
                                offset-x="5"
                                offset-y="5"
                            >
                                <v-avatar size="50" class="border elevation-1">
                                    <v-img v-if="admin.avatar" :src="admin.avatar" cover></v-img>
                                    <v-icon v-else :icon="getRoleTheme(admin.type).icon" :color="getRoleTheme(admin.type).color"></v-icon>
                                </v-avatar>
                            </v-badge>
                        </template>

                        <v-list-item-title class="font-weight-bold text-body-1 ml-2" style="color: #212121">{{ admin.name }}</v-list-item-title>
                        <v-list-item-subtitle class="d-flex align-center mt-1 ml-2">
                            <v-chip size="x-small" :color="getRoleTheme(admin.type).color" variant="tonal" class="mr-2 font-weight-bold">
                                {{ admin.type }}
                            </v-chip>
                            <span v-if="!admin.active" class="text-error text-caption font-weight-medium">
                                <v-icon icon="mdi-cancel" size="small" start></v-icon>Unavailable
                            </span>
                        </v-list-item-subtitle>
                        
                        <template v-slot:append>
                            <v-btn 
                                v-if="selectedAppointment?.assignedTo === admin.id" 
                                color="success" 
                                variant="tonal" 
                                size="small" 
                                class="font-weight-bold"
                                prepend-icon="mdi-check"
                            >
                                Assigned
                            </v-btn>
                            <v-btn 
                                v-else-if="admin.active"
                                variant="text" 
                                color="primary" 
                                icon="mdi-chevron-right"
                            ></v-btn>
                        </template>
                    </v-list-item>
                </template>
                <div v-else class="text-center py-12">
                    <v-icon icon="mdi-account-off-outline" size="64" color="grey-lighten-2" class="mb-4"></v-icon>
                    <div class="text-h6 text-grey">No matches found</div>
                    <div class="text-body-2 text-grey-lighten-1">Try searching for a different name or role</div>
                </div>
            </v-list>
        </v-card>
    </v-dialog>

  </v-container>
</template>

<style scoped>
.appointment-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0,0,0,0.05);
}

.appointment-card.on-hover {
    transform: translateY(-6px);
    border-color: rgba(var(--v-theme-primary), 0.2);
}

.status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
}

.border-dashed {
    border-style: dashed !important;
}

.assigned-card {
    border-color: rgba(0,0,0,0.08) !important;
    transition: background-color 0.2s;
}

.assigned-card:hover {
    background-color: #FAFAFA !important;
}

.admin-list-item {
    transition: all 0.2s;
}

.admin-list-item:hover {
    background-color: #F5F5F5;
    transform: translateX(4px);
}

.gap-4 {
    gap: 16px;
}

.letter-spacing-1 {
    letter-spacing: 1px;
}
.dark-page {
  background-color: #f0ecec; /* near-black */
}


</style>

<script setup lang="ts">
import { ref, computed } from 'vue'

// -- Mock Data --
const router = useRouter()
const { admins, appointments, getAdminById } = useMockData()

// -- Methods --
function navigateToDetails(id: number) {
    router.push(`/appointments/${id}`)
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
                    Manage schedule and track appointment status.
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
                        class="appointment-card rounded-xl overflow-visible cursor-pointer" 
                        :elevation="isHovering ? 8 : 2"
                        :class="{'on-hover': isHovering}"
                        @click="navigateToDetails(appt.id)"
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
                                <!-- <v-avatar color="primary" variant="tonal" rounded="lg" size="50" class="mr-4">
                                     <v-icon icon="mdi-sparkles" size="28" color="primary"></v-icon>
                                </v-avatar> -->
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
                                <div class="text-caption text-grey-darken-5 font-weight-bold mb-2 text-uppercase letter-spacing-1">Assigned Specialist</div>
                                <div class="assigned-card d-flex align-center pa-2 rounded-lg border bg-white transition-swing">
                                     <v-avatar size="44" class="mr-3 border cursor-pointer">
                                        <v-img :src="getAdminById(appt.assignedTo)?.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" cover></v-img>
                                     </v-avatar>
                                     <div class="flex-grow-1 overflow-hidden">
                                        <div class="font-weight-bold text-subtitle-2 text-truncate">
                                            {{ getAdminById(appt.assignedTo)?.name || 'Unknown' }}
                                        </div>
                                        <div class="text-caption text-grey text-truncate">
                                            {{ getAdminById(appt.assignedTo)?.type }}
                                        </div>
                                     </div>
                                </div>
                            </div>

                            <!-- Unassigned State -->
                            <div v-else class="unassigned-state rounded-lg pa-4 text-center border border-opacity-50 border-grey bg-grey-lighten-5">
                                <div class="text-body-2 text-primary font-weight-medium d-flex align-center justify-center">
                                    <v-icon icon="mdi-account-off-outline" start size="small"></v-icon>
                                    No specialist assigned
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </div>
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

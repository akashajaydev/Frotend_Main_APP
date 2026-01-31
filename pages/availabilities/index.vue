<script setup lang="ts">
import { useAvailabilityStore } from '~/stores/availability'
import { useRouter } from 'vue-router'

const store = useAvailabilityStore()
const router = useRouter()

// Helper to format schedule summary (simplified for list view)
const getScheduleSummary = (weekly: any) => {
    // This is a rough summary, could be more detailed
    const activeDays = Object.entries(weekly)
        .filter(([_, val]: [string, any]) => val.active)
        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1, 3)) // Mon, Tue...
    
    if (activeDays.length === 0) return 'Unavailable'
    if (activeDays.length === 7) return 'Every day'
    if (activeDays.length === 5 && !weekly.saturday.active && !weekly.sunday.active) return 'Mon - Fri'
    
    return activeDays.join(', ')
}

const getScheduleTimeRange = (weekly: any) => {
    // Find the first active day to show representative time
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    for (const day of days) {
        if (weekly[day].active && weekly[day].ranges.length > 0) {
           const r = weekly[day].ranges[0]
           // Simple 12h format
           return `${formatTime(r.start)} - ${formatTime(r.end)}`
        }
    }
    return ''
}

const formatTime = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
}

const createNew = () => {
    router.push('/availabilities/new')
}

const editSchedule = (id: string) => {
    router.push(`/availabilities/${id}`)
}

const deleteSchedule = (id: string) => {
    if(confirm('Are you sure you want to delete this schedule?')) {
        store.deleteSchedule(id)
    }
}
</script>

<template>
  <v-container fluid class="pa-6">
    <div class="d-flex justify-space-between align-center mb-6">
        <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Availability</h1>
            <p class="text-subtitle-1 text-grey">Configure times when you are available for bookings.</p>
        </div>
        <v-btn color="black" prepend-icon="mdi-plus" rounded="lg" @click="createNew">
            New
        </v-btn>
    </div>

    <v-card variant="flat" class="bg-transparent">
        <v-list class="bg-transparent pa-0">
             <v-card 
                v-for="schedule in store.schedules" 
                :key="schedule.id"
                class="mb-4 pa-4 rounded-xl border"
                elevation="0"
                @click="editSchedule(schedule.id)"
                hover
             >
                <div class="d-flex justify-space-between align-start">
                    <div>
                        <div class="d-flex align-center gap-2 mb-1">
                            <h3 class="text-h6 font-weight-bold">{{ schedule.name }}</h3>
                            <v-chip v-if="schedule.isDefault" size="small" color="grey-lighten-3" class="text-caption font-weight-bold text-grey-darken-3">Default</v-chip>
                        </div>
                        <div class="text-body-2 text-grey-darken-1 mb-1">
                            {{ getScheduleSummary(schedule.weekly) }}
                        </div>
                         <div class="text-body-2 text-grey-darken-1">
                            {{ getScheduleTimeRange(schedule.weekly) }}
                        </div>
                         <div class="d-flex align-center mt-2 text-caption text-grey">
                            <v-icon icon="mdi-web" size="small" class="mr-1"></v-icon>
                            {{ schedule.timezone }}
                        </div>
                    </div>
                    
                    <div class="d-flex">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-horizontal" variant="text" size="small" v-bind="props" @click.stop></v-btn>
                            </template>
                            <v-list density="compact" rounded="lg" elevation="2">
                                <v-list-item 
                                    prepend-icon="mdi-pencil" 
                                    title="Edit" 
                                    @click="editSchedule(schedule.id)"
                                ></v-list-item>
                                <v-list-item 
                                    prepend-icon="mdi-star-outline" 
                                    title="Set as default" 
                                    @click.stop="store.setDefault(schedule.id)"
                                    v-if="!schedule.isDefault"
                                ></v-list-item>
                                <v-list-item 
                                    prepend-icon="mdi-delete-outline" 
                                    title="Delete" 
                                    color="error"
                                    @click.stop="deleteSchedule(schedule.id)"
                                    v-if="!schedule.isDefault"
                                ></v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </div>
             </v-card>
        </v-list>
    </v-card>
    
  </v-container>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}
</style>

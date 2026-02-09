<script setup lang="ts">
import { useAvailabilityStore } from '~/stores/availability'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const store = useAvailabilityStore()
const router = useRouter()

onMounted(() => {
    store.fetchAvailability()
})

const formatTime = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
}

const getFormattedSchedule = (weekly: any) => {
    const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const daysShort: Record<string, string> = { 'sunday': 'Sun', 'monday': 'Mon', 'tuesday': 'Tue', 'wednesday': 'Wed', 'thursday': 'Thu', 'friday': 'Fri', 'saturday': 'Sat' }
    
    // 1. Collect active days and their ranges signature
    const activeDays = []
    for (const day of daysOrder) {
        if (weekly[day].active && weekly[day].ranges.length > 0) {
            // Sort ranges by start time
            const sortedRanges = [...weekly[day].ranges].sort((a: any, b: any) => a.start.localeCompare(b.start))
            const signature = sortedRanges.map((r: any) => `${formatTime(r.start)} - ${formatTime(r.end)}`).join('|')
            activeDays.push({ day, ranges: sortedRanges, signature })
        }
    }

    if (activeDays.length === 0) return ['Unavailable']

    // 2. Group consecutive days with same signature
    const groups = []
    let currentGroup = [activeDays[0]]

    for (let i = 1; i < activeDays.length; i++) {
        const prev = activeDays[i - 1]
        const curr = activeDays[i]
        
        const prevIndex = daysOrder.indexOf(prev.day)
        const currIndex = daysOrder.indexOf(curr.day)
        
        // Group if same signature AND consecutive days
        if (curr.signature === prev.signature && currIndex === prevIndex + 1) {
            currentGroup.push(curr)
        } else {
            groups.push(currentGroup)
            currentGroup = [curr]
        }
    }
    groups.push(currentGroup)

    // 3. Format output
    const lines: string[] = []
    for (const group of groups) {
        const firstDay = daysShort[group[0].day]
        const lastDay = daysShort[group[group.length - 1].day]
        const dayStr = group.length > 1 ? `${firstDay} - ${lastDay}` : firstDay
        
        // Add each range for this group
        const ranges = group[0].ranges
        for (const range of ranges) {
            const timeStr = `${formatTime(range.start)} - ${formatTime(range.end)}`
            lines.push(`${dayStr}, ${timeStr}`)
        }
    }

    return lines
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
  <v-container fluid class="pa-8">
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-8 gap-4">
        <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Availability</h1>
            <p class="text-subtitle-1 text-grey-darken-1" style="max-width: 600px; line-height: 1.6;">
                Configure your weekly schedule and override specific dates to manage when you are available for bookings.
            </p>
        </div>
        <div class="d-flex align-center gap-4">
            <!-- 
            <v-btn-toggle
                model-value="my"
                mandatory
                rounded="xl"
                color="grey-darken-3"
                variant="outlined"
                density="comfortable"
                class="border-sm"
            >
                <v-btn value="my" class="px-6 text-none font-weight-medium">My availability</v-btn>
            </v-btn-toggle>
            -->
             <v-btn 
                color="black" 
                prepend-icon="mdi-plus" 
                rounded="xl" 
                height="44"
                elevation="0"
                @click="createNew" 
                class="text-none px-6 font-weight-bold"
            >
                New Schedule
            </v-btn>
        </div>
    </div>

    <v-row>
        <v-col cols="12">
            <div v-if="store.schedules.length === 0" class="text-center py-12 text-grey">
                <v-icon icon="mdi-calendar-clock" size="64" class="mb-4 text-grey-lighten-2"></v-icon>
                <h3 class="text-h6 font-weight-medium">No schedules found</h3>
                <p class="mb-6">Create a schedule to get started.</p>
                <v-btn color="black" rounded="xl" @click="createNew" class="text-none">Create Schedule</v-btn>
            </div>

            <v-card 
                v-for="schedule in store.schedules" 
                :key="schedule.id"
                class="mb-4 rounded-xl border-sm transition-swing"
                variant="outlined"
                elevation="0"
                hover
                @click="editSchedule(schedule.id)"
                style="border-color: #E0E0E0;"
            >
                <div class="pa-6 d-flex flex-column flex-sm-row gap-4 justify-space-between">
                    <div class="d-flex flex-column gap-2 flex-grow-1">
                        <div class="d-flex align-center flex-wrap gap-3 mb-1">
                            <h3 class="text-h6 font-weight-bold text-grey-darken-4">{{ schedule.name }}</h3>
                            <v-chip 
                                v-if="schedule.isDefault" 
                                size="small" 
                                color="success" 
                                variant="tonal"
                                class="font-weight-bold px-3"
                            >
                                Default
                            </v-chip>
                        </div>
                        
                        <div class="d-flex align-center text-body-2 text-grey-darken-1 mb-4">
                            <v-icon icon="mdi-earth" size="small" class="mr-2"></v-icon>
                            {{ schedule.timezone }}
                        </div>

                         <div class="d-flex flex-column gap-1">
                            <div v-for="(line, index) in getFormattedSchedule(schedule.weekly)" :key="index" class="d-flex align-center text-body-2">
                                <v-icon icon="mdi-clock-outline" size="16" class="mr-3 text-grey-lighten-1"></v-icon>
                                <span class="text-grey-darken-3">{{ line }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex align-start justify-end">
                        <v-btn 
                            icon="mdi-pencil-outline" 
                            variant="text" 
                            color="grey-darken-1" 
                            class="mr-1"
                            @click.stop="editSchedule(schedule.id)"
                        >
                             <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                        </v-btn>
                        
                        <v-menu location="bottom end">
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-vertical" variant="text" color="grey-darken-1" v-bind="props" @click.stop></v-btn>
                            </template>
                            <v-list density="comfortable" rounded="lg" elevation="3" width="200">
                                <v-list-item 
                                    prepend-icon="mdi-pencil" 
                                    title="Edit" 
                                    @click="editSchedule(schedule.id)"
                                ></v-list-item>
                                <v-list-item 
                                    prepend-icon="mdi-check-circle-outline" 
                                    title="Set as default" 
                                    @click.stop="store.setDefault(schedule.id)"
                                    v-if="!schedule.isDefault"
                                ></v-list-item>
                                <v-divider class="my-1"></v-divider>
                                <v-list-item 
                                    prepend-icon="mdi-delete-outline" 
                                    title="Delete" 
                                    class="text-error"
                                    @click.stop="deleteSchedule(schedule.id)"
                                    v-if="!schedule.isDefault"
                                ></v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </div>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}
.gap-4 {
    gap: 16px;
}
</style>

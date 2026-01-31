<script setup lang="ts">
import { useAvailabilityStore } from '~/stores/availability'
import { useRouter } from 'vue-router'

const store = useAvailabilityStore()
const router = useRouter()

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
  <v-container fluid class="pa-6">
    <div class="d-flex justify-space-between align-center mb-6">
        <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Availability</h1>
            <p class="text-subtitle-1 text-grey">Configure times when you are available for bookings.</p>
        </div>
        <div class="d-flex align-center gap-4">
             <v-btn-toggle
                model-value="my"
                mandatory
                rounded="lg"
                color="grey-darken-3"
                variant="outlined"
                density="compact"
                class="border"
            >
                <v-btn value="my" class="px-4 text-none">My availability</v-btn>
            </v-btn-toggle>
             <v-btn color="black" prepend-icon="mdi-plus" rounded="lg" @click="createNew" class="text-none">
                New
            </v-btn>
        </div>
    </div>

    <v-card variant="flat" class="bg-transparent">
        <v-list class="bg-transparent pa-0">
             <v-card 
                v-for="schedule in store.schedules" 
                :key="schedule.id"
                class="mb-4 pa-6 rounded-xl border bg-white"
                elevation="0"
                @click="editSchedule(schedule.id)"
                hover
             >
                <div class="d-flex justify-space-between align-start">
                    <div class="w-100">
                        <div class="d-flex align-center gap-2 mb-4">
                            <h3 class="text-subtitle-1 font-weight-bold">{{ schedule.name }}</h3>
                            <v-chip v-if="schedule.isDefault" size="small" color="grey-lighten-3" class="text-caption font-weight-bold text-grey-darken-3 rounded-pill px-2">Default</v-chip>
                        </div>
                        
                        <div class="mb-4">
                            <div v-for="(line, index) in getFormattedSchedule(schedule.weekly)" :key="index" class="text-body-2 text-grey-darken-1 mb-1">
                                {{ line }}
                            </div>
                        </div>

                         <div class="d-flex align-center mt-2 text-caption text-grey">
                            <v-icon icon="mdi-earth" size="small" class="mr-1"></v-icon>
                            {{ schedule.timezone }}
                        </div>
                    </div>
                    
                    <div class="d-flex">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-horizontal" variant="text" density="comfortable" color="grey-darken-1" v-bind="props" @click.stop></v-btn>
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
.gap-4 {
    gap: 16px;
}
</style>

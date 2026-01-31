<script setup lang="ts">
import { useAvailabilityStore } from '~/stores/availability'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const store = useAvailabilityStore()
const route = useRoute()
const router = useRouter()

const schedule = ref<any>(null)
const dayMapping = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const validTimezones = Intl.supportedValuesOf('timeZone')

// Date Override State
const showOverrideDialog = ref(false)
const selectedOverrideDate = ref<any>(null) // For the date picker
const selectedOverrideRanges = ref<any[]>([]) 
const isUnavailableOverride = ref(false)

onMounted(() => {
    const id = route.params.id as string
    
    if (id === 'new') {
        schedule.value = store.getNewSchedule()
    } else {
        const s = store.getScheduleById(id)
        if (!s) {
            router.push('/availabilities')
            return
        }
        // Deep copy to avoid mutating store directly without action
        schedule.value = JSON.parse(JSON.stringify(s))
    }
})

const save = () => {
    if (route.params.id === 'new') {
        store.addSchedule(schedule.value)
    } else {
        store.updateSchedule(schedule.value.id, schedule.value)
    }
    if (schedule.value.isDefault) {
        store.setDefault(schedule.value.id)
    }
    router.push('/availabilities')
}

const deleteSchedule = () => {
    if (route.params.id === 'new') {
        router.push('/availabilities')
        return
    }

    if(confirm('Delete this schedule?')) {
        store.deleteSchedule(schedule.value.id)
        router.push('/availabilities')
    }
}

const setAsDefault = () => {
    store.setDefault(schedule.value.id)
}

const addTimeRange = (day: string) => {
    schedule.value.weekly[day].ranges.push({
        id: Math.random().toString(36).substring(7),
        start: '09:00',
        end: '17:00'
    })
}

const removeTimeRange = (day: string, index: number) => {
    schedule.value.weekly[day].ranges.splice(index, 1)
}

const copyToAllDays = (sourceDay: string) => {
    const sourceRanges = schedule.value.weekly[sourceDay].ranges
    dayMapping.forEach(d => {
        if (d !== sourceDay) {
            schedule.value.weekly[d].active = true
            // Deep copy ranges
            schedule.value.weekly[d].ranges = JSON.parse(JSON.stringify(sourceRanges))
        }
    })
}

// Override Logic
const overrideDates = computed(() => {
    if (!schedule.value) return []
    return Object.keys(schedule.value.overrides).sort()
})

const addOverride = () => {
    showOverrideDialog.value = true
    selectedOverrideDate.value = null
    selectedOverrideRanges.value = [{ start: '09:00', end: '17:00' }]
    isUnavailableOverride.value = false
}

const saveOverride = () => {
    if (!selectedOverrideDate.value) return
    
    // selectedOverrideDate might be a Date object or string depending on picker
    // Vuetify 3 date picker usually returns Date object or ISO string. Let's handle both.
    let dateStr = ''
    if (selectedOverrideDate.value instanceof Date) {
        // Adjust for timezone offset if needed, but usually we want local YYYY-MM-DD
         const offset = selectedOverrideDate.value.getTimezoneOffset()
         const date = new Date(selectedOverrideDate.value.getTime() - (offset*60*1000))
         dateStr = date.toISOString().split('T')[0]
    } else {
        dateStr = new Date(selectedOverrideDate.value).toISOString().split('T')[0]
    }

    if (isUnavailableOverride.value) {
        schedule.value.overrides[dateStr] = null
    } else {
        schedule.value.overrides[dateStr] = JSON.parse(JSON.stringify(selectedOverrideRanges.value))
    }
    
    showOverrideDialog.value = false
}

const deleteOverride = (date: string) => {
    delete schedule.value.overrides[date]
}

const formatOverrideDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const formatTime = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
}
</script>

<template>
  <v-container fluid class="pa-6" v-if="schedule">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row justify-space-between align-center mb-8">
        <div class="d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" class="mr-4" @click="router.back()"></v-btn>
            <div>
                <div class="d-flex align-center gap-2">
                    <v-text-field
                        v-model="schedule.name"
                        variant="plain"
                        density="compact"
                        hide-details
                        class="text-h5 font-weight-bold"
                        style="width: 300px;"
                    ></v-text-field>
                    <v-icon icon="mdi-pencil" size="small" color="grey"></v-icon>
                </div>
                <div class="text-caption text-grey">
                    {{ dayMapping.filter(d => schedule.weekly[d].active).length > 0 ? 'Weekly schedule' : 'No active days' }}
                </div>
            </div>
        </div>

        <div class="d-flex align-center gap-4">
             <div class="d-flex align-center mr-4">
                <span class="text-body-2 mr-2 text-grey-darken-1">Set as default</span>
                <v-switch
                    v-model="schedule.isDefault"
                    color="primary"
                    hide-details
                    density="compact"
                    inset
                ></v-switch>
             </div>
             <v-divider vertical class="mx-2"></v-divider>
             <v-btn variant="outlined" color="error" class="mr-2" icon="mdi-delete-outline" rounded="lg" @click="deleteSchedule"></v-btn>
             <v-btn color="black" rounded="lg" @click="save">Save</v-btn>
        </div>
    </div>

    <v-row>
        <!-- Weekly Schedule -->
        <v-col cols="12" md="8">
            <v-card variant="outlined" class="border-sm rounded-xl mb-6">
                <div class="pa-4 border-b">
                    <h3 class="text-h6 font-weight-bold">Weekly hours</h3>
                </div>
                <v-list class="pa-0">
                    <div v-for="(day, index) in dayMapping" :key="day">
                        <div class="d-flex flex-column flex-sm-row py-4 px-4 align-start align-sm-center hover-bg">
                            <div class="d-flex align-center" style="width: 180px;">
                                <v-switch
                                    v-model="schedule.weekly[day].active"
                                    color="primary"
                                    hide-details
                                    density="compact"
                                    inset
                                    class="mr-4"
                                ></v-switch>
                                <span class="text-body-1 font-weight-medium text-capitalize">{{ day }}</span>
                            </div>

                            <div class="flex-grow-1 w-100 mt-2 mt-sm-0">
                                <template v-if="!schedule.weekly[day].active">
                                    <div class="text-grey text-body-2 py-2">Unavailable</div>
                                </template>
                                <template v-else>
                                    <div v-for="(range, rIndex) in schedule.weekly[day].ranges" :key="rIndex" class="d-flex align-center mb-2 flex-wrap gap-2">
                                        <div class="d-flex align-center gap-2">
                                            <v-text-field
                                                v-model="range.start"
                                                type="time"
                                                variant="outlined"
                                                density="compact"
                                                hide-details
                                                style="width: 130px;"
                                                bg-color="white"
                                            ></v-text-field>
                                            <span class="text-grey">-</span>
                                            <v-text-field
                                                v-model="range.end"
                                                type="time"
                                                variant="outlined"
                                                density="compact"
                                                hide-details
                                                style="width: 130px;"
                                                bg-color="white"
                                            ></v-text-field>
                                        </div>
                                        
                                        <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="grey" @click="removeTimeRange(day, rIndex)" v-if="rIndex > 0 || schedule.weekly[day].ranges.length > 1"></v-btn>
                                        <v-btn icon="mdi-plus" variant="text" size="small" color="grey" @click="addTimeRange(day)" v-if="rIndex === schedule.weekly[day].ranges.length - 1"></v-btn>
                                    </div>
                                </template>
                            </div>

                            <div class="d-flex align-center" v-if="schedule.weekly[day].active">
                                <v-tooltip text="Copy to all days" location="top">
                                    <template v-slot:activator="{ props }">
                                         <v-btn icon="mdi-content-copy" variant="text" size="small" color="grey" v-bind="props" @click="copyToAllDays(day)"></v-btn>
                                    </template>
                                </v-tooltip>
                            </div>
                        </div>
                        <v-divider v-if="index < dayMapping.length - 1"></v-divider>
                    </div>
                </v-list>
            </v-card>

             <!-- Date Overrides List -->
            <v-card variant="outlined" class="border-sm rounded-xl">
                 <div class="pa-4 border-b">
                    <h3 class="text-h6 font-weight-bold">Date overrides</h3>
                    <p class="text-caption text-grey">Add dates when your availability changes from your daily hours.</p>
                </div>
                <div class="pa-4">
                    <div v-for="date in overrideDates" :key="date" class="d-flex justify-space-between align-center pa-4 border rounded-lg mb-3 bg-grey-lighten-5">
                        <div>
                            <div class="font-weight-bold">{{ formatOverrideDate(date) }}</div>
                            <div class="text-caption text-grey">
                                <span v-if="schedule.overrides[date] === null">Unavailable</span>
                                <span v-else>
                                    {{ schedule.overrides[date].map(r => `${formatTime(r.start)} - ${formatTime(r.end)}`).join(', ') }}
                                </span>
                            </div>
                        </div>
                         <div class="d-flex align-center">
                            <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="grey" @click="deleteOverride(date)"></v-btn>
                            <v-btn icon="mdi-pencil" variant="text" size="small" color="grey"></v-btn>
                        </div>
                    </div>
                    
                    <v-btn variant="outlined" rounded="lg" prepend-icon="mdi-plus" class="mt-2" @click="addOverride">
                        Add an override
                    </v-btn>
                </div>
            </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" md="4">
            <v-card variant="outlined" class="border-sm rounded-xl pa-4">
                 <h3 class="text-subtitle-1 font-weight-bold mb-4">Timezone</h3>
                 <v-autocomplete
                    v-model="schedule.timezone"
                    :items="validTimezones"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-earth"
                    menu-icon="mdi-chevron-down"
                 ></v-autocomplete>
            </v-card>
        </v-col>
    </v-row>

    <!-- Dialog for Override -->
    <v-dialog v-model="showOverrideDialog" max-width="800px">
        <v-card rounded="xl">
            <v-card-title class="pa-4 d-flex justify-space-between align-center">
                <span class="text-h6">Select the dates to override</span>
                 <v-btn icon="mdi-close" variant="text" @click="showOverrideDialog = false"></v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-row no-gutters>
                    <v-col cols="12" md="6" class="border-e">
                         <v-date-picker 
                            v-model="selectedOverrideDate" 
                            color="primary"
                            width="100%"
                            hide-header
                            elevation="0"
                         ></v-date-picker>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-6">
                        <div class="text-subtitle-2 mb-4">Which hours are you free?</div>
                        
                        <div class="mb-4">
                            <div class="d-flex align-center justify-space-between mb-2">
                                <span class="text-body-2">Mark unavailable (All day)</span>
                                <v-switch v-model="isUnavailableOverride" color="primary" hide-details density="compact" inset></v-switch>
                            </div>
                        </div>

                        <template v-if="!isUnavailableOverride">
                             <div v-for="(range, idx) in selectedOverrideRanges" :key="idx" class="d-flex align-center gap-2 mb-2">
                                <v-text-field
                                    v-model="range.start"
                                    type="time"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                ></v-text-field>
                                <span>-</span>
                                <v-text-field
                                    v-model="range.end"
                                    type="time"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                ></v-text-field>
                                <v-btn icon="mdi-plus" size="small" variant="text" v-if="idx === selectedOverrideRanges.length - 1" @click="selectedOverrideRanges.push({start: '09:00', end: '17:00'})"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" size="small" variant="text" v-if="selectedOverrideRanges.length > 1" @click="selectedOverrideRanges.splice(idx, 1)"></v-btn>
                             </div>
                        </template>
                        <template v-else>
                            <v-text-field disabled model-value="Unavailable all day" variant="outlined" density="compact"></v-text-field>
                        </template>

                        <div class="d-flex justify-end mt-8">
                            <v-btn variant="text" class="mr-2" @click="showOverrideDialog = false">Close</v-btn>
                            <v-btn color="black" @click="saveOverride">Save override</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}
.gap-4 {
    gap: 16px;
}
.hover-bg:hover {
    background-color: #fafafa;
}
.border-sm {
    border-color: #e0e0e0 !important;
}
</style>

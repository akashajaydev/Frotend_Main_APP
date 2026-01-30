<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import moment from 'moment'
import { useUIStore } from '~/stores/ui'
import { useSnackStore } from '~/stores/snack'
import helpers from '~/utils/helpers'

const ui = useUIStore()
const snack = useSnackStore()

// State
const date = ref(moment().format('YYYY-MM-DD'))
const timings = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)

// Generate dummy slots for 24 hours
const generateDummySlots = () => {
    const slots = []
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const startH = h.toString().padStart(2, '0')
            const startM = m.toString().padStart(2, '0')
            
            let endHVal = h
            let endMVal = m + 15
            if (endMVal >= 60) {
                endHVal++
                endMVal = 0
            }
            const endH = endHVal.toString().padStart(2, '0')
            const endM = endMVal.toString().padStart(2, '0')

            const isUnavailable = Math.random() < 0.3 // Randomly unavailable

            slots.push({
                start: `${startH}:${startM}`,
                end: `${endH}:${endM}`,
                unavailable: isUnavailable,
                // If unavailable, 30% chance it has an order (Booked)
                order: isUnavailable && Math.random() < 0.3 ? '65c1a9f0e12a4c' + Math.floor(Math.random() * 1000) : undefined
            })
        }
    }
    return slots
}

// Fetch availabilities
async function fetchAvailabilities() {
  loading.value = true
  try {
    const { ok, json } = await helpers.apiCall(`/availabilities/${date.value}`, {
      method: 'GET'
    })
    if (ok) {
      timings.value = json.availabilities.timings
    } else {
        // Fallback to dummy data as requested
        console.warn('API unavailable, using dummy data')
        timings.value = generateDummySlots()
        snack.info('Showing dummy data')
    }
  } catch (e) {
    console.error(e)
    // Fallback to dummy data as requested
    timings.value = generateDummySlots()
    snack.info('Showing dummy data')
  } finally {
    loading.value = false
  }
}

// Update availability
async function toggleAvailability(slot: any) {
  if (saving.value) return
  
  // Don't allow interacting with booked slots if that's the desired behavior, 
  // but usually admin can override. Let's warn or just process it.
  // For now, simple toggle.
  
  // Optimistic update for UI responsiveness
  const originalState = slot.unavailable
  slot.unavailable = !slot.unavailable
  if (!slot.unavailable) {
      // If making available, remove order info from UI immediately
      slot.order = undefined 
  }
  
  saving.value = true
  
  const isUnavailable = originalState // what it WAS before toggle
  // If it WAS unavailable, we are making it available.
  
  const payload: any = {
    date: date.value,
  }

  // Logic: The API expects what we WANT to do.
  if (originalState) {
    // It was unavailable, so we are sending an "available" payload to open it up
    payload.available = {
      start: slot.start,
      end: slot.end
    }
  } else {
    // It was available, so we are sending an "unavailable" payload to block it
    payload.unavailable = {
      start: slot.start,
      end: slot.end
    }
  }

  try {
    const { ok, json } = await helpers.apiCall('/availabilities', {
      method: 'PUT',
      json: payload
    })
    
    if (ok) {
      // API success
      if (json.availabilities && json.availabilities.timings) {
         timings.value = json.availabilities.timings
      }
      snack.success('Availability updated')
    } else {
         // Revert on failure
         slot.unavailable = originalState
         // If we are in dummy mode, just pretend it worked
         snack.info('Dummy mode: Updated locally')
    }
  } catch (e) {
    console.error(e)
    // Revert on failure, or keep if dummy mode
    snack.info('Dummy mode: Updated locally')
  } finally {
    saving.value = false
  }
}

// Watch date change
watch(date, () => {
  fetchAvailabilities()
})

onMounted(() => {
  fetchAvailabilities()
})

// Helper for display
const formatTime = (time: string) => {
    return moment(time, 'HH:mm').format('h:mm A')
}
</script>

<template>
  <v-container fluid class="pa-6">
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">User Availabilities</h1>
        <p class="text-subtitle-1 text-grey">Manage availability slots for {{ moment(date).format('MMMM Do YYYY') }}</p>
      </div>
      
      <div class="d-flex align-center gap-4" style="min-width: 300px;">
        <v-text-field
          v-model="date"
          type="date"
          label="Select Date"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          prepend-inner-icon="mdi-calendar"
          bg-color="white"
        ></v-text-field>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-center align-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Timings Grid -->
    <v-card v-else elevation="2" rounded="xl" class="pa-6">
        <template v-if="timings.length === 0">
             <div class="text-center py-8 text-grey">No timings available. Please check the API or try another date.</div>
        </template>
        
        <div v-else class="timings-grid">
            <v-card
                v-for="(slot, i) in timings"
                :key="i"
                :color="slot.unavailable ? (slot.order ? 'deep-purple-lighten-5' : 'grey-lighten-3') : 'green-lighten-5'"
                class="time-slot-card d-flex align-center justify-center pa-3 cursor-pointer transition-swing"
                :class="{
                    'unavailable': slot.unavailable && !slot.order, 
                    'booked': slot.unavailable && slot.order,
                    'elevation-2': !slot.unavailable
                }"
                @click="toggleAvailability(slot)"
                variant="flat"
                :disabled="saving"
            >
                <div class="text-center">
                    <div class="text-subtitle-2 font-weight-bold" 
                         :class="slot.unavailable ? (slot.order ? 'text-deep-purple-darken-3' : 'text-grey') : 'text-green-darken-3'">
                        {{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}
                    </div>
                    <div class="text-caption mt-1">
                         <template v-if="slot.unavailable">
                             <template v-if="slot.order">
                                 <v-icon size="small" icon="mdi-calendar-check" color="deep-purple-darken-2"></v-icon>
                                 <span class="ml-1 text-deep-purple-darken-2 font-weight-bold">Booked</span>
                             </template>
                             <template v-else>
                                 <v-icon size="small" icon="mdi-block-helper" color="grey"></v-icon>
                                 <span class="ml-1 text-grey">Blocked</span>
                             </template>
                         </template>
                         <template v-else>
                             <v-icon size="small" icon="mdi-check-circle-outline" color="success"></v-icon>
                             <span class="ml-1 text-success">Available</span>
                         </template>
                    </div>
                </div>
            </v-card>
        </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.timings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
}

.time-slot-card {
    border: 1px solid transparent;
    transition: all 0.2s ease;
    border-radius: 12px;
}

.time-slot-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}

.time-slot-card.unavailable {
    border: 1px dashed #bdbdbd;
    background-color: #f5f5f5 !important;
    opacity: 0.8;
}

.time-slot-card.booked {
    border: 1px solid #d1c4e9;
    background-color: #ede7f6 !important;
}

.time-slot-card.unavailable:hover, .time-slot-card.booked:hover {
    border-color: #9e9e9e;
    opacity: 1;
}

.gap-4 {
    gap: 16px;
}
</style>

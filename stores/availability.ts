import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid' // We'll need a simple ID generator or we can use a helper if available. Check package.json for uuid, or just use Math.random/Date for now if no uuid lib.

// Checking package.json... I don't recall seeing 'uuid'. I'll use a simple helper function.
const generateId = () => Math.random().toString(36).substring(2, 9)

export interface TimeRange {
    id: string
    start: string // "HH:mm"
    end: string   // "HH:mm"
}

export interface DaySchedule {
    active: boolean
    ranges: TimeRange[]
}

export interface Schedule {
    id: string
    name: string
    isDefault: boolean
    timezone: string
    weekly: {
        monday: DaySchedule
        tuesday: DaySchedule
        wednesday: DaySchedule
        thursday: DaySchedule
        friday: DaySchedule
        saturday: DaySchedule
        sunday: DaySchedule
    }
    overrides: Record<string, TimeRange[] | null> // date "YYYY-MM-DD" -> ranges or null (unavailable)
}

const defaultWeeklySchedule = (): Schedule['weekly'] => ({
    monday: { active: true, ranges: [{ id: generateId(), start: '09:00', end: '17:00' }] },
    tuesday: { active: true, ranges: [{ id: generateId(), start: '09:00', end: '17:00' }] },
    wednesday: { active: true, ranges: [{ id: generateId(), start: '09:00', end: '17:00' }] },
    thursday: { active: true, ranges: [{ id: generateId(), start: '09:00', end: '17:00' }] },
    friday: { active: true, ranges: [{ id: generateId(), start: '09:00', end: '17:00' }] },
    saturday: { active: false, ranges: [{ id: generateId(), start: '09:00', end: '17:00' }] },
    sunday: { active: false, ranges: [{ id: generateId(), start: '09:00', end: '17:00' }] },
})

export const useAvailabilityStore = defineStore('availability', {
    state: () => ({
        schedules: [
            {
                id: 'default',
                name: 'Working Hours',
                isDefault: true,
                timezone: 'America/New_York', // Example default
                weekly: defaultWeeklySchedule(),
                overrides: {}
            }
        ] as Schedule[]
    }),

    actions: {
        // Returns a new schedule object WITHOUT adding it to the store
        getNewSchedule(): Schedule {
            return {
                id: generateId(),
                name: 'New Schedule',
                isDefault: false,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                weekly: defaultWeeklySchedule(),
                overrides: {}
            }
        },

        addSchedule(schedule: Schedule) {
            this.schedules.push(schedule)
        },

        createSchedule() {
            const newSchedule = this.getNewSchedule()
            this.addSchedule(newSchedule)
            return newSchedule.id
        },

        updateSchedule(id: string, updates: Partial<Schedule>) {
            const index = this.schedules.findIndex(s => s.id === id)
            if (index !== -1) {
                this.schedules[index] = { ...this.schedules[index], ...updates }
            }
        },

        deleteSchedule(id: string) {
            if (id === 'default') return // Prevent deleting default for now if it's the only one
            this.schedules = this.schedules.filter(s => s.id !== id)
        },

        getScheduleById(id: string) {
            return this.schedules.find(s => s.id === id)
        },

        setDefault(id: string) {
            this.schedules.forEach(s => {
                s.isDefault = (s.id === id)
            })
        }
    }
})

import { defineStore } from 'pinia'
import helpers from '~/utils/helpers'

const generateId = () => Math.random().toString(36).substring(2, 9)

export interface TimeRange {
    id?: string
    start: string // "HH:mm"
    end: string   // "HH:mm"
    _id?: string
}

export interface DaySchedule {
    active: boolean
    ranges: TimeRange[]
    _id?: string
}

export interface Schedule {
    id: string // 'common' or uuid
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
    overrides: Record<string, TimeRange[] | null>
}

// Check if Schedule has all required properties
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
        schedules: [] as Schedule[],
        loading: false
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

        async updateSchedule(id: string, updates: Partial<Schedule>) {
            const index = this.schedules.findIndex(s => s.id === id)
            if (index !== -1) {
                // If it's the common schedule, sync with API
                if (id === 'common') {
                    const updatedSchedule = { ...this.schedules[index], ...updates }

                    // Transform back to API format
                    const apiPayload: any = {}

                    if (updates.timezone) apiPayload.timezone = updates.timezone

                    if (updates.weekly) {
                        apiPayload.workingHours = Object.entries(updatedSchedule.weekly).map(([day, schedule]: [string, any]) => ({
                            day,
                            enabled: schedule.active,
                            hoursRange: schedule.ranges.map((r: any) => ({
                                start: r.start,
                                end: r.end
                            }))
                        }))
                    }

                    // Only call API if there are relevant changes
                    if (Object.keys(apiPayload).length > 0) {
                        try {
                            const { ok } = await helpers.apiCall('/admin/misc', {
                                method: 'PATCH',
                                json: apiPayload
                            })
                            if (!ok) throw new Error('Failed to update availabilities')
                        } catch (e) {
                            console.error(e)
                            // Optionally revert state or show error
                            return
                        }
                    }
                }

                this.schedules[index] = { ...this.schedules[index], ...updates }
            }
        },

        deleteSchedule(id: string) {
            if (id === 'common') return // Cannot delete the main schedule
            this.schedules = this.schedules.filter(s => s.id !== id)
        },

        getScheduleById(id: string) {
            return this.schedules.find(s => s.id === id)
        },

        setDefault(id: string) {
            this.schedules.forEach(s => {
                s.isDefault = (s.id === id)
            })
        },

        async fetchAvailability() {
            this.loading = true
            try {
                const { ok, json } = await helpers.apiCall('/admin/misc')
                if (ok && json.misc) {
                    const misc = json.misc

                    // Transform API response to Store Schedule format
                    const weekly: any = { ...defaultWeeklySchedule() }

                    if (misc.workingHours && Array.isArray(misc.workingHours)) {
                        misc.workingHours.forEach((wh: any) => {
                            if (weekly[wh.day]) {
                                weekly[wh.day].active = wh.enabled ?? true
                                weekly[wh.day].ranges = (wh.hoursRange || []).map((r: any) => ({
                                    id: r._id || generateId(),
                                    start: r.start,
                                    end: r.end
                                }))
                            }
                        })
                    }

                    const commonSchedule: Schedule = {
                        id: 'common',
                        name: 'Working Hours',
                        isDefault: true,
                        timezone: misc.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                        weekly: weekly,
                        overrides: {} // API doesn't seem to have overrides yet, keeping empty
                    }

                    // Check if common schedule exists, update or push
                    const existingIndex = this.schedules.findIndex(s => s.id === 'common')
                    if (existingIndex !== -1) {
                        this.schedules[existingIndex] = commonSchedule
                    } else {
                        this.schedules.unshift(commonSchedule)
                    }
                }
            } catch (e) {
                console.error('Failed to fetch availabilities', e)
            } finally {
                this.loading = false
            }
        }
    }
})

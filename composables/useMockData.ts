export const useMockData = () => {
    const admins = useState('admins', () => [
        { id: 1, name: 'Baba Ram', email: 'baba@example.com', type: 'Baba', active: true, avatar: '' },
        { id: 2, name: 'Astro John', email: 'astro@example.com', type: 'Astrologer', active: true, avatar: '' },
        { id: 3, name: 'Healer Mary', email: 'healer@example.com', type: 'Healer', active: false, avatar: '' },
        { id: 4, name: 'Baba Shyam', email: 'shyam@example.com', type: 'Baba', active: true, avatar: '' },
        { id: 5, name: 'Astro Mike', email: 'mike@example.com', type: 'Astrologer', active: true, avatar: '' },
        { id: 6, name: 'Healer Sarah', email: 'sarah@example.com', type: 'Healer', active: true, avatar: '' },
        { id: 7, name: 'Baba Ganeshan', email: 'ganeshan@example.com', type: 'Baba', active: false, avatar: '' },
    ])

    const appointments = useState('appointments', () => [
        { id: 101, customer: 'Alice Smith', service: 'Astrology Reading', date: '2025-10-25 10:00 AM', status: 'Pending', assignedTo: null, description: 'Client seeks guidance on career path and relationship issues. Interested in Vedic astrology.' },
        { id: 102, customer: 'Bob Jones', service: 'Healing Session', date: '2025-10-26 02:00 PM', status: 'Confirmed', assignedTo: 3, description: 'Recurring back pain and stress management. Previous sessions have been helpful.' }, // Assigned to Mary
        { id: 103, customer: 'Charlie Brown', service: 'Baba Consultation', date: '2025-10-27 11:30 AM', status: 'Pending', assignedTo: null, description: 'Spiritual guidance and general consultation regarding family matters.' },
        { id: 104, customer: 'Diana Prince', service: 'Astrology Reading', date: '2025-10-28 09:00 AM', status: 'Completed', assignedTo: 2, description: 'Annual reading to check astrological charts for the upcoming year.' }, // Assigned to John
        { id: 105, customer: 'Ethan Hunt', service: 'Healing Session', date: '2025-10-29 03:00 PM', status: 'Pending', assignedTo: null, description: 'Post-injury recovery session. Focus on energy flow and muscle relaxation.' },
    ])

    const getAdminById = (id: number) => {
        return admins.value.find(a => a.id === id)
    }

    const getAppointmentById = (id: number) => {
        return appointments.value.find(a => a.id === id)
    }

    return {
        admins,
        appointments,
        getAdminById,
        getAppointmentById
    }
}

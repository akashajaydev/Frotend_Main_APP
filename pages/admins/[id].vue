<script setup lang="ts">
const route = useRoute()
const adminId = route.params.id

// Mock Data
const admin = ref({
    id: adminId,
    name: 'Baba Ram',
    email: 'baba@example.com',
    type: 'Baba',
    avatar: '',
    joined: '2025-01-10',
    active: true
})

const appointments = ref([
    { id: 101, customer: 'Rohan Set', date: '2026-01-20', time: '10:00 AM', status: 'Scheduled' },
    { id: 102, customer: 'Meera Jain', date: '2026-01-22', time: '02:00 PM', status: 'Completed' },
])

// In a real app, fetch data based on adminId
// onMounted(async () => {
//    admin.value = await fetchAdmin(adminId)
//    appointments.value = await fetchAppointments(adminId)
// })

</script>

<template>
    <v-container fluid class="pa-6">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="navigateTo('/')" class="mb-4">Back to Admins</v-btn>
        
        <v-row>
            <v-col cols="12" md="4">
                <v-card elevation="2" rounded="xl" class="text-center pa-6">
                    <v-avatar size="120" color="grey-lighten-2" class="mb-4">
                        <v-img v-if="admin.avatar" :src="admin.avatar"></v-img>
                        <v-icon v-else icon="mdi-account" size="60" color="grey"></v-icon>
                    </v-avatar>
                    <h2 class="text-h5 font-weight-bold">{{ admin.name }}</h2>
                    <p class="text-subtitle-1 text-grey mb-2">{{ admin.email }}</p>
                    <v-chip color="primary" class="mb-4">{{ admin.type }}</v-chip>
                    
                    <v-divider class="my-4"></v-divider>
                    
                    <div class="text-left">
                        <div class="mb-2">
                             <span class="text-grey">Joined:</span> 
                             <span class="font-weight-medium float-right">{{ admin.joined }}</span>
                        </div>
                         <div class="mb-2">
                             <span class="text-grey">Status:</span> 
                             <span class="font-weight-medium float-right text-success" v-if="admin.active">Active</span>
                             <span class="font-weight-medium float-right text-error" v-else>Inactive</span>
                        </div>
                    </div>
                </v-card>
            </v-col>
            
            <v-col cols="12" md="8">
                <v-card elevation="2" rounded="xl">
                    <v-card-title class="pa-4 font-weight-bold">Appointments</v-card-title>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">ID</th>
                                <th class="text-left">Customer</th>
                                <th class="text-left">Date & Time</th>
                                <th class="text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="apt in appointments" :key="apt.id">
                                <td>#{{ apt.id }}</td>
                                <td class="font-weight-medium">{{ apt.customer }}</td>
                                <td>{{ apt.date }} at {{ apt.time }}</td>
                                <td>
                                    <v-chip size="small" :color="apt.status === 'Scheduled' ? 'primary' : 'success'" label>{{ apt.status }}</v-chip>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>

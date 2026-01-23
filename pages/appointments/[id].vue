<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const { getAppointmentById, getAdminById } = useMockData()

const appointmentId = Number(route.params.id)
const appointment = getAppointmentById(appointmentId)

// If not found, redirect (or show error)
if (!appointment) {
    router.push('/appointments')
}

const assignedAdmin = computed(() => {
    return appointment?.assignedTo ? getAdminById(appointment.assignedTo) : null
})

// -- Chat State --
const newMessage = ref('')
const messages = ref([
    { id: 1, text: 'Hi, I have reviewing the customer details.', sender: 'specialist', time: '10:05 AM' },
    { id: 2, text: 'Great, please let me know if you need any specific charts.', sender: 'me', time: '10:10 AM' },
])

//Scroll to bottom ref
const messagesContainer = ref<HTMLElement | null>(null)

function sendMessage() {
    if (!newMessage.value.trim()) return
    messages.value.push({
        id: Date.now(),
        text: newMessage.value,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    newMessage.value = ''
    
    // Auto scroll to bottom
    setTimeout(() => {
        if(messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    }, 50)
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
    <v-container fluid class="fill-height dark-page pa-6 align-start" v-if="appointment">
        <div class="w-100">
             <!-- Header -->
            <div class="d-flex align-center mb-6">
                <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" class="mr-4"></v-btn>
                <div>
                     <h1 class="text-h4 font-weight-black text-grey-darken-3">Appointment Details</h1>
                     <div class="text-subtitle-1 text-grey-darken-1">ID: #{{ appointment.id }}</div>
                </div>
            </div>

            <v-row>
                <!-- Left Column: Details -->
                <v-col cols="12" md="7" lg="8">
                    <v-card class="rounded-xl pa-6 border-thin elevation-2 h-100">
                        <!-- Status & Quick Info -->
                        <div class="d-flex justify-space-between align-start mb-6">
                             <div>
                                <div class="text-overline text-primary mb-1">{{ appointment.service }}</div>
                                <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">{{ appointment.customer }}</h2>
                                 <div class="d-flex align-center text-grey-darken-2">
                                     <v-icon icon="mdi-calendar-clock" start size="small"></v-icon>
                                     <span class="text-body-1 font-weight-medium">{{ appointment.date }}</span>
                                </div>
                             </div>
                             <v-chip :color="getStatusColor(appointment.status)" class="font-weight-bold elevation-1 text-uppercase" size="large" label>
                                {{ appointment.status }}
                            </v-chip>
                        </div>

                        <v-divider class="mb-6"></v-divider>

                        <!-- Description / Notes -->
                         <div class="mb-6">
                             <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-3">Description</h3>
                             <p class="text-body-1 text-grey-darken-1 search-text">
                                 {{ appointment.description || 'No additional notes provided for this appointment.' }}
                             </p>
                         </div>
                         
                         <!-- Customer Info (Mock) -->
                         <div>
                            <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-3">Customer Contact</h3>
                             <v-list density="compact" class="bg-grey-lighten-5 rounded-lg pa-2">
                                 <v-list-item prepend-icon="mdi-email-outline">
                                     <v-list-item-title>customer@example.com</v-list-item-title>
                                     <v-list-item-subtitle>Email</v-list-item-subtitle>
                                 </v-list-item>
                                 <v-list-item prepend-icon="mdi-phone-outline">
                                     <v-list-item-title>+1 (555) 123-4567</v-list-item-title>
                                     <v-list-item-subtitle>Phone</v-list-item-subtitle>
                                 </v-list-item>
                             </v-list>
                         </div>

                    </v-card>
                </v-col>

                <!-- Right Column: Specialist & Chat -->
                <v-col cols="12" md="5" lg="4">
                    <!-- Specialist Profile -->
                    <v-card class="rounded-xl overflow-hidden elevation-2 mb-4" v-if="assignedAdmin">
                        <div class="bg-primary pa-4 text-center">
                            <v-avatar size="80" class="border-lg border-white elevation-2 mb-2">
                                <v-img :src="assignedAdmin.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" cover></v-img>
                            </v-avatar>
                            <div class="text-h6 font-weight-bold text-white">{{ assignedAdmin.name }}</div>
                            <div class="text-subtitle-2 text-white opacity-80">{{ assignedAdmin.type }}</div>
                        </div>
                    </v-card>

                     <!-- Unassigned Info -->
                    <v-card class="rounded-xl pa-6 text-center border-dashed mb-4 bg-grey-lighten-5" v-else>
                         <v-icon icon="mdi-account-alert-outline" size="48" color="grey"></v-icon>
                         <div class="text-h6 text-grey-darken-2 mt-2">No Specialist Assigned</div>
                         <div class="text-body-2 text-grey mb-4">Assign a specialist to enable chat.</div>
                    </v-card>

                    <!-- Chat Interface -->
                    <v-card class="rounded-xl elevation-2 d-flex flex-column chat-card" height="500" v-if="assignedAdmin">
                        <v-toolbar density="compact" color="white" class="border-b px-2">
                            <span class="text-subtitle-1 font-weight-bold ml-2">Team Chat</span>
                            <v-spacer></v-spacer>
                            <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" color="grey"></v-btn>
                        </v-toolbar>

                        <div class="flex-grow-1 overflow-y-auto pa-4 bg-blue-grey-lighten-5" ref="messagesContainer">
                            <div v-for="msg in messages" :key="msg.id" class="d-flex mb-4" :class="msg.sender === 'me' ? 'justify-end' : 'justify-start'">
                                <div class="message-bubble pa-3 rounded-lg elevation-1" :class="msg.sender === 'me' ? 'bg-primary text-white rounded-tr-0' : 'bg-white rounded-tl-0'">
                                    <div class="text-body-2">{{ msg.text }}</div>
                                    <div class="text-caption mt-1" :class="msg.sender === 'me' ? 'text-blue-grey-lighten-4' : 'text-grey'">{{ msg.time }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="pa-3 bg-white border-t">
                            <v-text-field
                                v-model="newMessage"
                                variant="outlined"
                                density="comfortable"
                                rounded="lg"
                                hide-details
                                placeholder="Type a message..."
                                bg-color="grey-lighten-5"
                                @keyup.enter="sendMessage"
                            >
                                <template v-slot:append-inner>
                                    <v-btn icon="mdi-send" variant="text" color="primary" density="compact" @click="sendMessage"></v-btn>
                                </template>
                            </v-text-field>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<style scoped>
.dark-page {
  background-color: #f0ecec;
}
.border-dashed {
    border-style: dashed !important;
    border-width: 2px;
}
.chat-card {
    border: 1px solid rgba(0,0,0,0.05);
}
.message-bubble {
    max-width: 80%;
    position: relative;
}
.search-text {
    line-height: 1.6;
}
</style>

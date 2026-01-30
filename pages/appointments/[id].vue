<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const { getAppointmentById, getAdminById, admins } = useMockData()

const appointmentId = Number(route.params.id)
const appointment = getAppointmentById(appointmentId)

// If not found, redirect (or show error)
if (!appointment) {
    router.push('/appointments')
}

const assignedAdmin = computed(() => {
    return appointment?.assignedTo ? getAdminById(appointment.assignedTo) : null
})

// -- Assignment State --
const assignDialog = ref(false)
const searchQuery = ref('')
const filteredAdmins = computed(() => {
    if (!searchQuery.value) return admins.value
    const lower = searchQuery.value.toLowerCase()
    return admins.value.filter(a => 
        a.name.toLowerCase().includes(lower) || 
        a.type.toLowerCase().includes(lower)
    )
})

function openAssignDialog() {
    searchQuery.value = ''
    assignDialog.value = true
}

function assignAdmin(admin: any) {
    if (appointment) {
        appointment.assignedTo = admin.id
        if (appointment.status === 'Pending') {
             appointment.status = 'Confirmed'
        }
        assignDialog.value = false
    }
}

function removeAssignment() {
    if (appointment) {
        appointment.assignedTo = null
        if (appointment.status === 'Confirmed') {
            appointment.status = 'Pending'
        }
    }
}

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

const getRoleTheme = (type: string) => {
  switch (type) {
    case 'Baba': return { color: 'orange-darken-2', icon: 'mdi-om' }
    case 'Astrologer': return { color: 'deep-purple-lighten-1', icon: 'mdi-star-four-points' }
    case 'Healer': return { color: 'teal-lighten-1', icon: 'mdi-hand-heart' }
    default: return { color: 'grey', icon: 'mdi-account' }
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
                        <div class="bg-primary pa-4 text-center position-relative">
                            <v-btn icon="mdi-pencil" size="small" variant="text" color="white" class="position-absolute top-0 right-0 ma-2" @click="openAssignDialog">
                                <v-icon icon="mdi-pencil"></v-icon>
                                <v-tooltip activator="parent" location="bottom">Change Specialist</v-tooltip>
                            </v-btn>
                             <v-btn icon="mdi-close-circle" size="small" variant="text" color="white" class="position-absolute top-0 left-0 ma-2" @click="removeAssignment">
                                <v-icon icon="mdi-close-circle"></v-icon>
                                <v-tooltip activator="parent" location="bottom">Remove Assignment</v-tooltip>
                            </v-btn>

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
                         <v-btn color="primary" rounded="lg" prepend-icon="mdi-plus" @click="openAssignDialog">Assign Now</v-btn>
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
                                    <v-btn icon="mdi-microphone" variant="text" color="grey-darken-1" density="compact" class="mr-1"></v-btn>
                                    <v-btn icon="mdi-send" variant="text" color="primary" density="compact" @click="sendMessage"></v-btn>
                                </template>
                            </v-text-field>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <!-- Assignment Dialog -->
        <v-dialog v-model="assignDialog" max-width="550px" transition="dialog-bottom-transition">
            <v-card class="rounded-xl overflow-hidden bg-white">
                <v-toolbar color="primary" class="px-4">
                     <v-icon icon="mdi-account-search" class="mr-2"></v-icon>
                     <v-toolbar-title class="text-h6 font-weight-bold">Assign Specialist</v-toolbar-title>
                     <v-btn icon="mdi-close" variant="text" @click="assignDialog = false"></v-btn>
                </v-toolbar>

                <div class="pa-5 bg-grey-lighten-5">
                     <div class="mb-4 d-flex align-center">
                        <v-avatar color="white" class="elevation-1 mr-3">
                            <v-icon icon="mdi-calendar-check" color="primary"></v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-caption text-grey font-weight-bold">Target Appointment</div>
                            <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ appointment.customer }} <span class="text-grey mx-1">•</span> {{ appointment.service }}</div>
                        </div>
                     </div>

                    <v-text-field
                        v-model="searchQuery"
                        prepend-inner-icon="mdi-magnify"
                        label="Search available staff..."
                        placeholder="Type name or role (e.g. 'Baba')"
                        variant="solo"
                        density="comfortable"
                        bg-color="white"
                        rounded="lg"
                        hide-details
                        class="elevation-1"
                    ></v-text-field>
                </div>
                
                <v-divider></v-divider>

                <v-list class="pa-2 bg-white" max-height="400" style="overflow-y: auto;">
                    <div class="text-caption font-weight-bold text-grey ml-4 mt-2 mb-2">AVAILABLE STAFF</div>
                    <template v-if="filteredAdmins.length > 0">
                        <v-list-item
                            v-for="admin in filteredAdmins"
                            :key="admin.id"
                            @click="assignAdmin(admin)"
                            rounded="lg"
                            class="mb-2 admin-list-item mx-2 border-thin"
                            lines="two"
                            :disabled="!admin.active"
                            :base-color="admin.active ? 'white' : 'grey-lighten-4'"
                        >
                            <template v-slot:prepend>
                                 <v-badge 
                                    dot 
                                    :color="admin.active ? 'success' : 'grey'"
                                    location="bottom right"
                                    offset-x="5"
                                    offset-y="5"
                                >
                                    <v-avatar size="50" class="border elevation-1">
                                        <v-img :src="admin.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'" cover></v-img>
                                    </v-avatar>
                                </v-badge>
                            </template>

                            <v-list-item-title class="font-weight-bold text-body-1 ml-2" style="color: #212121">{{ admin.name }}</v-list-item-title>
                            <v-list-item-subtitle class="d-flex align-center mt-1 ml-2">
                                <v-chip size="x-small" :color="getRoleTheme(admin.type).color" variant="tonal" class="mr-2 font-weight-bold">
                                    {{ admin.type }}
                                </v-chip>
                                <span v-if="!admin.active" class="text-error text-caption font-weight-medium">
                                    <v-icon icon="mdi-cancel" size="small" start></v-icon>Unavailable
                                </span>
                            </v-list-item-subtitle>
                            
                            <template v-slot:append>
                                <v-btn 
                                    v-if="appointment.assignedTo === admin.id" 
                                    color="success" 
                                    variant="tonal" 
                                    size="small" 
                                    class="font-weight-bold"
                                    prepend-icon="mdi-check"
                                >
                                    Assigned
                                </v-btn>
                                <v-btn 
                                    v-else-if="admin.active"
                                    variant="text" 
                                    color="primary" 
                                    icon="mdi-chevron-right"
                                ></v-btn>
                            </template>
                        </v-list-item>
                    </template>
                    <div v-else class="text-center py-12">
                        <v-icon icon="mdi-account-off-outline" size="64" color="grey-lighten-2" class="mb-4"></v-icon>
                        <div class="text-h6 text-grey">No matches found</div>
                        <div class="text-body-2 text-grey-lighten-1">Try searching for a different name or role</div>
                    </div>
                </v-list>
            </v-card>
        </v-dialog>
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
/* Reused from index.vue */
.admin-list-item {
    transition: all 0.2s;
}

.admin-list-item:hover {
    background-color: #F5F5F5;
    transform: translateX(4px);
}
</style>

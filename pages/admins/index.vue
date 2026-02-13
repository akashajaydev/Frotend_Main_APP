<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAdminsStore } from '~/stores/admins'

const adminsStore = useAdminsStore()
const search = ref('')
const createDialog = ref(false)

const newAdmin = ref({
  name: '',
  email: '',
  phone: '',
  role: 'admin:baba', 
  password: ''
})

const adminTypes = [
    { title: 'Baba', value: 'admin:baba' }, 
    { title: 'Astrologer', value: 'admin:astrologer' }, 
    { title: 'Healer', value: 'admin:healer' }
]

const headers = [
  { title: 'S.No', key: 'sno', align: 'start' },
  { title: 'Admin', key: 'name', align: 'start' },
  { title: 'Role', key: 'role', align: 'center' },
  { title: 'Created At', key: 'createdAt', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

// Helper for Role styling
const getRoleTheme = (role: string) => {
  // Normalize role string just in case
  const r = role.toLowerCase()
  if (r.includes('baba')) return { color: 'orange-darken-2', icon: 'mdi-om', label: 'Baba' }
  if (r.includes('astrologer')) return { color: 'deep-purple-lighten-1', icon: 'mdi-star-four-points', label: 'Astrologer' }
  if (r.includes('healer')) return { color: 'teal-lighten-1', icon: 'mdi-hand-heart', label: 'Healer' }
  return { color: 'grey', icon: 'mdi-account', label: role }
}

onMounted(() => {
    adminsStore.fetchAdmins()
})

const admins = computed(() => adminsStore.admins)
const loading = computed(() => adminsStore.loading)

async function createAdmin() {
    if (!newAdmin.value.name || !newAdmin.value.email || !newAdmin.value.password) {
        // Basic client-side validation could be improved
        alert('Please fill in all required fields')
        return
    }

    const payload = {
        name: newAdmin.value.name,
        email: newAdmin.value.email,
        phone: newAdmin.value.phone,
        password: newAdmin.value.password,
        role: newAdmin.value.role
    }

    const result = await adminsStore.createAdmin(payload)
    
    if (result.success) {
        createDialog.value = false
        // Reset form
        newAdmin.value = { 
            name: '', 
            email: '', 
            phone: '', 
            role: 'admin:baba', 
            password: '' 
        }
    } else {
        alert(result.message)
    }
}

function openCreateDialog() {
  createDialog.value = true
}

function viewAdmin(item: any) {
  // navigateTo(`/admins/${item._id}`) // Using _id from API
  console.log('View admin', item)
}

function editAdmin(item: any) {
  // Logic to edit
  console.log('Edit', item)
}

function deleteAdmin(item: any) {
  // Logic to delete
  console.log('Delete', item)
}

function formatDate(dateString: string) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>

<template>
  <v-container fluid class="pa-6">
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-8 gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Admins</h1>
        <p class="text-subtitle-1 text-grey">Manage your Babas, Astrologers, and Healers</p>
      </div>
      <div class="d-flex gap-4 align-center">
        <v-chip
           color="primary"
           variant="tonal"
           size="large"
           class="font-weight-bold"
        >
          Admins - {{ admins.length }}
        </v-chip>
        <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            label="Search Admins"
            single-line
            hide-details
            variant="outlined"
            rounded="xl"
            class="search-field"
            style="width: 300px; max-width: 100%;"
        ></v-text-field>
        <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            rounded="xl"
            size="large"
            elevation="3"
            @click="openCreateDialog"
            class="text-none font-weight-bold"
        >
            Create Admin
        </v-btn>
      </div>
    </div>

    <v-card elevation="2" rounded="xl" class="overflow-hidden">
      <v-data-table
        :headers="headers"
        :items="admins"
        :search="search"
        :loading="loading"
        class="admin-table"
        hover
      >
        <!-- S.No Slot -->
        <template v-slot:item.sno="{ index }">
           <div class="text-body-2 font-weight-medium text-grey-darken-2 pl-2">{{ index + 1 }}</div>
        </template>

        <!-- Admin Name & Avatar Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" class="mr-3 elevation-2">
              <v-img :src="'https://randomuser.me/api/portraits/men/85.jpg'" cover></v-img>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">{{ item.name }}</div>
              <div class="text-caption text-grey-darken-3">{{ item.email }}</div>
              <div class="text-caption text-grey-darken-3">{{ item.phone }}</div>
            </div>
          </div>
        </template>

        <!-- Role Slot -->
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleTheme(item.role).color"
            variant="tonal"
            size="small"
            class="font-weight-bold px-3"
            label
          >
            <v-icon start size="small" :icon="getRoleTheme(item.role).icon"></v-icon>
            {{ getRoleTheme(item.role).label }}
          </v-chip>
        </template>

        <!-- Created At Slot -->
        <template v-slot:item.createdAt="{ item }">
            <div class="text-body-2 text-grey-darken-2">{{ formatDate(item.createdAt) }}</div>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end">
                <v-btn icon size="small" variant="text" color="grey" @click="viewAdmin(item)">
                    <v-icon>mdi-eye-outline</v-icon>
                    <v-tooltip activator="parent" location="top">View</v-tooltip>
                </v-btn>
                <v-btn icon size="small" variant="text" color="primary" @click="editAdmin(item)">
                    <v-icon>mdi-pencil-outline</v-icon>
                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                </v-btn>
                <v-btn icon size="small" variant="text" color="error" @click="deleteAdmin(item)">
                    <v-icon>mdi-delete-outline</v-icon>
                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                </v-btn>
            </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create Admin Dialog -->
    <v-dialog v-model="createDialog" max-width="500px">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h5 font-weight-bold text-center">Create New Admin</v-card-title>
        <v-card-text class="mt-4">
          <v-form @submit.prevent="createAdmin">
            <v-text-field
              v-model="newAdmin.name"
              label="Full Name"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              rounded="lg"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="newAdmin.email"
              label="Email Address"
              prepend-inner-icon="mdi-email"
              type="email"
              variant="outlined"
              rounded="lg"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="newAdmin.phone"
              label="Phone Number"
              prepend-inner-icon="mdi-phone"
              type="tel"
              variant="outlined"
              rounded="lg"
              class="mb-2"
            ></v-text-field>
            <v-select
              v-model="newAdmin.role"
              :items="adminTypes"
              item-title="title"
              item-value="value"
              label="Role"
              prepend-inner-icon="mdi-badge-account"
              variant="outlined"
              rounded="lg"
              class="mb-2"
            ></v-select>
             <v-text-field
              v-model="newAdmin.password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              type="password"
              variant="outlined"
              rounded="lg"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between pt-4">
          <v-btn color="grey-darken-1" size="large" variant="text" @click="createDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            size="large"
            variant="flat"
            rounded="lg"
            class="px-8 font-weight-bold"
            elevation="2"
            @click="createAdmin"
            :loading="loading"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
.gap-4 {
    gap: 16px;
}

/* Custom Table Styling */
.admin-table :deep(thead tr th) {
   background-color: #dbdbdd !important;
   color: #070707 !important;
   font-weight: 700 !important;
   letter-spacing: 0.05em;
   text-transform: uppercase;
   font-size: 0.75rem;
}

.admin-table :deep(tbody tr:hover) {
    background-color: #f3f4f6 !important; /* Slight grey on hover */
    transition: background-color 0.2s ease;
}

.admin-table :deep(tbody tr td) {
    padding-top: 12px;
    padding-bottom: 12px;
}
</style>

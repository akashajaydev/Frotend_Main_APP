<script setup lang="ts">
import { ref } from 'vue'

const admins = ref([
  { id: 1, name: 'Baba Ram', email: 'baba@example.com', type: 'Baba', active: true, avatar: '' },
  { id: 2, name: 'Astro John', email: 'astro@example.com', type: 'Astrologer', active: true, avatar: '' },
  { id: 3, name: 'Healer Mary', email: 'healer@example.com', type: 'Healer', active: false, avatar: '' },
  { id: 4, name: 'Baba Shyam', email: 'shyam@example.com', type: 'Baba', active: true, avatar: '' },
  { id: 5, name: 'Astro Mike', email: 'mike@example.com', type: 'Astrologer', active: true, avatar: '' },
  { id: 6, name: 'Healer Sarah', email: 'sarah@example.com', type: 'Healer', active: true, avatar: '' },
  { id: 7, name: 'Baba Ganeshan', email: 'ganeshan@example.com', type: 'Baba', active: false, avatar: '' },
])

const search = ref('')
const createDialog = ref(false)
const newAdmin = ref({
  name: '',
  email: '',
  type: 'Baba',
  password: ''
})

const adminTypes = ['Baba', 'Astrologer', 'Healer']

const headers = [
  { title: 'Admin', key: 'name', align: 'start' },
  { title: 'Role', key: 'type', align: 'center' },
  { title: 'Status', key: 'active', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

// Helper for Role styling
const getRoleTheme = (type: string) => {
  switch (type) {
    case 'Baba': return { color: 'orange-darken-2', icon: 'mdi-om' }
    case 'Astrologer': return { color: 'deep-purple-lighten-1', icon: 'mdi-star-four-points' }
    case 'Healer': return { color: 'teal-lighten-1', icon: 'mdi-hand-heart' }
    default: return { color: 'grey', icon: 'mdi-account' }
  }
}

function createAdmin() {
  // Logic to create admin
  console.log('Creating admin:', newAdmin.value)
  createDialog.value = false
  // Reset form
  newAdmin.value = { name: '', email: '', type: 'Baba', password: '' }
}

function openCreateDialog() {
  createDialog.value = true
}

function viewAdmin(item: any) {
  navigateTo(`/admins/${item.id}`)
}

function editAdmin(item: any) {
  // Logic to edit
  console.log('Edit', item)
}

function deleteAdmin(item: any) {
  // Logic to delete
  console.log('Delete', item)
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
        class="admin-table"
        hover
      >
        <!-- Admin Name & Avatar Slot -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" class="mr-3 elevation-2">
              <v-img v-if="item.avatar" :src="item.avatar" cover></v-img>
              <v-icon v-else :icon="getRoleTheme(item.type).icon" :color="getRoleTheme(item.type).color" class="bg-grey-lighten-4"></v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">{{ item.name }}</div>
              <div class="text-caption text-grey">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Role Slot -->
        <template v-slot:item.type="{ item }">
          <v-chip
            :color="getRoleTheme(item.type).color"
            variant="tonal"
            size="small"
            class="font-weight-bold px-3"
            label
          >
            <v-icon start size="small" :icon="getRoleTheme(item.type).icon"></v-icon>
            {{ item.type }}
          </v-chip>
        </template>

        <!-- Status Slot -->
        <template v-slot:item.active="{ item }">
            <div class="d-flex justify-center">
                <v-icon
                    :icon="item.active ? 'mdi-check-circle' : 'mdi-close-circle'"
                    :color="item.active ? 'success' : 'error'"
                    size="small"
                ></v-icon>
            </div>
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
            <v-select
              v-model="newAdmin.type"
              :items="adminTypes"
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
</style>

<script setup lang="ts">
import { ref } from 'vue'

const headers = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Type', key: 'type' },
  { title: 'Active', key: 'active' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const admins = ref([
  { id: 1, name: 'Baba Ram', email: 'baba@example.com', type: 'Baba', active: true, avatar: '' },
  { id: 2, name: 'Astro John', email: 'astro@example.com', type: 'Astrologer', active: true, avatar: '' },
  { id: 3, name: 'Healer Mary', email: 'healer@example.com', type: 'Healer', active: false, avatar: '' },
])

const createDialog = ref(false)
const newAdmin = ref({
  name: '',
  email: '',
  type: 'Baba',
  password: ''
})

const adminTypes = ['Baba', 'Astrologer', 'Healer']

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
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Admins</h1>
        <p class="text-subtitle-1 text-grey">Manage your Babas, Astrologers, and Healers</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="xl" @click="openCreateDialog">
        Create Admin
      </v-btn>
    </div>

    <v-card elevation="2" rounded="xl">
      <v-data-table
        :headers="headers"
        :items="admins"
        class="pa-2"
        hover
      >
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="40" color="grey-lighten-2">
            <v-img v-if="item.avatar" :src="item.avatar"></v-img>
            <v-icon v-else icon="mdi-account" color="grey"></v-icon>
          </v-avatar>
        </template>

        <template v-slot:item.type="{ item }">
          <v-chip
            :color="item.type === 'Baba' ? 'orange' : 'purple'"
            size="small"
            label
            variant="tonal"
            class="font-weight-medium"
          >
            {{ item.type }}
          </v-chip>
        </template>

        <template v-slot:item.active="{ item }">
          <v-icon :icon="item.active ? 'mdi-check-circle' : 'mdi-close-circle'" :color="item.active ? 'success' : 'error'"></v-icon>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" color="info" @click="viewAdmin(item)"></v-btn>
          <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="editAdmin(item)"></v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteAdmin(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create Admin Dialog -->
    <v-dialog v-model="createDialog" max-width="500px">
      <v-card rounded="xl">
        <v-card-title class="text-h5 pa-4 font-weight-bold">Create New Admin</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createAdmin">
            <v-text-field
              v-model="newAdmin.name"
              label="Name"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="newAdmin.email"
              label="Email"
              type="email"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            ></v-text-field>
            <v-select
              v-model="newAdmin.type"
              :items="adminTypes"
              label="Role/Type"
              variant="outlined"
              density="comfortable"
              class="mb-2"
            ></v-select>
             <v-text-field
              v-model="newAdmin.password"
              label="Password"
              type="password"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="createDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="createAdmin" rounded="lg">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>
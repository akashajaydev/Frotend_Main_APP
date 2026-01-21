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

const createDialog = ref(false)
const newAdmin = ref({
  name: '',
  email: '',
  type: 'Baba',
  password: ''
})

const adminTypes = ['Baba', 'Astrologer', 'Healer']

// Helper for Role styling
const getRoleTheme = (type: string) => {
  switch (type) {
    case 'Baba': return { color: 'orange-darken-2', gradient: 'linear-gradient(135deg, #FF9800, #F57C00)', icon: 'mdi-om' }
    case 'Astrologer': return { color: 'deep-purple-lighten-1', gradient: 'linear-gradient(135deg, #673AB7, #512DA8)', icon: 'mdi-star-four-points' }
    case 'Healer': return { color: 'teal-lighten-1', gradient: 'linear-gradient(135deg, #009688, #00796B)', icon: 'mdi-hand-heart' }
    default: return { color: 'grey', gradient: 'linear-gradient(135deg, #757575, #616161)', icon: 'mdi-account' }
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
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Admins</h1>
        <p class="text-subtitle-1 text-grey">Manage your Babas, Astrologers, and Healers</p>
      </div>
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

    <v-row>
      <v-col
        v-for="admin in admins"
        :key="admin.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            class="admin-card pt-12 text-center"
            rounded="xl"
            :class="{ 'on-hover': isHovering }"
          >
            <!-- Colored Header/Top Bar -->
            <div class="card-header-bg" :style="{ background: getRoleTheme(admin.type).gradient }"></div>

            <!-- Avatar -->
            <div class="avatar-wrapper">
              <v-avatar size="100" class="elevation-4 border-white">
                <v-img v-if="admin.avatar" :src="admin.avatar" cover></v-img>
                <div v-else class="d-flex justify-center align-center w-100 h-100 bg-white">
                   <v-icon :icon="getRoleTheme(admin.type).icon" size="50" :color="getRoleTheme(admin.type).color"></v-icon>
                </div>
              </v-avatar>
              <!-- Active Indicator -->
              <v-icon
                class="active-status-icon"
                :icon="admin.active ? 'mdi-check-circle' : 'mdi-close-circle'"
                :color="admin.active ? 'success' : 'error'"
              ></v-icon>
            </div>

            <!-- Content -->
            <v-card-text class="mt-2">
              <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-1">{{ admin.name }}</h3>
              <p class="text-body-2 text-grey mb-3">{{ admin.email }}</p>

              <v-chip
                :color="getRoleTheme(admin.type).color"
                variant="outlined"
                class="font-weight-bold px-4"
                size="small"
              >
                {{ admin.type }}
              </v-chip>
            </v-card-text>

            <v-divider class="mx-4 my-2"></v-divider>

            <!-- Actions -->
            <v-card-actions class="justify-center pb-4">
               <v-btn icon size="small" variant="text" color="grey" @click="viewAdmin(admin)">
                 <v-icon>mdi-eye</v-icon>
                 <v-tooltip activator="parent" location="top">View Profile</v-tooltip>
               </v-btn>
               <v-btn icon size="small" variant="text" color="primary" @click="editAdmin(admin)">
                 <v-icon>mdi-pencil</v-icon>
                 <v-tooltip activator="parent" location="top">Edit</v-tooltip>
               </v-btn>
               <v-btn icon size="small" variant="text" color="error" @click="deleteAdmin(admin)">
                 <v-icon>mdi-delete</v-icon>
                 <v-tooltip activator="parent" location="top">Delete</v-tooltip>
               </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

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

.admin-card {
    position: relative;
    transition: all 0.3s ease-in-out;
    background: white;
    overflow: hidden;
}

.admin-card.on-hover {
    transform: translateY(-8px);
}

.card-header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
}

.avatar-wrapper {
    position: relative;
    display: inline-block;
    margin-top: 10px; /* Adjust to overlap correctly */
}

.border-white {
    border: 4px solid white;
}

.active-status-icon {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: white;
    border-radius: 50%;
    border: 2px solid white;
}
</style>
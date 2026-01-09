<script setup lang="ts">
import adminAvatar from '~/assets/images/admin.png'

const data = useDataStore()
const loading = ref(false)
const tab = ref('account')

// Account Form
const accountForm = reactive({
  name: '',
  email: ''
})

// Security Form
const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
    // Ensure profile is loaded
    if (!data.admin) {
        await helpers.fetchProfile()
    }
    if (data.admin) {
        accountForm.name = data.admin.name
        accountForm.email = data.admin.email
    }
})

const handleUpdateProfile = async () => {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
    // Mock success
    // In a real app, update the store and show a toast
    if (data.admin) {
        data.admin.name = accountForm.name
    }
    alert('Profile updated successfully!')
}

const handleChangePassword = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
        alert('Passwords do not match!')
        return
    }
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
    
    securityForm.currentPassword = ''
    securityForm.newPassword = ''
    securityForm.confirmPassword = ''
    
    alert('Password changed successfully!')
}
</script>

<template>
  <v-container fluid class="fill-height bg-grey-lighten-4 pa-0">
    <v-row no-gutters class="fill-height justify-center pt-10">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 font-weight-bold mb-6 text-grey-darken-3 px-4">Admin Profile</h1>
        
        <v-card elevation="2" rounded="xl" class="mx-4 overflow-hidden">
            <v-tabs v-model="tab" bg-color="deep-purple-accent-4" color="white" grow>
                <v-tab value="account" prepend-icon="mdi-account-circle">Account Info</v-tab>
                <v-tab value="security" prepend-icon="mdi-lock">Security</v-tab>
            </v-tabs>

            <v-window v-model="tab">
                <!-- Account Info Tab -->
                <v-window-item value="account">
                    <v-card-text class="pa-6">
                        <div class="d-flex flex-column align-center mb-6">
                             <v-avatar size="120" color="purple-lighten-4" class="elevation-3 mb-4">
                                <v-img :src="adminAvatar" alt="Admin"></v-img>
                            </v-avatar>
                            <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-camera">Change Avatar</v-btn>
                        </div>

                        <v-form @submit.prevent="handleUpdateProfile">
                            <v-text-field
                                v-model="accountForm.name"
                                label="Full Name"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                class="mb-2"
                            ></v-text-field>

                            <v-text-field
                                v-model="accountForm.email"
                                label="Email Address"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                disabled
                                hint="Email cannot be changed"
                                persistent-hint
                                class="mb-4"
                            ></v-text-field>

                            <div class="d-flex justify-end">
                                <v-btn
                                    type="submit"
                                    color="deep-purple-accent-4"
                                    :loading="loading"
                                    elevation="2"
                                >
                                    Save Changes
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card-text>
                </v-window-item>

                <!-- Security Tab -->
                <v-window-item value="security">
                    <v-card-text class="pa-6">
                         <v-alert
                            icon="mdi-shield-check"
                            title="Secure your account"
                            text="Ensure your account is using a long string to prevent unauthorized access."
                            type="info"
                            variant="tonal"
                            class="mb-6"
                        ></v-alert>

                        <v-form @submit.prevent="handleChangePassword">
                            <v-text-field
                                v-model="securityForm.currentPassword"
                                label="Current Password"
                                type="password"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                class="mb-2"
                            ></v-text-field>

                            <v-text-field
                                v-model="securityForm.newPassword"
                                label="New Password"
                                type="password"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                class="mb-2"
                            ></v-text-field>

                            <v-text-field
                                v-model="securityForm.confirmPassword"
                                label="Confirm New Password"
                                type="password"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                class="mb-4"
                            ></v-text-field>

                             <div class="d-flex justify-end">
                                <v-btn
                                    type="submit"
                                    color="deep-purple-accent-4"
                                    :loading="loading"
                                    elevation="2"
                                >
                                    Change Password
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card-text>
                </v-window-item>
            </v-window>
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

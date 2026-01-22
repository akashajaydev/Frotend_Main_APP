<script setup lang="ts">
import { ref } from 'vue'

const contacts = ref([
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    contactNumber: '+91 98765 43210',
    address: '123, Lotus Temple Road, New Delhi',
    additionalNotes: 'Interested in Kundali matching services.',
    date: '2023-10-25'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    contactNumber: '+91 91234 56789',
    address: '45, MG Road, Mumbai',
    additionalNotes: 'Need consultation for career growth.',
    date: '2023-10-26'
  },
  {
    id: 3,
    name: 'Amit Verma',
    email: 'amit.v@example.com',
    contactNumber: '+91 99887 76655',
    address: 'Sector 62, Noida, UP',
    additionalNotes: '',
    date: '2023-10-27'
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    email: 'sneha.g@example.com',
    contactNumber: '+91 88776 65544',
    address: 'Indiranagar, Bangalore',
    additionalNotes: 'Query regarding gemstone recommendations.',
    date: '2023-10-28'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram.s@example.com',
    contactNumber: '+91 77665 54433',
    address: 'Civil Lines, Jaipur',
    additionalNotes: 'Urgently need to speak to Baba Ram.',
    date: '2023-10-29'
  },
])

const search = ref('')

const headers = [
  { title: 'No.', key: 'id', align: 'start' },
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Contact Details', key: 'email', align: 'start' },
  { title: 'Address', key: 'address', align: 'start' },
  { title: 'Notes', key: 'additionalNotes', align: 'start' },
  { title: 'Date', key: 'date', align: 'end' },
]
</script>

<template>
  <v-container fluid class="pa-6">
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-8 gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Contacts</h1>
        <p class="text-subtitle-1 text-grey">View inquiries from the Contact Us form</p>
      </div>
      <div class="d-flex gap-4 align-center">
        <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            label="Search Contacts"
            single-line
            hide-details
            variant="outlined"
            rounded="xl"
            class="search-field"
            style="width: 300px; max-width: 100%;"
        ></v-text-field>
      </div>
    </div>

    <v-card elevation="2" rounded="xl" class="overflow-hidden">
      <v-data-table
        :headers="headers"
        :items="contacts"
        :search="search"
        class="contact-table"
        hover
      >
        <!-- ID Slot -->
        <template v-slot:item.id="{ item }">
          <div class="font-weight-bold text-grey-darken-1 mt-5">{{ item.id }}</div>
        </template>

        <!-- Name Slot -->
        <template v-slot:item.name="{ item }">
          <div class="font-weight-bold text-grey-darken-3 mt-5">{{ item.name }}</div>
        </template>

        <!-- Contact Details Slot -->
        <template v-slot:item.email="{ item }">
          <div>
            <div class="d-flex align-center">
                <v-icon size="small" class="mr-1 mt-5" color="primary">mdi-email-outline</v-icon>
                <span class="text-body-2 mt-5">{{ item.email }}</span>
            </div>
            <div class="d-flex align-center mt-1">
                <v-icon size="small" class="mr-1 mb-4" color="success">mdi-phone-outline</v-icon>
                <span class="text-body-2 mb-4">{{ item.contactNumber }}</span>
            </div>
          </div>
        </template>
        
        <!-- Address Slot -->
         <template v-slot:item.address="{ item }">
            <div class="text-body-2 text-grey-darken-5 mt-5">{{ item.address }}</div>
        </template>

        <!-- Notes Slot -->
        <template v-slot:item.additionalNotes="{ item }">
            <div v-if="item.additionalNotes" class="text-body-2 font-italic text-grey-darken-4 mt-4">
                "{{ item.additionalNotes }}"
            </div>
            <span v-else class="text-caption text-grey-lighten-1">No notes provided</span>
        </template>

         <!-- Date Slot -->
        <template v-slot:item.date="{ item }">
            <v-chip size="small" variant="tonal" color="black" class="mt-4">
                {{ item.date }}
            </v-chip>
        </template>

      </v-data-table>
    </v-card>
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
.contact-table :deep(thead tr th) {
   background-color: #dbdbdd !important;
   color: #070707 !important;
   font-weight: 700 !important;
   letter-spacing: 0.05em;
   text-transform: uppercase;
   font-size: 0.75rem;
}

.contact-table :deep(tbody tr:hover) {
    background-color: #f3f4f6 !important;
    transition: background-color 0.2s ease;
}

.contact-table :deep(tbody tr td) {
    padding-top: 16px;
    padding-bottom: 16px;
    vertical-align: top;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'

const products = ref<any[]>([])
const totalProducts = ref(0)
const loading = ref(false)
const itemsPerPage = ref(10)
const page = ref(1)
const search = ref('')

const headers = [
  { title: 'Image', key: 'image', sortable: false, align: 'center' },
  { title: 'Label', key: 'label', align: 'start' },
  { title: 'Category', key: 'category', sortable: false, align: 'start' },
  { title: 'Pricing (US/IN)', key: 'pricing', sortable: false, align: 'start' },
  { title: 'Delay (Days)', key: 'minimumDelayInDays', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

async function loadProducts() {
  loading.value = true
  try {
    // Replace with actual API call
    // const { data, error } = await useFetch('/api/products', {
    //   query: { page: page.value, limit: itemsPerPage.value }
    // })
    
    // Simulating API call based on USER_REQUEST description
    // In a real scenario, useRuntimeConfig().public.apiBase or similar
    // For now, I'll mock the fetch or assume a proxy is set up. 
    // Since I don't have the backend URL, I'll write the fetch logic to be easily adaptable.
    
    const response = await fetch(`https://api.example.com/products?page=${page.value}&limit=${itemsPerPage.value}`) // Placeholder URL
    // mocking response for now if fetch fails, or just structure it for the real backend
    
    // real implementation
    /*
    const response = await $fetch('/products', {
        baseURL: 'YOUR_API_BASE_URL', // needing context
        params: { page: page.value, limit: itemsPerPage.value }
    })
    */

    // USING MOCK DATA FOR UI VISUALIZATION AS PER USER INSTRUCTIONS
    const mockData = {
        products: [
            // Aura Scan
            {
                "_id": "aura-scan-single",
                "label": "Aura Scan Single Person",
                "parent": "Aura Scan",
                "root": "Aura Scan",
                "minimumDelayInDays": 3,
                "pricings": [ { "country": "US", "value": 111 }, { "country": "IN", "value": 9600 } ],
                "photos": ["https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-08T09:30:00.000Z"
            },
            {
                "_id": "aura-scan-family",
                "label": "Aura Scan Family",
                "parent": "Aura Scan",
                "root": "Aura Scan",
                "minimumDelayInDays": 5,
                "pricings": [ { "country": "US", "value": 221 }, { "country": "IN", "value": 15000 } ],
                "photos": ["https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-08T09:30:00.000Z"
            },
            // Astrology
            {
                "_id": "astrology-30-min",
                "label": "Astrology Consultation (30 Min)",
                "parent": "Astrology",
                "root": "Astrology",
                "minimumDelayInDays": 2,
                "pricings": [ { "country": "US", "value": 50 }, { "country": "IN", "value": 3000 } ],
                "photos": ["https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-09T10:00:00.000Z"
            },
            {
                "_id": "astrology-45-min",
                "label": "Astrology Consultation (45 Min)",
                "parent": "Astrology",
                "root": "Astrology",
                "minimumDelayInDays": 2,
                "pricings": [ { "country": "US", "value": 75 }, { "country": "IN", "value": 4500 } ],
                "photos": ["https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-09T10:00:00.000Z"
            },
            // Healings
            {
                "_id": "aura-healing",
                "label": "Aura Healing (30 min)",
                "parent": "Healings",
                "root": "Healings",
                "minimumDelayInDays": 1,
                "pricings": [ { "country": "US", "value": 60 }, { "country": "IN", "value": 4000 } ],
                "photos": ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-10T12:00:00.000Z"
            },
            {
                "_id": "evil-eye-removal",
                "label": "Evil Eye Removal (30 min)",
                "parent": "Healings",
                "root": "Healings",
                "minimumDelayInDays": 1,
                "pricings": [ { "country": "US", "value": 55 }, { "country": "IN", "value": 3500 } ],
                "photos": ["https://images.unsplash.com/photo-1605335198950-89196d0be22a?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-10T12:00:00.000Z"
            },
            {
                "_id": "item-energizing",
                "label": "Item Energizing for Healing (15 min)",
                "parent": "Healings",
                "root": "Healings",
                "minimumDelayInDays": 1,
                "pricings": [ { "country": "US", "value": 35 }, { "country": "IN", "value": 2100 } ],
                "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-10T12:00:00.000Z"
            },
            // Vaastu
            {
                "_id": "astro-tantra-vaastu",
                "label": "Astro & Tantra Vaastu (1.5 hr)",
                "parent": "Vaastu",
                "root": "Astro & Tantra Vaastu",
                "minimumDelayInDays": 7,
                "pricings": [ { "country": "US", "value": 300 }, { "country": "IN", "value": 21000 } ],
                "photos": ["https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-11T14:30:00.000Z"
            },
            // Yagya
            {
                "_id": "navratri-satvik",
                "label": "Navratri Devi Kripa Yagya (Satvik)",
                "parent": "Navratri Devi Kripa Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 10,
                "pricings": [ { "country": "US", "value": 150 }, { "country": "IN", "value": 11000 } ],
                "photos": ["https://images.unsplash.com/photo-1621262070386-302a2817ee86?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-12T09:00:00.000Z"
            },
            {
                "_id": "navratri-tamsik",
                "label": "Navratri Devi Kripa Yagya (Tamsik)",
                "parent": "Navratri Devi Kripa Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 10,
                "pricings": [ { "country": "US", "value": 200 }, { "country": "IN", "value": 15000 } ],
                "photos": ["https://images.unsplash.com/photo-1617206437298-5c074aa877d9?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-12T09:00:00.000Z"
            },
            {
                "_id": "navgraha-yagya",
                "label": "Navgraha Yagya",
                "parent": "Navgraha Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 7,
                "pricings": [ { "country": "US", "value": 180 }, { "country": "IN", "value": 13000 } ],
                "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-12T09:00:00.000Z"
            },
            {
                "_id": "birthday-blessing-yagya",
                "label": "Birthday Blessing Yagya",
                "parent": "Birthday Blessing Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 7,
                "pricings": [ { "country": "US", "value": 120 }, { "country": "IN", "value": 9000 } ],
                "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-12T09:00:00.000Z"
            },
            // Kundli Nivaran
            {
                "_id": "kaal-sarp-yog",
                "label": "Kaal Sarp Yog Yagya",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 250 }, { "country": "IN", "value": 18000 } ],
                "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "guru-chandal-yog",
                "label": "Guru Chandal Yog Yagya",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 260 }, { "country": "IN", "value": 19000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "pitra-dosh-nivaran",
                "label": "Pitra Dosh Nivaran",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 270 }, { "country": "IN", "value": 20000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "angarak-yog-nivaran",
                "label": "Angarak Yog Nivaran",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 230 }, { "country": "IN", "value": 16000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "manglik-dosh-nivaran",
                "label": "Manglik Dosh Nivaran",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 220 }, { "country": "IN", "value": 15000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "shani-sade-sati",
                "label": "Shani Sade Sati Yagya",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 240 }, { "country": "IN", "value": 17500 } ],
                "photos": ["https://images.unsplash.com/photo-1544833058-e70d62f85726?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "shani-dhaiya-yagya",
                "label": "Shani Dhaiya Yagya",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 240 }, { "country": "IN", "value": 17500 } ],
                 "photos": ["https://images.unsplash.com/photo-1544833058-e70d62f85726?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "gandmool-dosh-nivaran",
                "label": "Gandmool Dosh Nivaran",
                "parent": "Kundli Nivaran Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 14,
                "pricings": [ { "country": "US", "value": 210 }, { "country": "IN", "value": 14000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-13T10:00:00.000Z"
            },
            {
                "_id": "mahasiddha-guru-gorakshanath",
                "label": "Mahasiddha Guru Gorakshanath Yagya",
                "parent": "Mahasiddha Guru Gorakshanath Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 10,
                "pricings": [ { "country": "US", "value": 400 }, { "country": "IN", "value": 31000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-14T10:00:00.000Z"
            },
            // Spiritual Alignment
            {
                "_id": "puranmashi-yagya",
                "label": "Puranmashi Yagya",
                "parent": "Spiritual Alignment Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 3,
                "pricings": [ { "country": "US", "value": 100 }, { "country": "IN", "value": 7000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-14T10:00:00.000Z"
            },
            {
                "_id": "amavasya-yagya",
                "label": "Amavasya Yagya",
                "parent": "Spiritual Alignment Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 3,
                "pricings": [ { "country": "US", "value": 100 }, { "country": "IN", "value": 7000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-14T10:00:00.000Z"
            },
            {
                "_id": "monthly-shivratri-yagya",
                "label": "Monthly Shivratri Yagya",
                "parent": "Spiritual Alignment Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 3,
                "pricings": [ { "country": "US", "value": 110 }, { "country": "IN", "value": 7500 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-14T10:00:00.000Z"
            },
            {
                "_id": "kaalashtmi-yagya",
                "label": "Kaalashtmi Yagya",
                "parent": "Spiritual Alignment Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 3,
                "pricings": [ { "country": "US", "value": 120 }, { "country": "IN", "value": 8000 } ],
                 "photos": ["https://images.unsplash.com/photo-1600609842388-3e4b7c152431?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-14T10:00:00.000Z"
            },
            // Protection
             {
                "_id": "ma-bhadrakali",
                "label": "Satvik Maa Bhadrakali Yagya",
                "parent": "Protection from Enemy Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 7,
                "pricings": [ { "country": "US", "value": 300 }, { "country": "IN", "value": 22000 } ],
                 "photos": ["https://images.unsplash.com/photo-1589995186011-d7c7955d9d14?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-14T15:00:00.000Z"
            },
             {
                "_id": "ma-shamshan-kali",
                "label": "Tamsik Maa Shamshan Kali Yagya",
                "parent": "Protection from Enemy Yagya",
                "root": "Yagya",
                "minimumDelayInDays": 7,
                "pricings": [ { "country": "US", "value": 500 }, { "country": "IN", "value": 35000 } ],
                 "photos": ["https://images.unsplash.com/photo-1589995186011-d7c7955d9d14?q=80&w=200&auto=format&fit=crop"],
                "createdAt": "2025-01-14T15:00:00.000Z"
            },
        ],
        count: 27
    }
    
    // In real app, uncomment below:
    // const res = await $fetch('/products', { method: 'GET', query: { page: page.value, limit: itemsPerPage.value } })
    // products.value = res.products
    // totalProducts.value = res.count

    // Using Mock for now to ensure UI renders
    products.value = mockData.products
    totalProducts.value = mockData.count

  } catch (error) {
    console.error('Failed to load products', error)
  } finally {
    loading.value = false
  }
}

watch([page, itemsPerPage], () => {
  loadProducts()
})

// Initial Load
// loadProducts() -> called by v-data-table server-items? or mounted
import { onMounted } from 'vue'
onMounted(() => {
    loadProducts()
})


function viewProduct(item: any) {
  navigateTo(`/products/${item._id}`)
}

function createProduct() {
  navigateTo('/products/create')
}

// Helpers
const getPrice = (pricings: any[], country: string) => {
    const p = pricings.find((x: any) => x.country === country)
    return p ? p.value : '-'
}

</script>

<template>
  <v-container fluid class="pa-6">
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-8 gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Products</h1>
        <p class="text-subtitle-1 text-grey">Manage your astrology services and items</p>
      </div>
      <div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          rounded="xl"
          size="large"
          elevation="3"
          @click="createProduct"
          class="text-none font-weight-bold"
        >
          Create Product
        </v-btn>
      </div>
    </div>

    <v-card elevation="2" rounded="xl" class="overflow-hidden">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="products"
        :items-length="totalProducts"
        :loading="loading"
        :page="page"
        @update:options="loadProducts"
        class="product-table"
        hover
      >
        <!-- Image Slot -->
        <template v-slot:item.image="{ item }">
          <v-avatar size="48" rounded="lg" class="my-2 elevation-1">
            <v-img 
                :src="item.photos && item.photos.length > 0 ? item.photos[0] : 'https://placehold.co/100'" 
                cover
            ></v-img>
          </v-avatar>
        </template>

        <!-- Category Slot -->
        <template v-slot:item.category="{ item }">
            <div class="d-flex flex-column">
                <span class="text-caption text-grey">Root: {{ item.root }}</span>
                <span class="text-body-2 font-weight-medium text-grey-darken-3">{{ item.parent }}</span>
            </div>
        </template>

        <!-- Pricing Slot -->
        <template v-slot:item.pricing="{ item }">
             <div class="d-flex flex-column">
                <div class="text-body-2"><span class="text-grey text-caption w-25 d-inline-block">US:</span> ${{ getPrice(item.pricings, 'US') }}</div>
                <div class="text-body-2"><span class="text-grey text-caption w-25 d-inline-block">IN:</span> ₹{{ getPrice(item.pricings, 'IN') }}</div>
            </div>
        </template>

        <!-- Actions Slot -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end">
            <v-btn icon size="small" variant="text" color="primary" @click="viewProduct(item)">
              <v-icon>mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent" location="top">Edit</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<style scoped>
.gap-4 {
    gap: 16px;
}
.product-table :deep(thead tr th) {
   background-color: #f8f9fa !important;
   color: #374151 !important;
   font-weight: 700 !important;
   text-transform: uppercase;
   font-size: 0.75rem;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.id as string

const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const valid = ref(false)

const product = ref<any>({
  _id: '',
  label: '',
  root: '',
  parent: '',
  minimumDelayInDays: 0,
  pricings: [],
  photos: []
})

const countryOptions = ['US', 'IN', 'UK', 'CA', 'AU', 'EU', 'middle-east']

// -- PHOTOS --
const newPhotos = ref<File[]>([])

async function loadProduct() {
    loading.value = true
    try {
        // Mock Load
        // const res = await $fetch(`/products/${productId}`)
        
        // Mock Data simulation
        product.value = {
            _id: productId,
            label: 'Aura Scan Single Person',
            root: 'Aura Scan',
            parent: 'Aura Scan',
            minimumDelayInDays: 3,
            pricings: [
                 { country: 'US', value: 111 },
                 { country: 'IN', value: 9600 }
            ],
            photos: [
                'https://placehold.co/600x400',
                'https://placehold.co/600x400/orange/white'
            ]
        }

    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

async function updateProduct() {
   if (!valid.value) return
   saving.value = true
   try {
       // Mock API
       const payload = {
           label: product.value.label,
           root: product.value.root,
           parent: product.value.parent,
           minimumDelayInDays: product.value.minimumDelayInDays,
           pricings: product.value.pricings
       }
       console.log('PATCH payload:', payload)
       // await $fetch(`/products/${productId}`, { method: 'PATCH', body: payload })
       
       alert('Product updated successfully')
   } catch (e) {
       console.error(e)
   } finally {
       saving.value = false
   }
}

async function deleteProduct() {
    if(!confirm('Are you sure you want to delete this product?')) return
    try {
        console.log('DELETE product', productId)
        // await $fetch(`/products/${productId}`, { method: 'DELETE' })
        navigateTo('/products')
    } catch (e) {
        console.error(e)
    }
}

// -- Photo Management --

async function uploadPhotos() {
    if (newPhotos.value.length === 0) return
    uploading.value = true
    try {
        const formData = new FormData()
        newPhotos.value.forEach(file => {
            formData.append('photos', file)
        })
        
        console.log('Uploading...', formData)
        // Mock Response
        // const res = await $fetch(`/products/${productId}/photos`, { method: 'PUT', body: formData })
        // product.value.photos = res.photos // Update list
        
        // Simulating update
        setTimeout(() => {
             product.value.photos.push('https://placehold.co/600x400/green/white')
             newPhotos.value = [] // clear input
             uploading.value = false
        }, 1000)

    } catch (e) {
        console.error(e)
        uploading.value = false
    }
}

async function deletePhoto(photoUrl: string) {
    if(!confirm('Delete this photo?')) return
    try {
        console.log('Deleting photo:', photoUrl)
        // const res = await $fetch(`/products/${productId}/photos`, { 
        //    method: 'DELETE', 
        //    body: { photos: [photoUrl] }
        // })
        // product.value.photos = res.photos
        
        product.value.photos = product.value.photos.filter((p: string) => p !== photoUrl)
        
    } catch (e) {
        console.error(e)
    }
}

function addPricing() {
    product.value.pricings.push({ country: '', value: 0 })
}

function removePricing(index: number) {
    product.value.pricings.splice(index, 1)
}


onMounted(() => {
    loadProduct()
})

</script>

<template>
  <v-container fluid class="pa-6">
    <div class="d-flex justify-space-between align-center mb-6">
       <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="navigateTo('/products')" class="text-none text-grey-darken-2">Back to Products</v-btn>
       <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="deleteProduct">Delete Product</v-btn>
    </div>

    <div class="mb-8" v-if="loading">
        <v-skeleton-loader type="article"></v-skeleton-loader>
    </div>

    <v-form v-else v-model="valid" @submit.prevent="updateProduct">
        <div class="d-flex flex-column flex-md-row gap-6">
            <!-- Left Column: Details -->
            <div class="flex-grow-1" style="min-width: 0;">
                <v-card elevation="2" rounded="xl" class="pa-6 mb-6">
                    <div class="d-flex justify-space-between align-center mb-4">
                        <h2 class="text-h6 font-weight-bold">Product Details</h2>
                        <v-chip size="small" label class="text-uppercase font-weight-bold">{{ product._id }}</v-chip>
                    </div>

                    <v-text-field
                        v-model="product.label"
                        label="Product Label"
                        variant="outlined"
                        rounded="lg"
                        :rules="[v => !!v || 'Label is required']"
                        class="mb-2"
                    ></v-text-field>

                    <v-row>
                        <v-col cols="12" md="6">
                             <v-text-field
                                v-model="product.root"
                                label="Root Category"
                                variant="outlined"
                                rounded="lg"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                             <v-text-field
                                v-model="product.parent"
                                label="Parent Category"
                                variant="outlined"
                                rounded="lg"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-text-field
                        v-model.number="product.minimumDelayInDays"
                        label="Minimum Delay (Days)"
                        type="number"
                        variant="outlined"
                        rounded="lg"
                        class="mt-2"
                    ></v-text-field>
                </v-card>

                <!-- Photos Section -->
                <v-card elevation="2" rounded="xl" class="pa-6">
                     <h2 class="text-h6 font-weight-bold mb-4">Photos</h2>
                     
                     <v-row>
                         <v-col v-for="(photo, i) in product.photos" :key="i" cols="6" md="4" lg="3">
                             <v-card class="position-relative rounded-lg overflow-hidden" elevation="1">
                                 <v-img :src="photo" aspect-ratio="1" cover></v-img>
                                 <v-btn 
                                    icon="mdi-delete" 
                                    size="small" 
                                    color="error" 
                                    position="absolute" 
                                    location="top right"
                                    class="ma-1"
                                    @click="deletePhoto(photo)"
                                 ></v-btn>
                             </v-card>
                         </v-col>
                     </v-row>

                     <v-divider class="my-6"></v-divider>
                     
                     <div class="d-flex align-center gap-4">
                         <v-file-input
                            v-model="newPhotos"
                            label="Upload New Photos"
                            multiple
                            prepend-icon="mdi-camera"
                            variant="outlined"
                            rounded="lg"
                            hide-details
                            density="compact"
                         ></v-file-input>
                         <v-btn
                            color="secondary"
                            variant="flat"
                            rounded="lg"
                            @click="uploadPhotos"
                            :loading="uploading"
                            :disabled="newPhotos.length === 0"
                         >
                            Upload
                         </v-btn>
                     </div>
                </v-card>
            </div>

            <!-- Right Column: Pricing & Save -->
            <div style="width: 100%; max-width: 400px;">
                <v-card elevation="2" rounded="xl" class="pa-6 mb-6">
                    <div class="d-flex justify-space-between align-center mb-4">
                        <h2 class="text-h6 font-weight-bold">Pricing</h2>
                        <v-btn size="small" variant="text" color="primary" icon="mdi-plus" @click="addPricing"></v-btn>
                    </div>

                     <div v-for="(price, index) in product.pricings" :key="index" class="d-flex gap-2 align-center mb-3">
                        <v-select
                            v-model="price.country"
                            :items="countryOptions"
                            label="Country"
                            variant="outlined"
                            density="compact"
                            rounded="lg"
                            hide-details
                            style="width: 100px;"
                        ></v-select>
                        <v-text-field
                            v-model.number="price.value"
                            label="Price"
                            type="number"
                            variant="outlined"
                            density="compact"
                            rounded="lg"
                            hide-details
                            prefix="$" 
                        ></v-text-field>
                        <v-btn icon="mdi-delete-outline" size="small" variant="text" color="error" @click="removePricing(index)"></v-btn>
                    </div>
                </v-card>

                <v-btn
                    block
                    color="primary"
                    size="large"
                    rounded="xl"
                    elevation="4"
                    type="submit"
                    :loading="saving"
                    class="font-weight-bold"
                >
                    Save Changes
                </v-btn>
            </div>
        </div>
    </v-form>
  </v-container>
</template>

<style scoped>
.gap-6 {
    gap: 24px;
}
.gap-4 {
    gap: 16px;
}
.gap-2 {
    gap: 8px;
}
</style>

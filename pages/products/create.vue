<script setup lang="ts">
import { ref, computed } from 'vue'

const valid = ref(false)
const loading = ref(false)

const product = ref({
  _id: '',
  label: '',
  root: '',
  parent: '',
  minimumDelayInDays: 1,
  pricings: [
    { country: 'US', value: 0 },
    { country: 'IN', value: 0 },
    { country: 'UK', value: 0 },
  ]
})

// Auto-generate ID from Label if ID is empty
function onLabelChange() {
    if (!product.value._id && product.value.label) {
        product.value._id = product.value.label
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
    }
}

const countryOptions = ['US', 'IN', 'UK', 'CA', 'AU', 'EU', 'middle-east']

function addPricing() {
    product.value.pricings.push({ country: '', value: 0 })
}

function removePricing(index: number) {
    product.value.pricings.splice(index, 1)
}

async function createProduct() {
  if (!valid.value) return
  loading.value = true
  
  try {
      // API Call
      // await $fetch('/products', { method: 'POST', body: product.value })
      
      console.log('Creating Product:', product.value)
      
      // Navigate to details or list
      // For now, list
      navigateTo('/products')
      
  } catch (error) {
      console.error('Error creating product', error)
  } finally {
      loading.value = false
  }
}

</script>

<template>
  <v-container fluid class="pa-6">
    <div class="mb-6">
       <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="navigateTo('/products')" class="text-none text-grey-darken-2">Back to Products</v-btn>
    </div>
    
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Create New Product</h1>
      <p class="text-subtitle-1 text-grey">Add a new astrology service</p>
    </div>

    <v-form v-model="valid" @submit.prevent="createProduct">
      <v-row>
        <v-col cols="12" md="8">
          <v-card elevation="2" rounded="xl" class="pa-6 mb-6">
            <h2 class="text-h6 font-weight-bold mb-4">Basic Information</h2>
            
            <v-text-field
              v-model="product.label"
              label="Product Label"
              variant="outlined"
              rounded="lg"
              :rules="[v => !!v || 'Label is required']"
              @update:model-value="onLabelChange"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="product._id"
              label="Product ID (Slug)"
              variant="outlined"
              rounded="lg"
              :rules="[v => !!v || 'ID is required']"
              hint="Unique identifier used in URLs"
              persistent-hint
              class="mb-4"
            ></v-text-field>

            <v-row>
                <v-col cols="12" md="6">
                     <v-text-field
                        v-model="product.root"
                        label="Root Category"
                        placeholder="e.g., Aura Scan"
                        variant="outlined"
                        rounded="lg"
                        :rules="[v => !!v || 'Root category is required']"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                     <v-text-field
                        v-model="product.parent"
                        label="Parent Category"
                        placeholder="e.g., Aura Scan"
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
        </v-col>

        <v-col cols="12" md="4">
           <v-card elevation="2" rounded="xl" class="pa-6">
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
                    style="max-width: 120px;"
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
        </v-col>
      </v-row>

      <div class="d-flex justify-end mt-4">
          <v-btn
            color="primary"
            size="large"
            rounded="xl"
            elevation="4"
            type="submit"
            :loading="loading"
            class="px-8 font-weight-bold"
          >
            Create Product
          </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}
</style>

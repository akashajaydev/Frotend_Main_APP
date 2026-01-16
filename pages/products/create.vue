<script setup lang="ts">
import { useProductStore } from '~/stores/product'

const productStore = useProductStore()
const snack = useSnackStore()

const valid = ref(false)
const form = ref<any>(null)

const product = ref({
    name: '',
    category: null,
    price: null,
    description: '',
    status: 'Active',
    image: null
})

const categories = ['Astrology', 'Yagya', 'Healings', 'Vaastu']
const statusOptions = ['Active', 'Inactive']

const nameRules = [
    (v: string) => !!v || 'Name is required',
    (v: string) => (v && v.length <= 50) || 'Name must be less than 50 characters',
]

const categoryRules = [
    (v: string) => !!v || 'Category is required',
]

const priceRules = [
    (v: any) => !!v || 'Price is required',
    (v: any) => v > 0 || 'Price must be greater than 0',
]

async function submit() {
    const { valid } = await form.value.validate()

    if (valid) {
        productStore.addProduct({
            name: product.value.name,
            category: product.value.category!, // validated
            price: Number(product.value.price),
            description: product.value.description,
            status: product.value.status as 'Active' | 'Inactive',
        })
        
        snack.success('Product created successfully')
        navigateTo('/products')
    }
}
</script>

<template>
    <v-container fluid class="pa-6">
        <div class="mb-6 d-flex align-center">
             <v-btn icon="mdi-arrow-left" variant="text" @click="navigateTo('/products')" class="me-2"></v-btn>
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">Create Product</h1>
                <p class="text-subtitle-1 text-grey">Add a new service or product to your catalog</p>
            </div>
        </div>

        <v-row>
            <v-col cols="12" md="8" lg="6">
                <v-card elevation="2" rounded="xl" class="pa-6">
                    <v-form ref="form" v-model="valid">
                        <v-text-field
                            v-model="product.name"
                            :rules="nameRules"
                            label="Product Name"
                            variant="outlined"
                            required
                            class="mb-2"
                        ></v-text-field>

                        <v-select
                            v-model="product.category"
                            :items="categories"
                            :rules="categoryRules"
                            label="Category"
                            variant="outlined"
                            required
                            class="mb-2"
                        ></v-select>

                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field
                                    v-model="product.price"
                                    :rules="priceRules"
                                    label="Price (₹)"
                                    type="number"
                                    variant="outlined"
                                    prefix="₹"
                                    required
                                    class="mb-2"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="product.status"
                                    :items="statusOptions"
                                    label="Status"
                                    variant="outlined"
                                    required
                                    class="mb-2"
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-textarea
                            v-model="product.description"
                            label="Description"
                            variant="outlined"
                            rows="4"
                            class="mb-4"
                        ></v-textarea>
                        
                         <v-file-input
                            label="Product Image (Optional)"
                            variant="outlined"
                            prepend-icon="mdi-camera"
                            density="compact"
                            class="mb-6"
                        ></v-file-input>

                        <div class="d-flex justify-end">
                            <v-btn variant="text" size="large" class="mr-2" @click="navigateTo('/products')">Cancel</v-btn>
                            <v-btn
                                color="primary"
                                size="large"
                                rounded="lg"
                                elevation="2"
                                @click="submit"
                            >
                                Create Product
                            </v-btn>
                        </div>
                    </v-form>
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

<script setup lang="ts">
import { useProductStore } from '~/stores/product'

const route = useRoute()
const productStore = useProductStore()
const snack = useSnackStore()
const confirm = useConfirmStore()

const productId = route.params.id as string
const valid = ref(false)
const form = ref<any>(null)

// Load product data
const currentProduct = productStore.getProductById(productId)

const product = ref({
    name: '',
    category: null as string | null,
    price: null as number | null,
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
})

if (currentProduct) {
    product.value = {
        name: currentProduct.name,
        category: currentProduct.category,
        price: currentProduct.price,
        description: currentProduct.description,
        status: currentProduct.status,
    }
} else {
    // Handle not found (optional, for now just redirect or show error)
    snack.error('Product not found')
    navigateTo('/products')
}

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

async function save() {
    const { valid } = await form.value.validate()

    if (valid) {
        productStore.updateProduct(productId, {
            name: product.value.name,
            category: product.value.category!,
            price: Number(product.value.price),
            description: product.value.description,
            status: product.value.status as 'Active' | 'Inactive',
        })
        
        snack.success('Product updated successfully')
        navigateTo('/products')
    }
}

function deleteProduct() {
     if (currentProduct?.hasOrders) {
        snack.error('Cannot delete: This product has associated orders.')
        return
    }

    confirm.show(
        'Delete Product',
        `Are you sure you want to delete "${currentProduct?.name}"?`,
        () => {
            const result = productStore.deleteProduct(productId)
            if (result.success) {
                snack.success(result.message)
                navigateTo('/products')
            } else {
                snack.error(result.message)
            }
        },
        {
            _okText: 'Delete',
            _okColor: 'red-darken-1'
        } as any // using any because the type definition in store seems slightly mismatched or I want to bypass strict color check for now (custom color was error)
    )
}
</script>

<template>
    <v-container fluid class="pa-6">
        <div class="mb-6 d-flex justify-space-between align-center">
             <div class="d-flex align-center">
                <v-btn icon="mdi-arrow-left" variant="text" @click="navigateTo('/products')" class="me-2"></v-btn>
                <div>
                    <h1 class="text-h4 font-weight-bold text-grey-darken-3">Edit Product</h1>
                    <p class="text-subtitle-1 text-grey">Update product details or settings</p>
                </div>
             </div>
             <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="deleteProduct">
                Delete Product
             </v-btn>
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
                            label="Replace Image (Optional)"
                            variant="outlined"
                            prepend-icon="mdi-camera"
                            density="compact"
                            class="mb-6"
                        ></v-file-input>
                        
                        <!-- Mock Stats for Delete Validation Visibility -->
                         <v-alert
                            v-if="currentProduct?.hasOrders"
                            type="info"
                            variant="tonal"
                            density="compact"
                            class="mb-4"
                            icon="mdi-information"
                        >
                            This product has associated orders and cannot be deleted.
                        </v-alert>

                        <div class="d-flex justify-end">
                            <v-btn variant="text" size="large" class="mr-2" @click="navigateTo('/products')">Cancel</v-btn>
                            <v-btn
                                color="primary"
                                size="large"
                                rounded="lg"
                                elevation="2"
                                @click="save"
                            >
                                Save Changes
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

<script setup lang="ts">
import { useProductStore } from '~/stores/product'

const productStore = useProductStore()
const search = ref('')
const categoryFilter = ref<string | null>(null)

const categories = ['Astrology', 'Yagya', 'Healings', 'Vaastu']

const filteredProducts = computed(() => {
    let items = productStore.products
    if (categoryFilter.value) {
        items = items.filter(p => p.category === categoryFilter.value)
    }
    if (search.value) {
        const query = search.value.toLowerCase()
        items = items.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        )
    }
    return items
})

const snack = useSnackStore()
const confirm = useConfirmStore()

function deleteProduct(item: any) {
    if (item.hasOrders) {
        snack.error('Cannot delete: This product has associated orders.')
        return
    }

    confirm.show(
        'Delete Product',
        `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
        () => {
            const result = productStore.deleteProduct(item.id)
            if (result.success) {
                snack.success(result.message)
            } else {
                snack.error(result.message)
            }
        },
        {
            _okText: 'Delete',
            _okColor: 'red-darken-1'
        } as any
    )
}

// Helper to get random picsum image for now if no image exists
// Using static ID based on product ID to keep it consistent across reloads
function getProductImage(id: string) {
    return `https://picsum.photos/seed/${id}/300/200`
}
</script>

<template>
    <v-container fluid class="pa-6">
        <div class="mb-6 d-flex justify-space-between align-center flex-wrap gap-4">
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">Products</h1>
                <p class="text-subtitle-1 text-grey">Manage your store's products and services</p>
            </div>
            <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                rounded="xl"
                size="large"
                to="/products/create"
                elevation="3"
                class="text-none font-weight-bold"
            >
                Create Product
            </v-btn>
        </div>

        <!-- Filters -->
        <v-card elevation="0" class="mb-8 bg-transparent">
            <v-row>
                <v-col cols="12" sm="5" md="4">
                    <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="Search Products"
                        variant="outlined"
                        density="comfortable"
                        rounded="xl"
                        hide-details
                        bg-color="white"
                        class="search-input"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="3">
                    <v-select
                        v-model="categoryFilter"
                        :items="categories"
                        label="Filter by Category"
                        clearable
                        density="comfortable"
                        variant="outlined"
                        rounded="xl"
                        hide-details
                        bg-color="white"
                    ></v-select>
                </v-col>
            </v-row>
        </v-card>

        <!-- Product Grid -->
        <v-row>
            <v-col
                v-for="product in filteredProducts"
                :key="product.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
                <v-hover v-slot="{ isHovering, props }">
                    <v-card
                        v-bind="props"
                        :elevation="isHovering ? 8 : 2"
                        :class="['product-card', { 'on-hover': isHovering }]"
                        rounded="xl"
                    >
                        <!-- Image Area -->
                        <div class="image-container">
                            <v-img
                                :src="getProductImage(product.id)"
                                cover
                                height="200"
                                class="align-end"
                            >
                                <v-card-title class="text-white product-title-overlay">
                                    {{ product.name }}
                                </v-card-title>
                            </v-img>
                            
                            <!-- Status Badge -->
                            <v-chip
                                :color="product.status === 'Active' ? 'success' : 'grey'"
                                class="status-chip font-weight-bold"
                                size="small"
                                variant="flat"
                            >
                                {{ product.status }}
                            </v-chip>
                        </div>

                        <!-- Card Content -->
                        <div class="pa-4 flex-grow-1 d-flex flex-column">
                            <div class="d-flex justify-space-between align-start mb-2">
                                <span class="text-caption text-uppercase font-weight-bold text-primary bg-blue-lighten-5 px-2 py-1 rounded-pill">
                                    {{ product.category }}
                                </span>
                                <div class="text-h6 font-weight-bold text-primary">
                                    ₹{{ product.price }}
                                </div>
                            </div>

                            <p class="text-body-2 text-grey-darken-1 mb-4 text-truncate-2">
                                {{ product.description }}
                            </p>

                            <v-divider class="mb-3"></v-divider>

                            <!-- Actions -->
                            <div class="d-flex justify-space-between align-center mt-auto">
                                <v-btn
                                    variant="text"
                                    color="primary"
                                    class="flex-grow-1 mr-2"
                                    rounded="lg"
                                    :to="`/products/${product.id}`"
                                    prepend-icon="mdi-pencil"
                                >
                                    Edit
                                </v-btn>
                                <v-btn
                                    variant="tonal"
                                    color="error"
                                    class="flex-grow-1 ml-2"
                                    rounded="lg"
                                    @click="deleteProduct(product)"
                                    icon="mdi-delete"
                                    size="small"
                                >
                                </v-btn>
                            </div>
                        </div>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}

.product-card {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background-color: white;
    overflow: hidden;
    cursor: default;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.product-card.on-hover {
    transform: translateY(-8px);
}

.image-container {
    position: relative;
    overflow: hidden;
}

.v-img {
    transition: transform 0.5s ease;
}

.product-card.on-hover .v-img {
    transform: scale(1.05);
}

.product-title-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    padding-bottom: 12px;
    font-size: 1.1rem;
    line-height: 1.4;
}

.status-chip {
    position: absolute;
    top: 12px;
    right: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 40px; /* Approximate height for 2 lines */
}

.search-input :deep(.v-field__outline__start) {
    border-radius: 24px 0 0 24px !important;
}
.search-input :deep(.v-field__outline__end) {
    border-radius: 0 24px 24px 0 !important;
}
</style>

<script setup lang="ts">
import { useProductStore } from '~/stores/product'

const productStore = useProductStore()
const search = ref('')
const categoryFilter = ref<string | null>(null)

const categories = ['Astrology', 'Yagya', 'Healings', 'Vaastu']

const headers = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Product Name', key: 'name', align: 'start' },
    { title: 'Category', key: 'category', align: 'start' },
    { title: 'Price', key: 'price', align: 'end' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
] as const

const filteredProducts = computed(() => {
    let items = productStore.products
    if (categoryFilter.value) {
        items = items.filter(p => p.category === categoryFilter.value)
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
</script>

<template>
    <v-container fluid class="pa-6">
        <div class="mb-6 d-flex justify-space-between align-center">
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">Products</h1>
                <p class="text-subtitle-1 text-grey">Manage your store's products and services</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" to="/products/create" elevation="2">
                Create Product
            </v-btn>
        </div>

        <v-card elevation="2" rounded="xl">
            <v-data-table
                :headers="headers"
                :items="filteredProducts"
                :search="search"
                class="pa-2"
                hover
            >
                <template v-slot:top>
                     <v-row class="pa-4 align-center">
                        <v-col cols="12" sm="4">
                             <v-text-field
                                v-model="search"
                                prepend-inner-icon="mdi-magnify"
                                label="Search Products"
                                single-line
                                hide-details
                                variant="outlined"
                                density="compact"
                                rounded="lg"
                            ></v-text-field>
                        </v-col>
                         <v-col cols="12" sm="3">
                            <v-select
                                v-model="categoryFilter"
                                :items="categories"
                                label="Filter by Category"
                                clearable
                                density="compact"
                                variant="outlined"
                                hide-details
                                rounded="lg"
                            ></v-select>
                        </v-col>
                    </v-row>
                </template>

                <template v-slot:item.price="{ item }">
                    <span class="font-weight-medium">₹{{ item.price }}</span>
                </template>

                 <template v-slot:item.status="{ item }">
                    <v-chip
                        :color="item.status === 'Active' ? 'success' : 'grey'"
                        size="small"
                        label
                        variant="tonal"
                    >
                        {{ item.status }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div class="d-flex justify-end">
                        <v-btn icon variant="text" color="primary" size="small" :to="`/products/${item.id}`" class="mr-1">
                            <v-icon>mdi-pencil</v-icon>
                            <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                        </v-btn>
                        <v-btn icon variant="text" color="error" size="small" @click="deleteProduct(item)">
                            <v-icon>mdi-delete</v-icon>
                            <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<style scoped>
.v-container {
    font-family: 'Montserrat', sans-serif;
}
</style>

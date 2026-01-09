<script setup lang="ts">
import adminAvatar from '~/assets/images/admin.png'

let drawer = ref(false)
let route = useRoute()
const data = useDataStore()

onMounted(() => {
	helpers.fetchProfile()
})

function toggleDrawer() {
	drawer.value = !drawer.value
}

function goto(path: string) {
	navigateTo(path)
	drawer.value = false
}
</script>

<template>
	<v-layout>
		<v-main style="height: 70px">
			<header class="d-flex justify-between align-center px-8 custom-header text-white">
				<NuxtLink href="/" title="XtrasZone Admin Panel">
					<img src="/logo.svg" alt="Site Logo" class="logo" />
				</NuxtLink>

				<div class="menu h-100 d-flex align-center">
					<NuxtLink v-if="data.admin" href="#" @click.prevent="helpers.logout">Logout</NuxtLink>

					<NuxtLink v-else href="/login" :class="{ active: route.path === '/login' }">Login</NuxtLink>

					<v-btn
						@click="toggleDrawer"
						icon="mdi-menu"
						size="small"
						variant="text"
						color="white"
						class="ms-2"
					></v-btn>
				</div></header
		></v-main>
		<v-navigation-drawer v-model="drawer" temporary class="components-drawer rounded-e-xl" elevation="5">
			<div class="pa-4 text-center">
        <v-avatar size="80" color="purple-lighten-4" class="mb-3">
          <v-img v-if="data.admin" :src="adminAvatar" alt="Admin"></v-img>
          <v-icon v-else icon="mdi-account" size="40" color="purple-darken-2"></v-icon>
        </v-avatar>
				<h3 class="text-h6 font-weight-bold text-purple-darken-3 mb-1">{{ data.admin ? data.admin.name : 'Guest' }}</h3>
        <p class="text-caption text-grey">Welcome back!</p>
			</div>

			<v-divider class="mb-2"></v-divider>

			<v-list density="comfortable" nav class="px-3">
				<template v-if="data.admin">
					<v-list-item
						prepend-icon="mdi-home"
						title="Home"
						value="home"
						:active="route.path === '/'"
						@click="goto('/')"
            active-color="purple-darken-2"
            rounded="xl"
            class="mb-1"
					/>

					<v-list-item
						prepend-icon="mdi-book-multiple"
						title="Courses"
						value="courses"
						:active="route.path === '/courses'"
						@click="goto('/courses')"
            active-color="purple-darken-2"
            rounded="xl"
            class="mb-1"
					/>

					<v-list-item
						prepend-icon="mdi-cash-multiple"
						title="Orders"
						value="orders"
						:active="route.path === '/orders'"
						@click="goto('/orders')"
            active-color="purple-darken-2"
            rounded="xl"
            class="mb-1"
					/>

					<v-list-item
						prepend-icon="mdi-comment-quote"
						title="Feedbacks"
						value="feedbacks"
						:active="route.path === '/feedbacks'"
						@click="goto('/feedbacks')"
            active-color="purple-darken-2"
            rounded="xl"
            class="mb-1"
					/>

					<v-list-item
						prepend-icon="mdi-google-analytics"
						title="Analytics"
						value="analytics"
						:active="route.path === '/analytics'"
						@click="goto('/analytics')"
            active-color="purple-darken-2"
            rounded="xl"
            class="mb-1"
					/>

					<v-list-item
						prepend-icon="mdi-sale"
						title="Coupons"
						value="coupons"
						:active="route.path === '/coupons'"
						@click="goto('/coupons')"
            active-color="purple-darken-2"
            rounded="xl"
            class="mb-1"
					/>

					<v-list-item
						prepend-icon="mdi-logout"
						title="Logout"
						value="logout"
						:active="route.path === '/logout'"
						@click="helpers.logout"
            active-color="error"
            rounded="xl"
            class="mt-4"
					/>
				</template>

				<v-list-item
					v-if="!data.admin"
					prepend-icon="mdi-login"
					title="Login"
					value="login"
					:active="route.path === '/login'"
					@click="goto('/login')"
          active-color="purple-darken-2"
          rounded="xl"
				/>
			</v-list>
		</v-navigation-drawer>
	</v-layout>
</template>

<style scoped>
header {
	height: 70px;
}

.custom-header {
  background: linear-gradient(to right, #5c6bc0, #512da8);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Montserrat', sans-serif;
}

.components-drawer {
  font-family: 'Montserrat', sans-serif;
  border: none;
}

.logo {
	width: auto;
	height: 35px;
  filter: brightness(0) invert(1); /* Make logo white to match theme */
}

.menu a {
	color: rgba(255, 255, 255, 0.9);
	text-decoration: none;
	padding: 8px 20px;
	margin-inline: 4px;
	font-weight: 500;
	font-size: 0.95rem;
	border-radius: 50px;
	text-align: center;
	display: flex;
	align-items: center;
	transition: all 300ms;
}

.menu a:hover {
	background-color: rgba(255, 255, 255, 0.2);
	color: white;
}

a.active {
	background-color: rgba(255, 255, 255, 0.25);
	color: white;
	font-weight: 600;
}
</style>

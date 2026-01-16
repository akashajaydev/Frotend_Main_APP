<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import adminAvatar from '~/assets/images/admin.png'

const data = useDataStore()
const ui = useUIStore()
const route = useRoute()

onMounted(() => {
	helpers.fetchProfile()
})

function toggleDrawer() {
	ui.toggleDrawer()
}

function goto(path: string) {
	navigateTo(path)
}
</script>

<template>
	<header class="d-flex justify-between align-center px-8 custom-header text-white">

		<v-btn @click="toggleDrawer" icon="mdi-menu" size="small" variant="text" color="white"
			class="ms-2"></v-btn>
		<NuxtLink href="/" title="XtrasZone Admin Panel">
			<img src="/logo.svg" alt="Site Logo" class="logo" />
		</NuxtLink>

		<div class="menu h-100 d-flex align-center">
			<template v-if="data.admin">
				<v-menu location="bottom end" transition="scale-transition">
					<template v-slot:activator="{ props }">
						<v-btn v-bind="props" variant="text" class="text-capitalize px-2 d-flex align-center"
							height="48" rounded="xl">
							<v-avatar size="32" class="me-2">
								<v-img :src="adminAvatar" alt="Admin"></v-img>
							</v-avatar>
							<span class="text-white font-weight-medium d-none d-sm-block">{{ data.admin.name
								}}</span>
							<v-icon icon="mdi-chevron-down" size="small" color="white" class="ms-1"></v-icon>
						</v-btn>
					</template>

					<v-list density="compact" rounded="xl" elevation="3" class="mt-2 py-2">
						<v-list-item prepend-icon="mdi-account" title="Profile" value="profile"
							@click="goto('/profile')" active-color="primary" />
						<v-divider class="my-1"></v-divider>
						<v-list-item prepend-icon="mdi-logout" title="Logout" value="logout"
							@click="helpers.logout" color="error" />
					</v-list>
				</v-menu>
			</template>

			<NuxtLink v-else href="/login" :class="{ active: route.path === '/login' }">Login</NuxtLink>
		</div>
	</header>
</template>

<style scoped>
header {
	height: 70px;
}

.custom-header {
	background: linear-gradient(to right, #090909, #2d058b);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	font-family: 'Montserrat', sans-serif;
}

.logo {
	width: auto;
	height: 35px;
	filter: brightness(0) invert(1);
	/* Make logo white to match theme */
}

/* Menu styles */
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

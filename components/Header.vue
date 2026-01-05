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
			<header class="d-flex justify-between align-center bg-theme-lighten px-8">
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
						color="var(--theme)"
						class="ms-2 text-white"
					></v-btn>
				</div></header
		></v-main>
		<v-navigation-drawer v-model="drawer" temporary>
			<v-list-item
				v-if="data.admin"
				:prepend-avatar="adminAvatar"
				:title="data.admin.name"
				class="mt-8"
				:active="route.path === '/profile'"
				@click="goto('/profile')"
			></v-list-item>

			<v-divider></v-divider>

			<v-list density="compact" nav>
				<template v-if="data.admin">
					<v-list-item
						prepend-icon="mdi-home"
						title="Home"
						value="home"
						:active="route.path === '/'"
						@click="goto('/')"
					/>

					<v-list-item
						prepend-icon="mdi-book-multiple"
						title="Courses"
						value="courses"
						:active="route.path === '/courses'"
						@click="goto('/courses')"
					/>

					<v-list-item
						prepend-icon="mdi-cash-multiple"
						title="Orders"
						value="orders"
						:active="route.path === '/orders'"
						@click="goto('/orders')"
					/>

					<v-list-item
						prepend-icon="mdi-comment-quote"
						title="Feedbacks"
						value="feedbacks"
						:active="route.path === '/feedbacks'"
						@click="goto('/feedbacks')"
					/>

					<v-list-item
						prepend-icon="mdi-google-analytics"
						title="Analytics"
						value="analytics"
						:active="route.path === '/analytics'"
						@click="goto('/analytics')"
					/>

					<v-list-item
						prepend-icon="mdi-sale"
						title="Coupons"
						value="coupons"
						:active="route.path === '/coupons'"
						@click="goto('/coupons')"
					/>

					<v-list-item
						prepend-icon="mdi-logout"
						title="Logout"
						value="logout"
						:active="route.path === '/logout'"
						@click="helpers.logout"
					/>
				</template>

				<v-list-item
					v-if="!data.admin"
					prepend-icon="mdi-login"
					title="Login"
					value="login"
					:active="route.path === '/login'"
					@click="goto('/login')"
				/>
			</v-list>
		</v-navigation-drawer>
	</v-layout>
</template>

<style scoped>
header {
	height: 70px;
}

.logo {
	width: auto;
	height: 35px;
}

.menu a {
	color: var(--theme);
	text-decoration: none;
	padding: 3px 15px;
	margin-inline: 2px;
	font-weight: 500;
	font-size: 1.1rem;
	border: 5px solid transparent;
	border-radius: 50px;
	text-align: center;
	display: flex;
	align-items: center;
	transition: all 300ms;
}

.menu a:hover {
	background-color: var(--theme);
	color: white;
	border: 5px solid var(--theme-semi-lighten);
}

a.active {
	background-color: var(--theme);
	color: white;
	border: 5px solid var(--theme-lighten);
}
</style>

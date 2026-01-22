<script setup lang="ts">
import { useSnackStore } from '~/stores/snack';
import { useConfirmStore } from '~/stores/confirm';
import { useAlertStore } from '~/stores/alert';
import { useUIStore } from '~/stores/ui';
import adminAvatar from '~/assets/images/admin.png';

const snack = useSnackStore();
const confirm = useConfirmStore();
const alert = useAlertStore();
const ui = useUIStore();
const data = useDataStore();
const route = useRoute();

function goto(path: string) {
	navigateTo(path);
	ui.drawer = false;
}
</script>

<template>
	<v-app>
		<Header />

		<v-main>
			<!-- Alert Message -->
			<v-container>
				
			</v-container>
			<slot />
		</v-main>

		<Footer />

		<!-- Navigation Drawer (Moved from Header) -->
		<v-navigation-drawer v-model="ui.drawer" temporary class="components-drawer " elevation="5">
			<div class="pa-4 text-center">
				<v-avatar size="80" color="-lighten-4" class="mb-3">
					<v-img v-if="data.admin" :src="adminAvatar" alt="Admin"></v-img>
					<v-icon v-else icon="mdi-account" size="40" color="darken-2"></v-icon>
				</v-avatar>
				<h3 class="text-h6 font-weight-bold text-darken-3 mb-1">{{ data.admin ? data.admin.name : 'Guest'
					}}</h3>
				<p class="text-caption text-grey">Welcome back!</p>
			</div>

			<v-divider class="mb-2"></v-divider>

			<v-list density="comfortable" nav class="px-3">
				<template v-if="data.admin">
					<!-- Super Admin Menu -->
					<template v-if="data.admin.role === 'super-admin'">
						<v-list-item prepend-icon="mdi-account-group" title="Admins" value="admins"
							:active="route.path === '/' || route.path.startsWith('/admins')" @click="goto('/')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />
						<v-list-item prepend-icon="mdi-calendar-check" title="Appointments" value="appointments"
							:active="route.path.startsWith('/appointments')" @click="goto('/appointments')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />
						<v-list-item prepend-icon="mdi-card-account-mail" title="Contacts" value="contacts"
							:active="route.path.startsWith('/contacts')" @click="goto('/contacts')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />
						<v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"
							:active="route.path === '/dashboard'" @click="goto('/dashboard')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />
						<v-list-item prepend-icon="mdi-package-variant" title="Products" value="products"
							:active="route.path.startsWith('/products')" @click="goto('/products')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />

						<v-list-item prepend-icon="mdi-cash-multiple" title="Orders" value="orders"
							:active="route.path.startsWith('/orders')" @click="goto('/orders')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />

						<v-list-item prepend-icon="mdi-checkbox-marked-circle-outline" title="Tasks" value="tasks"
							:active="route.path.startsWith('/tasks')" @click="goto('/tasks')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />

						<v-list-item prepend-icon="mdi-calendar-clock" title="Availabilities" value="availabilities"
							:active="route.path === '/availabilities'" @click="goto('/availabilities')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />

						<v-list-item prepend-icon="mdi-google-analytics" title="Analytics" value="analytics"
							:active="route.path === '/analytics'" @click="goto('/analytics')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />
					</template>

					<!-- Admin Menu -->
					<template v-else-if="data.admin.role === 'admin'">
						<v-list-item prepend-icon="mdi-checkbox-marked-circle-outline" title="Tasks" value="tasks"
							:active="route.path.startsWith('/tasks')" @click="goto('/tasks')"
							active-class="bg-black text-white" rounded="xl" class="mb-1" />
					</template>

					<!-- Common Menu Items -->
					<v-list-item prepend-icon="mdi-account" title="Profile" value="profile"
						:active="route.path === '/profile'" @click="goto('/profile')" active-class="bg-black text-white"
						rounded="xl" class="mb-1" />

					<v-list-item prepend-icon="mdi-logout" title="Logout" value="logout"
						:active="route.path === '/logout'" @click="helpers.logout" active-color="error" rounded="xl"
						class="mt-4" />
				</template>

				<v-list-item v-if="!data.admin" prepend-icon="mdi-login" title="Login" value="login"
					:active="route.path === '/login'" @click="goto('/login')" active-class="bg-black text-white"
					rounded="xl" />
			</v-list>
		</v-navigation-drawer>

		<!-- Snackbar -->
		<v-snackbar v-model="snack.visible" :color="snack.color">
			{{ snack.message }}

			<template v-slot:actions>
				<v-btn :color="snack.dismissColor" variant="text" @click="snack.hide">Close</v-btn>
			</template>
		</v-snackbar>

		<!-- Confirm Dialog -->
		<v-dialog v-model="confirm.visible" persistent width="auto" min-width="700px">
			<v-card>
				<v-card-title class="text-h5 fw-bold">{{ confirm.title }}</v-card-title>
				<v-card-text>{{ confirm.message }}</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						:color="confirm.cancelColor"
						variant="text"
						@click="
							confirm.onCancel?.();
							confirm.hide();
						"
						>{{ confirm.cancelText }}</v-btn
					>
					<v-btn
						:color="confirm.okColor"
						variant="text"
						@click="
							confirm.onOk?.();
							confirm.hide();
						"
						>{{ confirm.okText }}</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-app>
</template>

<style scoped>
main {
	min-height: calc(100dvh - 70px - 70px);
}

.components-drawer {
	font-family: 'Montserrat', sans-serif;
	border: none;
}
</style>

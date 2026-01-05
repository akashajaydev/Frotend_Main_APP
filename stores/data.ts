import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', () => {
	const admin = ref<Admin>();

	return { admin };
});

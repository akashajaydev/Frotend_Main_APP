<script setup lang="ts">
const props = defineProps<{links: Link[]}>()

interface Link {
  label: string
  href?: string
}
</script>

<template>
  <div class="mb-6">
    <template v-for="(link, index) of props.links" :key="link.label">
      <NuxtLink :to="link.href" class="fz-14">{{ link.label }}</NuxtLink>
      <Icon v-if="index < props.links.length - 1" name="mingcute:right-fill" color="var(--theme)" class="fz-12 mx-2" />
    </template>
  </div>
</template>
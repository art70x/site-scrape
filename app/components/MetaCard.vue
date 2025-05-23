<template>
  <section
    class="space-y-4 rounded-lg border p-4 shadow-md ta-200 hover:border-primary hover:bg-gray-200 hover:shadow-primary"
    aria-labelledby="preview-title"
  >
    <h2 id="preview-title">{{ meta.title }}</h2>
    <p class="text-gray-700">{{ meta.description }}</p>

    <img
      class="mt-2 w-full rounded"
      v-if="meta.image"
      :src="meta.image"
      :alt="`${meta.title} 's OpenGraph Image`"
      loading="lazy"
    />
    <a :href="meta.url" target="_blank" rel="noopener noreferrer">
      {{ meta.url }}
    </a>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  meta: {
    title?: string
    description?: string
    image?: string
    url?: string
  }
}>()
</script>

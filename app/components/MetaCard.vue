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

<template>
  <Transition name="fade" mode="out-in">
    <section
      v-if="meta"
      class="space-y-4 rounded-lg border p-4 shadow-md ta-200 hover:border-primary hover:bg-zinc-200 hover:shadow-primary"
      aria-labelledby="preview-title"
    >
      <h2 id="preview-title" class="flex items-center gap-2 text-lg font-semibold">
        {{ meta.title || 'No title' }}
      </h2>

      <p class="text-gray-700">{{ meta.description || 'No description available' }}</p>

      <img
        v-if="meta.image"
        class="mt-2 w-full rounded"
        :src="meta.image"
        :alt="`${meta.title} OpenGraph Image`"
        loading="lazy"
      />

      <a
        :href="meta.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-primary underline underline-offset-2"
      >
        {{ meta.url }}
      </a>
    </section>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

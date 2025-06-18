<script setup lang="ts">
defineProps<{ history: string[] }>()
defineEmits(['select'])
</script>

<template>
  <div class="mt-6">
    <TransitionGroup v-if="history.length" tag="ul" name="fade" class="space-y-4">
      <li v-for="url in history" :key="url">
        <button
          class="flex w-full items-center gap-2 rounded-md bg-zinc-200 px-4 py-2 text-start font-medium transition-all hover:bg-zinc-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
          :aria-label="`Preview ${url}`"
          @click="$emit('select', url)"
        >
          <Icon name="mdi:history" class="text-2xl text-gray-700" />
          {{ url }}
        </button>
      </li>
    </TransitionGroup>
    <div v-else class="flex flex-col items-center justify-center py-8 text-center">
      <div class="mb-4 rounded-full bg-gray-200 p-4">
        <Icon name="ri:history-line" class="text-[48px] text-foreground/80" />
      </div>
      <h3>No history yet</h3>
      <p class="max-w-xs text-sm text-foreground/70">
        Your previous searches will appear here for quick access
      </p>
    </div>
  </div>
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

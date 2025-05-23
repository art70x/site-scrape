<template>
  <ul class="mt-6 space-y-4">
    <li v-for="url in history" :key="url">
      <button
        class="w-full rounded-md bg-gray-200 px-4 py-2 text-start font-medium ta-200 hover:bg-gray-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
        :aria-label="`Preview ${url}`"
        @click="$emit('select', url)"
      >
        {{ url }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const history = ref<string[]>([])

onMounted(() => {
  const data = localStorage.getItem('meta:history')
  history.value = data ? JSON.parse(data) : []
})

defineEmits(['select'])
</script>

<template>
  <div class="mt-6 overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-300 rounded-md border border-gray-200 shadow-sm">
      <thead class="bg-gray-50 text-left font-semibold text-gray-700">
        <tr>
          <th class="px-4 py-3">Field</th>
          <th class="px-4 py-3">Value</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 text-gray-700">
        <tr>
          <td class="px-4 py-2 font-medium">Title</td>
          <td class="px-4 py-2 break-words">{{ meta.title || 'N/A' }}</td>
        </tr>
        <tr>
          <td class="px-4 py-2 font-medium">Description</td>
          <td class="px-4 py-2 break-words">{{ meta.description || 'N/A' }}</td>
        </tr>
        <tr>
          <td class="px-4 py-2 font-medium">Image Link</td>
          <td class="px-4 py-2 break-all">
            <a v-if="meta.image" :href="meta.image" target="_blank" rel="noopener noreferrer">
              {{ meta.image }}
            </a>
            <span v-else>N/A</span>
          </td>
        </tr>
        <tr>
          <td class="px-4 py-2 font-medium">Icon (or favicon) Link</td>
          <td class="px-4 py-2 break-all">
            <a v-if="meta.logo" :href="meta.logo" target="_blank" rel="noopener noreferrer">
              {{ meta.logo }}
            </a>
            <span v-else>N/A</span>
          </td>
        </tr>
        <tr>
          <td class="px-4 py-2 font-medium">URL</td>
          <td class="px-4 py-2 break-words">
            <a :href="meta.url || '#'" target="_blank" rel="noopener noreferrer">
              {{ meta.url || 'N/A' }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  meta: {
    title?: string
    description?: string
    image?: string
    logo?: string
    url?: string
  }
}>()
</script>

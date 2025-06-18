<script setup lang="ts">
const props = defineProps<{
  meta: {
    og: {
      image?: string
    }
    title?: string
    description?: string
    icons: {
      favicon?: string
      appleTouchIcon?: string
    }
    url?: string
  }
}>()

const rows = {
  title: props.meta.title,
  description: props.meta.description,
  image: props.meta.og.image,
  icon: props.meta.icons.favicon || props.meta.icons.appleTouchIcon,
  url: props.meta.url,
}

const isUrl = (val?: string) => val?.startsWith('http')
</script>

<template>
  <div class="mt-6 overflow-x-auto">
    <table
      class="min-w-full divide-y divide-gray-300 rounded-md border border-gray-200 text-sm shadow-sm"
    >
      <thead class="bg-zinc-50 text-left font-semibold text-gray-700">
        <tr>
          <th class="px-4 py-3">Field</th>
          <th class="px-4 py-3">Value</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 text-gray-700">
        <tr v-for="(value, label) in rows" :key="label">
          <td class="px-4 py-2 font-medium capitalize">
            {{ label }}
          </td>
          <td class="px-4 py-2 break-words">
            <a
              v-if="isUrl(value)"
              :href="value"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary underline underline-offset-2"
            >
              {{ value }}
            </a>
            <span v-else>{{ value || 'N/A' }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

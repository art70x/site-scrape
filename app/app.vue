<script setup lang="ts">
useSeoMeta({
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow, max-image-preview:large',
  ogType: 'website',
  ogSiteName: 'SiteScrape',
  ogLocale: 'en_us',
  twitterCard: 'summary_large_image',
})
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useSeoMeta({
  viewport: 'width=device-width, initial-scale=1.0',
  charset: 'utf-8',
  author: 'art70x',
  ogType: 'website',
  ogLocale: 'en_US',
  ogUrl: 'https://sitescrape.vercel.app/',
  twitterCard: 'summary_large_image',
  twitterCreator: 'art70x',
  themeColor: '#2776ec',
  googleSiteVerification: 'FSVkWUhVYofaUBvZktFhGzEpTWJMcDPimVgqHFTBMNo',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  titleTemplate: null,
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

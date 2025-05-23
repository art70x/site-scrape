<template>
  <div class="mx-auto max-w-3xl px-4 py-10 text-gray-900 sm:px-6 lg:px-8">
    <!-- HERO SECTION -->
    <header
      class="mb-10 flex flex-col-reverse items-center gap-6 border-b pb-10 sm:flex-row sm:justify-between"
      id="hero"
    >
      <div class="text-center sm:text-left">
        <h1>SiteScrape</h1>
        <p class="mt-2 max-w-md text-base text-gray-600">
          Boost productivity with SiteScrape — a browser-based web scraping tool that helps you collect website data quickly and securely. Ideal for research and automation.
        </p>
      </div>
      <img
        class="rounded-xl drop-shadow-xl drop-shadow-primary/25"
        src="/icon.svg"
        width="240"
        height="240"
        alt="SiteScrape app icon"
      />
    </header>

    <!-- FORM SECTION -->
    <section class="mb-8 space-y-3" id="form" aria-labelledby="form-title">
      <h2 class="sr-only" id="form-title">Meta preview form</h2>
      <form class="space-y-4" @submit.prevent="handleSubmit" aria-describedby="form-help">
        <label class="sr-only" for="url">Website URL</label>
        <input
          class="w-full rounded-lg border border-gray-400 px-4 py-2 tracking-wide shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          id="url"
          v-model="url"
          type="url"
          placeholder="Enter a website URL"
          required
          aria-required="true"
        />
        <p class="text-sm text-gray-500" id="form-help">
          Enter any valid link to fetch its metadata.
        </p>

        <div class="flex items-center gap-2">
          <input
            class="rounded-lg border-gray-300 text-primary shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
            id="autofetch"
            type="checkbox"
            v-model="autoFetch"
            @change="saveSetting"
            aria-describedby="checkbox-help"
          />
          <label class="cursor-pointer text-sm text-gray-500" id="checkbox-help" for="autofetch">
            Auto-fetch on page load
          </label>
        </div>

        <button class="btn" type="submit">Get Metadata</button>
      </form>
    </section>

    <!-- RESULT SECTION -->
    <section class="space-y-6" id="result" aria-live="polite">
      <div class="flex items-center gap-2 text-blue-500" v-if="loading" role="status">
        <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span class="text-sm">Fetching metadata...</span>
      </div>
      <p class="font-semibold text-red-600" v-if="error" role="alert">{{ error }}</p>
      <template v-if="meta && !error && !loading">
        <LazyMetaCard :meta="meta" />
        <LazyMetaTable :meta="meta" />
      </template>
    </section>

    <!-- SHARE SECTION -->
    <section class="space-y-2 pt-8" id="share" v-if="meta?.url && !loading">
      <h2 class="text-lg font-semibold text-gray-800">🔗 Share this preview</h2>
      <div class="flex flex-wrap items-center gap-3">
        <SocialShare
          v-for="sm in ['x', 'facebook', 'reddit', 'whatsapp', 'bluesky']"
          :key="sm"
          :network="sm"
          :styled="true"
          :url="`${$config.public.siteUrl}?url=${getCleanPath(url)}`"
          title="Check out this link on SiteScrape!"
          hashtags="nuxt,link,preview"
        />
        <button
          class="btn"
          @click="copyLink"
          :aria-label="copied ? 'Copied link' : 'Copy share link'"
        >
          {{ copied ? 'Copied!' : 'Copy Link' }}
        </button>
      </div>
    </section>

    <!-- HISTORY SECTION -->
    <section class="mt-10 border-t pt-10" id="history">
      <h2 class="mb-2 text-lg font-semibold">📜 History</h2>
      <LazyMetaHistory @select="fetchMetaFromHistory" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const url = ref<string>('')
const copied = ref(false)
const autoFetch = ref(false)

const { meta, error, loading, fetchMeta } = useMetaPreview()
const route = useRoute()
const router = useRouter()

useSeoMeta({
  title: 'SiteScrape - Website Meta Analyzer',
  description: 'Boost productivity with SiteScrape — a browser-based web scraping tool that helps you collect website data quickly and securely. Ideal for research and automation.',
  ogDescription: 'Boost productivity with SiteScrape — a browser-based web scraping tool that helps you collect website data quickly and securely. Ideal for research and automation.',
  twitterDescription: 'Boost productivity with SiteScrape — a browser-based web scraping tool that helps you collect website data quickly and securely. Ideal for research and automation.',
})
useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://site-scrape.netlify.app/'
    }
  ]
})

const normalizeUrl = (input: string): string => {
  const trimmed = input
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
  return `https://${trimmed}`
}

const getCleanPath = (value: string) =>
  value
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')

const submitUrl = (inputUrl: string) => {
  const fullUrl = normalizeUrl(inputUrl)
  url.value = fullUrl
  fetchMeta(fullUrl)
  router.replace({ query: { url: getCleanPath(fullUrl) } })
}

const handleSubmit = () => {
  submitUrl(url.value)
}

const fetchMetaFromHistory = (selectedUrl: string) => {
  submitUrl(selectedUrl)
}

const copyLink = async () => {
  if (typeof window === 'undefined') return

  const shareLink = `${useRuntimeConfig().public.siteUrl}?url=${getCleanPath(url.value)}`
  try {
    await navigator.clipboard.writeText(shareLink)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

const loadSetting = () => {
  if (typeof window === 'undefined') return
  const saved = localStorage.getItem('sitescrape:autoFetch')
  autoFetch.value = saved === 'true'
}

const saveSetting = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem('sitescrape:autoFetch', String(autoFetch.value))
}

onMounted(() => {
  loadSetting()
  const shared = route.query.url
  if (typeof shared === 'string') {
    const reconstructed = normalizeUrl(shared)
    url.value = reconstructed
    if (autoFetch.value) {
      fetchMeta(reconstructed)
    }
  }
})
</script>

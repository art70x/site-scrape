<template>
  <div>
    <!-- Hero Section -->
    <header
      class="mx-auto mb-8 flex max-w-3xl flex-col-reverse items-center gap-6 border-b px-4 py-10 pb-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8"
    >
      <div class="text-center sm:text-left">
        <h1 class="text-3xl font-bold">SiteScrape</h1>
        <p class="mt-2 max-w-md text-base text-zinc-600">
          {{ useRuntimeConfig().public.description }}
        </p>
      </div>
      <a href="/" aria-label="SiteScrape Homepage">
        <img
          class="drop-shadow-xl drop-shadow-primary/25"
          src="/icon.svg"
          width="240"
          height="240"
          alt="SiteScrape icon"
          loading="lazy"
      /></a>
    </header>
    <!-- Form Section -->
    <section class="mb-8 space-y-4">
      <h2 class="sr-only">Website Metadata Analyzer</h2>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="sr-only" for="url-input">Enter website URL</label>
          <input
            class="w-full rounded-lg border border-gray-400 px-4 py-2 tracking-wide shadow-sm ring-offset-1 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
            id="url-input"
            v-model="url"
            type="url"
            placeholder="https://example.com"
            required
            aria-required="true"
          />
          <p class="mt-1 text-sm text-zinc-500">
            Enter any valid website URL to fetch its metadata
          </p>
        </div>

        <div class="flex items-center gap-2">
          <input
            class="rounded-lg border-gray-300 text-primary shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
            id="auto-fetch"
            v-model="autoFetch"
            type="checkbox"
            @change="saveSettings"
          />
          <label class="cursor-pointer text-sm text-zinc-500" for="auto-fetch">
            Auto-fetch on page load
          </label>
        </div>

        <button class="btn" type="submit" :disabled="loading || !isValidUrl" :aria-busy="loading">
          Get Metadata
        </button>
      </form>
    </section>

    <!-- Results Section -->
    <section aria-live="polite">
      <div class="flex items-center gap-2 text-blue-500" v-if="loading">
        <span class="sr-only">Loading</span>
        <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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

      <div class="font-semibold text-red-600" v-if="error" role="alert">
        {{ error }}
      </div>

      <template v-if="meta && !error && !loading">
        <LazyMetaCard :meta="meta" />
        <LazyMetaTable :meta="meta" />
      </template>
    </section>

    <!-- Share Section -->
    <section class="space-y-3 pt-8" v-if="meta?.url && !loading">
      <h2 class="text-lg font-semibold text-zinc-800">🔗 Share this preview</h2>
      <div class="flex flex-wrap items-center gap-3">
        <SocialShare
          v-for="network in ['x', 'facebook', 'reddit', 'whatsapp', 'bluesky']"
          :key="network"
          :network="network"
          :styled="true"
          :url="`${siteUrl}?url=${getCleanPath(url)}`"
          title="Check out this link on SiteScrape!"
          hashtags="webdev,metadata,preview"
        />
        <button
          class="flex items-center gap-2 rounded-sm bg-primary p-2 text-sm font-medium text-zinc-50 ta-270 hover:bg-primary-hover focus:ring-2 focus:ring-primary-hover focus:ring-offset-2"
          @click="copyToClipboard"
          :aria-label="copied ? 'Copied' : 'Copy'"
        >
          <Icon
            class="size-6"
            :name="copied ? 'ri:check-line' : 'ri:file-copy-line'"
            width="1rem"
            height="1rem"
            role="img"
            aria-hidden="true"
          />
          <span class="px-2">{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>
      </div>
    </section>
    <!-- History Section -->
    <section class="mt-10 border-t pt-10">
      <h2 class="mb-3 text-lg font-semibold">📜 History</h2>
      <LazyMetaHistory @select="submitUrl" />
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, useRoute, useRouter, useRuntimeConfig } from '#imports'

// State
const url = ref('')
const copied = ref(false)
const autoFetch = ref(false)
const { meta, error, loading, fetchMeta } = useMetaPreview()

// Dependencies
const route = useRoute()
const router = useRouter()
const {
  public: { siteUrl, description },
} = useRuntimeConfig()

// Constants
const LOCAL_STORAGE_KEY = 'sitescrape:autoFetch'
const SHARE_COPY_TIMEOUT = 2000

// SEO Configuration
useSeoMeta({
  title: 'SiteScrape - Website Meta Analyzer',
  description: description,
  ogDescription:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
  twitterDescription:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
})

defineOgImageComponent('pergel', {
  headline: '',
  title: 'SiteScrape - Website Meta Analyzer',
  description:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
})

// Computed
const isValidUrl = computed(() => {
  try {
    new URL(normalizeUrl(url.value))
    return true
  } catch {
    return false
  }
})

// Methods
const normalizeUrl = (input: string): string => {
  if (!input.trim()) return ''

  try {
    const processed = input.startsWith('http') ? input : `https://${input}`
    const { protocol, hostname, pathname } = new URL(processed)

    return `${protocol}//${hostname}${pathname.replace(/\/$/, '')}`
  } catch {
    return ''
  }
}

const getCleanPath = (url: string): string => {
  const normalized = normalizeUrl(url)
  if (!normalized) return ''

  try {
    const { host, pathname } = new URL(normalized)
    return host + pathname
  } catch {
    return ''
  }
}

const submitUrl = (inputUrl: string): void => {
  const normalizedUrl = normalizeUrl(inputUrl)
  if (!normalizedUrl) return

  url.value = normalizedUrl
  updateUrlParam(normalizedUrl)
  fetchMeta(normalizedUrl)
}

const updateUrlParam = (url: string): void => {
  const cleanPath = getCleanPath(url)
  router.replace({ query: cleanPath ? { url: cleanPath } : {} })
}

const handleSubmit = (): void => {
  if (isValidUrl.value) submitUrl(url.value)
}

const copyToClipboard = async (): Promise<void> => {
  const shareUrl = `${siteUrl}?url=${getCleanPath(url.value)}`

  try {
    await navigator.clipboard.writeText(shareUrl)
    copied.value = true
    setTimeout(() => (copied.value = false), SHARE_COPY_TIMEOUT)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

// Settings Management
const loadSettings = (): void => {
  autoFetch.value = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true'
}

const saveSettings = (): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, String(autoFetch.value))
}

// Lifecycle
onMounted(() => {
  loadSettings()
  initFromUrlParam()
})

const initFromUrlParam = (): void => {
  const { url: urlParam } = route.query
  if (typeof urlParam === 'string') {
    const normalized = normalizeUrl(urlParam)
    url.value = normalized
    if (autoFetch.value) fetchMeta(normalized)
  }
}

// Watchers
watch(
  () => route.query.url,
  (newUrl) => {
    if (typeof newUrl === 'string' && newUrl !== getCleanPath(url.value)) {
      const normalized = normalizeUrl(newUrl)
      url.value = normalized
      if (autoFetch.value) fetchMeta(normalized)
    }
  },
)
</script>

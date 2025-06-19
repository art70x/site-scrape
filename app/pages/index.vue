<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'

useSeoMeta({
  title: 'SiteScrape - SEO Analyzer',
  description:
    'Easily scrape and extract website data with SiteScrape — a streamlined, browser-based web scraping tool built for speed, simplicity, and convenience.',
  ogTitle: 'SiteScrape - SEO Analyzer',
  ogDescription:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
  twitterTitle: 'SiteScrape - SEO Analyzer',
  twitterDescription:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://sitescrape.vercel.app/' }],
})

defineOgImageComponent('NuxtSeo', {
  title: 'SiteScrape - SEO Analyzer',
  description:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
  theme: '#2b7fff',
})

const query = ref('')
const copied = ref(false)
const route = useRoute()
const router = useRouter()
const isFetched = ref(false)

const { meta, error, history, fetchMeta, normalizeUrl, clearHistory } = useMetaPreview()

const normalizedUrl = computed(() => normalizeUrl(query.value))

async function handleSelect(url: string) {
  query.value = url
  await performFetch(url)
}

async function performFetch(url: string) {
  isFetched.value = false
  await fetchMeta(url)
  if (!error.value) {
    isFetched.value = true
  }
}

onMounted(() => {
  const param = route.query.url as string
  if (param) {
    query.value = param
    performFetch(param)
  }
})

function copy() {
  if (!normalizedUrl.value) return
  navigator.clipboard.writeText(`${'https://sitescrape.vercel.app/'}?url=${normalizedUrl.value}`)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)

  const liveRegion = document.getElementById('copy-announcement')
  if (liveRegion) liveRegion.textContent = 'Link copied to clipboard'
}

async function submitForm() {
  if (!normalizedUrl.value) {
    alert('Please enter a valid URL.')
    return
  }
  router.replace({ query: { url: normalizedUrl.value } })
  await performFetch(normalizedUrl.value)
}
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-8">
    <section id="hero" class="mb-6 flex flex-col items-center">
      <img
        src="/icon.svg"
        height="90"
        width="115.375"
        alt="SiteScrape icon"
        class="drop-shadow-xl drop-shadow-primary/25"
      />
      <h1 class="mb-6">SiteScrape – SEO Analyzer</h1>
      <p class="mt-2 max-w-md text-base text-gray-600">
        Easily scrape and extract website data with SiteScrape — a streamlined, browser-based web
        scraping tool built for speed, simplicity, and convenience.
      </p>
    </section>

    <section id="form">
      <form class="mb-4 flex flex-row items-center gap-x-2" @submit.prevent="submitForm">
        <input
          v-model="query"
          type="url"
          inputmode="url"
          autocomplete="url"
          required
          class="w-full rounded-lg border border-gray-400 px-4 py-2 font-medium tracking-wide shadow-sm ta-200 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
          placeholder="Enter a website URL"
          aria-label="Enter URL to fetch metadata"
          aria-required="true"
        />
        <button
          type="submit"
          class="btn"
          :disabled="!normalizedUrl"
          aria-label="Fetch metadata for entered URL"
        >
          <Icon name="ri:search-2-fill" />
          Fetch
        </button>
      </form>
    </section>

    <section id="results">
      <Transition name="fade" mode="out-in">
        <div
          v-if="error"
          role="alert"
          aria-live="assertive"
          class="rounded bg-red-100 px-4 py-3 text-sm text-red-700"
        >
          <Icon name="ri:alert-fill" class="mr-1 inline" />
          {{ error }}
        </div>
      </Transition>

      <Transition name="fade" mode="out-in">
        <div v-if="!isFetched && query" class="text-center text-gray-500">
          <Icon name="ri:loader-fill" class="mr-1 inline animate-spin" />
          Fetching metadata...
        </div>
      </Transition>

      <Transition name="fade" mode="out-in">
        <MetaTable v-if="isFetched" :meta="meta" class="mt-4" />
      </Transition>
    </section>

    <section v-if="isFetched" id="share" class="space-y-3 pt-8">
      <h2 class="text-lg font-semibold text-zinc-800">🔗 Share this preview</h2>
      <div class="flex flex-wrap items-center gap-3">
        <SocialShare
          v-for="network in ['x', 'facebook', 'reddit', 'whatsapp', 'bluesky']"
          :key="network"
          :network="network"
          :styled="true"
          :url="`${'https://sitescrape.vercel.app/'}?url=${normalizedUrl}`"
          title="Check out this link on SiteScrape!"
          hashtags="webdev,metadata,preview"
        />
        <button
          class="flex items-center gap-2 rounded-sm bg-primary px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-primary-hover focus:ring-2 focus:ring-primary-hover focus:ring-offset-2"
          :aria-label="copied ? 'Copied' : 'Copy'"
          @click="copy"
        >
          <Icon class="size-6" :name="copied ? 'ri:check-line' : 'ri:file-copy-line'" />
          <span class="px-2">{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>
        <div id="copy-announcement" class="sr-only" aria-live="polite" />
      </div>
    </section>

    <section class="mt-8">
      <div class="mb-2 flex items-center justify-between">
        <h2 class="flex items-center gap-2 text-lg font-semibold">Recently Searched</h2>
        <button
          v-if="history.length"
          class="text-sm text-red-500 hover:underline"
          @click="clearHistory"
        >
          Clear History
        </button>
      </div>
      <MetaHistory :history="history" @select="handleSelect" />
    </section>
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

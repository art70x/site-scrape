<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#imports'

const {
  public: { siteUrl, description },
} = useRuntimeConfig()

useSeoMeta({
  title: 'SiteScrape - Website Meta Analyzer',
  description,
  ogTitle: 'SiteScrape - Website Meta Analyzer',
  ogDescription:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
  twitterTitle: 'SiteScrape - Website Meta Analyzer',
  twitterDescription:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
})

defineOgImageComponent('NuxtSeo', {
  title: 'SiteScrape - Website Meta Analyzer',
  description:
    'Scrape and extract website data easily with SiteScrape — a fast, simple, browser-based web scraping tool',
  theme: '#2b7fff',
})

const query = ref('')
const route = useRoute()
const router = useRouter()
const { meta, loading, error, fetchMeta, history, clearHistory } = useMetaPreview()
const copied = ref(false)

onMounted(() => {
  const param = route.query.url as string
  if (param) {
    query.value = `https://${param}`
    fetchMeta(query.value)
  }
})

function getCleanPath(urlStr: string): string {
  try {
    const parsed = new URL(urlStr)
    return parsed.host + parsed.pathname
  } catch {
    return urlStr.replace(/^https?:\/\//, '')
  }
}

function copy() {
  navigator.clipboard.writeText(`${siteUrl}?url=${getCleanPath(query.value)}`)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

function submitForm() {
  const cleanUrl = getCleanPath(query.value)
  router.replace({ query: { url: cleanUrl } })
  fetchMeta(query.value)
}
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-8">
    <section id="hero" class="mb-6 flex flex-col items-center">
      <img
        class="drop-shadow-xl drop-shadow-primary/25"
        src="/icon.svg"
        height="90"
        width="115.375"
        alt="SiteScrape icon"
        loading="lazy"
      />
      <h1 class="mb-6">SiteScrape – Website Meta Analyzer</h1>
      <p class="mt-2 max-w-md text-base text-gray-600">
        {{ description }}
      </p>
    </section>
    <section id="form">
      <form class="mb-4 flex flex-row items-center gap-x-2" @submit.prevent="submitForm">
        <input
          v-model="query"
          type="url"
          inputmode="url"
          required
          class="w-full rounded-lg border border-gray-400 px-4 py-2 font-medium tracking-wide shadow-sm ta-200 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
          placeholder="Enter a website URL"
          aria-label="Enter URL to fetch metadata"
          aria-required="true"
        />
        <button type="submit" class="btn" :disabled="loading">
          <Icon name="mdi:magnify" />
          Fetch
        </button>
      </form>
    </section>

    <section id="results">
      <Transition name="fade" mode="out-in">
        <div v-if="error" class="rounded bg-red-100 px-4 py-3 text-sm text-red-700">
          <Icon name="mdi:alert-circle-outline" class="mr-1 inline" />
          {{ error }}
        </div>
      </Transition>
      <Transition name="fade" mode="out-in">
        <MetaCard v-if="meta" :meta="meta" class="mt-6" />
      </Transition>
      <MetaTable v-if="meta" :meta="meta" class="mt-4" />
    </section>
    <section v-if="meta?.url && !loading" id="share" class="space-y-3 pt-8">
      <h2 class="text-lg font-semibold text-zinc-800">🔗 Share this preview</h2>
      <div class="flex flex-wrap items-center gap-3">
        <SocialShare
          v-for="network in ['x', 'facebook', 'reddit', 'whatsapp', 'bluesky']"
          :key="network"
          :network="network"
          :styled="true"
          :url="`${siteUrl}?url=${getCleanPath(query)}`"
          title="Check out this link on SiteScrape!"
          hashtags="webdev,metadata,preview"
        />
        <button
          class="flex items-center gap-2 rounded-sm bg-primary p-2 text-sm font-medium text-zinc-50 hover:bg-primary-hover focus:ring-2 focus:ring-primary-hover focus:ring-offset-2"
          :aria-label="copied ? 'Copied' : 'Copy'"
          @click="copy"
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
    <section class="mt-8">
      <div class="mb-2 flex items-center justify-between">
        <h2 class="flex items-center gap-2 text-lg font-semibold">
          <Icon name="mdi:history" />
          Recently Searched
        </h2>
        <button
          v-if="history.length"
          class="text-sm text-red-500 hover:underline focus:outline-none"
          @click="clearHistory"
        >
          Clear History
        </button>
      </div>
      <MetaHistory :history="history" @select="fetchMeta" />
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

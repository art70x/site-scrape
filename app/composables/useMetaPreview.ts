import { ref, onMounted } from 'vue'

const historyKey = 'meta:history'

export const useMetaPreview = () => {
  const meta = ref<Record<string, object> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const history = ref<string[]>([])

  const normalizeUrl = (url: string): string | null => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).href
    } catch {
      return null
    }
  }

  const loadHistory = () => {
    history.value = JSON.parse(localStorage.getItem(historyKey) || '[]')
  }

  const updateHistory = (url: string) => {
    const existing = [...history.value]
    if (!existing.includes(url)) {
      const updated = [url, ...existing].slice(0, 10)
      localStorage.setItem(historyKey, JSON.stringify(updated))
      history.value = updated
    }
  }

  const fetchMeta = async (url: string) => {
    const normalized = normalizeUrl(url)
    if (!normalized) {
      error.value = 'Invalid URL'
      return
    }

    loading.value = true
    error.value = null

    try {
      const cacheKey = `meta:${normalized}`
      const cached = localStorage.getItem(cacheKey)

      if (cached) {
        meta.value = { ...JSON.parse(cached), _cached: true }
        updateHistory(normalized)
        return
      }

      const res = await $fetch('/api/meta', {
        query: { url: normalized },
      })

      if (res?.success && res.metadata) {
        meta.value = res.metadata
        localStorage.setItem(cacheKey, JSON.stringify(res.metadata))
        updateHistory(normalized)
      } else {
        error.value = res?.error || 'No metadata found'
      }
    } catch (e) {
      console.error(e)
      error.value = 'Failed to fetch metadata'
    } finally {
      loading.value = false
    }
  }

  const clearHistory = () => {
    localStorage.removeItem(historyKey)
    history.value = []
  }

  onMounted(loadHistory)

  return {
    meta,
    loading,
    error,
    fetchMeta,
    history,
    clearHistory,
  }
}

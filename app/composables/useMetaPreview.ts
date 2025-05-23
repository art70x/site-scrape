import { ref } from 'vue'

export const useMetaPreview = () => {
  const meta = ref<Record<string, any> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const normalizeUrl = (url: string): string | null => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).href
    } catch {
      return null
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
      let cached = null
      if (typeof window !== 'undefined') {
        cached = localStorage.getItem(cacheKey)
      }

      if (cached) {
        meta.value = { ...JSON.parse(cached), _cached: true }
        loading.value = false
        return
      }

      const res = await $fetch('/api/meta', {
        query: { url: normalized },
      })

      if ('error' in res) {
        error.value = res.error
      } else if (res.success && res.metadata) {
        meta.value = res.metadata
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify(res.metadata))
        }
        updateHistory(normalized)
      }
    } catch (e) {
      error.value = 'Something went wrong.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const updateHistory = (url: string) => {
    const key = 'meta:history'
    const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]')

    if (!existing.includes(url)) {
      existing.unshift(url)
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 10)))
    }
  }

  const getHistory = (): string[] => {
    return JSON.parse(localStorage.getItem('meta:history') || '[]')
  }

  const clearHistory = () => {
    localStorage.removeItem('meta:history')
  }

  return {
    meta,
    loading,
    error,
    fetchMeta,
    getHistory,
    clearHistory,
  }
}

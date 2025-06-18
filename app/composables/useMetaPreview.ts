import { ref, onMounted } from 'vue'

export function useMetaPreview() {
  const meta = ref<object | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const history = ref<string[]>([])

  function normalizeUrl(input: string): string | null {
    try {
      const url = new URL(input.startsWith('http') ? input : `https://${input}`)
      return url.origin
    } catch {
      return null
    }
  }

  async function fetchMeta(url: string) {
    const clean = normalizeUrl(url)
    if (!clean) {
      error.value = 'Invalid URL'
      return
    }
    error.value = null
    loading.value = true

    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(clean)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch metadata')
      }
      const data = await response.json()
      meta.value = data

      addToHistory(clean)
    } catch (err) {
      error.value = err.message || 'Unknown error'
      meta.value = null
    } finally {
      loading.value = false
    }
  }

  function loadHistory() {
    const data = localStorage.getItem('meta:history')
    history.value = data ? JSON.parse(data) : []
  }

  function saveHistory() {
    localStorage.setItem('meta:history', JSON.stringify(history.value))
  }

  function addToHistory(url: string) {
    if (!history.value.includes(url)) {
      history.value.unshift(url)
      history.value = history.value.slice(0, 20)
      saveHistory()
    }
  }

  function clearHistory() {
    history.value = []
    saveHistory()
  }

  onMounted(() => {
    loadHistory()
    window.addEventListener('storage', (e) => {
      if (e.key === 'meta:history') {
        loadHistory()
      }
    })
  })

  return {
    meta,
    error,
    loading,
    history,
    fetchMeta,
    normalizeUrl,
    clearHistory,
  }
}

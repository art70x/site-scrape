import { defineEventHandler, getQuery } from 'h3'
import metascraper from 'metascraper'
import metascraperTitle from 'metascraper-title'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperLogo from 'metascraper-logo'
import metascraperUrl from 'metascraper-url'
import got from 'got'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    return { error: 'Missing or invalid URL' }
  }
  let vUrl: string

  try {
    vUrl = new URL(url.startsWith('http') ? url : `https://${url}`).href
  } catch {
    return { error: 'Invalid URL format' }
  }

  try {
    const scraper = metascraper([
      metascraperTitle(),
      metascraperDescription(),
      metascraperImage(),
      metascraperLogo(),
      metascraperUrl(),
    ])
    const { body } = await got(vUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      timeout: { request: 10000 },
      retry: { limit: 2 },
    })
    const metadata = await scraper({ html: body, url: vUrl })
    const fallbackLogo = `https://www.google.com/s2/favicons?domain=${new URL(vUrl).hostname}&sz=64`

    return {
      success: true,
      metadata: {
        ...metadata,
        logo: metadata.logo || fallbackLogo,
      },
    }
  } catch (err) {
    console.error('Error scraping URL:', err)
    return {
      error: 'Failed to fetch metadata',
      details: err.message ?? err.toString(),
    }
  }
})

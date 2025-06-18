import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL parameter is required',
    })
  }

  try {
    new URL(url)
  } catch (error: Error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL format',
      error,
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetadataAnalyzer/1.0)',
      },
      size: 1024 * 1024 * 2,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch URL: ${response.statusText}`,
      })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const metadata = {
      url: url,
      title: $('title').first().text().trim() || $('h1').first().text().trim() || '',
      description:
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        '',

      keywords: $('meta[name="keywords"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || '',
      robots: $('meta[name="robots"]').attr('content') || '',
      viewport: $('meta[name="viewport"]').attr('content') || '',

      og: {
        title: $('meta[property="og:title"]').attr('content') || '',
        description: $('meta[property="og:description"]').attr('content') || '',
        image: $('meta[property="og:image"]').attr('content') || '',
        url: $('meta[property="og:url"]').attr('content') || '',
        type: $('meta[property="og:type"]').attr('content') || '',
        siteName: $('meta[property="og:site_name"]').attr('content') || '',
      },

      twitter: {
        card: $('meta[name="twitter:card"]').attr('content') || '',
        title: $('meta[name="twitter:title"]').attr('content') || '',
        description: $('meta[name="twitter:description"]').attr('content') || '',
        image: $('meta[name="twitter:image"]').attr('content') || '',
        creator: $('meta[name="twitter:creator"]').attr('content') || '',
        site: $('meta[name="twitter:site"]').attr('content') || '',
      },

      icons: {
        favicon: $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || '/favicon.ico',
        appleTouchIcon: $('link[rel="apple-touch-icon"]').attr('href') || '',
        androidChrome: $('link[rel="manifest"]').attr('href') || '',
      },

      canonicalUrl: $('link[rel="canonical"]').attr('href') || '',
      lang: $('html').attr('lang') || '',

      jsonLd: $('script[type="application/ld+json"]')
        .map((i, el) => {
          try {
            return JSON.parse($(el).html())
          } catch (e: Error) {
            console.log('No Schema found.', e)
            return null
          }
        })
        .get()
        .filter(Boolean)
        .slice(0, 3),
    }

    const baseUrl = new URL(url).origin
    if (metadata.og.image && !metadata.og.image.startsWith('http')) {
      metadata.og.image = new URL(metadata.og.image, baseUrl).href
    }
    if (metadata.twitter.image && !metadata.twitter.image.startsWith('http')) {
      metadata.twitter.image = new URL(metadata.twitter.image, baseUrl).href
    }
    if (metadata.icons.favicon && !metadata.icons.favicon.startsWith('http')) {
      metadata.icons.favicon = new URL(metadata.icons.favicon, baseUrl).href
    }
    if (metadata.icons.appleTouchIcon && !metadata.icons.appleTouchIcon.startsWith('http')) {
      metadata.icons.appleTouchIcon = new URL(metadata.icons.appleTouchIcon, baseUrl).href
    }

    return metadata
  } catch (error) {
    if (error.name === 'AbortError') {
      throw createError({
        statusCode: 408,
        statusMessage: 'Request timeout',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching metadata: ${error.message}`,
    })
  }
})

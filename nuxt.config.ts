import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  build: {
    minify: 'terser',
    terser: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['@/main.css'],

  modules: [
    '@nuxtjs/seo',
    '@stefanobartoletti/nuxt-social-share',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    'nuxt-booster',
    '@nuxtjs/fontaine',
  ],

  site: {
    url: 'https://sitescrape.vercel.app',
    name: 'SiteScrape',
    description:
      'Easily scrape and extract website data with SiteScrape — a streamlined, browser-based web scraping tool built for speed, simplicity, and convenience.',
  },

  sitemap: {
    defaults: {
      lastmod: new Date().toISOString(),
      priority: 1,
      changefreq: 'weekly',
    },
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
    ],
  },

  booster: {
    optimizeSSR: {
      cleanPreloads: true,
      cleanPrefetches: true,
      inlineStyles: true,
    },

    performanceMetrics: {
      device: {
        hardwareConcurrency: { min: 2, max: 48 },
        deviceMemory: { min: 2 },
      },
      timing: {
        fcp: 800,
        dcl: 1200,
      },
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800],
      styles: ['normal', 'italic'],
    },
  },

  features: {
    inlineStyles: true,
  },

  experimental: {
    renderJsonPayloads: true,
  },

  routeRules: {
    '/**/*.{svg,css,ttf,woff,png}': {
      swr: true,
      cache: {
        maxAge: 432000,
      },
    },
  },
})

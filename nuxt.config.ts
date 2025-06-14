import tailwindcss from '@tailwindcss/vite'

export default {
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

  runtimeConfig: {
    public: {
      siteUrl: 'https://sitescrape.vercel.app',
      description:
        'Easily scrape and extract website data with SiteScrape — a streamlined, browser-based web scraping tool built for speed, simplicity, and convenience.',
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
  ],

  site: {
    url: 'https://sitescrape.vercel.app',
    name: 'SiteScrape',
    description:
      'Easily scrape and extract website data with SiteScrape — a streamlined, browser-based web scraping tool built for speed, simplicity, and convenience.',
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
    },
  },

  socialShare: {
    baseUrl: 'https://sitescrape.vercel.app',
  },

  features: {
    inlineStyles: true,
  },

  experimental: {
    renderJsonPayloads: true,
  },

  routeRules: {
    '/*.{svg,css,woff2,png}': {
      swr: true,
      cache: {
        maxAge: 432000,
      },
    },
  },
}

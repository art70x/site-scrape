import tailwindcss from '@tailwindcss/vite'

export default {
  compatibilityDate: '2024-11-01',

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
      siteUrl: 'https://sitescrape.netlify.app',
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

  modules: ['@nuxtjs/seo', '@stefanobartoletti/nuxt-social-share', '@nuxt/icon', '@nuxt/fonts'],

  site: {
    url: 'https://sitescrape.netlify.app',
    name: 'SiteScrape',
    description:
      'Easily scrape and extract website data with SiteScrape — a streamlined, browser-based web scraping tool built for speed, simplicity, and convenience.',
  },

  socialShare: {
    baseUrl: 'https://sitescrape.netlify.app',
  },

  experimental: {
    renderJsonPayloads: true,
    inlineSSRStyles: true,
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

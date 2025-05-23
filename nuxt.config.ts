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
      siteUrl: 'https://site-scrape.netlify.app/',
    },
  },

  build: {
    cssMinify: true,
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

  modules: ['@nuxtjs/seo', '@stefanobartoletti/nuxt-social-share'],

  site: {
    url: 'https://site-scrape.netlify.app/',
    name: 'SiteCrape',
    description: ' Analyze and share website previews instantly with SEO-friendly metadata.',
  },

  socialShare: {
    baseUrl: 'https://site-scrape.netlify.app/',
  },

  experimental: {
    renderJsonPayloads: true,
  },

  routeRules: {
    '/*.{svg,css,webp}': {
      swr: true,
      cache: {
        maxAge: 43200,
      },
    },
  },
}

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {
    public: {
      backend: process.env.BACKEND
    }
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    'nuxt-icon',
    '@pinia/nuxt'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
	nitro: {
		prerender: {
			failOnError: false
		}
	},
	// experimental: {
	// 	renderJsonPayloads: false
	// },
  app: {
    head: {
      title: 'XtrasZone Admin Panel',
      link: [
        {
          rel: 'shortcut icon',
          href: '/logo.svg'
        },
        {
          href: '/bootstrap.min.css',
          rel: 'stylesheet'
        },
        {
          href: '/helpers.css',
          rel: 'stylesheet'
        },
        {
          href: '/styles.css',
          rel: 'stylesheet'
        },
      ],
    }
  }
})

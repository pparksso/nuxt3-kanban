// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@pinia/nuxt'],
    app: {
        head: {
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                {
                    charset: 'utf-8',
                },
            ],
            title: '칸반보드',
        },
    },
    css: ['@/assets/styles/reset.css', '@/assets/styles/global.css'],
    runtimeConfig: {
        public: {
            apiKey: process.env.firebaseKey,
        },
    },
});

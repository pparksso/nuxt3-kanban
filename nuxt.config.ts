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
            link: [
                {
                    href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp',
                    rel: 'stylesheet',
                },
            ],
        },
    },
    css: ['@/assets/styles/reset.css', '@/assets/styles/global.css'],
    runtimeConfig: {
        public: {
            apiKey: process.env.firebaseKey,
        },
    },
});

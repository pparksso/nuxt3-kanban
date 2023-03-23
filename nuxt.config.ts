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
            FB_PROJECT_ID: process.env.projectId,
            FB_AUTH_DOMAIN: process.env.authDomain,
            FB_STORAGE_BUCKET: process.env.storageBucket,
            FB_MESSAGING_SENDER_ID: process.env.messagingSenderId,
            FB_APP_ID: process.env.appId,
            // FB_MEASUREMENT_ID:
        },
    },
});

import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.apiKey,
        authDomain: config.FB_AUTH_DOMAIN,
        projectId: config.FB_PROJECT_ID,
        storageBucket: config.FB_STORAGE_BUCKET,
        messagingSenderId: config.FB_MESSAGING_SENDER_ID,
        appId: config.FB_APP_ID,
        databaseURL: 'https://kanban-nuxt3-default-rtdb.asia-southeast1.firebasedatabase.app',
    };
    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app);
    const database = getDatabase(app);
});

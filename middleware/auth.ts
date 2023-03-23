import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = getAuth();
    const loginState = () => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                return navigateTo('/');
            } else return true;
        });
    };
    return loginState;
});

//미들웨어에서 firebase가 안됨...

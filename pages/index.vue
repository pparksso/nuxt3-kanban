<template>
    <div class="login">
        <div class="login__wrap">
            <div class="login__image-box">
                <h1>Welcome!</h1>
            </div>
            <div class="login__input-box" v-if="isLogged">
                <div class="login__input-box__text-box">
                    <h2>Login</h2>
                    <p>
                        Welcome back! Please login to your <br />
                        account
                    </p>
                </div>
                <button @click="loginHandler"></button>
            </div>
            <div class="logout" v-else>
                <button @click="logoutHandler"><span>Logout</span></button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';

const isLogged = ref();

onBeforeMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) isLogged.value = false;
        else isLogged.value = true;
    });
});

const loginHandler = () => {
    useAuth().signIn();
};

const logoutHandler = () => {
    useAuth().signOut();
};
</script>
<style lang="scss" scoped>
.login {
    &__wrap {
        display: flex;
        width: 100vw;
        height: 100vh;
    }
    &__image-box {
        width: 50%;
        background-image: url('@/assets/images/login_bg.jpg');
        background-size: cover;
        display: flex;
        align-items: center;
        h1 {
            margin-left: 10%;
            font-size: 100px;
            letter-spacing: 3px;
            color: #7a616186;
        }
    }
    &__input-box {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        &__text-box {
            h2 {
                font-weight: 900;
                font-size: 40px;
                margin-bottom: 25px;
            }
            p {
                color: #aaa;
                font-size: 20px;
                margin-bottom: 40px;
            }
        }
        button {
            width: 192px;
            height: 46px;
            background-image: url('@/assets/images/btn_google_signin_dark_normal_web.png');
            background-repeat: no-repeat;
            background-size: contain;
            &:hover {
                background-image: url('@/assets/images/btn_google_signin_dark_focus_web.png');
            }
        }
    }
}
.logout {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    button span {
        font-size: 40px;
        font-weight: 900;
    }
}
</style>

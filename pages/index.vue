<template>
    <div class="login">
        <div class="login__wrap">
            <div class="login__image-box">
                <h1>Welcome!</h1>
            </div>
            <div class="login__input-box">
                <div class="login__input-box__text-box">
                    <h2>Login</h2>
                    <p>
                        Welcome back! Please login to your <br />
                        account
                    </p>
                </div>
                <button></button>
            </div>
        </div>
    </div>
</template>
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
</style>

<template>
    <div class="side-bar">
        <div class="side-bar__top">
            <div class="side-bar__user-box">
                <span>{{ name }}</span>
                <button><span class="material-icons"> add </span></button>
            </div>
            <div class="side-bar__list-box">
                <ul>
                    <li><span>쇼핑리스트</span></li>
                </ul>
                <ul>
                    <li><span>쇼핑리스트</span></li>
                </ul>
            </div>
        </div>
        <div class="side-bar__logout-box">
            <button @click="logoutHandler"><span>logout</span></button>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps({
    name: String,
});
const logoutHandler = () => {
    useAuth().signOut();
};
</script>
<style lang="scss" scoped>
.side-bar {
    width: 15vw;
    overflow-y: scroll;
    padding: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &::-webkit-scrollbar {
        width: 6px;
        background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        height: 10%;
        border-radius: 10px;
    }
    &__user-box {
        margin-bottom: 50px;
        display: flex;
        align-items: center;
        > span {
            font-weight: 900;
            user-select: none;
            color: #252a32;
            display: inline-block;
            margin-right: 10px;
        }
        button {
            height: 24px;
        }
    }
    &__list-box {
        ul {
            li {
                cursor: pointer;
                padding: 15px;
                span {
                    color: #aaa;
                    font-weight: 400;
                }
            }
        }
    }
    &__logout-box {
        button span {
            font-size: 24px;
        }
    }
}
</style>

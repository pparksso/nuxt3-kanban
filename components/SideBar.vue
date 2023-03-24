<template>
    <div class="side-bar">
        <div class="side-bar__top">
            <div class="side-bar__user-box">
                <span>{{ props.info?.name }}</span>
                <button @click="showInputBoxHandler">
                    <span class="material-icons"> add </span>
                </button>
                <div class="side-bar__user-box__input-box" v-if="showInputBox">
                    <input
                        type="text"
                        maxlength="10"
                        ref="listInputRef"
                        @keydown="addListHandler"
                    />
                </div>
            </div>
            <div class="side-bar__list-box">
                <ul>
                    <li><span></span></li>
                </ul>
            </div>
        </div>
        <div class="side-bar__logout-box">
            <button @click="logoutHandler"><span>logout</span></button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getDatabase, set, ref as databaseRef } from 'firebase/database';

const props = defineProps({
    info: Object,
});

const db = getDatabase();

const showInputBox = ref(false);
const listInputRef = ref<HTMLInputElement | null>(null);

const logoutHandler = () => {
    useAuth().signOut();
};

const showInputBoxHandler = () => {
    showInputBox.value = !showInputBox.value;
};

watchEffect(() => {
    if (showInputBox.value) {
        listInputRef.value?.focus();
    }
});

//목록 추가
const addListHandler = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
        const word = listInputRef.value?.value;
        set(databaseRef(db, '/users' + props.info?.email), {
            name: word,
            email: props.info?.email,
        });
    }
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
        position: relative;
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
        &__input-box {
            position: absolute;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
            top: 30px;
            left: 0;
            padding: 5px;
            width: 90%;
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

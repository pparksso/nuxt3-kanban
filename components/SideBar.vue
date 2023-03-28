<template>
    <div class="side-bar">
        <div class="side-bar__top">
            <div class="side-bar__user-box">
                <span>{{ props.info?.name }}</span>
                <button @click="showInputBoxHandler">
                    <span class="material-icons"> add </span>
                </button>
                <div v-if="showInputBox" class="side-bar__user-box__input-box">
                    <input
                        ref="listInputRef"
                        type="text"
                        maxlength="10"
                        @keydown="addListHandler"
                    />
                </div>
            </div>
            <div class="side-bar__list-box">
                <ul>
                    <li v-for="(title, index) of kanbanTitles" :key="index">
                        <span>{{ title }}</span>
                        <button @click="removeListHandler(title)">
                            <span class="material-icons">close</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="side-bar__logout-box">
            <button @click="logoutHandler"><span>logout</span></button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getDatabase, set, ref as rtdbRef, remove } from 'firebase/database';

const props = defineProps({
    info: Object,
});

interface GetLists {
    getTitle: () => void;
    kanbanTitles: Ref<object>;
}

const { getTitle, kanbanTitles } = inject<GetLists>('getLists', {
    getTitle: () => '',
    kanbanTitles: {} as Ref<object>,
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

const hideInputBoxHandler = () => {
    getTitle();
    showInputBox.value = false;
    if (listInputRef.value?.value) listInputRef.value.value = '';
};

//목록 추가
const addListHandler = (e: KeyboardEvent) => {
    const encodedEmail = encodeURIComponent(props.info?.email.replace(/\./g, '%2E'));
    const path = `${encodedEmail}/`;
    if (e.code === 'Enter') {
        const word = listInputRef.value?.value as string;
        set(rtdbRef(db, path + word), {
            title: word,
        }).then(() => {
            hideInputBoxHandler();
        });
    }
};

//목록 삭제
const removeListHandler = (title: string) => {
    const encodedEmail = encodeURIComponent(props.info?.email.replace(/\./g, '%2E'));
    const path = `${encodedEmail}/`;
    remove(rtdbRef(db, path + title)).then(() => {
        getTitle();
    });
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
                display: flex;
                align-items: center;
                justify-content: space-between;
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

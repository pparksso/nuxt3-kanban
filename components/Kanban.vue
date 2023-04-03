<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div class="kanban">
        <div class="kanban-wrap">
            <div class="kanban__title">
                <h1 v-if="kanbanStore.kanbanDatas">{{ kanbanStore.kanbanDatas['title'] }}</h1>
                <button @click="showInputBox">
                    <span class="material-icons"> add </span>
                </button>
                <div v-if="inputBoxState" class="kanban__title__add-box">
                    <input
                        ref="inputRef"
                        type="text"
                        maxlength="10"
                        @keydown="addSubTitleHandler"
                    />
                </div>
            </div>
            <Card />
        </div>
    </div>
</template>
<script setup lang="ts">
import { getDatabase, ref as rtdbRef, set } from 'firebase/database';
import { useKanbanStore } from '@/stores/kanban';

const kanbanStore = useKanbanStore();
const inputBoxState = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | null>(null);

const db = getDatabase();

// 인풋박스 on/off
const showInputBox = () => {
    inputBoxState.value = !inputBoxState.value;
};

watchEffect(() => {
    // 인풋박스 포커스
    if (inputBoxState.value) inputRef.value?.focus();
});

// 카드 인풋박스 숨기기
const hideAddInputBoxHandler = () => {
    inputBoxState.value = false;
    if (inputRef.value?.value) inputRef.value.value = '';
};
// 칸반 추가
const addSubTitleHandler = (e: KeyboardEvent) => {
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        if (e.code === 'Enter') {
            const word = inputRef.value?.value as string;
            useReg().checkChar(word);
            const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${word}/`;
            set(rtdbRef(db, path), {
                title: word,
            })
                .then(() => {
                    if (typeof kanbanStore.kanbanDatas?.title === 'string') {
                        kanbanStore.changeCategoryTitle(kanbanStore.kanbanDatas.title);
                    }
                    hideAddInputBoxHandler();
                    kanbanStore.getTitle();
                })
                .catch((_err) => {
                    // eslint-disable-next-line no-alert
                    alert('특수문자를 사용할 수 없습니다.');
                });
        }
        if (e.code === 'Escape') {
            inputBoxState.value = false;
            if (inputRef.value?.value) inputRef.value.value = '';
        }
    }
};
</script>
<style lang="scss" scoped>
.kanban {
    background-color: #fbfdff;
    flex-grow: 1;
    &-wrap {
        padding: 50px;
    }
    &__title {
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        position: relative;
        h1 {
            font-weight: 700;
            font-size: 30px;
        }
        .material-icons {
            font-size: 50px;
        }
        &__add-box {
            position: absolute;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
            bottom: -30px;
            right: 20px;
            padding: 5px;
            width: 10%;
        }
    }
}
</style>

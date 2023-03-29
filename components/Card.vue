<template>
    <div class="kanban__main-box">
        <div
            v-for="(card, index) in kanbanStore.kanbanDatas?.cards"
            :key="index"
            class="kanban__main-box__item-list"
        >
            <div class="kanban__main-box__item-list__title">
                <span>{{ card.title }}</span>
                <button :data-title="card.title" @click="removeCardHandler">
                    <span :data-title="card.title" class="material-icons"> close </span>
                </button>
            </div>
            <ul v-if="card.items">
                <li v-for="(i, idx) in card.items" :key="idx">
                    <div class="kanban__main-box__item-list__item">
                        <span>{{ i }}</span>
                        <div class="btns">
                            <button><span class="material-icons"> edit </span></button>
                            <button><span class="material-icons"> close </span></button>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="plus">
                <button><span>New</span><span class="material-icons"> add </span></button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { remove, ref as rtdbRef, getDatabase } from 'firebase/database';
import { useKanbanStore } from '@/stores/kanban';

const kanbanStore = useKanbanStore();

const db = getDatabase();
// 카드 삭제
const removeCardHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetWord = target.dataset.title;
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${targetWord}/`;
        remove(rtdbRef(db, path)).then(() => {
            kanbanStore.getTitle();
        });
    }
};
</script>
<style lang="scss" scoped>
.kanban__main-box {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    &__item-list {
        width: 25%;
        padding: 0 15px;
        margin-bottom: 30px;
        &:not(&:last-child) {
            border-right: 1px solid rgba(0, 0, 0, 0.1);
        }
        &__title {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: 20px;
                user-select: none;
            }
        }
        &__item {
            display: flex;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            > span {
                flex-grow: 1;
                user-select: none;
            }
            .btns {
                display: flex;
                align-items: flex-start;
            }
        }
        .plus {
            margin-top: 10px;
            button {
                width: 100%;
                border-radius: 5px;
                background-color: #5078e1;
                padding: 7px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                    color: #fff;
                }
            }
        }
    }
}
</style>

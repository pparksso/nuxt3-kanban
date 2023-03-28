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
            <div class="kanban__main-box">
                <div v-if="kanbanListState" class="kanban__main-box__item-list">
                    <div class="kanban__main-box__item-list__title">
                        <span>큰 제목</span
                        ><button><span class="material-icons"> more_horiz </span></button>
                    </div>
                    <ul>
                        <li>
                            <div class="kanban__main-box__item-list__item">
                                <span
                                    >오늘 먹은것은 이것이지 하하 모루겠다.. 아 어렵네 하 ㅠㅠ
                                </span>
                                <div class="btns">
                                    <button><span class="material-icons"> edit </span></button>
                                    <button><span class="material-icons"> close </span></button>
                                </div>
                            </div>
                        </li>
                        <li class="plus">
                            <button>
                                <span>New</span><span class="material-icons"> add </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useKanbanStore } from '@/stores/kanban';

const kanbanStore = useKanbanStore();
const kanbanListState = ref();
const inputBoxState = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | null>(null);

// 칸반 아이템들이 있는지 없는지 확인하는 함수
function kanbanListStateHandler() {
    if (kanbanStore.kanbanDatas) {
        if (kanbanStore.kanbanDatas.cards) {
            kanbanListState.value = true;
        } else {
            kanbanListState.value = false;
        }
    } else {
        kanbanListState.value = false;
    }
}
kanbanListStateHandler();

// 인풋박스 on/off
const showInputBox = () => {
    inputBoxState.value = !inputBoxState.value;
};

// 칸반 추가
const addSubTitleHandler = (e: KeyboardEvent) => {
    console.log(e.code);
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
    &__main-box {
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
}
</style>

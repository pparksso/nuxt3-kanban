<template>
    <div class="kanban__main-box">
        <div
            v-for="(card, cardIndex, index1) in kanbanStore.kanbanDatas?.cards"
            :key="cardIndex"
            class="kanban__main-box__item-list"
        >
            <div ref="titleRef" class="kanban__main-box__item-list__title">
                <span>{{ card.title }}</span>
                <button :data-title="card.title" @click="removeCardHandler">
                    <span :data-title="card.title" class="material-icons"> close </span>
                </button>
            </div>
            <ul v-if="card.items">
                <div
                    class="kanban__main-box__item-list__dropzone"
                    @dragover="dragoverHandler"
                    @drop="dropHandler"
                    @dragleave="dragEndHandler"
                ></div>
                <li
                    v-for="(i, idx) in card.items"
                    :key="idx"
                    class="kanban__main-box__item-list-wrap"
                    draggable="true"
                    @dragend="dragEndHandler"
                >
                    <div class="kanban__main-box__item-list__item">
                        <input
                            ref="itemInputRef"
                            type="text"
                            :value="i"
                            readonly
                            placeholder="추가 'Enter' 취소 'Esc'"
                            :data-itemidx="idx"
                            :data-cardidx="index1"
                            @keydown="editItemHandler"
                        />
                        <div class="btns">
                            <button
                                :data-cardidx="index1"
                                :data-itemidx="idx"
                                @click="editItemClickHandler"
                            >
                                <span
                                    :data-cardidx="index1"
                                    :data-itemidx="idx"
                                    class="material-icons"
                                >
                                    edit
                                </span>
                            </button>
                            <button
                                :data-cardidx="index1"
                                :data-itemidx="idx"
                                @click="removeItemHandler"
                            >
                                <span
                                    :data-cardidx="index1"
                                    :data-itemidx="idx"
                                    class="material-icons"
                                >
                                    close
                                </span>
                            </button>
                        </div>
                    </div>
                    <div
                        class="kanban__main-box__item-list__dropzone"
                        @dragover="dragoverHandler"
                        @drop="dropHandler"
                        @dragleave="dragEndHandler"
                    ></div>
                </li>
            </ul>
            <ul v-else>
                <div
                    class="kanban__main-box__item-list__dropzone"
                    @dragover="dragoverHandler"
                    @drop="dropHandler"
                    @dragleave="dragEndHandler"
                ></div>
            </ul>
            <div :class="{ active: index1 === showAddItemIdx }" class="add-item">
                <input
                    ref="inputRef"
                    type="text"
                    :data-index="index1"
                    maxlength="30"
                    placeholder="추가 'Enter' 취소 'Esc'"
                    @keydown="pressKeyAddItem"
                />
                <button @click="addItemHandler">
                    <span class="material-icons"> add </span>
                </button>
            </div>
            <div class="plus">
                <button :data-index="index1" @click="showAddItemHandler">
                    <span :data-index="index1">New</span
                    ><span class="material-icons" :data-index="index1"> add </span>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref as rtdbRef, getDatabase, update, set, remove } from 'firebase/database';
import { useKanbanStore } from '@/stores/kanban';

const kanbanStore = useKanbanStore();
const db = getDatabase();
const showAddItemIdx = ref<number | undefined>();
const inputRef = ref<[HTMLInputElement] | null>(null);
const itemInputRef = ref<[HTMLInputElement] | null>(null);
const inputs = computed(() => inputRef.value?.map((input: HTMLInputElement) => input.value) ?? []);
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
// 아이템 추가 칸 show/hide
const showAddItemHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetIndex = Number(target.dataset.index);
    // 열린 인풋창 포커스 시키는 함수
    if (
        typeof targetIndex === 'number' &&
        typeof inputRef.value === 'object' &&
        inputRef.value !== null
    ) {
        // 왜 안되는지 모르겠음.... ㅠㅠㅠ
        inputRef.value[targetIndex].focus();
    }
    // 열려있는 창을 눌렀을 때 닫히는 코드
    if (typeof showAddItemIdx.value === 'number' && inputRef.value !== null) {
        if (targetIndex === showAddItemIdx.value) {
            inputRef.value[showAddItemIdx.value].value = '';
            showAddItemIdx.value = undefined;
            return;
        }
        inputRef.value[showAddItemIdx.value].value = '';
    }
    showAddItemIdx.value = targetIndex;
};
// 아이템 추가하는 함수
const addItemHandler = () => {
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        if (typeof showAddItemIdx.value === 'number') {
            const text = inputRef.value[showAddItemIdx.value].value;
            const word = kanbanStore.cardNames[showAddItemIdx.value];
            const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${word}/`;
            if (kanbanStore.kanbanDatas?.cards[word]?.items) {
                const items = Object.values(kanbanStore.kanbanDatas.cards[word].items);
                items.push(text);
                set(rtdbRef(db, path), {
                    title: word,
                    items,
                }).then(() => {
                    inputRef.value[showAddItemIdx.value].value = '';
                    showAddItemIdx.value = undefined;
                    kanbanStore.getTitle();
                });
            } else {
                update(rtdbRef(db, path), {
                    items: [text],
                }).then(() => {
                    inputRef.value[showAddItemIdx.value].value = '';
                    showAddItemIdx.value = undefined;
                    kanbanStore.getTitle();
                });
            }
        }
    }
};
// 키보드이벤트 + 아이템 추가 함수
const pressKeyAddItem = (e: KeyboardEvent) => {
    if (e.code === 'Enter') addItemHandler();
    if (e.code === 'Escape') {
        inputRef.value[showAddItemIdx.value].value = '';
        showAddItemIdx.value = undefined;
    }
};
// 아이템 삭제
const removeItemHandler = (e: MouseEvent) => {
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        const idx = e.target?.dataset.itemidx;
        const word = kanbanStore.cardNames[e.target?.dataset.cardidx];
        const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${word}/`;
        const items = Object.values(kanbanStore.kanbanDatas?.cards[word].items);
        items.splice(idx, 1);
        update(rtdbRef(db, path), {
            items,
        }).then(() => {
            kanbanStore.getTitle();
        });
    }
};
// 아이템 수정 버튼 클릭했을 때, 인풋창 변화 함수
const editItemClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const itemIdx = target.dataset.itemidx;
    console.log(itemInputRef.value);
    // 오류나는 중... 여기 해결해야됨!!!
    itemInputRef.value[itemIdx].removeAttribute('readonly');
    itemInputRef.value[itemIdx].focus();
};
// 아이템 수정, 수정 취소 함수
const editItemHandler = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        const word = kanbanStore.cardNames[e.target?.dataset.cardidx];
        const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${word}/`;
        const idx = e.target.dataset.itemidx;
        const val = e.target.value;
        const items = Object.values(kanbanStore.kanbanDatas?.cards[word].items);
        items[idx] = val;
        update(rtdbRef(db, path), {
            items,
        }).then(() => {
            e.target.setAttribute('readonly', true);
            kanbanStore.getTitle();
        });
    }
    if (e.code === 'Escape') {
        const word = kanbanStore.cardNames[e.target?.dataset.cardidx];
        const idx = e.target.dataset.itemidx;
        const items = Object.values(kanbanStore.kanbanDatas?.cards[word].items);
        e.target.value = items[idx];
        e.target.setAttribute('readonly', true);
    }
};

// dropzone 위에 아이템이 왔을 때 사용할 함수(dragover)
const dragoverHandler = (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.classList.add('active');
};

// 아이템이 dropzone을 떠났을 때 (dragleave)
const dragEndHandler = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.classList.remove('active');
};

// 아이템이 dropzone에 drop했을 때(drop)
const dropHandler = (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.classList.remove('active');
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
        &__dropzone {
            height: 10px;
            transition: background 0.15s, height 0.15s;
            &.active {
                height: 15px;
                background: rgba(238, 92, 92, 0.63);
            }
        }
        &__item {
            display: flex;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            > input {
                flex-grow: 1;
                &::placeholder {
                    color: #bbb;
                }
            }
            .btns {
                display: flex;
                align-items: flex-start;
            }
        }
        .add-item {
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            background-color: #fff;
            display: none;
            &.active {
                display: block;
            }
            input {
                width: 100%;
                height: 60px;
                padding: 10px;
                &::placeholder {
                    color: #bbb;
                }
            }
            button {
                text-align: center;
                width: 100%;
            }
        }
        .plus {
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

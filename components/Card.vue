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
                    :data-idx="index1"
                    :data-category="card.title"
                    data-dropidx="0"
                    @dragover="dragoverHandler"
                    @drop="dropHandler"
                    @dragleave="dragEndHandler"
                ></div>
                <li
                    v-for="(i, idx) in card.items"
                    :key="idx"
                    class="kanban__main-box__item-list-wrap"
                    draggable="true"
                    :data-category="card.title"
                    :data-itemidx="idx"
                    :data-dragval="i"
                    @dragstart="dragStartHandler"
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
                                    ref="editBtnRefs"
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
                        :data-dropidx="idx + 1"
                        :data-category="card.title"
                        @dragover="dragoverHandler"
                        @drop="dropHandler"
                        @dragleave="dragEndHandler"
                    ></div>
                </li>
            </ul>
            <ul v-else>
                <div
                    class="kanban__main-box__item-list__dropzone"
                    data-dropidx="0"
                    :data-category="card.title"
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
const inputs = computed(() => inputRef.value?.map((input: HTMLInputElement) => input.value) ?? []);

// 아이템 인풋 ref
const itemInputRef = ref<[HTMLInputElement] | null>(null);
// 수정버튼 ref
const editBtnRefs = ref<[HTMLDivElement] | null>(null);
// 드래그 되는 dom
const dragItem = ref();

// 카드 삭제
const removeCardHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetWord = target.dataset.title;
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${targetWord}/`;
        remove(rtdbRef(db, path)).then(() => {
            kanbanStore.changeCategoryTitle(kanbanStore.kanbanDatas?.title);
            kanbanStore.getTitle();
        });
    }
};
// 아이템 추가 칸 show/hide
const showAddItemHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetIndex = Number(target.dataset.index);
    // 첫 랜더링 때 아이템 추가칸의 배열이 거꾸로 담기는 문제 해결하는 함수
    if (inputRef.value[0].dataset.index != 0) {
        const newInputArr = inputRef.value?.reverse();
        inputRef.value = newInputArr;
    }
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
// eslint-disable-next-line consistent-return
const addItemHandler = (val: string, dom: HTMLInputElement) => {
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        if (typeof showAddItemIdx.value === 'number') {
            const text = val;
            const wordArr = Object.keys(kanbanStore.kanbanDatas?.cards);
            const word = wordArr[showAddItemIdx.value];
            const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${word}/`;
            if (text === '') {
                alert('빈칸은 저장할 수 없습니다.');
                return false;
            }
            if (kanbanStore.kanbanDatas?.cards[word]?.items) {
                const items = Object.values(kanbanStore.kanbanDatas.cards[word].items);
                items.push(text);
                set(rtdbRef(db, path), {
                    title: word,
                    items,
                }).then(() => {
                    dom.value = '';
                    showAddItemIdx.value = undefined;
                    kanbanStore.changeCategoryTitle(kanbanStore.kanbanDatas?.title);
                    kanbanStore.getTitle();
                });
            } else {
                update(rtdbRef(db, path), {
                    items: [text],
                }).then(() => {
                    dom.value = '';
                    showAddItemIdx.value = undefined;
                    kanbanStore.changeCategoryTitle(kanbanStore.kanbanDatas?.title);
                    kanbanStore.getTitle();
                });
            }
        }
    }
};
// 키보드이벤트 + 아이템 추가 함수
const pressKeyAddItem = (e: KeyboardEvent) => {
    if (e.code === 'Enter') addItemHandler(e.target.value, e.target);
    if (e.code === 'Escape') {
        e.target.value = '';
        showAddItemIdx.value = undefined;
    }
};
// 아이템 삭제
const removeItemHandler = (e: MouseEvent) => {
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        const idx = e.target?.dataset.itemidx;
        const wordArr = Object.keys(kanbanStore.kanbanDatas?.cards);
        const word = wordArr[e.target?.dataset.cardidx];
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
    const { target } = e;
    let index: number;
    editBtnRefs.value?.forEach((i, idx) => {
        if (target === i) index = idx;
    });
    itemInputRef.value?.forEach((i, idx) => {
        if (index === idx) i.removeAttribute('readonly');
        else i.setAttribute('readonly', true);
    });
    itemInputRef.value[index].focus();
};

// 아이템 수정, 수정 취소 함수
const editItemHandler = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        const wordArr = Object.keys(kanbanStore.kanbanDatas?.cards);
        const word = wordArr[e.target?.dataset.cardidx];
        const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/${word}/`;
        const idx = e.target.dataset.itemidx;
        const val = e.target.value;
        const items = Object.values(kanbanStore.kanbanDatas?.cards[word].items);
        items[idx] = val;
        update(rtdbRef(db, path), {
            items,
        }).then(() => {
            e.target.setAttribute('readonly', true);
            kanbanStore.changeCategoryTitle(kanbanStore.kanbanDatas?.title);
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

// drag 시작 시 해당 아이템 변수에 저장
const dragStartHandler = (e: DragEvent) => {
    dragItem.value = e.target;
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
const dropHandler = async (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    const droppedIdx = target.dataset.dropidx; // 드롭 할 위치
    const droppedCategory = target.dataset.category; // 드롭 할 카테고리
    target.classList.remove('active');
    const draggedItem = dragItem.value; // 드래그 한 아이템
    if (typeof kanbanStore.userInfo.email === 'string') {
        const encodedEmail = encodeURIComponent(kanbanStore.userInfo.email.replace(/\./g, '%2E'));
        const { category, itemidx, dragval } = draggedItem.dataset;
        const path = `${encodedEmail}/${kanbanStore.kanbanDatas?.title}/cards/`;
        const draggedItems = kanbanStore.kanbanDatas?.cards[category].items;
        let droppedItems;
        draggedItems.splice(itemidx, 1); // 드래그를 시작한 카테고리에서 아이템 삭제
        if (kanbanStore.kanbanDatas?.cards[droppedCategory].items) {
            droppedItems = kanbanStore.kanbanDatas?.cards[droppedCategory].items;
        } else {
            droppedItems = [];
        }
        droppedItems.splice(droppedIdx, 0, dragval);
        const removeDragItem = await update(rtdbRef(db, `${path}/${category}`), {
            items: draggedItems,
        });
        const setDropItems = await update(rtdbRef(db, `${path}/${droppedCategory}`), {
            items: droppedItems,
        });
        await kanbanStore.getTitle();
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
        &__dropzone {
            height: 10px;
            transition: background 0.15s, height 0.15s;
            &.active {
                height: 15px;
                background: rgba(0, 0, 0, 0.1);
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

<template>
    <div class="board">
        <div v-if="kanbanStore.loading" class="board-loading">
            <img src="@/assets/images/loading.gif" alt="로딩중" />
        </div>
        <div class="board-wrap">
            <SideBar />
            <EmptyBorad v-if="!kanbanStore.kanbanTitles" />
            <Kanban v-else />
        </div>
    </div>
</template>
<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useKanbanStore } from '@/stores/kanban';

const kanbanStore = useKanbanStore();

const auth = getAuth();
const authPromise = new Promise((resolve) => {
    // eslint-disable-next-line consistent-return
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            return navigateTo('/');
        }
        kanbanStore.userInfo.name = user.displayName;
        kanbanStore.userInfo.email = user.email;
        resolve(true);
    });
});

authPromise.then((isAuthenticated) => {
    if (isAuthenticated) kanbanStore.getTitle();
});
</script>
<style lang="scss" scoped>
.board {
    &-wrap {
        display: flex;
        width: 100vw;
        height: 100vh;
    }
    &-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
    }
}
</style>

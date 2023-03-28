<template>
    <div class="board">
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
}
</style>

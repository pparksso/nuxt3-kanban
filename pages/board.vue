<template>
    <div class="board">
        <div class="board-wrap">
            <SideBar />
            <Kanban />
            <!-- <EmptyBorad /> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';

onBeforeMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            return navigateTo('/');
        } else return true;
    });
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

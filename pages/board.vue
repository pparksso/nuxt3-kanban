<template>
    <div class="board">
        <div class="board-wrap">
            <SideBar />
            <Kanban />
            <!-- <EmptyBorad /> -->
        </div>
    </div>
</template>
<style lang="scss" scoped>
.board {
    &-wrap {
        display: flex;
        width: 100vw;
        height: 100vh;
    }
}
</style>

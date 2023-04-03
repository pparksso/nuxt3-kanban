<template>
    <div class="empty">
        <h1>Welcome to Kanban Board!!</h1>
        <div class="txtBox">
            <p>1. 새로운 칸반 보드를 만들어보세요.</p>
            <p>2. 칸반 보드로 이동해보세요.</p>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.empty {
    background-color: #fbfdff;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1 {
        font-size: 40px;
        margin-bottom: 30px;
    }
    p {
        font-size: 20px;
    }
}
</style>

<template>
    <div class="kanban">
        <div class="kanban-wrap">
            <div class="kanban__title">
                <h1>쇼핑리스트</h1>
            </div>
            <div class="kanban__main-box">
                <div class="kanban__main-box__item-list">
                    <div class="kanban__main-box__item-list__title">
                        <span>큰 제목</span><button><span class="material-icons"> more_horiz </span></button>
                    </div>
                    <ul>
                        <li>
                            <div class="kanban__main-box__item-list__item">
                                <span>오늘 먹은것은 이것이지 하하 모루겠다.. 아 어렵네 하 ㅠㅠ </span>
                                <div class="btns">
                                    <button><span class="material-icons"> edit </span></button>
                                    <button><span class="material-icons"> close </span></button>
                                </div>
                            </div>
                        </li>
                        <li class="plus">
                            <button><span>New</span><span class="material-icons"> add </span></button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.kanban {
    background-color: #fbfdff;
    flex-grow: 1;
    &-wrap {
        padding: 50px;
    }
    &__title {
        margin-bottom: 30px;
        h1 {
            font-weight: 700;
            font-size: 30px;
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

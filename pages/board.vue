<template>
    <div class="board">
        <div class="board-wrap">
            <SideBar :info="userInfo" />
            <EmptyBorad v-if="!kanbanTitles" />
            <Kanban v-else />
        </div>
    </div>
</template>
<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, onValue, ref as rtdbRef, get, child } from 'firebase/database';

const db = getDatabase();

const kanbanTitles = ref<string[] | null>();

interface UserInfo {
    name: string | null;
    email: string | null;
}
const userInfo = reactive<UserInfo>({
    name: '',
    email: '',
});

const auth = getAuth();
const dbRef = rtdbRef(getDatabase());
const authPromise = new Promise((resolve) => {
    // eslint-disable-next-line consistent-return
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            return navigateTo('/');
        }
        userInfo.name = user.displayName;
        userInfo.email = user.email;
        resolve(true);
    });
});

const getTitle = () => {
    const encodedEmail = encodeURIComponent(
        !userInfo.email ? '' : userInfo.email.replace(/\./g, '%2E'),
    );
    const path = `${encodedEmail}/`;
    // eslint-disable-next-line consistent-return
    get(child(dbRef, path)).then((snapshot) => {
        const titleData = snapshot.val();
        if (titleData) {
            const titleArr = Object.keys(titleData);
            kanbanTitles.value = titleArr;
        } else {
            kanbanTitles.value = null;
            return false;
        }
    });
};

authPromise.then((isAuthenticated) => {
    if (isAuthenticated) getTitle();
});

//자식 컴포넌트에서 사용
provide('getLists', {
    getTitle,
    kanbanTitles,
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

<template>
    <div class="board">
        <div class="board-wrap">
            <SideBar :info="userInfo" />
            <!-- <Kanban /> -->
            <EmptyBorad />
        </div>
    </div>
</template>
<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, onValue, ref, get, child } from 'firebase/database';

const db = getDatabase();

const dbRef = ref(db);
// get(child(dbRef, 'users/')).then((snapshot) => {
//     console.log(snapshot.val());
// });

interface UserInfo {
    name: string | null;
    email: string | null;
}
const userInfo = reactive<UserInfo>({
    name: '',
    email: '',
});

onBeforeMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            return navigateTo('/');
        } else {
            userInfo.name = user.displayName;
            userInfo.email = user.email;
        }
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

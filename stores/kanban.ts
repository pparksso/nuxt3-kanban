import { defineStore } from 'pinia';
import { get, child, ref as rtdbRef, getDatabase } from 'firebase/database';

type UserInfo = {
    name: string | null;
    email: string | null;
};

export const useKanbanStore = defineStore('word', () => {
    const db = getDatabase();
    const dbRef = rtdbRef(db);
    // 유저 정보
    const userInfo = ref<UserInfo>({
        name: '',
        email: '',
    });

    // 추가한 칸반리스트 제목
    const saveWord = ref<string>('');

    // 리스트 제목 변경 함수
    function changeWord(word: string) {
        saveWord.value = word;
    }

    // 칸반리스트 제목이 모인 배열
    const kanbanTitles = ref<string[] | null>();
    // 해당 칸반리스트
    const kanbanDatas = ref<Object | null>();
    function getTitle() {
        const encodedEmail = encodeURIComponent(
            !userInfo.value.email ? '' : userInfo.value.email.replace(/\./g, '%2E'),
        );
        const path = `${encodedEmail}/`;

        // eslint-disable-next-line consistent-return
        get(child(dbRef, path)).then((snapshot) => {
            const titleData = snapshot.val();
            if (titleData) {
                const titleArr = Object.keys(titleData);
                kanbanTitles.value = titleArr;
                kanbanDatas.value = titleData[saveWord.value];
                if (!saveWord.value) kanbanDatas.value = titleData[titleArr[0]];
                console.log(kanbanDatas.value);
            } else {
                kanbanTitles.value = null;
                kanbanDatas.value = null;
                return false;
            }
        });
    }
    return { userInfo, changeWord, kanbanTitles, kanbanDatas, getTitle };
});

import { defineStore } from 'pinia';
import { get, child, ref as rtdbRef, getDatabase } from 'firebase/database';

type UserInfo = {
    name: string | null;
    email: string | null;
};

type KanbanDatas = {
    title: string | null;
    cards: object | null;
};
export const useKanbanStore = defineStore('word', () => {
    const db = getDatabase();
    const dbRef = rtdbRef(db);
    const route = useRoute();

    // 로딩 상태
    const loading = ref<boolean>(true);

    // 유저 정보
    const userInfo = ref<UserInfo>({
        name: '',
        email: '',
    });

    // 지금 현재 칸반리스트 카테고리 이름
    const nowCategoryTitle = ref<string>('');

    // 지금의 칸반리스트 변경 함수
    function changeCategoryTitle(title: string) {
        nowCategoryTitle.value = title;
    }

    // 추가한 칸반리스트 제목
    const saveWord = ref<string>('');

    // 리스트 제목 변경 함수
    function changeWord(word: string) {
        saveWord.value = word;
    }

    // 칸반리스트 제목이 모인 배열
    const kanbanTitles = ref<string[] | null>();
    // 해당 칸반리스트
    const kanbanDatas = ref<KanbanDatas | null>();

    // 칸반보드 안의 카드들의 이름을 모은 배열
    const cardNames = ref<string[] | null>();

    function getTitle() {
        const encodedEmail = encodeURIComponent(
            !userInfo.value.email ? '' : userInfo.value.email.replace(/\./g, '%2E'),
        );
        const path = `${encodedEmail}/`;

        // eslint-disable-next-line consistent-return
        get(child(dbRef, path)).then((snapshot) => {
            loading.value = false;
            const titleData = snapshot.val();
            if (titleData) {
                // 큰 칸반리스트의 타이틀들
                const titleArr = Object.keys(titleData);
                kanbanTitles.value = titleArr;
                if (nowCategoryTitle.value !== '' && nowCategoryTitle.value !== undefined) {
                    kanbanDatas.value = titleData[nowCategoryTitle.value];
                    cardNames.value = Object.keys(kanbanDatas.value?.cards as object);
                } else if (saveWord.value) {
                    kanbanDatas.value = titleData[saveWord.value];
                    cardNames.value = Object.keys(kanbanDatas.value?.cards as object);
                } else {
                    kanbanDatas.value = titleData[titleArr[0]];
                }
            } else {
                kanbanTitles.value = null;
                kanbanDatas.value = null;
                return false;
            }
        });
    }

    return {
        loading,
        userInfo,
        changeWord,
        kanbanTitles,
        kanbanDatas,
        getTitle,
        cardNames,
        changeCategoryTitle,
    };
});

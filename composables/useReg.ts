export const useReg = () => {
    /**
     * . , $, #, [] 가 포함되어있으면 alert 생성
     * @param word
     */
    function checkChar(word: string) {
        const prohibitedChars = /[.\\#$\\[\]]/;
        if (prohibitedChars.test(word)) {
            // eslint-disable-next-line no-alert
            alert('마침표, 특수문자, 대괄호를 사용할 수 없습니다.');
        }
    }
    return {
        checkChar,
    };
};

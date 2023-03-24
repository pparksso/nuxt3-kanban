import {
    getAuth,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
} from 'firebase/auth';

export const useAuth = () => {
    const token = useState<string | null>('token', () => null);
    async function signIn() {
        return await new Promise<void>((resolve, reject) => {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            return signInWithPopup(auth, provider)
                .then((userCredential) => {
                    userCredential.user
                        .getIdToken()
                        .then((idToken) => {
                            token.value = idToken;
                            resolve();
                            navigateTo('/board');
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    async function signOut() {
        return await new Promise<void>((resolve, reject) => {
            const auth = getAuth();
            firebaseSignOut(auth)
                .then(() => {
                    token.value = null;
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    async function checkAuthState() {
        return await new Promise<void>((resolve, reject) => {
            if (process.server) return resolve();
            const auth = getAuth();
            onAuthStateChanged(
                auth,
                (user) => {
                    if (user) {
                        user.getIdToken()
                            .then((idtoken) => {
                                token.value = idtoken;
                                resolve();
                            })
                            .catch(reject);
                    } else {
                        token.value = null;
                        resolve();
                    }
                },
                (err) => {
                    reject(err);
                },
            );
        });
    }

    return {
        signIn,
        signOut,
        token,
        checkAuthState,
    };
};

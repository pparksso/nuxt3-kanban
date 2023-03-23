import {
    getAuth,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth';

export const useAuth = () => {
    const token = useState<string>('token', () => null);
    async function signIn(email: string, password: string) {
        return await new Promise<void>((resolve, reject) => {
            const auth = getAuth();
            return signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    userCredential.user
                        .getIdToken()
                        .then((idToken) => {
                            token.value = idToken;
                            resolve();
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

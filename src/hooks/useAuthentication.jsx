import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react"
import { app } from "../firebase/config";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth(app);

    function checkIfIsCancelled() {
        if (cancelled) return;
    }

    const createUser = async (data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError('');

        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )

            await updateProfile(user, { displayName: data.displayName })

            setLoading(false);
            return user;
        } catch (e) {
            setLoading(true);
            console.log(e.message);
            console.log(typeof e.message);

            let systemErrorMessage

            if (e.message.includes('Password')) {
                systemErrorMessage = 'A senha precisa conter pelo menos 6 caracteres'
            } else if (e.message.includes('email-already')) {
                systemErrorMessage = 'E-mail já cadastrado.'
            } else {
                systemErrorMessage = 'Ocorreu um erro,  por favor tente mais tarde.'
            }

            setError(systemErrorMessage);
            setLoading(false);
        }
    }

    const logout = () => {
        checkIfIsCancelled();
        signOut(auth)
    }

    const login = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError('')

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false);
        } catch (e) {
            let systemErrorMessage;
            if (e.message.includes('invalid-credential')) {
                systemErrorMessage = ' E-mail e/ou senha incorretos.'
            } else {
                systemErrorMessage = 'Ocorreu um erro, por favor tente mais tarde.'
            }
            setError(systemErrorMessage);
            setLoading(false);
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login
    };
}
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const devAuthEnabled = import.meta.env.VITE_DEV_AUTH === '1' || import.meta.env.VITE_DEV_AUTH === 'true';
    const devUserEmail = import.meta.env.VITE_DEV_USER || 'oca@bracu.ac.bd';
    const googleProvider = new GoogleAuthProvider();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        if (devAuthEnabled) {
            setUser({ email: email || devUserEmail });
            setLoading(false);
            return Promise.resolve();
        }
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        setLoading(true);
        if (devAuthEnabled) {
            setUser({ email: email || devUserEmail });
            setLoading(false);
            return Promise.resolve();
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setLoading(true);
        if (devAuthEnabled) {
            setUser(null);
            setLoading(false);
            return Promise.resolve();
        }
        return signOut(auth);
    };

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const updateInfo = (name, photourl) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photourl,
        });
    };

    const markLoggedIn = (email) => {
        setUser({ email });
        setLoading(false);
    };

    useEffect(() => {
        // Restore backend auth session if present
        const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('auth_email') : null;
        if (storedEmail) {
            setUser({ email: storedEmail });
            setLoading(false);
            return;
        }
        if (devAuthEnabled) {
            setUser({ email: devUserEmail });
            setLoading(false);
            return;
        }
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => {
            return unSubscribe();
        };
    }, [devAuthEnabled, devUserEmail]);

    const drilling = {
        user,
        createUser,
        login,
        logOut,
        loading,
        setLoading,
        updateInfo,
        googleLogin,
        markLoggedIn,
    };

    return (
        <AuthContext.Provider value={drilling}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

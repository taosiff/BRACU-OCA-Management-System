import { createContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import auth from "../firebase/firebase.config";
import apiClient from "../utils/apiClient";

export const AuthContext = createContext(null);

const clearStoredSession = () => {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_name");
  } catch {
    // Ignore storage errors
  }
};

const AuthProvider = ({ children }) => {
  const devAuthEnabled =
    import.meta.env.VITE_DEV_AUTH === "1" || import.meta.env.VITE_DEV_AUTH === "true";
  const devUserEmail = import.meta.env.VITE_DEV_USER || "oca@bracu.ac.bd";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = (token, email, role, name) => {
    try {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_email", email);
      localStorage.setItem("auth_role", role || "");
      localStorage.setItem("auth_name", name || "");
    } catch {
      // Ignore storage errors
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const { token, email: userEmail, role, name } = res.data || {};
      if (!token || !userEmail) {
        throw new Error("Invalid login response from server");
      }
      persistSession(token, userEmail, role, name);
      setUser({ email: userEmail, role, name });
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const registerVisitor = async ({ name, email, password, studentId }) => {
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        studentId,
      });
      const { token, email: userEmail, role, name: userName } = res.data || {};
      if (!token || !userEmail) {
        throw new Error("Invalid registration response from server");
      }
      persistSession(token, userEmail, role || "visitor", userName || name);
      setUser({ email: userEmail, role: role || "visitor", name: userName || name });
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    clearStoredSession();
    setUser(null);
    if (auth) {
      try {
        await signOut(auth);
      } catch {
        // Ignore Firebase sign-out errors if not signed in via Firebase
      }
    }
    setLoading(false);
  };

  const markLoggedIn = (email, role = "", name = "") => {
    setUser({ email, role, name });
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const storedEmail =
        typeof window !== "undefined" ? localStorage.getItem("auth_email") : null;

      if (token) {
        try {
          const res = await apiClient.get("/auth/me");
          if (active) {
            setUser({
              email: res.data.email,
              role: res.data.role,
              name: res.data.name,
            });
          }
        } catch {
          clearStoredSession();
          if (active) setUser(null);
        } finally {
          if (active) setLoading(false);
        }
        return;
      }

      if (devAuthEnabled && storedEmail) {
        if (active) {
          setUser({ email: storedEmail });
          setLoading(false);
        }
        return;
      }

      if (devAuthEnabled) {
        if (active) {
          setUser({ email: devUserEmail });
          setLoading(false);
        }
        return;
      }

      if (active) {
        setUser(null);
        setLoading(false);
      }
    };

    restoreSession();
    return () => {
      active = false;
    };
  }, [devAuthEnabled, devUserEmail]);

  const authValue = {
    user,
    login,
    registerVisitor,
    logOut,
    loading,
    setLoading,
    markLoggedIn,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

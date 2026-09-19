import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const { user } = await api.me();
        setUser(user);
      } catch {
        setToken(null);
      } finally {
        setReady(true);
      }
    }
    restoreSession();
  }, []);

  async function signup({ name, email, password, phone }) {
    try {
      const { token, user } = await api.register({ name, email, password, phone });
      setToken(token);
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function login({ email, password }) {
    try {
      const { token, user } = await api.login({ email, password });
      setToken(token);
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function updateProfile(patch) {
    const { user } = await api.updateProfile(patch);
    setUser(user);
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, signup, login, logout, updateProfile, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

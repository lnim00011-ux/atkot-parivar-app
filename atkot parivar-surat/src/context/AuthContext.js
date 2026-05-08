import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginWithJwt } from "../services/authService";

const TOKEN_KEY = "atkot-parivar.jwt";
const USER_KEY = "atkot-parivar.user";
const PROFILE_KEY = "atkot-parivar.profile";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedToken, storedUser, storedProfile] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(PROFILE_KEY)
        ]);
        setToken(storedToken);
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setMemberProfile(storedProfile ? JSON.parse(storedProfile) : null);
      } finally {
        setIsBootstrapping(false);
      }
    }
    restoreSession();
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    memberProfile,
    isBootstrapping,
    isAuthenticated: Boolean(token),
    hasCompletedProfile: Boolean(memberProfile?.name && memberProfile?.whatsapp && memberProfile?.area),
    signIn: async (credentials) => {
      const session = await loginWithJwt(credentials);
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, session.token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(session.user || {}))
      ]);
      setToken(session.token);
      setUser(session.user || {});
    },
    saveMemberProfile: async (profile) => {
      const normalizedProfile = { ...profile, id: user?.id || `local-${Date.now()}`, whatsapp: profile.whatsapp.replace(/\D/g, "") };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(normalizedProfile));
      setMemberProfile(normalizedProfile);
    },
    signOut: async () => {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
        AsyncStorage.removeItem(PROFILE_KEY)
      ]);
      setToken(null);
      setUser(null);
      setMemberProfile(null);
    }
  }), [isBootstrapping, memberProfile, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

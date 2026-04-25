"use client";

import dayjs from "dayjs";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User, AuthState } from "@/types";
import {
  hashPassword,
  verifyPassword,
  generateId,
  isValidEmail,
  isValidPassword,
} from "@/utils/auth";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "@/utils/storage";

interface AuthContextType extends AuthState {
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "event_manager_users";
const CURRENT_USER_STORAGE_KEY = "event_manager_current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    userId: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const currentUserId = getLocalStorage(CURRENT_USER_STORAGE_KEY);
    if (currentUserId) {
      const users = getLocalStorage(USERS_STORAGE_KEY, []);
      const user = users.find((u: User) => u.id === currentUserId);
      if (user) {
        setAuthState({
          isLoggedIn: true,
          user,
          userId: user.id,
        });
      }
    }
    setIsHydrated(true);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (!isValidEmail(email)) {
        throw new Error("Invalid email format");
      }

      const users = getLocalStorage(USERS_STORAGE_KEY, []);

      const user = users.find((u: User) => u.email === email);
      if (!user) {
        throw new Error("User not found");
      }

      if (!verifyPassword(password, user.passwordHash)) {
        throw new Error("Invalid password");
      }

      setAuthState({
        isLoggedIn: true,
        user,
        userId: user.id,
      });

      setLocalStorage(CURRENT_USER_STORAGE_KEY, user.id);
    },
    [],
  );

  const signup = useCallback(
    async (
      username: string,
      email: string,
      password: string,
    ): Promise<void> => {
      if (!username || !email || !password) {
        throw new Error("All fields are required");
      }

      if (!isValidEmail(email)) {
        throw new Error("Invalid email format");
      }

      if (!isValidPassword(password)) {
        throw new Error("Password must be at least 6 characters");
      }

      const users = getLocalStorage(USERS_STORAGE_KEY, []);

      if (users.some((u: User) => u.email === email)) {
        throw new Error("User with this email already exists");
      }

      const newUser: User = {
        id: generateId(),
        username,
        email,
        passwordHash: hashPassword(password),
        createdAt: dayjs().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      setLocalStorage(USERS_STORAGE_KEY, updatedUsers);

      setAuthState({
        isLoggedIn: true,
        user: newUser,
        userId: newUser.id,
      });

      setLocalStorage(CURRENT_USER_STORAGE_KEY, newUser.id);
    },
    [],
  );

  const logout = useCallback((): void => {
    setAuthState({
      isLoggedIn: false,
      user: null,
      userId: null,
    });
    removeLocalStorage(CURRENT_USER_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      isHydrated,
      login,
      signup,
      logout,
    }),
    [authState, isHydrated, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

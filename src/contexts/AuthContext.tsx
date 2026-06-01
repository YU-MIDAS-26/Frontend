import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { queryClient } from "../main";

type AuthContextValue = {
  isLoggedIn: boolean;
  userId: string | null;
  login: (nextUserId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true",
  );
  const [userId, setUserId] = useState<string | null>(() =>
    localStorage.getItem("userId"),
  );

  const login = useCallback((nextUserId: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", nextUserId);
    setIsLoggedIn(true);
    setUserId(nextUserId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");

    localStorage.removeItem("accessToken");

    queryClient.clear();

    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "isLoggedIn" && event.key !== "userId") {
        return;
      }

      // TODO: 백엔드 연동 후에는 토큰 만료 체크나 사용자 정보 재조회 로직을
      // 초기 진입 시점에 추가하는 것도 좋습니다.
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserId(localStorage.getItem("userId"));
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      userId,
      login,
      logout,
    }),
    [isLoggedIn, login, logout, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

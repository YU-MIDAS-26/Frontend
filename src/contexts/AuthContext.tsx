import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

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
  const [userId, setUserId] = useState<string | null>(
    () => localStorage.getItem("userId"),
  );

  const login = useCallback((nextUserId: string) => {
    // TODO: 백엔드 연동 시 로그인 응답(access token, refresh token, user info)을
    // 여기에서 저장하도록 바꾸면 됩니다.
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", nextUserId);
    setIsLoggedIn(true);
    setUserId(nextUserId);
  }, []);

  const logout = useCallback(() => {
    // TODO: 백엔드 연동 시 로그아웃 API 호출, 토큰 폐기, 세션 정리 로직을
    // 여기에서 함께 처리하면 됩니다.
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

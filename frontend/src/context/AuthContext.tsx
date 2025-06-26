// AuthContext.tsx
import React, {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  logIn: () => void;
  logOut: () => void;
};

const AUTH_STORAGE_KEY = 'auth-key';

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  logIn: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {

  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /** Persist the boolean flag in localStorage */
  const storeAuthState = (newState: { isLoggedIn: boolean }) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      console.error('Error saving auth state', err);
    }
  };

  const logIn = () => {
    setIsLoggedIn(true);
    storeAuthState({ isLoggedIn: true });
  };

  const logOut = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });
  };

  useEffect(() => {
    /** Load the flag from localStorage once on mount */
    const init = async () => {
      // simulate network or other async work if you want a splash/loading state
      await new Promise((r) => setTimeout(r, 300)); // optional

      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { isLoggedIn?: boolean };
          setIsLoggedIn(!!parsed.isLoggedIn);
        }
      } catch (err) {
        console.error('Error reading auth state', err);
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ isReady, isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

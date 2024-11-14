import React, { createContext, useState, useEffect, ReactNode } from "react";
import { sessionStorageService } from "@/services/sessionStorageService";
import { useRouter } from 'next/router';

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userRole: "",
  setUserRole: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
        setIsLoggedIn(!!event.newValue);
        if (!event.newValue) {
          // User logged out, clear the role and redirect to the home page
          setUserRole("");
          router.push("/");
        } else {
          // User logged in, set the role from the session storage
          setUserRole(sessionStorageService.getItem("role") || "");
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
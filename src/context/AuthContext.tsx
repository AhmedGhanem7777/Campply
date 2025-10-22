// src/context/AuthContext.tsx
import { createContext, ReactNode, useState } from "react";
import { registerUser } from "../Service/api/endpoints";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isActive: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  register: (data: {
    displayName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  register: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const register = async (data: {
    displayName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    try {
      const res = await registerUser(data);
      console.log("✅ Register API response:", res);

      // حفظ التوكن
      localStorage.setItem("token", res.token);
      setToken(res.token);

      // حفظ المستخدم في الحالة
      setUser({
        id: res.id,
        displayName: res.displayName,
        email: res.email,
        role: res.role,
        isActive: res.isActive,
        token: res.token,
      });
    } catch (error: any) {
      console.error(" Register error:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, register }}>
      {children}
    </AuthContext.Provider>
  );
};

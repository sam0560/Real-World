import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { AuthContextType } from "../..";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context as AuthContextType;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("jwtToken"));
  const [user, setUser] = useState<{ username: string; email: string; image?: string } | null>(null);

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await fetch("https://api.realworld.io/api/user", {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user info");
      }

      const data = await res.json();
      setUser({ username: data.user.username, email: data.user.email, image: data.user.image });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const login = (token: string) => {
    localStorage.setItem("jwtToken", token);
    setIsAuthenticated(true);
    fetchUserInfo(token);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
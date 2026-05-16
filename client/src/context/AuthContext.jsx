import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ========================================
  // LOAD USER FROM STORAGE
  // ========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem(
        "opsmind_user"
      );

    if (storedUser) {
      setUser(
        JSON.parse(storedUser)
      );
    }

    setLoading(false);

  }, []);

  // ========================================
  // LOGIN
  // ========================================

  const login = (
    token,
    userData
  ) => {

    localStorage.setItem(
      "opsmind_token",
      token
    );

    localStorage.setItem(
      "opsmind_user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem(
      "opsmind_token"
    );

    localStorage.removeItem(
      "opsmind_user"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () => useContext(AuthContext);
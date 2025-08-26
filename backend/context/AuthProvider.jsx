import React, { createContext, useState, useContext } from "react";
export const AuthContext = createContext();

export default function AuthProvider({children}) {
  const localUser = localStorage.getItem("Users");
  const [authUser, setAuthUser] = useState(
    localUser ? JSON.parse(localUser) : undefined
  );
  return (
    <AuthContext.Provider value={[ authUser, setAuthUser ]}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import React, { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const localUser = localStorage.getItem("Users");
  const [authUser, setAuthUser] = useState(
    localUser ? JSON.parse(localUser) : undefined
  );

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
}


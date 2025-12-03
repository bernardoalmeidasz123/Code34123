import React, { useContext } from "react";

export const AuthContext = React.createContext({ token: null, setToken: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

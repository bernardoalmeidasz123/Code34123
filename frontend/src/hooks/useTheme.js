import React, { useContext } from "react";

export const ThemeContext = React.createContext({ dark: false, toggle: () => {} });

export function useThemeToggle() {
  return useContext(ThemeContext);
}

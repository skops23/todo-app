import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { colors } from "../constants/colors";

type Scheme = keyof typeof colors;
type Theme = {
  scheme: Scheme;
  theme: (typeof colors)[Scheme];
  toggleTheme: () => void;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const scheme = selectedScheme ?? systemScheme ?? "light";

  return (
    <ThemeContext.Provider value={{
      scheme,
      theme: colors[scheme],
      toggleTheme: () => setSelectedScheme(scheme === "dark" ? "light" : "dark"),
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme requires ThemeProvider");
  return context;
}

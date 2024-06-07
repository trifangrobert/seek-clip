import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material/styles";

type ThemeContextType = {
  toggleTheme: () => void;
  currentTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? (savedTheme as "light" | "dark") : "light";
  };

  const [themeMode, setThemeMode] = useState<"light" | "dark">(getInitialTheme);

  const getPrimaryColor = () => {
    return themeMode === "dark" ? "#e3f2fd" : "#6200ee";
  };

  const theme: Theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: themeMode,
        primary: {
          main: getPrimaryColor(),
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
            body {
              &::-webkit-scrollbar {
                width: 8px;
                height: 8px; // For horizontal scrollbars
              }
              &::-webkit-scrollbar-track {
                background-color: transparent;
              }
              &::-webkit-scrollbar-thumb {
                background-color: ${
                  themeMode === "dark" ? "#6b6b6b" : "#bfbfbf"
                };
                border-radius: 10px;
                &:hover {
                  background-color: ${
                    themeMode === "dark" ? "#a8a8a8" : "#949494"
                  };
                }
              }
            }
          `,
        },
      },
    });
  }, [themeMode]);

  const toggleTheme = () => {
    const newThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newThemeMode);
    localStorage.setItem("theme", newThemeMode);
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, currentTheme: themeMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

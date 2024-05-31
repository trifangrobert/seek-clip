import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';

type ThemeContextType = {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? (savedTheme as 'light' | 'dark') : 'light';
    }

    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(getInitialTheme);

    const theme: Theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: themeMode,
            },
        });
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    }

    return (
        <ThemeContext.Provider value={{ toggleTheme, currentTheme: themeMode }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
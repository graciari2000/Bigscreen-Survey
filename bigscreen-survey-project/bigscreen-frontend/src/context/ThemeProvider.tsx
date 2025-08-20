import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define light and dark theme variables
const light = {
    '--background': '#ffffff',
    '--text-color': '#000000',
    '--secondary': '#f0f0f0',
    toggleImage: '/assets/Group 192.png', // Light theme image
};

const dark = {
    '--background': '#000000',
    '--text-color': '#ffffff',
    '--secondary': '#1a1a1a',
    toggleImage: '/assets/Group 193.png', // Dark theme image
};

// Create ThemeContext
export const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { },
    toggleImage: '', // Add toggleImage to the context
});

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        const root = document.documentElement;
        const themeVariables = theme === 'light' ? light : dark;

        Object.keys(themeVariables).forEach((key) => {
            if (key.startsWith('--')) {
                root.style.setProperty(key, themeVariables[key as keyof typeof light]);
            }
        });
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, toggleImage: theme === 'light' ? light.toggleImage : dark.toggleImage }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
import React from 'react';
import { useTheme, useToggleTheme } from "../../hooks/useTheme";

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleImage } = useTheme();
    const toggleTheme = useToggleTheme();

    return (
        <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <img src={toggleImage} alt={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} />
        </button>
    );
};

export default ThemeToggleButton;
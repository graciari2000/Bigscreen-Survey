// filepath: /Applications/MAMP/htdocs/BigScreen/Bigscreen-Survey/bigscreen-survey-project/frontend/src/hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from './../context/ThemeProvider.tsx';

export const useTheme = () => {
    const { theme, toggleImage } = useContext(ThemeContext);
    return { theme, toggleImage }; // Return both theme and toggleImage
};

export const useToggleTheme = () => {
    const { toggleTheme } = useContext(ThemeContext);
    return toggleTheme;
};
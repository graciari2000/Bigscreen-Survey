import { useState, useEffect } from 'react';
import React from 'react';
import '../ThemeToggle.css';

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' ||
            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        // Apply theme to document
        const root = document.documentElement;

        if (isDarkMode) {
            root.style.setProperty('--background', '#010104');
            root.style.setProperty('--text', '#e6e6e6');
            root.style.setProperty('--primary', '#bf92d3');
            root.style.setProperty('--secondary', '#c4c4c4');
            root.style.setProperty('--accent', '#bf92d3');
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            root.style.setProperty('--background', '#fbfbfe');
            root.style.setProperty('--text', '#1a1a1a');
            root.style.setProperty('--primary', '#592c6d');
            root.style.setProperty('--secondary', '#3b3b3b');
            root.style.setProperty('--accent', '#592c6d');
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }

        // Save to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
            <img
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                src={isDarkMode ? '/assets/Group 192.png' : '/assets/Group 193.png'}
                alt={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            />
    );
};

export default ThemeToggle;
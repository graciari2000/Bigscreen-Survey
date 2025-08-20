import React from 'react';
import Group192 from './assets/Group 192.png';
import Group193 from './assets/Group 193.png';

interface ThemeToggleProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-200 hover:scale-110"
            style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--background)',
                border: 'none',
            }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <img style={{ width: '50px', height: '30px', position: 'absolute', top: '0', right: '0' }}
                src={theme === 'light' ? Group193 : Group192}
                alt={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                className="w-6 h-6"
            />
        </button>
    );
};
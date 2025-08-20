import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.tsx';
import { Navigation } from './components/Navigation.tsx';
import { SurveyPage } from './components/SurveyPage.tsx';
import { ResponsePage } from './components/ResponsePage.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { useTheme, useToggleTheme } from './hooks/useTheme.ts';

function App() {
  const { theme } = useTheme(); // Correctly destructure `theme` from `useTheme`
  const toggleTheme = useToggleTheme(); // Use `useToggleTheme` hook to get the toggle function

  return (
    <BrowserRouter>
      <div
        className="min-h-screen transition-colors duration-200"
        style={{ backgroundColor: theme === 'light' ? '#f9fafb' : '#111827' }}
      >
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <Navigation />

        <div className="flex items-center justify-center p-4">
          <div
            className="rounded-xl p-8 shadow-lg transition-colors duration-200"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <Routes>
              <Route path="/" element={<SurveyPage />} />
              <Route path="/responses/:token" element={<ResponsePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
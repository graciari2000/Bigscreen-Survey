import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation.tsx';
import { SurveyPage } from './components/SurveyPage.tsx';
import { ResponsePage } from './components/ResponsePage.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AdminRegister } from './components/AdminRegister.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-200">
        <Navigation />

        <div className="flex items-center justify-center p-4 pt-20"> {/* Added pt-20 for spacing */}
          <div className="rounded-xl p-8 shadow-lg transition-colors duration-200">
            <Routes>
              <Route path="/" element={<SurveyPage />} />
              <Route path="/responses/:token" element={<ResponsePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
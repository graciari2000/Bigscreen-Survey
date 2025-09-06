// Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./../styles/Navigation.css";
import { useNavigate } from 'react-router-dom';

export function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <nav className='navbar'>
            <div className="navbar-links">
                <Link
                    to="/admin"
                    className={location.pathname.startsWith('/admin') ? 'font-bold' : ''}
                >
                    Home
                </Link>
                {/* Add this link to view questions */}
                <Link
                    to="/admin/questions"
                    className={location.pathname.startsWith('/admin/questions') ? 'font-bold' : ''}
                >
                    Questions
                </Link>
                {/* Add this link to view responses */}
                <Link
                    to="/responses"
                    className={location.pathname.startsWith('/responses') ? 'font-bold' : ''}
                >
                    Responses
                </Link>
                <button
                    onClick={handleLogout}
                    className="admin-logout-btn"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
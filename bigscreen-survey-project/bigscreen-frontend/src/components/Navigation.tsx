import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./../styles/Navigation.css";
import ThemeToggle from "./ThemeToggle.tsx";

export function Navigation() {
    const location = useLocation();

    return (
        <nav className='navbar'>
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={` ${location.pathname === '/' ? 'font-bold' : ''
                            }`}>
                        bigscreen
                    </Link>
                    <Link
                        to="/admin/login"
                        className={` ${location.pathname.startsWith('/admin') ? 'font-bold' : ''
                            }`}>
                        Admin
                    </Link>
                    <div className='theme-toggle-container'>
                <ThemeToggle />
                </div>
                    </div>
        </nav>
    );
}
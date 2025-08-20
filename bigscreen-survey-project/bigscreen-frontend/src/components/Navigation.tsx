import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
    const location = useLocation();

    return (
        <nav
            className="p-4 border-b"
            style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--secondary)'
            }}
        >
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="flex space-x-6">
                    <Link
                        to="/"
                        className={`font-medium hover:underline transition-colors ${location.pathname === '/' ? 'font-bold' : ''
                            }`}
                        style={{ color: 'var(--primary)' }}
                    >
                        Survey
                    </Link>
                    <Link
                        to="/admin/login"
                        className={`font-medium hover:underline transition-colors ${location.pathname.startsWith('/admin') ? 'font-bold' : ''
                            }`}
                        style={{ color: 'var(--primary)' }}
                    >
                        Admin
                    </Link>
                </div>

                <h1
                    className="font-bold text-xl font-sans tracking-tight"
                    style={{ color: 'var(--text)' }}
                >
                    bigscreen
                </h1>
            </div>
        </nav>
    );
}
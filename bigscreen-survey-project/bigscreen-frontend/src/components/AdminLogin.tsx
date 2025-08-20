import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../hooks/useTheme.ts";

export function AdminLogin() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(
                    response.status === 401
                        ? 'Invalid username or password'
                        : `Login failed with status ${response.status}`
                );
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/admin');
        } catch (error: any) {
            setError(error.message || 'An error occurred during login');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="w-[375px] h-[812px] mx-auto border relative overflow-hidden"
            style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--secondary)',
            }}
        >
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center">
                <a
                    href="/"
                    className="font-medium text-sm hover:underline"
                    style={{ color: 'var(--primary)' }}
                >
                    Survey
                </a>
            </div>

            {/* Content */}
            <div className="px-6 pt-8">
                {/* Logo */}
                <div className="text-center mb-12">
                    <h1
                        className="font-bold text-2xl font-sans tracking-tight"
                        style={{ color: 'var(--text)' }}
                    >
                        bigscreen
                    </h1>
                </div>

                {/* Title */}
                <div className="mb-8">
                    <h2
                        className="font-bold text-[30px] leading-tight text-center"
                        style={{ color: 'var(--text)' }}
                    >
                        Admin Login
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div
                            className="text-sm text-center p-3 rounded-lg"
                            style={{ backgroundColor: 'var(--secondary)', color: 'var(--background)' }}
                        >
                            {error}
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium mb-2"
                            style={{ color: 'var(--text)' }}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--secondary)',
                                color: 'var(--text)',
                                '--tw-ring-color': 'var(--primary)',
                            } as React.CSSProperties}
                            placeholder="Enter your username"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-2"
                            style={{ color: 'var(--text)' }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--secondary)',
                                color: 'var(--text)',
                                '--tw-ring-color': 'var(--primary)',
                            } as React.CSSProperties}
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full font-medium py-3 px-4 rounded-lg transition-colors hover:opacity-90"
                        style={{
                            backgroundColor: 'var(--secondary)',
                            color: 'var(--background)',
                            opacity: isLoading ? 0.6 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
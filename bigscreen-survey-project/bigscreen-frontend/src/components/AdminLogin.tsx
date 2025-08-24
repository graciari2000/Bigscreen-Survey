import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./../App.css";

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
            const response = await fetch('http://localhost:8000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // Check if response is OK before trying to parse JSON
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid username or password');
                }
                if (response.status === 422) {
                    const errorData = await response.json();
                    const errorMessage = errorData.errors
                        ? Object.values(errorData.errors).flat().join(', ')
                        : errorData.message || 'Validation failed. Please check your input.';
                    throw new Error(errorMessage);
                }
                throw new Error(`Login failed with status ${response.status}`);
            }

            const data = await response.json();

            // Store the token in localStorage
            localStorage.setItem('adminToken', data.token);

            // Store admin data if available
            if (data.admin) {
                localStorage.setItem('adminData', JSON.stringify(data.admin));
            }

            // Redirect to admin dashboard
            navigate('/admin', {
                replace: true,  // Replace current history entry
                state: { message: 'Login successful!' }  // Optional success message
            });

        } catch (error: any) {
            setError(error.message || 'An error occurred during login');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center pb-6 border-b">
                    <Link to="/" className="font-medium text-sm text-blue-600 hover:underline">
                        Survey
                    </Link>
                    <Link to="/admin/register" className="font-medium text-sm text-blue-600 hover:underline">
                        Register
                    </Link>
                </div>

                {/* Logo */}
                <div className="text-center">
                    <h1 className="font-bold text-3xl font-sans text-gray-800">bigscreen</h1>
                </div>

                {/* Title */}
                <div>
                    <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                        Admin Login
                    </h2>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your username"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/admin/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Register here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
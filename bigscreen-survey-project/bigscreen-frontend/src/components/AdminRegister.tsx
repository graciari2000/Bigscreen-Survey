import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./../App.css";

export function AdminRegister() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Basic validation
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/admin/register', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if response is OK before trying to parse JSON
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Registration failed: Unauthorized.');
                }
                if (response.status === 422) {
                    const errorData = await response.json();
                    const errorMessage = errorData.errors
                        ? Object.values(errorData.errors).flat().join(', ')
                        : errorData.message || 'Validation failed. Please check your input.';
                    throw new Error(errorMessage);
                }
                throw new Error(`Registration failed with status ${response.status}`);
            }

            // Parse the successful response but don't assign to a variable if not used
            await response.json();

            // Auto-login after successful registration
            const loginResponse = await fetch('http://localhost:8000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            if (!loginResponse.ok) {
                // Registration succeeded but login failed - redirect to login page
                navigate('/admin/login', {
                    state: { message: 'Registration successful. Please login.' }
                });
                return;
            }

            const loginData = await loginResponse.json();
            localStorage.setItem('adminToken', loginData.token);
            navigate('/admin');
        } catch (error: any) {
            setError(error.message || 'An error occurred during registration');
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center pb-6 border-b">
                    <Link to="/" className="font-medium text-sm text-blue-600 hover:underline">
                        Survey
                    </Link>
                    <Link to="/admin/login" className="font-medium text-sm text-blue-600 hover:underline">
                        Login
                    </Link>
                </div>

                {/* Logo */}
                <div className="text-center">
                    <h1 className="font-bold text-3xl font-sans text-gray-800">bigscreen</h1>
                </div>

                {/* Title */}
                <div>
                    <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                        Admin Registration
                    </h2>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
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
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Choose a username"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
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
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Create a password (min. 8 characters)"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm your password"
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
                                    Creating Account...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/admin/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
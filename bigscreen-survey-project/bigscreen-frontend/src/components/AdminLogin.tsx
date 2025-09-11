import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./../App.css";
import "./../styles/AdminLogin.css";


export function AdminLogin() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Hide navbar when component mounts
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.display = 'none';
        }

        // Cleanup: Show navbar when component unmounts
        return () => {
            if (navbar) {
                navbar.style.display = 'flex';
            }
        };
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
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
        <div className="admin-login-container">
            {/* Background shapes */}

            <div className="admin-login-card">
                <div className="user-icon">
                    <div className="user-icon-head"></div>
                    <div className="user-icon-body"></div>
                </div>
                

                {/* Title */}
                <div className="admin-login-title">
                    <h2>Login as admin</h2>
                </div>

                {/* Form */}
                <form className="admin-login-form" onSubmit={handleLogin}>
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="Enter your username"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
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

                    <div className="register-link">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/admin/register">Register here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
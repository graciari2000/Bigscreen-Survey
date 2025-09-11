import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./../App.css";
import "./../styles/AdminRegister.css";

export function AdminRegister() {

    // Add inside the component function
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
            const response = await fetch('`${process.env.REACT_APP_API_URL}/api/admin/register', {
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
            const loginResponse = await fetch('`${process.env.REACT_APP_API_URL}/api/admin/login', {
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
        <div className="admin-register-container">
            <div className="admin-register-card">
                    <div className="user-icon">
                        <div className="user-icon-head-register"></div>
                        <div className="user-icon-body-register"></div>
    </div>

                {/* Title */}
                <div className="admin-register-title">
                    <h2>Register as admin</h2>
                </div>

                {/* Form */}
                <form className="admin-register-form" onSubmit={handleRegister}>
                    {error && (
                        <div className="register-error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <div className="register-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="register-form-input"
                            placeholder="Choose a username"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="register-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="register-form-input"
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="register-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="register-form-input"
                            placeholder="Create a password (min. 8 characters)"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="register-form-group">
                        <label htmlFor="password_confirmation">Confirm Password</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            className="register-form-input"
                            placeholder="Confirm your password"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-button"
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

                    <div className="register-login-link">
                        <p>
                            Already have an account?{' '}
                            <Link to="/admin/login">Login here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
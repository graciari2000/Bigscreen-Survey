// QuestionsList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./../styles/ResponsePage.css";

interface Question {
    id: number;
    number: number;
    body: string;
    type: string;
    options?: string;
    created_at: string;
    updated_at: string;
}

export function QuestionsList() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                setError('Admin authentication required. Please login first.');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:8000/api/admin/questions`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Authentication failed. Please login again.');
                    localStorage.removeItem('adminToken');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            setQuestions(data);
        } catch (error: any) {
            console.error('Error fetching questions:', error);
            setError('Failed to load questions. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'A': return 'Multiple Choice';
            case 'B': return 'Text Input';
            case 'C': return 'Rating Scale';
            default: return type;
        }
    };

    if (loading) {
        return (
            <div className="response-page-container">
                <div className="response-content">
                    <div className="response-loading">
                        <p>Loading questions...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="response-page-container">
                <div className="response-content">
                    <div className="response-error">
                        <p>Error: {error}</p>
                        <button onClick={fetchQuestions} className="response-error-button">
                            Try Again
                        </button>
                        <Link to="/admin/login" className="response-error-button">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="response-page-container">

            <div className="response-content">
                <div className="response-title">
                    <h2>Survey Questions</h2>
                </div>

                {questions.length === 0 ? (
                    <div className="no-responses">
                        <p>No questions found in the database.</p>
                    </div>
                ) : (
                    <div className="response-table-container">
                        <table className="response-table">
                            <thead>
                                <tr>
                                    <th>Question #</th>
                                    <th>Question</th>
                                    <th>Type</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((question) => (
                                    <tr key={question.id}>
                                        <td className="question-number">
                                            {question.number}
                                        </td>
                                        <td className="question-body">
                                            {question.body}
                                        </td>
                                        <td className="question-type">
                                            {getTypeLabel(question.type)}
                                        </td>
                                        <td className="question-options">
                                            {question.options ? JSON.parse(question.options).join(', ') : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

               
                </div>
            </div>
    );
}
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./../App.css";
import "./../styles/ResponsePage.css";

interface Question {
    id: number;
    number: number;
    body: string;
    type: string;
    options?: string[];
    responses: Array<{
        answer: string;
    }>;
}

interface User {
    id: number;
    email: string;
    response_token: string;
    created_at: string;
    updated_at: string;
}

export function ResponsePage() {
    const { token } = useParams<{ token: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            fetch(`http://localhost:8000/api/responses/${token}`, {
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setUser(data.user);

                    // Parse options from JSON strings to arrays if they exist
                    const questionsWithParsedOptions = data.questions.map((question: any) => ({
                        ...question,
                        options: question.options ? JSON.parse(question.options) : null
                    }));

                    setQuestions(questionsWithParsedOptions);
                })
                .catch(error => {
                    console.error('Error fetching responses:', error);
                    setError('Failed to load responses. The link may be invalid or expired.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [token]);

    if (loading) {
        return (
            <div className="w-[375px] mx-auto border p-6" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--secondary)' }}>
                <div className="text-center">
                    <p style={{ color: 'var(--text)' }}>Loading your responses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[375px] mx-auto border p-6" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--secondary)' }}>
                <div className="text-center">
                    <p style={{ color: 'var(--text)', marginBottom: '1rem' }}>Error: {error}</p>
                    <a
                        href="/"
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--background)', padding: '0.5rem 1rem', borderRadius: '0.25rem', display: 'inline-block' }}
                    >
                        Return to Survey
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="response-page-container">
        
            {/* Content */}
            <div className="response-content">
                {/* Title */}
                <div className="response-title">
                    <h2>Survey Responses</h2>
                </div>

                {/* Responses */}
                <div className="response-list">
                    {user && (
                        <div className="response-user-info">
                            <p className="response-user-email">
                                Email: {user.email}
                            </p>
                            <p className="response-date">
                                Submitted on: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {questions.map(question => (
                        <div key={question.id} className="response-item">
                            <p className="response-question">
                                {question.number}. {question.body}
                            </p>
                            <div className="response-answer">
                                <strong>Answer:</strong> {question.responses[0]?.answer || 'No answer provided'}
                            </div>

                            {/* Show options for multiple choice questions */}
                            {question.type === 'A' && question.options && (
                                <div className="response-options">
                                    <p className="response-options-label">
                                        Available options:
                                    </p>
                                    <div className="response-options-list">
                                        {question.options.map((option, index) => (
                                            <span
                                                key={index}
                                                className={`response-option ${question.responses[0]?.answer === option ? 'selected' : ''}`}
                                            >
                                                {option}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="response-footer">
                    <p className="response-token">
                        response token: {token}
                    </p>
                </div>
            </div>
        </div>
    );
}
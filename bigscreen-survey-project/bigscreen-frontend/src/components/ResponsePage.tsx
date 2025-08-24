import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./../App.css";

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
        <div
            className="w-[375px] mx-auto border relative overflow-hidden min-h-screen"
            style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--secondary)'
            }}
        >
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center">
                <a
                    href="/"
                    className="font-medium text-sm hover:underline"
                    style={{ color: 'var(--primary)' }}
                >
                    Take Another Survey
                </a>
            </div>

            {/* Content */}
            <div className="px-6 pt-8 pb-12">
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
                        Your Survey Responses
                    </h2>
                    {user && (
                        <p className="text-center text-sm mt-2" style={{ color: 'var(--text)' }}>
                            Thank you for completing the survey!
                        </p>
                    )}
                </div>

                {/* Responses */}
                <div className="space-y-6">
                    {user && (
                        <div className="text-center mb-8">
                            <p
                                className="text-sm font-medium"
                                style={{ color: 'var(--text)' }}
                            >
                                Email: {user.email}
                            </p>
                            <p
                                className="text-xs mt-1"
                                style={{ color: 'var(--secondary)' }}
                            >
                                Submitted on: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {questions.map(question => (
                        <div key={question.id} className="mb-6 p-4 border rounded-lg" style={{
                            borderColor: 'var(--secondary)',
                            backgroundColor: 'var(--background)'
                        }}>
                            <p
                                className="font-medium mb-2 text-sm"
                                style={{ color: 'var(--text)' }}
                            >
                                {question.number}. {question.body}
                            </p>
                            <div
                                className="text-sm p-2 rounded mt-2"
                                style={{
                                    backgroundColor: 'var(--secondary)',
                                    color: 'var(--background)'
                                }}
                            >
                                <strong>Answer:</strong> {question.responses[0]?.answer || 'No answer provided'}
                            </div>

                            {/* Show options for multiple choice questions */}
                            {question.type === 'A' && question.options && (
                                <div className="mt-3">
                                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text)' }}>
                                        Available options:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {question.options.map((option, index) => (
                                            <span
                                                key={index}
                                                className="text-xs px-2 py-1 rounded"
                                                style={{
                                                    backgroundColor: question.responses[0]?.answer === option
                                                        ? 'var(--primary)'
                                                        : 'var(--secondary)',
                                                    color: 'var(--background)',
                                                    opacity: question.responses[0]?.answer === option ? 1 : 0.6
                                                }}
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
                <div className="text-center mt-12">
                    <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                        Your response token: {token}
                    </p>
                    <a
                        href="/"
                        className="inline-block mt-4 px-6 py-2 rounded-lg text-sm font-medium"
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--background)'
                        }}
                    >
                        Take Another Survey
                    </a>
                </div>
            </div>
        </div>
    );
}
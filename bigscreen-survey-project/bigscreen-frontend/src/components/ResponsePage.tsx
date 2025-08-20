import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function ResponsePage() {
    const { token } = useParams<{ token: string }>();
    const [user, setUser] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch(`/api/responses/${token}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setUser(data.user);
                    setQuestions(data.questions);
                })
                .catch(error => console.error('Error fetching responses:', error));
        }
    }, [token]);

    return (
        <div
            className="w-[375px] h-[812px] mx-auto border relative overflow-hidden"
            style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--secondary)'
            }}
        >
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
                        Your Responses
                    </h2>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {user && (
                        <div>
                            <p
                                className="text-sm font-medium mb-4"
                                style={{ color: 'var(--text)' }}
                            >
                                Email: {user.email}
                            </p>
                            {questions.map(question => (
                                <div key={question.id} className="mb-4 p-4 border rounded-lg" style={{ borderColor: 'var(--secondary)' }}>
                                    <p
                                        className="font-medium mb-2"
                                        style={{ color: 'var(--text)' }}
                                    >
                                        {question.body}
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: 'var(--primary)' }}
                                    >
                                        Answer: {question.responses[0]?.answer || 'No answer'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
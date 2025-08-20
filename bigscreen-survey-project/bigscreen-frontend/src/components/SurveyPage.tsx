import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SurveyPage() {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/survey')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request failed with status code ${response.status}`);
                }
                return response.json();
            })
            .then(data => setQuestions(data))
            .catch(error => console.error('Error fetching questions:', error));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, responses }),
            });
            if (!response.ok) {
                throw new Error(`Request failed with status code ${response.status}`);
            }
            const data = await response.json();
            navigate(`/responses/${data.response_url.split('/').pop()}`);
        } catch (error) {
            console.error('Error submitting survey:', error);
        }
    };

    const handleResponseChange = (questionId: string, answer: string) => {
        setResponses({ ...responses, [questionId]: { answer } });
    };

    return (
        <div
            className="w-[375px] h-[812px] mx-auto border relative overflow-hidden"
            style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--secondary)'
            }}
        >
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center">
                <a
                    href="/admin/login"
                    className="font-medium text-sm hover:underline"
                    style={{ color: 'var(--primary)' }}
                >
                    Survey Admin
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
                        Bigscreen Survey
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2"
                            style={{ color: 'var(--text)' }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--secondary)',
                                color: 'var(--text)',
                                '--tw-ring-color': 'var(--primary)',
                            } as React.CSSProperties}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {questions.map((question: any) => (
                        <div key={question.id}>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: 'var(--text)' }}
                            >
                                {question.body}
                            </label>
                            {question.type === 'A' ? (
                                <select
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors"
                                    style={{
                                        backgroundColor: 'var(--background)',
                                        borderColor: 'var(--secondary)',
                                        color: 'var(--text)',
                                        '--tw-ring-color': 'var(--primary)',
                                    } as React.CSSProperties}
                                    required
                                >
                                    <option value="">Select an option</option>
                                    {question.options.map((option: string) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={question.type === 'B' ? 'text' : 'number'}
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors"
                                    style={{
                                        backgroundColor: 'var(--background)',
                                        borderColor: 'var(--secondary)',
                                        color: 'var(--text)',
                                        '--tw-ring-color': 'var(--primary)',
                                    } as React.CSSProperties}
                                    required
                                />
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full font-medium py-3 px-4 rounded-lg transition-colors hover:opacity-90"
                        style={{
                            backgroundColor: 'var(--secondary)',
                            color: 'var(--background)',
                        }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
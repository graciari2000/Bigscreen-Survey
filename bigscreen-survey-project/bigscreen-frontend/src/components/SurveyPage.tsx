import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../styles/SurveyPage.css";
import "./../App.css";

interface Question {
    id: string;
    body: string;
    type: 'A' | 'B' | 'C';
    options?: string[];
    number: number;
}

export function SurveyPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [responses, setResponses] = useState<Record<string, { answer: string }>>({});
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://localhost:8000/api/survey', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Received data:', data);

                // Parse options from JSON strings to arrays
                const questionsWithParsedOptions = data.map((question: any) => ({
                    ...question,
                    options: question.options ? JSON.parse(question.options) : null
                }));

                setQuestions(questionsWithParsedOptions);

            } catch (error: any) {
                console.error('Error fetching questions:', error);
                setError(error.message || 'Failed to load questions');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Prepare the data in the format the backend expects
            const formattedResponses = Object.entries(responses).reduce((acc, [questionId, response]) => {
                acc[questionId] = response;
                return acc;
            }, {} as Record<string, { answer: string }>);

            const payload = {
                email,
                responses: formattedResponses
            };

            console.log('Submitting payload:', payload);

            const response = await fetch('http://localhost:8000/api/survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Request failed with status code ${response.status}`);
            }

            const data = await response.json();
            console.log('Submission successful:', data);

            if (data.response_url) {
                navigate(`/responses/${data.response_url.split('/').pop()}`);
            } else {
                navigate('/thank-you'); // Fallback redirect
            }

        } catch (error: any) {
            console.error('Error submitting survey:', error);
            setError('Failed to submit survey. Please try again.');
        }
    };

    const handleResponseChange = (questionId: string, answer: string) => {
        setResponses(prev => ({ ...prev, [questionId]: { answer } }));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    if (loading) {
        return (
            <div className="w-[375px] mx-auto border p-6" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--secondary)' }}>
                <div className="text-center">
                    <p style={{ color: 'var(--text)' }}>Loading questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[375px] mx-auto border p-6" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--secondary)' }}>
                <div className="text-center">
                    <p style={{ color: 'var(--text)' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='survey-container'>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label
                            className="question"
                            style={{ color: 'var(--text)' }}
                        >
                            Your email address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    {/* Survey Questions */}
                    {questions.map((question: Question) => (
                        <div key={question.id}>
                            <label
                                className="question"
                                style={{ color: 'var(--text)' }}
                            >
                                {question.number}. {question.body}
                            </label>

                            {question.type === 'A' && question.options ? (
                                <select
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    required
                                >
                                    <option value="">Select an option</option>
                                    {question.options.map((option: string) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : question.type === 'B' ? (
                                <input
                                    type="text"
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    required
                                />
                            ) : question.type === 'C' ? (
                                <select
                                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    required
                                >
                                    <option value="">Select a rating</option>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating}
                                        </option>
                                    ))}
                                </select>
                            ) : null}
                        </div>
                    ))}

                    <button
                        type="submit">
                        Submit Survey
                    </button>
                </form>
                </div>
    );
}
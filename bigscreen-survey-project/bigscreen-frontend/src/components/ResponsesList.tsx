// ResponsesList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./../styles/ResponsePage.css";

interface ResponseSummary {
    id: number;
    user_id: number;
    question_id: number;
    answer: string;
    created_at: string;
    updated_at: string;
    user?: {
        email: string;
        response_token: string;
    };
    question?: {
        number: number;
        body: string;
    };
}

interface GroupedResponses {
    [key: string]: {
        email: string;
        userId: number;
        token: string;
        responses: ResponseSummary[];
    };
}

export function ResponsesList() {
    const [responses, setResponses] = useState<ResponseSummary[]>([]);
    const [groupedResponses, setGroupedResponses] = useState<GroupedResponses>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchResponses();
    }, []);

    useEffect(() => {
        // Group responses by user when responses change and sort by question number
        if (responses.length > 0) {
            const grouped = responses.reduce((acc: GroupedResponses, response) => {
                const userId = response.user_id.toString();
                const userEmail = response.user?.email || `User ${userId}`;
                const userToken = response.user?.response_token || '';

                if (!acc[userId]) {
                    acc[userId] = {
                        email: userEmail,
                        userId: response.user_id,
                        token: userToken,
                        responses: []
                    };
                }

                acc[userId].responses.push(response);
                return acc;
            }, {});

            // Sort responses within each user group by question number (1-20)
            Object.keys(grouped).forEach(userId => {
                grouped[userId].responses.sort((a, b) => {
                    const aNumber = a.question?.number || a.question_id;
                    const bNumber = b.question?.number || b.question_id;
                    return aNumber - bNumber;
                });
            });

            setGroupedResponses(grouped);
        }
    }, [responses]);

    const fetchResponses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                setError('Admin authentication required. Please login first.');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8000/api/responses', {
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
            setResponses(data);
        } catch (error: any) {
            console.error('Error fetching responses:', error);
            setError('Failed to load responses. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="response-page-container">
                <div className="response-content">
                    <div className="response-loading">
                        <p>Loading responses...</p>
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
                        <button onClick={fetchResponses} className="response-error-button">
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
                    <h2>All Survey Responses</h2>
                </div>

                {Object.keys(groupedResponses).length === 0 ? (
                    <div className="no-responses">
                        <p>No responses found in the database.</p>
                    </div>
                ) : (
                    <div className="user-responses-container">
                        {Object.values(groupedResponses).map((userGroup) => (
                            <div key={userGroup.userId} className="user-response-group">
                                <div className="user-group-header">
                                    <h3 className="user-email">{userGroup.email}</h3>
                                </div>

                                <div className="response-table-container">
                                    <table className="response-table">
                                        <thead>
                                            <tr>
                                                <th>Question number</th>
                                                <th>Question</th>
                                                <th>Answer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userGroup.responses.map((response) => (
                                                <tr key={response.id}>
                                                    <td className="question-number">
                                                        {response.question?.number || response.question_id}
                                                    </td>
                                                    <td className="question-body">
                                                        {response.question?.body || `Question ${response.question_id}`}
                                                    </td>
                                                    <td className="question-answer">
                                                        {response.answer}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                
            </div>
        </div>
    );
}
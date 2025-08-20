import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadarController, PointElement, LinearScale } from 'chart.js';
import "./../hooks/useTheme.ts";

ChartJS.register(ArcElement, Tooltip, Legend, RadarController, PointElement, LinearScale);

export function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState<any>(null);

    fetch('/api/admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    response.status === 401
                        ? 'Unauthorized: Invalid or expired token'
                        : `Failed to fetch dashboard data: ${response.status}`
                );
            }
            return response.json();
        })
        .then(data => {
            setDashboardData(data);
            setIsLoading(false);
        })
        .catch(error => {
            setError(error.message || 'An error occurred while fetching dashboard data');
            console.error('Error fetching dashboard:', error);
            setIsLoading(false);
        });

    return (
        <div
            className="min-h-screen p-6"
            style={{ backgroundColor: 'var(--background)' }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: 'var(--text)' }}
                    >
                        Admin Dashboard
                    </h1>
                    <div className="text-center mb-4">
                        <h2
                            className="font-bold text-xl font-sans tracking-tight"
                            style={{ color: 'var(--primary)' }}
                        >
                            bigscreen
                        </h2>
                    </div>
                </div>

                {/* Dashboard Content */}
                {dashboardData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div
                            className="p-6 rounded-lg border"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--secondary)'
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: 'var(--text)' }}
                            >
                                VR Headset Used
                            </h3>
                            <canvas id="headsetChart" className="w-full h-64"></canvas>
                        </div>

                        <div
                            className="p-6 rounded-lg border"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--secondary)'
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: 'var(--text)' }}
                            >
                                VR Content Store
                            </h3>
                            <canvas id="storeChart" className="w-full h-64"></canvas>
                        </div>

                        <div
                            className="p-6 rounded-lg border"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--secondary)'
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: 'var(--text)' }}
                            >
                                Primary Use
                            </h3>
                            <canvas id="usageChart" className="w-full h-64"></canvas>
                        </div>

                        <div
                            className="p-6 rounded-lg border"
                            style={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--secondary)'
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: 'var(--text)' }}
                            >
                                Quality Ratings
                            </h3>
                            <canvas id="qualityChart" className="w-full h-64"></canvas>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p
                            className="text-lg"
                            style={{ color: 'var(--text)' }}
                        >
                            Loading dashboard data...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
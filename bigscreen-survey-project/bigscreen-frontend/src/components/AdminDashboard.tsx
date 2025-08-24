import React, { useState, useEffect, useRef } from 'react';
import "./../App.css";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    RadarController,
    PointElement,
    LinearScale,
    RadialLinearScale,
    PieController,
    LineElement,
    ChartTypeRegistry
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    RadarController,
    PointElement,
    LineElement,
    LinearScale,
    RadialLinearScale,
    PieController
);

// Define proper types for your data
interface DashboardData {
    headsetData: Record<string, number>;
    storeData: Record<string, number>;
    usageData: Record<string, number>;
    qualityData: Record<string, number>;
}

export function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const headsetChartRef = useRef<ChartJS | null>(null);
    const storeChartRef = useRef<ChartJS | null>(null);
    const usageChartRef = useRef<ChartJS | null>(null);
    const qualityChartRef = useRef<ChartJS | null>(null);

    const headsetCanvasRef = useRef<HTMLCanvasElement>(null);
    const storeCanvasRef = useRef<HTMLCanvasElement>(null);
    const usageCanvasRef = useRef<HTMLCanvasElement>(null);
    const qualityCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');

        if (!token) {
            setError('No authentication token found. Please login again.');
            setIsLoading(false);
            navigate('/admin/login');
            return;
        }

        fetch('http://localhost:8000/api/admin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('adminToken');
                        navigate('/admin/login');
                        throw new Error('Session expired. Please login again.');
                    }
                    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setDashboardData(data);
            })
            .catch(error => {
                setError(error.message || 'An error occurred while fetching dashboard data');
                console.error('Error fetching dashboard:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

    useEffect(() => {
        if (!dashboardData) return;

        // Clean up previous charts
        const destroyCharts = () => {
            [headsetChartRef, storeChartRef, usageChartRef, qualityChartRef].forEach(ref => {
                if (ref.current) {
                    ref.current.destroy();
                    ref.current = null;
                }
            });
        };

        destroyCharts();

        // Create charts when data and canvas elements are available
        const createCharts = () => {
            // VR Headset Used Chart
            if (headsetCanvasRef.current && dashboardData.headsetData) {
                const ctx = headsetCanvasRef.current.getContext('2d');
                if (ctx) {
                    headsetChartRef.current = new ChartJS(ctx, {
                        type: 'pie',
                        data: {
                            labels: Object.keys(dashboardData.headsetData),
                            datasets: [{
                                data: Object.values(dashboardData.headsetData),
                                backgroundColor: ['#FF6F61', '#6B7280', '#10B981', '#FBBF24', '#3B82F6', '#8B5CF6'],
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'VR Headset Distribution'
                                }
                            }
                        }
                    });
                }
            }

            // VR Content Store Chart
            if (storeCanvasRef.current && dashboardData.storeData) {
                const ctx = storeCanvasRef.current.getContext('2d');
                if (ctx) {
                    storeChartRef.current = new ChartJS(ctx, {
                        type: 'pie',
                        data: {
                            labels: Object.keys(dashboardData.storeData),
                            datasets: [{
                                data: Object.values(dashboardData.storeData),
                                backgroundColor: ['#10B981', '#FBBF24', '#3B82F6', '#EF4444', '#8B5CF6'],
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'VR Content Store Usage'
                                }
                            }
                        }
                    });
                }
            }

            // Primary Use Chart
            if (usageCanvasRef.current && dashboardData.usageData) {
                const ctx = usageCanvasRef.current.getContext('2d');
                if (ctx) {
                    usageChartRef.current = new ChartJS(ctx, {
                        type: 'pie',
                        data: {
                            labels: Object.keys(dashboardData.usageData),
                            datasets: [{
                                data: Object.values(dashboardData.usageData),
                                backgroundColor: ['#3B82F6', '#10B981', '#FBBF24', '#EF4444', '#8B5CF6'],
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Primary Use Cases'
                                }
                            }
                        }
                    });
                }
            }

            // Quality Ratings Radar Chart
            if (qualityCanvasRef.current && dashboardData.qualityData) {
                const ctx = qualityCanvasRef.current.getContext('2d');
                if (ctx) {
                    qualityChartRef.current = new ChartJS(ctx, {
                        type: 'radar',
                        data: {
                            labels: Object.keys(dashboardData.qualityData),
                            datasets: [{
                                label: 'Average Rating',
                                data: Object.values(dashboardData.qualityData),
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                borderColor: '#3B82F6',
                                pointBackgroundColor: '#3B82F6',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: '#3B82F6'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                    beginAtZero: true,
                                    max: 5,
                                    ticks: {
                                        stepSize: 1
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Quality Ratings'
                                }
                            }
                        }
                    });
                }
            }
        };

        // Small timeout to ensure DOM is fully rendered
        setTimeout(createCharts, 100);

        // Cleanup function to destroy charts
        return destroyCharts;
    }, [dashboardData]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-700">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-red-500 mb-4 text-lg">{error}</p>
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-lg shadow">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Admin Dashboard
                        </h1>
                        <div className="text-center">
                            <h2 className="font-bold text-xl text-blue-600">
                                bigscreen
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Dashboard Content */}
                {dashboardData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* VR Headset Used */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                VR Headset Used
                            </h3>
                            <div className="h-64">
                                <canvas ref={headsetCanvasRef} className="w-full h-full"></canvas>
                            </div>
                        </div>

                        {/* VR Content Store */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                VR Content Store
                            </h3>
                            <div className="h-64">
                                <canvas ref={storeCanvasRef} className="w-full h-full"></canvas>
                            </div>
                        </div>

                        {/* Primary Use */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Primary Use
                            </h3>
                            <div className="h-64">
                                <canvas ref={usageCanvasRef} className="w-full h-full"></canvas>
                            </div>
                        </div>

                        {/* Quality Ratings */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Quality Ratings
                            </h3>
                            <div className="h-64">
                                <canvas ref={qualityCanvasRef} className="w-full h-full"></canvas>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-lg text-gray-600">
                            No dashboard data available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
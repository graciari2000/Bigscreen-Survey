import React, { useState, useEffect, useRef } from 'react';
import "./../App.css";
import "./../styles/AdminDashboard.css";
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

        fetch(`${process.env.REACT_APP_API_URL}/api/admin`, {
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

    

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button
                    onClick={() => navigate('/admin/login')}
                    className="retry-button"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <div className="dashboard-grid">

                {/* Dashboard Content */}
                {dashboardData ? (
                    <div>
                        {/* VR Headset Used */}
                        <div className="dashboard-card">
                            <h3>VR Headset Used</h3>
                            <div className="chart-container">
                                <canvas ref={headsetCanvasRef}></canvas>
                            </div>
                        </div>

                        {/* VR Content Store */}
                        <div className="dashboard-card">
                            <h3>VR Content Store</h3>
                            <div className="chart-container">
                                <canvas ref={storeCanvasRef}></canvas>
                            </div>
                        </div>

                        {/* Primary Use */}
                        <div className="dashboard-card">
                            <h3>Primary Use</h3>
                            <div className="chart-container">
                                <canvas ref={usageCanvasRef}></canvas>
                            </div>
                        </div>

                        {/* Quality Ratings */}
                        <div className="dashboard-card">
                            <h3>Quality Ratings</h3>
                            <div className="chart-container">
                                <canvas ref={qualityCanvasRef}></canvas>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="dashboard-card">
                        <p>No dashboard data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
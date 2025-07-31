const { useState, useEffect } = React;
const { BrowserRouter, Routes, Route, Link, useNavigate, useParams } = ReactRouterDOM;

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SurveyPage />} />
                <Route path="/responses/:token" element={<ResponsePage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

const SurveyPage = () => {
    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState({ email: '', responses: {} });
    const [message, setMessage] = useState('');
    const [responseUrl, setResponseUrl] = useState('');

    useEffect(() => {
        axios.get('/api/survey').then(response => {
            setQuestions(response.data);
            const initialResponses = response.data.reduce((acc, q) => ({
                ...acc,
                [q.id]: { answer: '' }
            }), {});
            setFormData({ ...formData, responses: initialResponses });
        });
    }, []);

    const handleInputChange = (e, questionId) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setFormData({ ...formData, email: value });
        } else {
            setFormData({
                ...formData,
                responses: { ...formData.responses, [questionId]: { answer: value } }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/survey', formData)
            .then(response => {
                setMessage(response.data.message);
                setResponseUrl(response.data.response_url);
            })
            .catch(error => {
                setMessage('Error submitting survey');
            });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bigscreen Survey</h1>
            {message ? (
                <div className="bg-green-100 p-4 rounded">
                    <p>{message}</p>
                    {responseUrl && (
                        <p>View your responses: <a href={responseUrl} className="text-blue-500">{responseUrl}</a></p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Question 1/20: Your email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange(e)}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    {questions.map((question, index) => (
                        <div key={question.id} className="border border-dashed p-4">
                            <label className="block font-medium">Question {index + 1}/20: {question.body}</label>
                            {question.type === 'A' ? (
                                <select
                                    name={`responses[${question.id}][answer]`}
                                    value={formData.responses[question.id]?.answer || ''}
                                    onChange={(e) => handleInputChange(e, question.id)}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Select an option</option>
                                    {question.options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : question.type === 'B' ? (
                                <input
                                    type="text"
                                    name={`responses[${question.id}][answer]`}
                                    value={formData.responses[question.id]?.answer || ''}
                                    onChange={(e) => handleInputChange(e, question.id)}
                                    className="border rounded p-2 w-full"
                                    maxLength="255"
                                    required
                                />
                            ) : (
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <label key={num}>
                                            <input
                                                type="radio"
                                                name={`responses[${question.id}][answer]`}
                                                value={num}
                                                checked={formData.responses[question.id]?.answer == num}
                                                onChange={(e) => handleInputChange(e, question.id)}
                                                required
                                            />
                                            {num}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Finalize</button>
                </div>
            )}
        </div>
    );
};

const ResponsePage = () => {
    const { token } = useParams();
    const [data, setData] = useState({ user: null, questions: [] });

    useEffect(() => {
        axios.get(`/api/responses/${token}`).then(response => {
            setData(response.data);
        });
    }, [token]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Survey Responses</h1>
            <p>Email: {data.user?.email}</p>
            <div className="space-y-4">
                {data.questions.map((question, index) => (
                    <div key={question.id} className="border border-dashed p-4">
                        <p className="font-medium">Question {index + 1}/20: {question.body}</p>
                        <p>Answer: {question.responses[0]?.answer || 'No response'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('/api/admin/login', credentials)
            .then(response => {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/admin');
            })
            .catch(() => alert('Invalid credentials'));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
            <div className="space-y-4 max-w-md">
                <div>
                    <label className="block font-medium">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login</button>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('dashboard');
    const [data, setData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        axios.get(`/api/admin${activePage === 'dashboard' ? '' : '/' + activePage}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setData(response.data);
        }).catch(() => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
        });
    }, [activePage, navigate]);

    const handleLogout = () => {
        const token = localStorage.getItem('adminToken');
        axios.post('/api/admin/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
        });
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-gray-800 text-white p-4">
                <img src="https://via.placeholder.com/150x50?text=Bigscreen+Logo" alt="Bigscreen Logo" className="mb-4" />
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <button onClick={() => setActivePage('dashboard')} className="block w-full text-left py-2 hover:bg-gray-700">Dashboard</button>
                        </li>
                        <li>
                            <button onClick={() => setActivePage('questions')} className="block w-full text-left py-2 hover:bg-gray-700">Questions</button>
                        </li>
                        <li>
                            <button onClick={() => setActivePage('responses')} className="block w-full text-left py-2 hover:bg-gray-700">Responses</button>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="block w-full text-left py-2 hover:bg-gray-700">Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {activePage === 'dashboard' && <Dashboard data={data} />}
                {activePage === 'questions' && <Questions data={data} />}
                {activePage === 'responses' && <Responses data={data} />}
            </div>
        </div>
    );
};

const Dashboard = ({ data }) => {
    useEffect(() => {
        if (data.headsetData) {
            new Chart(document.getElementById('headsetChart'), {
                type: 'pie',
                data: {
                    labels: ['Oculus Quest', 'Oculus Rift/s', 'HTC Vive', 'Windows Mixed Reality', 'Valve Index'],
                    datasets: [{
                        label: 'VR Headset Used',
                        data: Object.values(data.headsetData || {}),
                        backgroundColor: ['#FF6F61', '#6B7280', '#10B981', '#FBBF24', '#3B82F6'],
                        borderColor: ['#1F2937', '#1F2937', '#1F2937', '#1F2937', '#1F2937'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'VR Headset Used' }
                    }
                }
            });

            new Chart(document.getElementById('storeChart'), {
                type: 'pie',
                data: {
                    labels: ['SteamVR', 'Oculus Store', 'Viveport', 'Windows Store'],
                    datasets: [{
                        label: 'VR Content Store',
                        data: Object.values(data.storeData || {}),
                        backgroundColor: ['#10B981', '#FBBF24', '#3B82F6', '#EF4444'],
                        borderColor: ['#1F2937', '#1F2937', '#1F2937', '#1F2937'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'VR Content Store' }
                    }
                }
            });

            new Chart(document.getElementById('usageChart'), {
                type: 'pie',
                data: {
                    labels: ['Watching TV live', 'Watching movies', 'Working', 'Solo gaming', 'Team gaming'],
                    datasets: [{
                        label: 'Primary Use',
                        data: Object.values(data.usageData || {}),
                        backgroundColor: ['#3B82F6', '#10B981', '#FBBF24', '#EF4444', '#8B5CF6'],
                        borderColor: ['#1F2937', '#1F2937', '#1F2937', '#1F2937', '#1F2937'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Primary Use of Bigscreen' }
                    }
                }
            });

            new Chart(document.getElementById('qualityChart'), {
                type: 'radar',
                data: {
                    labels: ['Image Quality', 'Interface Comfort', 'Network Connection', '3D Graphics', 'Audio Quality'],
                    datasets: [{
                        label: 'Quality Ratings',
                        data: Object.values(data.qualityData || {}),
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: '#3B82F6',
                        pointBackgroundColor: '#3B82F6',
                        pointBorderColor: '#1F2937'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Quality Ratings (1–5)' }
                    },
                    scales: {
                        r: { min: 0, max: 5, ticks: { stepSize: 1 } }
                    }
                }
            });
        }
    }, [data]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl font-semibold">VR Headset Used</h2>
                    <canvas id="headsetChart"></canvas>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">VR Content Store</h2>
                    <canvas id="storeChart"></canvas>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Primary Use of Bigscreen</h2>
                    <canvas id="usageChart"></canvas>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Quality Ratings</h2>
                    <canvas id="qualityChart"></canvas>
                </div>
            </div>
        </div>
    );
};

const Questions = ({ data }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Questions</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Number</th>
                        <th className="border p-2">Question</th>
                        <th className="border p-2">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(question => (
                        <tr key={question.id}>
                            <td className="border p-2">{question.number}</td>
                            <td className="border p-2">{question.body}</td>
                            <td className="border p-2">{question.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Responses = ({ data }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Responses</h1>
            {data.map(user => (
                <div key={user.id} className="mb-4">
                    <h2 className="text-xl font-semibold">User: {user.email}</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Number</th>
                                <th className="border p-2">Question</th>
                                <th className="border p-2">Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.responses.map(response => (
                                <tr key={response.id}>
                                    <td className="border p-2">{response.question.number}</td>
                                    <td className="border p-2">{response.question.body}</td>
                                    <td className="border p-2">{response.answer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
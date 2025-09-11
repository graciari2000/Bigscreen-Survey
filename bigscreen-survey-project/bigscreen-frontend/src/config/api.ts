// src/config/api.ts
export const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL ||
        (process.env.REACT_APP_ENV === 'production'
            ? 'https://bigscreen-survey.com'  // production API URL
            : 'http://localhost:8000'),       // local API URL
    isProduction: process.env.REACT_APP_ENV === 'production',
};
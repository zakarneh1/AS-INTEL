import axios from 'axios';

const FALLBACK_BACKEND_URL = 'https://as-intel.onrender.com';
const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000';

const getDefaultBackendUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `${LOCAL_BACKEND_URL}/api`;
        }
    }

    return `${FALLBACK_BACKEND_URL}/api`;
};

const normalizeBackendUrl = (url) => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `${LOCAL_BACKEND_URL}/api`;
        }
    }

    if (!url || typeof url !== 'string') {
        return getDefaultBackendUrl();
    }

    const trimmed = url.trim().replace(/\/+$/, '');
    if (!trimmed || trimmed.toLowerCase() === 'undefined') {
        return getDefaultBackendUrl();
    }

    return trimmed.toLowerCase().endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const configuredUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

export const API_BASE = normalizeBackendUrl(configuredUrl);

export const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
});

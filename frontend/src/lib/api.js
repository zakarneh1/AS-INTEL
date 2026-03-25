import axios from 'axios';

const FALLBACK_BACKEND_URL = 'https://as-intel.onrender.com';

const normalizeBackendUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return `${FALLBACK_BACKEND_URL}/api`;
    }

    const trimmed = url.trim().replace(/\/+$/, '');
    if (!trimmed || trimmed.toLowerCase() === 'undefined') {
        return `${FALLBACK_BACKEND_URL}/api`;
    }

    return trimmed.toLowerCase().endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const configuredUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

export const API_BASE = normalizeBackendUrl(configuredUrl);

export const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
});

const API_BASE = 'http://localhost:8080/api';

function getToken() {
    return localStorage.getItem('token');
}

function getHeaders(withAuth = false) {
    const headers = {
        'Content-Type': 'application/json'
    };
    if (withAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] =
                'Bearer ' + token;
        }
    }
    return headers;
}

async function apiCall(endpoint, method = 'GET',
        body = null, withAuth = false) {
    try {
        const options = {
            method,
            headers: getHeaders(withAuth)
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(
            API_BASE + endpoint, options);

        if (response.status === 401 ||
                response.status === 403) {
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }

        const text = await response.text();
        if (!text) return {};

        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(
                data.message ||
                'Something went wrong');
        }
        return data;
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error(
                'Cannot connect to server. ' +
                'Make sure Spring Boot is running!');
        }
        throw error;
    }
}
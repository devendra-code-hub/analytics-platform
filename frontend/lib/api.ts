import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const getSummary = async () => {
    const response = await api.get('/stats/summary');
    return response.data;
};

export const getEvents = async () => {
    const response = await api.get('/stats/events');
    return response.data;
};

export const getFunnel = async (steps: string[]) => {
    const response = await api.get(`/stats/funnel?steps=${steps.join(',')}`);
    return response.data;
};

export const getChartData = async () => {
    const response = await api.get('/stats/chart');
    return response.data;
};

export default api;

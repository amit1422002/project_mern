const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

export const fetchTasks = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};

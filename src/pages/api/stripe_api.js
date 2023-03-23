import axios from 'axios';

export const createStripeCustomer = async (email, uid) => {
    try {
        const response = await axios.post('/api/create_customer', {
        email,
        uid,
        });
        return response.data.customerId;
    } catch (error) {
        console.error('Error creating Stripe customer:', error);
        throw error;
    }
    };

    export const getSessionDetails = async (session_id) => {
    try {
        const response = await fetch(`/api/checkout_sessions/${session_id}`, { method: 'GET' });
        return await response.json();
    } catch (error) {
        console.error('Error fetching session details:', error);
        throw error;
    }
};

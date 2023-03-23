// pages/api/checkout_sessions/[sessionId].js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
if (req.method === 'GET') {
    try {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
    });

    res.status(200).json(session);
    } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
    }
} else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
}
}
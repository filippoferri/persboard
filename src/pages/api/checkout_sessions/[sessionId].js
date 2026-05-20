// pages/api/checkout_sessions/[sessionId].js
import { requireFirebaseUser } from '../../../lib/apiAuth';
import { getStripeServer } from '../../../lib/stripeServer';

export default async function handler(req, res) {
if (req.method === 'GET') {
    try {
    const authUser = await requireFirebaseUser(req);
    const stripe = getStripeServer();
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
    });

    if (session.metadata?.uid !== authUser.uid && session.client_reference_id !== authUser.uid) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

    res.status(200).json(session);
    } catch (err) {
    res.status(err.statusCode || 500).json({ statusCode: err.statusCode || 500, message: err.message });
    }
} else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
}
}

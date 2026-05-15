import Stripe from 'stripe';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { requireFirebaseUser } from '../../lib/apiAuth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    try {
        const authUser = await requireFirebaseUser(req);
        const db = getAdminDb();
        const userRef = db.collection('users').doc(authUser.uid);
        const userSnap = await userRef.get();
        const existingCustomerId = userSnap.data()?.stripeCustomerId;

        if (existingCustomerId) {
            res.status(200).json({ customerId: existingCustomerId });
            return;
        }

        // Create a Stripe customer
        const customer = await stripe.customers.create({
            email: authUser.email,
            metadata: {
                uid: authUser.uid,
            },
        });

        // Save the customer ID to Firestore
        await userRef.set({
            stripeCustomerId: customer.id,
        }, { merge: true });

        res.status(200).json({ customerId: customer.id });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: 'Error creating customer' });
    }
}

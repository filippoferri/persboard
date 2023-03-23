import Stripe from 'stripe';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import { FIREBASE_API } from '../../config-global';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const { email, uid } = req.body;

    try {
        // Create a Stripe customer
        const customer = await stripe.customers.create({
            email,
        });

        // Initialize Firebase app
        const app = initializeApp(FIREBASE_API);
        const db = getFirestore(app);

        // Save the customer ID to Firestore
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, { 
            stripeCustomerId: customer.id,
            tier: 'paid',
            lastPayment: Timestamp.fromDate(new Date()),
        }, { merge: true });

        res.status(200).json({ customerId: customer.id });
    } catch (error) {
        res.status(500).json({ error: 'Error creating customer' });
    }
}

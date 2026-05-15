import Stripe from 'stripe';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { requireFirebaseUser } from '../../lib/apiAuth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const authUser = await requireFirebaseUser(req);
    const userSnap = await getAdminDb().collection('users').doc(authUser.uid).get();
    const customerId = userSnap.data()?.stripeCustomerId;

    if (!customerId) {
      res.status(200).json({ data: [] });
      return;
    }

    const paymentList = await stripe.charges.list({
      customer: customerId,
      limit: 5, // You can change the limit as needed
    });

    res.status(200).json(paymentList);

  } catch (error) {
    res.status(error.statusCode || 500).json({ error: 'Error fetching payment data' });
  }
}

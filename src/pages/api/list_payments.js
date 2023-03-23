import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // You need to provide the customer ID that you saved during the customer's creation in Stripe
  const { customerId } = req.query;

  try {
    const paymentList = await stripe.charges.list({
      customer: customerId,
      limit: 5, // You can change the limit as needed
    });

    res.status(200).json(paymentList);

  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment data' });
  }
}
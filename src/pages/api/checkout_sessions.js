import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { quantity, price } = req.body;

      console.log('quantity', quantity);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        allow_promotion_codes: true,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Buy ${quantity} Credits`,
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {
          credits: quantity.toString(), // Store the number of credits in the metadata
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_HOST_API_KEY}/dashboard/billing/success/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_HOST_API_KEY}/dashboard/billing/cancel/`,
      });
      
      
      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

// utils
import getStripe from '../../utils/getStripe';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await getStripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            default_price: 'price_1Mk2KSIvN6LsMTsI4faUPn9o',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://example.com/success`,
        cancel_url: `https://example.com/success`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

// can you help how to create a checkout session in nextjs with stripe?


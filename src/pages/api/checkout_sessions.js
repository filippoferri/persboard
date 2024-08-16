import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { quantity, price, promotionCode } = req.body;

      const sessionParams = {
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
      };

      // Automatically apply a promotion code if provided
      if (promotionCode) {
        const promotionCodeData = await stripe.promotionCodes.list({
          code: promotionCode,
          active: true,
        });

        if (promotionCodeData.data.length > 0) {
          sessionParams.discounts = [{
            promotion_code: promotionCodeData.data[0].id,
          }];
        }
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

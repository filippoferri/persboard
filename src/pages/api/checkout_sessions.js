import Stripe from 'stripe';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { requireFirebaseUser } from '../../lib/apiAuth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const CREDIT_PACKAGES = {
  50: 1499,
  100: 2499,
  500: 9999,
  1000: 14999,
};

const getAppUrl = () => process.env.APP_URL || 'http://localhost:3034';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const authUser = await requireFirebaseUser(req);
      const { quantity, promotionCode } = req.body;
      const credits = Number(quantity);
      const unitAmount = CREDIT_PACKAGES[credits];

      if (!unitAmount) {
        res.status(400).json({ message: 'Invalid credit package' });
        return;
      }

      const db = getAdminDb();
      const userSnap = await db.collection('users').doc(authUser.uid).get();
      const stripeCustomerId = userSnap.data()?.stripeCustomerId;

      const sessionParams = {
        payment_method_types: ['card'],
        allow_promotion_codes: true,
        ...(stripeCustomerId ? { customer: stripeCustomerId } : { customer_email: authUser.email }),
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Buy ${credits} Credits`,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        client_reference_id: authUser.uid,
        metadata: {
          uid: authUser.uid,
          credits: credits.toString(),
        },
        mode: 'payment',
        success_url: `${getAppUrl()}/dashboard/billing/success/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getAppUrl()}/dashboard/billing/cancel/`,
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
      res.status(err.statusCode || 500).json({ statusCode: err.statusCode || 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

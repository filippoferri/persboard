import { FieldValue, getAdminDb } from '../../../lib/firebaseAdmin';
import { getRequiredServerEnv } from '../../../lib/serverEnv';
import { getStripeServer } from '../../../lib/stripeServer';

export const config = {
  api: {
    bodyParser: false,
  },
};

const readBuffer = (req) => new Promise((resolve, reject) => {
  const chunks = [];

  req.on('data', (chunk) => {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  });

  req.on('end', () => {
    resolve(Buffer.concat(chunks));
  });

  req.on('error', reject);
});

const handleCheckoutCompleted = async (session) => {
  const uid = session.metadata?.uid || session.client_reference_id;
  const credits = Number(session.metadata?.credits || 0);

  if (!uid || !Number.isInteger(credits) || credits <= 0) {
    throw new Error('Invalid checkout session metadata');
  }

  const db = getAdminDb();
  const userRef = db.collection('users').doc(uid);
  const eventRef = userRef.collection('stripeEvents').doc(session.id);

  await db.runTransaction(async (transaction) => {
    const eventSnap = await transaction.get(eventRef);

    if (eventSnap.exists) {
      return;
    }

    transaction.set(eventRef, {
      type: 'checkout.session.completed',
      credits,
      sessionId: session.id,
      createdAt: FieldValue.serverTimestamp(),
    });

    transaction.set(userRef, {
      credits: FieldValue.increment(credits),
      stripeCustomerId: session.customer,
      tier: 'paid',
      lastPayment: FieldValue.serverTimestamp(),
    }, { merge: true });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const signature = req.headers['stripe-signature'];

  let event;

  try {
    const rawBody = await readBuffer(req);
    const stripe = getStripeServer();
    const webhookSecret = getRequiredServerEnv('STRIPE_WEBHOOK_SECRET');

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    const message = statusCode === 400 ? `Webhook Error: ${error.message}` : error.message;

    res.status(statusCode).json({ message });
    return;
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Webhook handler failed' });
  }
}

import Stripe from 'stripe';
import { getRequiredServerEnv } from './serverEnv';

let stripeClient;

export const getStripeServer = () => {
  if (!stripeClient) {
    stripeClient = new Stripe(getRequiredServerEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  return stripeClient;
};

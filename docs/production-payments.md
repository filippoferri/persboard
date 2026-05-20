# Production Environment And Stripe Payments

This app expects payment fulfillment to happen from the Stripe webhook, not from the browser success page.

## Required Vercel Environment Variables

Set these for Production. For parity, set the same names for Preview and Development with test values.

In Vercel Project Settings, set Node.js Version to `20.x`. The repository uses `package-lock.json`, so deployments should install with `npm install` and build with `npm run build`.

| Name | Visibility | Notes |
| --- | --- | --- |
| `APP_URL` | Server | Public app URL, for Stripe success and cancel redirects. Current production alias: `https://my.personalboard.ai`. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | Firebase web app config. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Firebase web app config. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client | Firebase web app config. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Firebase web app config. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | Firebase web app config. |
| `NEXT_PUBLIC_FIREBASE_APPID` | Client | Firebase web app config. |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Client | Firebase web app config, optional for analytics but keep it set if Firebase provides it. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe publishable key. Must start with `pk_`. |
| `OPENAI_API_KEY` | Server | OpenAI API key. Do not prefix with `NEXT_PUBLIC_`. |
| `OPENAI_MODEL` | Server | Optional. Defaults to `gpt-4o-mini`. |
| `STRIPE_SECRET_KEY` | Server | Stripe secret key. Must start with `sk_`. Do not prefix with `NEXT_PUBLIC_`. |
| `STRIPE_WEBHOOK_SECRET` | Server | Stripe endpoint signing secret. Must start with `whsec_`. |
| `FIREBASE_PROJECT_ID` | Server | Firebase Admin service account project ID. |
| `FIREBASE_CLIENT_EMAIL` | Server | Firebase Admin service account client email. |
| `FIREBASE_PRIVATE_KEY` | Server | Firebase Admin service account private key. Keep escaped newlines as `\n` in Vercel. |

Never create these names:

- `NEXT_PUBLIC_OPENAI_API_KEY`
- `NEXT_PUBLIC_STRIPE_SECRET_KEY`

If real secret values were ever stored under those public names, rotate the OpenAI and Stripe keys before removing the old variables.

## Vercel Commands

List configured names without printing secret values:

```bash
vercel env ls
```

Add missing production values:

```bash
vercel env add APP_URL production
vercel env add OPENAI_API_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add FIREBASE_PROJECT_ID production
vercel env add FIREBASE_CLIENT_EMAIL production
vercel env add FIREBASE_PRIVATE_KEY production
```

Remove old public secret names only after the server-side variables above are present and a production deploy passes:

```bash
vercel env remove NEXT_PUBLIC_OPENAI_API_KEY production
vercel env remove NEXT_PUBLIC_STRIPE_SECRET_KEY production
```

Repeat removal for Preview and Development if those old names exist there too.

## Stripe Webhook

Create a Stripe webhook endpoint:

```text
https://my.personalboard.ai/api/stripe/webhook
```

Subscribe at least to:

```text
checkout.session.completed
```

Copy the endpoint signing secret into `STRIPE_WEBHOOK_SECRET`.

The webhook handler validates the Stripe signature, reads `uid` and `credits` from checkout metadata, and writes an idempotency record under:

```text
users/{uid}/stripeEvents/{checkoutSessionId}
```

## Local Payment Test

1. Create `.env.local` from `.env.example` and fill test values.
2. Start the app:

```bash
npm run dev
```

3. In another terminal, forward Stripe events:

```bash
stripe listen --forward-to localhost:3034/api/stripe/webhook
```

4. Copy the printed `whsec_...` value to `STRIPE_WEBHOOK_SECRET` in `.env.local` and restart `npm run dev`.
5. Log in with a test Firebase user.
6. Buy the smallest credit pack with Stripe card `4242 4242 4242 4242`, any future expiry, any CVC.
7. Verify Firestore:

```text
users/{uid}.credits increased by the purchased credits
users/{uid}.stripeCustomerId is present
users/{uid}/stripeEvents/{checkoutSessionId} exists
```

8. Refresh the billing page and confirm the payment appears in the charge table.

## Environment Validation

Run the local checker before build or deploy:

```bash
npm run check:env
```

For a production-like `.env.local`:

```bash
npm run check:env -- --target production
```

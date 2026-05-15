## Personal Board

### Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with Firebase, Stripe, and OpenAI values before starting the app.

### Required Server Secrets

Do not expose these with `NEXT_PUBLIC_`:

- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Stripe checkout credits are fulfilled by the `/api/stripe/webhook` endpoint after `checkout.session.completed`.

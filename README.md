# OweMate

OweMate is a peer-to-peer money tracking app for recording money you lend or owe to people you know.

## MVP

- Email sign-up and sign-in with Supabase Auth
- User-scoped cloud transaction storage with Row Level Security
- Record whether you lent or owe money
- Commitment / repayment date
- Due-date reminder notifications
- Dashboard with balances and recent records
- People view with per-person balances
- Android and iOS app foundation using Expo + React Native + TypeScript

## Local setup

Create a local `.env` file from `.env.example` and add your Supabase project URL and publishable key.

Install dependencies and start the app:

```bash
npm install
npm run start
```

For type checking:

```bash
npm run typecheck
```

## Supabase

The production schema is maintained in `SUPABASE_SCHEMA.sql`. The project uses Row Level Security so authenticated users can only access their own transaction rows.

Never commit `.env` or secret Supabase keys.

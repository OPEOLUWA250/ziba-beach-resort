# Security checks

Run these before every launch and after any change to sign-in, payments or the admin area. They attack a **local copy** of the site and print `PASS` when the site refuses an attack and `FAIL` when it doesn't. Checks that can't run say `NOT PROVEN` and why.

They talk to the Supabase project in `.env.local`, so they only touch rows they create (named `sectest-…@example.com`). Never point them at the live site; `lib.mjs` refuses any `https://` address unless you set `SECTEST_ALLOW_REMOTE=1`.

## 1. Start a local copy

From this folder's repository:

1. `npm ci`
2. Check `.env.local` has the Supabase URL, anon key and service key, `ADMIN_AUTH_JWT_SECRET`, and only a Paystack **test** key (`sk_test_…`).
3. `npm run build`, then `npx next start -p 3200`.

## 2. Run the checks (in another terminal)

```
npm run security:setup     # creates one ADMIN account (sectest-check-admin@example.com), writes .env.sectest
npm run security:check     # S1–S9 below
npm run security:cleanup   # deletes the test account, its audit-log lines, the storage probe and .env.sectest
```

| Check | Attack | Refused when |
| --- | --- | --- |
| S1 | Read guest/admin tables, write the catalogue, upload to Storage with the public key from the browser bundle | every table and write is refused |
| S2 | Forged admin cookie: wrong secret, `alg: none`, tampered signature | none opens an admin API |
| S3 | Keep using a copied admin cookie after signing out | it stops working at sign-out |
| S4 | Frame the site; missing CSP, HSTS, nosniff, Referrer/Permissions-Policy; `X-Powered-By` sent | all headers present |
| S5 | 200 KB body and a filled-in bot trap on the day-pass form (never creates a booking) | 413 and 400 |
| S6 | Admin, cron, webhook and diagnostic endpoints without credentials; removed customer-login routes | 401 / 404 |
| S7 | An ordinary admin tries to create a SUPER_ADMIN | 403 **and** an `ACCESS_DENIED` audit row |
| S8 | Tell real admin usernames from made-up ones by the answer or its timing | same answer, similar time |
| S9 | Rotate `X-Forwarded-For` to dodge the sign-in limit | some tries get 429 |

`security:check` uses up the admin sign-in limit on purpose in its last step, so wait a minute before running it again (15 minutes if S8 left the test account locked; cleanup and setup start fresh).

S1, S3, S7 and S8 need the database. If the Supabase project in `.env.local` is paused or deleted they print `NOT PROVEN`.

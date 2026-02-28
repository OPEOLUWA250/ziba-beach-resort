# Environment Variables Setup

## Required Environment Variables

### Supabase (REQUIRED)

Your Ziba Beach Resort application requires Supabase for database and authentication:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Get from: Supabase Dashboard → Project Settings → API → Project URL
   - Example: `https://xyzabc.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Public Anonymous Key (safe to expose in frontend)
   - Get from: Supabase Dashboard → Project Settings → API → anon public key
   - Used for client-side database operations

3. **SUPABASE_SERVICE_ROLE_KEY** ⚠️ KEEP SECRET
   - Service Role Key for server-side admin operations
   - Get from: Supabase Dashboard → Project Settings → API → service_role secret
   - Used for: Blog migrations, admin operations, deletion
   - **Never commit this to git or expose in frontend**
   - Store in production environment secrets only

### Payment Processing (Optional)

If you're using Paystack for payments:

1. **NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY**
   - Paystack public key (safe for frontend)
   - Get from: Paystack Dashboard → Settings → API Keys & Names → Public Key

2. **PAYSTACK_SECRET_KEY** ⚠️ KEEP SECRET
   - Paystack secret key for server-side operations
   - Get from: Paystack Dashboard → Settings → API Keys & Names → Secret Key
   - Used for payment verification and webhook handling

### Email Service (Optional)

If you're using Resend for transactional emails:

1. **RESEND_API_KEY** ⚠️ KEEP SECRET
   - API key for Resend email service
   - Get from: Resend Dashboard → API Keys section
   - Used for sending booking confirmations and notifications

### Application URLs

1. **NEXT_PUBLIC_APP_URL**
   - Your application's public URL
   - Local development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
   - Used in email links and OAuth redirects

## How to Set Environment Variables

### Local Development

1. Create `.env.local` file in the project root:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your actual values:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ...
   ```

3. Restart development server for changes to take effect

### Production Deployment

**Vercel:**

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - Name the variable exactly as shown above
   - Paste the value
   - Check "Encrypt" for sensitive keys
   - Save

**Other Platforms:**

- Follow platform-specific documentation
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is marked as secret
- Mark `PAYSTACK_SECRET_KEY` as secret if using Paystack
- Mark `RESEND_API_KEY` as secret if using Resend

## Variable Prefixes Explained

- **NEXT*PUBLIC*** prefix = Exposed to frontend (public, use only non-sensitive data)
- **No prefix** = Server-side only (use for secrets and sensitive keys)

## Verification

After setting environment variables:

1. Check local development logs for errors containing "Missing" or "undefined"
2. Test critical features:
   - Admin dashboard should load
   - Blog creation/editing should work
   - Image uploads should display
   - Payments should process (if enabled)

## Support

- **Supabase Issues?** Check Supabase Dashboard for service status
- **Payment Issues?** Verify Paystack credentials in dashboard
- **Email Issues?** Check Resend dashboard for API key validity

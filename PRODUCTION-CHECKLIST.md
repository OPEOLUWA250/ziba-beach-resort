# 🚀 QUICK START: Production Deployment

## Step 1: Run Database Migration (5 minutes)

```bash
# Go to: https://supabase.com/dashboard
# Navigate to: SQL Editor
# Copy and run: scripts/add-session-management.sql
```

**What it does:** Adds single-session enforcement columns to `admin_users` table

---

## Step 2: Generate Production JWT Secret (1 minute)

```bash
# Run this command:
openssl rand -base64 64

# Or use Node:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Copy the output - you'll need it next
```

---

## Step 3: Set Environment Variables on Hosting Platform

### **Vercel/Netlify/Railway:**
Go to: **Settings → Environment Variables**

Add these variables:

```bash
ADMIN_AUTH_JWT_SECRET=YOUR_GENERATED_SECRET_FROM_STEP_2
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Use Paystack LIVE keys (not test!)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
```

---

## Step 4: Deploy & Test

### ✅ Test 1: Single Session
1. Login on Chrome
2. Login with same account on Firefox
3. Go back to Chrome → Should be logged out
4. Message: "Session invalidated. Logged in elsewhere."

### ✅ Test 2: Account Lockout
1. Enter wrong password 5 times
2. 6th attempt: "Account locked for 15 minutes"
3. Wait 15 minutes → Auto-unlocks

---

## 🛡️ Security Features Now Active

✅ **Single-session enforcement** - One device at a time
✅ **Account lockout** - 5 failed attempts = 15min lock
✅ **IP tracking** - All logins logged with IP address
✅ **Session tokens** - httpOnly, secure, sameSite
✅ **Password hashing** - bcrypt (12 rounds)
✅ **HTTPS enforced** - In production only

---

## ⚠️ CRITICAL: Before Going Live

- [ ] Run database migration script
- [ ] Generate NEW JWT secret (don't use dev secret!)
- [ ] Use Paystack LIVE keys
- [ ] NEXT_PUBLIC_APP_URL = production domain
- [ ] NODE_ENV = production
- [ ] SSL certificate installed (HTTPS)
- [ ] Test single-session on two devices
- [ ] Test account lockout

---

## 📞 Questions?

**Read the full guide:** `SECURITY-GUIDE.md`

**Need help?** Check:
1. Database migration ran successfully
2. All env variables set correctly
3. Browser console for errors
4. Supabase logs for database issues

---

## 🎯 What Happens When User Logs In?

```
1. User enters credentials
2. System checks if account is locked
3. Verifies password (bcrypt)
4. Generates unique sessionId (64 hex chars)
5. Saves sessionId to database (replaces old one)
6. Creates JWT token with sessionId inside
7. Sets httpOnly cookie

Every request:
- Extract sessionId from JWT
- Compare with database sessionId
- If mismatch: "Logged in elsewhere" → logout
- If match: Allow access
```

---

*Generated: March 5, 2026*
*Ziba Beach Resort - Production Deployment Guide*

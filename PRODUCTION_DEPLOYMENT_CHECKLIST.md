# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Variables

- [ ] Copy `.env.example` to `.env.production.local`
- [ ] Fill in all REQUIRED variables:
  - `NEXT_PUBLIC_SUPABASE_URL` - Get from Supabase Dashboard
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get from Supabase Dashboard
  - `SUPABASE_SERVICE_ROLE_KEY` - Get from Supabase Dashboard
  - `NEXT_PUBLIC_SITE_URL` - Your production domain (e.g., https://ziba-resort.com)

### 2. Database Verification

- [ ] Log into Supabase Dashboard
- [ ] Verify `popups` table exists
- [ ] Create at least one popup with:
  - `title` - Non-empty string
  - `slug` - Unique URL-safe string
  - `excerpt` - Non-empty string
  - `featured_image` - Valid image URL
  - `modal_cta_text` - Button text (defaults to "Learn More")
  - `status` - Set to `ACTIVE`

### 3. Local Testing

```bash
# Build production version
npm run build

# Start production server
npm run start

# Visit http://localhost:3000 and verify:
# 1. Homepage loads
# 2. Scroll down 300px
# 3. Popup modal appears
# 4. Open DevTools Console and check for [PopupModal] logs
# 5. API call shows 200 status
```

### 4. Code Changes Verification

- [ ] `components/popup-modal.tsx` - Has console logging and error handling
- [ ] `app/api/popups/route.ts` - Has cache headers and proper error logging
- [ ] `lib/supabase/server.ts` - Credentials are properly loaded
- [ ] `lib/supabase/client.ts` - NEXT_PUBLIC variables used correctly

## Deployment Process

### Option A: Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Click "Import"

2. **Configure Environment Variables**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add each variable:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_key_here
     SUPABASE_SERVICE_ROLE_KEY = your_key_here
     NEXT_PUBLIC_SITE_URL = https://your-domain.com
     ```
   - Set environment to: **Production**
   - Click "Save"

3. **Deploy**
   - Go to Deployments tab
   - Click "Import Project" or trigger deployment
   - Wait for build to complete
   - Click "Visit" to see live site

4. **Verify**
   - Visit your production URL
   - Open DevTools (F12)
   - Scroll to trigger popup
   - Check Console for [PopupModal] logs

### Option B: Netlify

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select your repo
   - Click "Deploy site"

2. **Configure Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add variables (same as above)

3. **Trigger Deployment**
   - Push to main branch: `git push origin main`
   - Or manually trigger in Netlify dashboard
   - Wait for build (5-10 minutes)

4. **Verify**
   - Follow verification steps above

### Option C: AWS/GCP/Azure

Contact your DevOps team with:

- Application type: Next.js 16
- Required environment variables (list from section 1)
- Build command: `npm run build`
- Start command: `npm run start`

## Post-Deployment

### 1. Verify Production Functionality

```bash
# 1. Check homepage loads
curl https://your-domain.com

# 2. Test API endpoint
curl "https://your-domain.com/api/popups?active=true" \
  -H "Accept: application/json"

# 3. Check response (should include popup data)
```

### 2. Browser Testing

- [ ] Open https://your-domain.com
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Scroll down 300px
- [ ] Look for logs starting with `[PopupModal]`
- [ ] Verify popup appears

### 3. Network Debugging

- [ ] Open DevTools → Network tab
- [ ] Refresh page
- [ ] Look for request to `/api/popups?active=true`
- [ ] Status should be `200`
- [ ] Response should contain popup details

### 4. Common Issues & Fixes

| Issue                | Solution                                     |
| -------------------- | -------------------------------------------- |
| Popup doesn't appear | Check [PopupModal] logs in console           |
| API returns 404      | Verify NEXT_PUBLIC_SUPABASE_URL is correct   |
| API returns 500      | Check SUPABASE_SERVICE_ROLE_KEY is set       |
| No data in response  | Verify popup exists and status = 'ACTIVE'    |
| CORS errors          | Ensure NEXT_PUBLIC_SITE_URL is set correctly |

## Performance Monitoring

### 1. Enable Vercel Analytics (if using Vercel)

- Dashboard → Settings → Analytics
- Enable "Web Analytics"
- Monitor API performance

### 2. Monitor Supabase

- Go to Supabase Dashboard
- Check Query Performance in Analytics
- Note any slow queries

### 3. Set Alerts

- Set up alerts for:
  - API errors > 1% rate
  - Page load time > 3s
  - Database connection failures

## Maintenance

### Weekly

- [ ] Check production logs for errors
- [ ] Verify popup is still showing
- [ ] Monitor Supabase usage

### Monthly

- [ ] Review analytics
- [ ] Check for any deprecation warnings
- [ ] Update dependencies if needed

## Rollback Plan

If production breaks:

```bash
# Revert to last working commit
git revert HEAD
git push origin main

# Or deploy previous version
# (From Vercel/Netlify dashboard)
```

## Support Resources

- **Supabase Issues**: https://supabase.com/docs/guides/cli
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Docs**: https://vercel.com/docs
- **Check Production Logs**:
  - Vercel: Dashboard → Deployments → Logs
  - Netlify: Site → Deploys → Production Deploy → Logs

---

**After following this checklist, your popup should appear in production.**

If issues persist, check `PRODUCTION_POPUP_FIX.md` for advanced troubleshooting.

# Production Popup Fix Guide

## Problem

Popup modal appears on localhost but not in production.

## Root Causes & Solutions

### 1. **Missing Environment Variables in Production** ⚠️

The popup relies on the `/api/popups` endpoint which needs Supabase credentials.

**Fix:**
Ensure these variables are set in your production environment:

```env
# REQUIRED - Get from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# REQUIRED for API calls from browser
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. **Deployment Platform Specific Setup**

#### Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables listed above
3. Set them for Production environment
4. Redeploy with: `git push`

#### Other Platforms (Netlify, etc.)

1. Set environment variables in your platform's dashboard
2. Ensure they're set for production builds
3. Redeploy/rebuild with the new variables

### 3. **Debugging Popup Issues**

Open browser DevTools (F12) and check:

1. **Console Tab** - Look for logs starting with `[PopupModal]`
   - Should see: "Fetching from: https://your-domain.com/api/popups?active=true"
   - Should see: "API Response: { success: true, count: 1, popups: [...] }"

2. **Network Tab** - Check the `/api/popups?active=true` request
   - Status should be: **200**
   - Response should contain popup data

3. **Common Errors**:
   ```
   "API responded with status: 404" → API endpoint not found
   "API responded with status: 500" → Server error, check backend logs
   "Supabase error" → Missing/incorrect credentials
   ```

### 4. **Verify Popups Exist in Production Database**

1. Go to Supabase Dashboard
2. Navigate to your production project
3. Go to **SQL Editor** or **Table Editor**
4. Check the `popups` table:
   - Popups must have `status = 'ACTIVE'`
   - Must have `featured_image`, `title`, `excerpt` populated
   - No errors in schema

### 5. **Test the API Endpoint Directly**

Replace `YOUR_DOMAIN` with your actual domain:

```bash
curl "https://YOUR_DOMAIN/api/popups?active=true" \
  -H "Accept: application/json"
```

Should return:

```json
{
  "success": true,
  "count": 1,
  "popups": [
    {
      "id": "...",
      "title": "Your Popup Title",
      "status": "ACTIVE",
      ...
    }
  ]
}
```

### 6. **Check Supabase Connection**

Verify Supabase URL is accessible:

```bash
curl https://YOUR_PROJECT.supabase.co/rest/v1/popups \
  -H "apikey: YOUR_ANON_KEY"
```

### 7. **Cache Issue**

If popup still doesn't show after fixes:

1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Hard refresh page (Ctrl+F5 or Cmd+Shift+R)
3. Clear CDN cache if using one (Cloudflare, etc.)
4. Wait 5-10 minutes for cache to clear

## Checklist for Production Deployment

- [ ] All environment variables set in production dashboard
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is your actual Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] `NEXT_PUBLIC_SITE_URL` matches your production domain
- [ ] Popups table has at least one popup with `status = 'ACTIVE'`
- [ ] API endpoint responds with 200 and popup data
- [ ] Browser console shows successful fetch logs
- [ ] Browser cache cleared
- [ ] CDN cache cleared (if applicable)

## Manual Testing Steps

1. **Local Testing:**

   ```bash
   npm run build
   npm run start
   # Visit http://localhost:3000
   # Check console for [PopupModal] logs
   ```

2. **Production Testing:**
   - Visit your production domain
   - Open DevTools (F12)
   - Check Console tab for [PopupModal] logs
   - Scroll down 300px to trigger popup
   - Verify popup appears

## Advanced: Enable Debug Mode

Add this temporarily to `popup-modal.tsx` for extra logging:

```tsx
useEffect(() => {
  console.log("[PopupModal Debug] Component mounted");
  console.log(
    "[PopupModal Debug] NEXT_PUBLIC_SITE_URL:",
    process.env.NEXT_PUBLIC_SITE_URL,
  );
  console.log(
    "[PopupModal Debug] window.location.origin:",
    typeof window !== "undefined" ? window.location.origin : "N/A",
  );
}, []);
```

## Contact Supabase Support

If API still fails after all checks:

1. Go to Supabase Dashboard
2. Open your project
3. Check server logs in Dashboard
4. If errors appear, note the error message
5. Contact Supabase support with:
   - Error message
   - Timestamp of error
   - Project ID

---

**After applying all fixes, redeploy your application and test again.**

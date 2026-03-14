# Receipt Lookup Debugging & Enhancement Guide

## Overview

Enhanced the receipt lookup feature with comprehensive logging and improved user experience to help diagnose any data fetching issues.

## Changes Made

### 1. **API Logging Enhancement** (`app/api/receipt/lookup/route.ts`)

Added detailed console logging at every stage of the booking lookup process:

#### Initial Request Logging

```
[Receipt Lookup] Search parameters: { ref, email }
[Receipt Lookup] Missing Supabase credentials
```

#### Room Bookings Search

```
[Receipt Lookup] Searching room bookings for: ZB-2026-12345
[Receipt Lookup] Room bookings query error: [error details]
[Receipt Lookup] Room booking found: true|false
```

#### Day-Pass Bookings Search

```
[Receipt Lookup] Searching day-pass bookings for: ZB-DP-1234567890
[Receipt Lookup] Day-pass bookings query error: [error details]
[Receipt Lookup] Day-pass booking found: true|false
```

#### Paystack Reference Search

```
[Receipt Lookup] Searching by Paystack reference: [ref]
[Receipt Lookup] Room Paystack search error: [error details]
[Receipt Lookup] Found room booking by Paystack ref
[Receipt Lookup] Day-pass Paystack search error: [error details]
[Receipt Lookup] Found day-pass booking by Paystack ref
```

#### Final Results

```
[Receipt Lookup] No booking found for reference: [ref]
[Receipt Lookup] Successfully found booking of type: room|day-pass
[Receipt Lookup] Unexpected error: [error]
```

### 2. **Component Logging Enhancement** (`app/view-booking/view-booking-content-new.tsx`)

Added detailed logging on the client side:

```typescript
[Lookup Component] Auto-searching with URL param: ZB-2026-12345
[Lookup Component] Fetching from: /api/receipt/lookup?ref=ZB-2026-12345
[Lookup Component] Response status: 200
[Lookup Component] Success! Booking type: room|day-pass
[Lookup Component] Error response: { error: "..." }
[Lookup Component] Fetch error: [error object]
```

### 3. **Improved User Input Handling**

#### Reference Number Input

- Auto-converts to uppercase
- Clears error message when user starts typing new value
- Disabled during loading state
- Enter key submits the form
- Support for both room references (ZB-XXXX-XXXXX) and day-pass references (ZB-DP-XXXXXXXXX)

#### Email Input

- Support for optional email verification
- Disabled during loading state
- Enter key submits the form

#### Search Button

- Disabled when there's no reference entered
- Disabled while loading
- Shows animated loading state with spinner
- Clear visual feedback

### 4. **Enhanced Help Section**

Added a blue information box that explains:

- Reference format (starts with `ZB-`)
- Where to find the reference (confirmation email)
- Alternative search method (Paystack payment reference)
- Contact information for lost references

## Testing Your Changes

### Step 1: Monitor Browser Console

Open Developer Tools (F12) and go to the **Console** tab. You should see messages like:

```
[Lookup Component] Auto-searching with URL param: ZB-2026-12345
[Lookup Component] Fetching from: /api/receipt/lookup?ref=ZB-2026-12345
[Lookup Component] Response status: 200
```

### Step 2: Monitor Server Logs

If running locally or with server logs visible, you should see:

```
[Receipt Lookup] Search parameters: { ref: "ZB-2026-12345", email: null }
[Receipt Lookup] Searching room bookings for: ZB-2026-12345
[Receipt Lookup] Room booking found: true
[Receipt Lookup] Successfully found booking of type: room
```

### Step 3: Test Different Scenarios

**Scenario 1: Valid Room Booking Reference**

1. Go to `/view-booking`
2. Enter `ZB-2026-xxxxx` (a valid room booking reference)
3. Check console logs to see the flow

**Scenario 2: Valid Day-Pass Reference**

1. Enter `ZB-DP-xxxxxxxxx` (a valid day-pass reference)
2. Verify the logs show day-pass booking flow

**Scenario 3: Reference Not Found**

1. Enter a non-existent reference like `ZB-2026-99999`
2. Should see: `[Receipt Lookup] No booking found for reference`
3. User sees error message on UI

**Scenario 4: Email Verification**

1. Enter a valid reference
2. Enter an email that doesn't match the booking
3. Should see error about mismatched email

**Scenario 5: Paystack Reference**

1. Enter a Paystack payment reference instead of a ZB reference
2. Should see logs showing Paystack search flow

## Debugging Checklist

If data is still not fetching, check:

### ✅ Server-Side

1. [ ] Supabase credentials are set in `.env.local`
2. [ ] `NEXT_PUBLIC_SUPABASE_URL` is configured
3. [ ] `SUPABASE_SERVICE_ROLE_KEY` is configured
4. [ ] Check server logs for `[Receipt Lookup]` messages
5. [ ] Verify `bookings` table exists in Supabase
6. [ ] Verify `day_pass_bookings` table exists in Supabase

### ✅ Data Quality

1. [ ] Test data actually exists in the tables
2. [ ] Column names match exactly: `booking_reference_code`, `reference_code`, `guest_email`, `email`
3. [ ] Case sensitivity matches (defaults to lowercase comparison)

### ✅ Client-Side

1. [ ] Open Dev Tools → Console
2. [ ] Check for `[Lookup Component]` messages
3. [ ] Verify API response status is 200
4. [ ] Check for `[Lookup Component] Error response` messages

### ✅ Network

1. [ ] API endpoint `/api/receipt/lookup` is reachable
2. [ ] No CORS issues (should work on same domain)
3. [ ] No network errors in Network tab of Dev Tools

## Common Issues & Solutions

### Issue: "No booking found"

**Possible Causes:**

- Reference doesn't exist in database
- Email doesn't match booking email
- Column name mismatch in API code
- Wrong table queried

**Debug Steps:**

1. Check server logs for which search was attempted
2. Verify reference format (ZB- prefix for rooms or ZB-DP- for day pass)
3. Query Supabase directly to confirm data exists

### Issue: "Failed to fetch booking" or network errors

**Possible Causes:**

- Server error (500 status)
- Database connection issue
- Missing environment variables

**Debug Steps:**

1. Check server logs for errors
2. Look for `[Receipt Lookup] Unexpected error` message
3. Verify Supabase connection

### Issue: Logs not appearing

**Possible Causes:**

- Console not open
- Different browser context
- Logs getting filtered

**Debug Steps:**

1. Ensure Dev Tools Console is visible (F12)
2. Make sure filters are set to show all messages
3. Try in a fresh incognito window

## Reference Format Guide

### Room Bookings

- Format: `ZB-YYYY-XXXXX` where YYYY is year
- Example: `ZB-2026-12345`
- Stored in: `bookings.booking_reference_code`

### Day-Pass Bookings

- Format: `ZB-DP-XXXXXXXXX` (9-10 digits)
- Example: `ZB-DP-1234567890`
- Stored in: `day_pass_bookings.reference_code`

### Paystack Reference

- Format: Any valid Paystack reference number
- Can be used as alternative search
- Stored in: `bookings.paystack_reference` or `day_pass_bookings.paystack_reference`

## Files Changed

1. **`app/api/receipt/lookup/route.ts`**
   - Added comprehensive logging at every step
   - Logs to console using `console.log()` and `console.error()`
   - Tagged all messages with `[Receipt Lookup]` prefix

2. **`app/view-booking/view-booking-content-new.tsx`**
   - Added client-side logging with `[Lookup Component]` prefix
   - Improved error messages with status codes
   - Enhanced input handling (auto-uppercase, error clearing)
   - Disabled inputs during loading
   - Improved help section with clear instructions
   - Better format guide in placeholder text

## Next Steps if Issues Persist

1. **Check database directly:**

   ```sql
   SELECT * FROM bookings WHERE booking_reference_code = 'ZB-2026-12345';
   SELECT * FROM day_pass_bookings WHERE reference_code = 'ZB-DP-1234567890';
   ```

2. **Verify API is being called:**
   - Open Network tab in Dev Tools
   - Trigger a search
   - Check the request to `/api/receipt/lookup`
   - Verify query parameters are correct

3. **Check Supabase connection:**
   - Verify credentials in `.env.local`
   - Test connectivity with a simple API call

4. **Enable verbose logging (if needed):**
   - Consider adding more detailed logging in the transformation steps
   - Log the exact queries being executed

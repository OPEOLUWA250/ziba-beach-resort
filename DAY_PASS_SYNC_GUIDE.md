# Day Pass Experience Sync - Implementation Guide

## 🎯 What Was Fixed

### Problem

1. The public day-pass page had **hardcoded products** that never synced with the admin dashboard
2. Admin dashboard showed **duplicate tickets** (Kids, Teen, Adult tickets appearing multiple times)
3. Changes made in admin panel had **no effect** on the public-facing page

### Solution

The system now uses a **single source of truth** - the `day_pass_experiences` table in Supabase. Both the admin dashboard and public page pull from the same database.

---

## 🔧 Changes Made

### 1. **Fixed UUID Error in Admin Panel** ✅

- Updated API routes to properly handle Next.js 15+ async params
- Admin can now **edit and delete** experiences without errors

**Files Updated:**

- `app/api/admin/experiences/[id]/route.ts`

### 2. **Created Public API Endpoint** ✅

- New endpoint to fetch available day-pass experiences
- Only returns `available: true` items to customers

**New File:**

- `app/api/day-pass/experiences/route.ts`

### 3. **Synced Public Page with Database** ✅

- Removed hardcoded products from day-pass page
- Now fetches products dynamically from Supabase
- Maintains same UI/UX with tickets and add-on experiences

**Files Updated:**

- `app/day-pass/page.tsx`

### 4. **Prevented Duplicate Entries** ✅

- Added unique constraint on experience names
- SQL now uses UPSERT logic (insert or update)
- Running the seed script multiple times won't create duplicates

**Files Updated:**

- `scripts/seed-day-pass-experiences.sql`

**New File:**

- `scripts/cleanup-duplicate-experiences.sql` (to remove existing duplicates)

---

## 📋 How to Set Up

### Step 1: Clean Up Duplicates (If Any Exist)

Run this in **Supabase SQL Editor** first:

```sql
-- File: scripts/cleanup-duplicate-experiences.sql
DELETE FROM public.day_pass_experiences
WHERE id NOT IN (
  SELECT MIN(id)
  FROM public.day_pass_experiences
  GROUP BY name
);
```

### Step 2: Run the Main Setup

Copy all SQL from `scripts/seed-day-pass-experiences.sql` and run in **Supabase SQL Editor**:

This will:

1. ✅ Create the `day_pass_experiences` table
2. ✅ Add indexes and unique constraints
3. ✅ Set up Row Level Security (RLS) policies
4. ✅ Insert 18 experiences:
   - 8 Day Pass Tickets (Infant, Kids, Kids Plus, Teens, Teen Plus, Adult, Adult Plus, Senior)
   - 10 Add-On Experiences (Massages, Painting, Horse riding, Picnics, etc.)

---

## 🎉 Benefits

### For Admins:

- ✅ **Edit prices** in admin panel → instantly updates public page
- ✅ **Add new experiences** → automatically appears for customers
- ✅ **Mark as unavailable** → hides from public (but keeps in database)
- ✅ **No duplicates** → clean database with unique names

### For Customers:

- ✅ **Always see current prices** and available experiences
- ✅ **Real-time updates** when admin makes changes
- ✅ **Faster page loads** with optimized database queries

### For Developers:

- ✅ **Single source of truth** - no more syncing hardcoded data
- ✅ **Type-safe** with proper TypeScript interfaces
- ✅ **Scalable** - easy to add categories like "honeymoon" or "team-building"

---

## 🧪 Testing

1. **Admin Dashboard** (`localhost:3000/admin/experiences`):
   - Should show 18 experiences (no duplicates)
   - Edit any experience → verify save works
   - Delete test experience → verify deletion works

2. **Public Day Pass Page** (`localhost:3000/day-pass`):
   - Should show same experiences from admin panel
   - Change price in admin → refresh page → new price appears
   - Mark experience as "unavailable" in admin → disappears from public page

3. **Cart Functionality**:
   - Add items to cart → verify localStorage works
   - Proceed to checkout → verify all items included

---

## 📊 Database Schema

```sql
day_pass_experiences
├── id (UUID, Primary Key)
├── name (TEXT, UNIQUE)
├── description (TEXT)
├── price_per_person (INTEGER)
├── category (TEXT: 'day-pass' | 'honeymoon' | 'team-building')
├── age_group (TEXT)
├── available (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🔐 Security

- **Row Level Security (RLS)** enabled
- Public can **read** available experiences
- Admin can **create, update, delete** (requires authentication)
- Service role key used for admin operations

---

## 🚀 Next Steps

1. Run cleanup SQL (if duplicates exist)
2. Run main seed SQL
3. Test admin dashboard
4. Test public page
5. Verify cart/checkout flow

---

## 💡 Pro Tips

- **Adding New Experiences**: Use the "Add Experience" button in admin panel
- **Bulk Price Updates**: Edit directly in Supabase dashboard
- **Seasonal Experiences**: Mark as unavailable instead of deleting
- **Analytics**: Query `day_pass_bookings.items` to see what sells best

---

## 🐛 Troubleshooting

### "No experiences found" in admin

- Check Supabase connection
- Verify SQL ran successfully
- Check browser console for errors

### Public page shows old prices

- Hard refresh (Ctrl+Shift+R)
- Check if `available: true` in database
- Verify API endpoint returns data: `/api/day-pass/experiences`

### Cart not working

- Clear localStorage: `localStorage.clear()`
- Check browser console
- Verify product IDs match database UUIDs

---

**Last Updated:** March 5, 2026

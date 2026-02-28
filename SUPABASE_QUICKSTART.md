# Supabase SDK Quick Start

## Prerequisites

1. Supabase account and project created
2. Environment variables configured in `.env.local`

## Database Schema Setup

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase dashboard
2. Click on your project
3. Navigate to `SQL Editor` in the left sidebar

### Step 2: Run the Schema

1. Click `New Query`
2. Copy the entire contents from `prisma/supabase-schema.sql`
3. Paste into the SQL editor
4. Click `Run` or press `Ctrl+Enter`

This will:

- ✅ Create all necessary tables (users, rooms, bookings, blogs, menus)
- ✅ Set up indexes for optimized queries
- ✅ Enable Row Level Security (RLS)
- ✅ Insert 4 sample rooms for testing

### Step 3: Verify Setup

Run a test query to verify tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see:

- users
- rooms
- bookings
- blogs
- menus

## Testing the API

### 1. Health Check

```bash
curl http://localhost:3000/api/rooms
```

Expected response:

```json
{
  "total": 4,
  "rooms": [...],
  "success": true
}
```

### 2. Create Booking

```bash
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "room01",
    "checkInDate": "2026-03-15",
    "checkOutDate": "2026-03-18",
    "numberOfGuests": 2,
    "email": "guest@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 3. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### 4. Get Blogs

```bash
curl http://localhost:3000/api/blogs
```

## Development Tips

### 1. Enable Debug Logging

Edit `lib/supabase/client.ts`:

```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
  // Debug mode
  global: {
    headers: { "x-debug": "true" },
  },
});
```

### 2. Check Supabase Logs

In Supabase dashboard → Function Logs:

- Shows query execution times
- Displays errors in real-time
- Helps identify performance issues

### 3. Monitor Database Usage

Supabase dashboard → Database → Usage:

- Storage usage
- Query counts
- Connection info

## Common Issues & Solutions

### Issue: "PGRST116" Error

**Problem:** Record not found
**Solution:** Check if record ID exists in database

```typescript
// This returns null instead of throwing
const data = await getBlogBySlug("non-existent-slug");
if (!data) {
  console.log("Not found");
}
```

### Issue: "23505" Error

**Problem:** Unique constraint violation (duplicate email, slug, etc.)
**Solution:** Check for existing records before insert

```typescript
const existing = await supabase
  .from("users")
  .select("id")
  .eq("email", email)
  .single();

if (existing.data) {
  throw new Error("User already exists");
}
```

### Issue: Permission Denied

**Problem:** RLS policy blocking operation
**Solution:** Ensure user is authenticated or adjust RLS policies

```typescript
// Check RLS settings in Supabase dashboard
// Tables → Select Table → RLS Policies
```

## Environment Variables Checklist

```env
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ DATABASE_URL (optional, for direct DB access)
```

## File Structure

```
lib/
├── supabase/
│   ├── client.ts       # Public client
│   ├── admin.ts        # Admin client
│   └── utils.ts        # Helpers & error handling
└── services/
    ├── auth.ts         # User authentication
    ├── booking.ts      # Booking operations
    ├── rooms.ts        # Room operations
    ├── blogs.ts        # Blog operations
    └── menus.ts        # Menu operations

app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── rooms/route.ts
├── bookings/
│   ├── create/route.ts
│   ├── [id]/route.ts
│   └── check-availability/route.ts
├── blogs/
│   ├── route.ts
│   └── [id]/route.ts
└── menus/route.ts
```

## Next Steps

1. ✅ Run schema initialization
2. ✅ Test API endpoints
3. Add JWT authentication tokens
4. Set up proper error tracking
5. Implement caching if needed
6. Add real-time subscriptions for live updates
7. Set up database backups

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase JS Client API](https://supabase.com/docs/reference/javascript/introduction)
- [TypeScript Support](https://supabase.com/docs/reference/javascript/typescript-support)

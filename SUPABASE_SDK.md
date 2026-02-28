# Supabase SDK Integration Guide

## Overview

The Ziba Beach Resort application has been migrated from Prisma ORM to **Supabase SDK** for direct PostgreSQL database access. This provides a lightweight, modern approach to database operations with real-time capabilities.

## Environment Setup

### Required Environment Variables (`.env.local`)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
```

**Note:** The `NEXT_PUBLIC_*` variables are safe to expose to the browser only.

## Client Architecture

### 1. Public Client (`lib/supabase/client.ts`)

Used for browser-safe operations and client-side requests:

```typescript
import { supabase } from "@/lib/supabase/client";

const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();
```

### 2. Admin Client (`lib/supabase/admin.ts`)

Used for server-side operations with elevated permissions:

```typescript
import supabaseAdmin from "@/lib/supabase/admin";

await supabaseAdmin.from("bookings").insert({
  // insert data
});
```

## Database Schema

### Tables

#### Users

```sql
- id: TEXT (Primary Key)
- email: TEXT (Unique)
- firstName: TEXT
- lastName: TEXT
- phone: TEXT
- country: TEXT
- currency: TEXT (Default: 'NGN')
- passwordHash: TEXT
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### Rooms

```sql
- id: TEXT (Primary Key)
- title: TEXT
- description: TEXT
- priceNGN: INTEGER
- capacity: INTEGER
- amenities: TEXT[]
- images: TEXT[]
- status: TEXT (Default: 'AVAILABLE')
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### Bookings

```sql
- id: TEXT (Primary Key)
- userId: TEXT (Foreign Key → users.id)
- roomId: TEXT (Foreign Key → rooms.id)
- checkInDate: TIMESTAMP
- checkOutDate: TIMESTAMP
- numberOfGuests: INTEGER
- specialRequests: TEXT
- status: TEXT (Default: 'PENDING')
- totalAmount: INTEGER
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### Blogs

```sql
- id: TEXT (Primary Key)
- slug: TEXT (Unique)
- title: TEXT
- excerpt: TEXT
- content: TEXT
- featured_image: TEXT
- author: TEXT
- category: TEXT
- read_time: INTEGER
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### Menus

```sql
- id: TEXT (Primary Key)
- categoryId: TEXT
- itemId: TEXT
- category: TEXT
- name: TEXT
- description: TEXT
- price: INTEGER
- image: TEXT
- available: BOOLEAN (Default: TRUE)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

### Initialize Schema

Run the SQL schema file in Supabase SQL Editor:

```bash
# The schema file is located at:
prisma/supabase-schema.sql
```

## Service Layer

All business logic is organized in `lib/services/`:

### Authentication Service (`lib/services/auth.ts`)

```typescript
// Register user
const user = await registerUser({
  email: "user@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  currency: "NGN",
});

// Login
const user = await loginUser(email, password);

// Get user by email
const user = await getUserByEmail(email);

// Get user by ID
const user = await getUserById(id);

// Update profile
await updateUserProfile(userId, { firstName: "Jane" });
```

### Booking Service (`lib/services/booking.ts`)

```typescript
// Check availability
const available = await isRoomAvailable(roomId, checkIn, checkOut);

// Create booking
const booking = await createBooking({
  userId,
  roomId,
  checkInDate,
  checkOutDate,
  numberOfGuests,
});

// Get user bookings
const bookings = await getUserBookings(userId);

// Get booking details
const booking = await getBookingDetails(bookingId);

// Calculate price
const price = calculateBookingPrice(pricePerNight, checkIn, checkOut);

// Get available rooms
const rooms = await getAvailableRooms(checkIn, checkOut);

// Update booking status
await updateBookingStatus(bookingId, "CONFIRMED");

// Cancel booking
await cancelBooking(bookingId);
```

### Room Service (`lib/services/rooms.ts`)

```typescript
// Get all rooms
const rooms = await getAllRooms();

// Get room by ID
const room = await getRoomById(roomId);

// Create room
const room = await createRoom({
  title: "Beach Room",
  priceNGN: 200000,
  capacity: 3,
});

// Update room
await updateRoom(roomId, { priceNGN: 250000 });

// Get rooms by capacity
const rooms = await getRoomsByCapacity(4);

// Delete room
await deleteRoom(roomId);
```

## API Routes

### Authentication Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rooms Route

- `GET /api/rooms` - Fetch all available rooms
- `POST /api/rooms` - Create new room

### Bookings Route

- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/[id]` - Get booking details
- `POST /api/bookings/check-availability` - Check room availability

### Blogs Route

- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog
- `GET /api/blogs/[id]` - Get blog details
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

### Menus Route

- `GET /api/menus` - Get all menu categories
- `POST /api/menus` - Create menu category

## Error Handling

All services include error handling:

```typescript
try {
  const data = await supabase.from("users").select("*").eq("id", id).single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw error;
  }

  return data;
} catch (error) {
  console.error("Database error:", error);
  throw error;
}
```

## Real-Time Features (Future)

Supabase supports real-time subscriptions:

```typescript
// Listen to booking changes
supabase
  .channel("bookings")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "bookings" },
    (payload) => {
      console.log("Change received!", payload);
    },
  )
  .subscribe();
```

## Type Safety

The Supabase client includes TypeScript types from `Database` interface defined in `lib/supabase/client.ts`:

```typescript
import type { Database } from "@/lib/supabase/client";

type User = Database["public"]["Tables"]["users"]["Row"];
type NewUser = Database["public"]["Tables"]["users"]["Insert"];
```

## Security Considerations

### Row Level Security (RLS)

RLS policies are configured in the schema:

1. **Public Tables**: `rooms`, `blogs`, `menus` - readable by all
2. **Private Tables**: `users`, `bookings` - readable only by owner

### Best Practices

1. ✅ Use `.env.local` for sensitive credentials (never commit)
2. ✅ Use public client in browser, admin client only on server
3. ✅ Implement auth properly before using RLS policies
4. ✅ Always validate input on server-side
5. ✅ Handle errors gracefully in API routes

## Debugging

Enable debug logging:

```typescript
// In lib/supabase/client.ts
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  debug: process.env.NODE_ENV === "development",
});
```

## Migration from Prisma

The following was replaced:

- `@prisma/client` → `@supabase/supabase-js`
- `prisma.user.findUnique()` → `supabase.from("users").select().single()`
- `prisma.booking.create()` → `supabase.from("bookings").insert()`
- `prisma.$transaction()` → Supabase transactions (via SQL)

## Next Steps

1. ✅ Run database schema: `prisma/supabase-schema.sql`
2. ✅ Seed initial data if needed
3. Implement JWT authentication tokens
4. Add real-time subscriptions
5. Set up proper RLS policies
6. Implement caching layer if needed

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

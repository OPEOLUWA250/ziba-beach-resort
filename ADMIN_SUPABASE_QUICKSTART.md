# Admin Page + Supabase Quick Start Guide

## 🎯 What You Need to Get Started

To work on the admin page with a live database, you need these components:

### 1. **Supabase Project** (Database + Auth)

### 2. **Environment Variables** (.env.local)

### 3. **Prisma** (ORM for database access)

### 4. **Admin Authentication** (Login to access admin page)

### 5. **Database Schema** (Tables for rooms, bookings, users, etc.)

---

## ⚡ 5-Minute Setup

### Step 1: Create Free Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Project name**: `ziba-beach-resort` (or your choice)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location (e.g., Europe, America, Africa)
4. Click **"Create new project"** (wait 2-3 minutes)

### Step 2: Get Your Credentials

Once project is created:

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL** → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon key)** → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Settings → Database**
4. Copy:
   - **Connection string** (PostgreSQL) → Save as `DATABASE_URL`
   - **Service Role Secret Key** → Save as `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Create .env.local File

In your project root (`c:\Users\Opeoluwa\Projects\ziba-beach-resort\`):

Create a file named `.env.local` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:your-password@db.project-id.supabase.co:5432/postgres

# Paystack (Optional - for payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx

# Currency Exchange API (Optional)
EXCHANGE_RATE_API_KEY=your-api-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Set Up Database Schema

```bash
# Install dependencies
npm install

# Create tables in your Supabase database
npm run prisma:push
```

This will:

- Read your `prisma/schema.prisma`
- Create all tables in Supabase
- Set up relationships between tables

You'll be asked to confirm, type `y` and press Enter.

### Step 5: Verify It's Working

```bash
# Start development server
npm run dev
```

Open http://localhost:3000 in your browser. If you see the homepage without errors, Supabase is connected!

---

## 🔐 Admin Page Authentication

Your admin page is at `/admin` and already has authentication built-in.

### Create Admin Account:

1. The admin page uses **role-based access control** (RBAC)
2. To log in, you need an admin user in the database

#### Option A: Create via Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard → Auth → Users**
2. Click **"New user"**
3. Fill in:
   - **Email**: `admin@zibabeach.com` (or your email)
   - **Password**: Create strong password
4. After creation, go to **User Details**
5. Add to "user_role" table with `role: 'admin'`

#### Option B: Use Database Directly

In Supabase SQL Editor, run:

```sql
-- Create user with email/password
INSERT INTO auth.users (
  email,
  role,
  email_confirmed_at,
  confirmation_token,
  encrypted_password
)
VALUES (
  'admin@zibabeach.com',
  'authenticated',
  NOW(),
  '',
  crypt('your-password-here', gen_salt('bf'))
);

-- Get the user_id that was created, then:
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@zibabeach.com';
```

Then log in at `/admin` with your email and password.

---

## 📊 Database Tables Created

When you run `npm run prisma:push`, these tables are created:

| Table          | Purpose                | Fields                                            |
| -------------- | ---------------------- | ------------------------------------------------- |
| **users**      | Guest & admin accounts | id, email, name, phone, currency                  |
| **rooms**      | Accommodation options  | id, name, price, capacity, amenities              |
| **bookings**   | Guest reservations     | id, user_id, room_id, check_in, check_out, status |
| **payments**   | Payment records        | id, booking_id, amount, status, reference         |
| **user_roles** | Admin access control   | user_id, role                                     |
| **reviews**    | Guest feedback         | id, booking_id, rating, comment                   |

---

## 🛠️ Working with the Admin Page

### What's Already Built:

✅ Admin dashboard skeleton at `/admin`
✅ User management page at `/admin/users`
✅ Rooms management at `/admin/rooms`
✅ Bookings management at `/admin/bookings`
✅ Reviews & feedback at `/admin/reviews`
✅ Revenue analytics at `/admin/revenue`
✅ Communications at `/admin/communications`

### To Start Development:

1. **Access admin**: http://localhost:3000/admin (after login)
2. **Edit components**: Files are in `app/admin/` folder
3. **Database queries**: Use Prisma client in server components
4. **Real-time updates**: Use Supabase real-time subscriptions

---

## 🔧 Key Files You'll Work With

```
prisma/
  └── schema.prisma          ← Database structure

app/admin/
  ├── page.tsx              ← Admin dashboard home
  ├── users/page.tsx        ← User management
  ├── rooms/page.tsx        ← Room management
  ├── bookings/page.tsx     ← Booking management
  ├── revenue/page.tsx      ← Analytics
  └── [other sections]

lib/services/
  └── supabase.ts          ← Supabase client setup

.env.local                  ← Your credentials (don't commit!)
```

---

## ✅ Verification Checklist

- [ ] Created Supabase project
- [ ] Copied credentials to `.env.local`
- [ ] Ran `npm run prisma:push`
- [ ] Started dev server (`npm run dev`)
- [ ] Created admin user
- [ ] Logged into `/admin` successfully
- [ ] See admin dashboard loading without errors

---

## 🚨 Troubleshooting

### Error: "Cannot find .env.local"

→ Create `.env.local` file in project root with credentials

### Error: "Database connection failed"

→ Check `DATABASE_URL` is correct (with password, not placeholder)

### Error: "Table doesn't exist"

→ Run `npm run prisma:push` again

### Can't log into admin

→ Verify user exists in Supabase Auth and has 'admin' role

### Supabase connection timeout

→ Check your internet, or Supabase region is too far (change region in project settings)

---

## 📚 Full Documentation

For detailed architecture, schema, and advanced setup:

- See **SUPABASE_SETUP.md** (20+ pages of technical guide)
- **Architecture.md** has system design
- **README.md** has project overview

---

## 🎬 Next Steps

1. ✅ Complete this setup
2. 🔨 Start building admin features
3. 📱 Connect UI to Supabase real data
4. 🔐 Add authentication checks
5. 📊 Build analytics dashboards
6. 🚀 Deploy to production

---

**Questions?** Check SUPABASE_SETUP.md for comprehensive guide!

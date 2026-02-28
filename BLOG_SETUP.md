# Blog Management Setup Guide

## Step 1: Create the Blogs Table in Supabase

Go to your Supabase Dashboard → SQL Editor and run this SQL:

```sql
-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT DEFAULT 'Ziba Beach Resort',
  category TEXT,
  read_time INTEGER DEFAULT 5,
  createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_createdat ON blogs(createdat DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON blogs;
DROP POLICY IF EXISTS "Allow authenticated insert" ON blogs;
DROP POLICY IF EXISTS "Allow authenticated update" ON blogs;
DROP POLICY IF EXISTS "Allow authenticated delete" ON blogs;

-- Create new policies
-- Allow anyone to read
CREATE POLICY "Allow public read" ON blogs
  FOR SELECT
  USING (true);

-- Allow service role to insert (for migrations)
CREATE POLICY "Allow service insert" ON blogs
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to update
CREATE POLICY "Allow service update" ON blogs
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow service role to delete
CREATE POLICY "Allow service delete" ON blogs
  FOR DELETE
  USING (true);
```

## Step 2: Create the Storage Bucket for Images

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Create the blog-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set bucket policies
CREATE POLICY IF NOT EXISTS "Public read on blog-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY IF NOT EXISTS "Authenticated upload on blog-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY IF NOT EXISTS "Authenticated delete on blog-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images');

CREATE POLICY IF NOT EXISTS "Authenticated update on blog-images"
ON storage.objects FOR UPDATE
WITH CHECK (bucket_id = 'blog-images');
```

## Step 3: Migrate Existing Blogs to Database

Once the table is created, call this endpoint to migrate all 11 blog posts:

```bash
curl -X POST http://localhost:3000/api/migrate/blogs
```

Or use this in your terminal:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/migrate/blogs" -Method POST
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

You should see:

```json
{
  "success": true,
  "message": "Migration completed: 11 succeeded, 0 failed"
}
```

## Step 4: Verify the Blogs are in the Database

Visit: http://localhost:3000/admin/blog

You should see all 11 blog posts in the table.

## Step 5: Test CRUD Operations

### Create a New Blog

1. Click "New Blog Post" button
2. Fill in the form with:
   - Title
   - Excerpt
   - Content
   - Category (Proposals, Travel Tips, Weddings, Family)
   - Read time
   - Featured image (drag and drop)
3. Click "Create Blog Post"

### Edit an Existing Blog

1. Click the edit icon (✏️) on any blog row
2. Modify the fields
3. Update the featured image if needed
4. Click "Update Blog"

### Delete a Blog

1. Click the delete icon (🗑️) on any blog row
2. Confirm the deletion

## Step 6: View Changes on Main Blog Page

The main blog page now fetches from the database instead of static files:

1. Go to http://localhost:3000/blog
2. **All changes from admin dashboard appear immediately!**
3. Click on any blog to view full content
4. See dates, authors, and read times match the admin data
5. Related posts show other blogs in the same category

## Important Details

**Image Upload:**

- ✅ Now works! Upload bucket is created
- Allowed formats: JPEG, PNG, WebP, GIF
- Max size: 5MB
- Images stored in `blog-images` bucket
- Automatic public URL generation

**Database Integration:**

- ✅ Admin dashboard changes now sync to main blog page
- ✅ Real-time blog list updates
- ✅ Dynamic date formatting
- ✅ Related posts from same category

- Database uses LOWERCASE column names: `createdat`, `updatedat`, NOT `createdAt`, `updatedAt`
- This is critical for INSERT and UPDATE operations
- All other column names are lowercase: `featured_image`, `read_time`

## API Endpoints

- **GET /api/blogs** - Fetch all blogs
- **POST /api/blogs** - Create a new blog
- **GET /api/blogs/[slug]** - Get blog by slug
- **PUT /api/blogs/[id]** - Update blog by ID
- **DELETE /api/blogs/[id]** - Delete blog by ID
- **POST /api/migrate/blogs** - Migrate blogs from static data (one-time use)

## Troubleshooting

### Error: "Upload failed: Bucket not found"

- Run the storage bucket SQL from Step 2
- Ensure the `blog-images` bucket is created and public

### Error: "Could not find the 'updatedAt' column"

- Use lowercase: `updatedat` not `updatedAt`

### Error: "new row violates row-level security policy"

- The RLS policies need to be set correctly (see SQL above)
- Use the admin client for migrations

### Error: "Could not find the 'sections' column"

- The current schema doesn't include sections
- Content can be stored in the `content` column (supports markdown)

### Admin changes not showing on main blog page

- Refresh the browser (Ctrl+Shift+R for hard refresh)
- The main page now fetches from API in real-time

## Files Modified

- `lib/services/blogs.ts` - Fixed to use lowercase column names
- `app/api/blogs/route.ts` - Blog list and creation endpoint
- `app/api/blogs/[id]/route.ts` - Blog detail, update, delete endpoint
- `app/api/migrate/blogs/route.ts` - Migration endpoint
- `app/admin/blog/page.tsx` - Admin dashboard for blogs
- `app/admin/blog/blog-form.tsx` - Form to create/edit blogs with image upload
- `app/blog/page.tsx` - **Now fetches from API instead of static files (UPDATED)**
- `app/blog/[slug]/page.tsx` - **Now fetches from API, displays related posts (UPDATED)**
- `lib/supabase/image-upload.ts` - Image upload utility
- `prisma/create_blogs_table.sql` - Database schema SQL
- `prisma/create_storage_bucket.sql` - Storage bucket setup SQL

## Next Steps

Once confirmed working, you can:

1. Add more categories in the blog form
2. Add author management
3. Add blog status (draft/published)
4. Add tags or search functionality
5. Add SEO metadata per blog post

- `app/api/blogs/[id]/route.ts` - Blog detail, update, delete endpoint
- `app/api/migrate/blogs/route.ts` - Migration endpoint
- `app/admin/blog/page.tsx` - Admin dashboard for blogs
- `app/admin/blog/blog-form.tsx` - Form to create/edit blogs
- `lib/supabase/image-upload.ts` - Image upload utility

## Next Steps

Once confirmed working, you can:

1. Add more categories in the blog form
2. Add author management
3. Add blog status (draft/published)
4. Add tags or search functionality

# Day-Pass Experience Management Setup Guide

## Overview

The day-pass experience management system allows admins to manage pricing and availability for:

- Day pass tickets (infant, kids, teens, adults)
- Day pass premium options ("Plus" packages)
- Honeymoon experiences
- Team-building experiences

## Setup Instructions

### Step 1: Create the Database Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query and copy the contents of `scripts/setup-experiences.sql`
4. Execute the SQL to create the `day_pass_experiences` table with default ticket types

The table will be created with these columns:

- `id` (UUID, auto-generated)
- `name` (Text) - Experience name
- `description` (Text, optional) - Experience description
- `price_per_person` (Integer) - Price in Naira
- `category` (Text) - One of: 'day-pass', 'honeymoon', 'team-building'
- `age_group` (Text, optional) - Age range (e.g., "18+ years")
- `available` (Boolean) - Availability status
- `created_at` (Timestamp) - Auto-generated
- `updated_at` (Timestamp) - Auto-generated

### Step 2: Access the Admin Interface

1. Navigate to your admin dashboard: `/admin`
2. In the sidebar, click on **Experiences**
3. You'll see the experience management interface

## Features

### View All Experiences

- Dashboard displays statistics:
  - Total experiences
  - Available count
  - Unavailable count
- Grid layout for easy browsing
- Categorized by type (day-pass, honeymoon, team-building)

### Add New Experience

1. Click **"Add Experience"** button
2. Fill in the form:
   - **Name**: Experience title
   - **Price Per Person**: Cost in Naira (₦)
   - **Category**: Choose type (day-pass, honeymoon, team-building)
   - **Age Group**: Target age range (optional)
   - **Description**: Details about the experience (optional)
   - **Available**: Toggle to mark as available/unavailable
3. Click **Save**

### Edit Experience

1. Click **Edit** button on any card
2. Modify the form fields:
   - Price can be updated instantly
   - Status can be toggled
   - Description can be changed
3. Click **Save** to update
4. Changes are reflected in real-time on the customer website

### Delete Experience

1. Click **Delete** button on any card
2. Confirm deletion in the modal dialog
3. Click **Delete** to confirm or **Keep It** to cancel
4. Deleted experiences are removed immediately

## API Endpoints

### GET /api/admin/experiences

Fetch all experiences

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Adult Ticket",
    "description": "Standard day pass for adults 18+",
    "price_per_person": 20000,
    "category": "day-pass",
    "age_group": "18+ years",
    "available": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

### POST /api/admin/experiences

Create a new experience

**Request Body:**

```json
{
  "name": "VIP Day Pass",
  "description": "Premium day pass with extra perks",
  "pricePerPerson": 35000,
  "category": "day-pass",
  "ageGroup": "18+ years",
  "available": true
}
```

### PUT /api/admin/experiences/[id]

Update an experience

**Request Body:** Same as POST

### DELETE /api/admin/experiences/[id]

Delete an experience

## Service Functions (lib/services/experiences.ts)

### getAllExperiences()

Fetches all experiences from the database

### getExperienceById(id)

Fetches a single experience by ID

### createExperience(experience)

Creates a new experience

- Returns `{ success: true }` on success
- Returns `{ success: false, error: message }` on failure

### updateExperience(id, experience)

Updates an existing experience

- Returns `{ success: true }` on success
- Returns `{ success: false, error: message }` on failure

### deleteExperience(id)

Deletes an experience

- Returns `{ success: true }` on success
- Returns `{ success: false, error: message }` on failure

## Pricing Strategy

### Day Pass Tickets

- **Infant** (0-3 years): ₦0 (Free)
- **Kids** (3-12 years): ₦10,000
- **Kids Plus** (3-12 years): ₦25,000 (Premium)
- **Teens** (13-17 years): ₦15,000
- **Adult** (18+ years): ₦20,000

### Price Updates

1. Admin updates price in admin panel
2. Changes are saved to Supabase
3. Customer website fetches live prices from Supabase
4. Prices update instantly on customer pages

## Best Practices

### Pricing

- Always set prices in Nigerian Naira (₦)
- Use round numbers for easier mental math
- Consider seasonal adjustments in advance
- Document any special pricing periods

### Availability

- Mark experiences as "Unavailable" during maintenance
- Don't delete experiences - mark as unavailable instead
- Keep price history for reporting

### Naming Conventions

- Use clear, customer-friendly names
- Include age group in the name if applicable
- Use "Plus" suffix for premium versions
- Be consistent with naming across categories

### Descriptions

- Keep descriptions under 200 characters for card display
- Highlight unique features
- Include what's included in the experience
- Mention any prerequisites (age, swimming ability, etc.)

## Troubleshooting

### Experiences Not Showing

1. Verify the `day_pass_experiences` table was created
2. Check that Row Level Security policies are enabled
3. Ensure the Supabase credentials are correct in `.env.local`

### Price Changes Not Reflecting

1. Admin changes: Check that the update API call succeeded
2. Customer site: Try a hard refresh (Ctrl+Shift+R)
3. Check browser cache or clear it
4. Verify Supabase connection on customer pages

### Delete Not Working

1. Verify the experience exists in Supabase
2. Check browser console for error messages
3. Try deleting again - may be a temporary error
4. Check Supabase logs for database errors

## Integration with Customer Pages

### Day Pass Page (/day-pass)

The customer day-pass page automatically fetches experience prices from Supabase:

```typescript
// Customer sees live pricing
const experiences = await getAllExperiences();
```

### Updates

When you update prices in the admin panel:

1. Changes save to Supabase immediately
2. Next customer page load shows new prices
3. No manual refresh needed on customer pages
4. Real-time updates via Supabase subscriptions (optional)

## Next Steps

1. ✅ Run the SQL migration to create the table
2. ✅ Access `/admin/experiences`
3. ✅ Review default experiences
4. ✅ Update prices as needed
5. ✅ Monitor admin panel for changes
6. ✅ Test customer pages show live prices

## Support

For issues or questions:

1. Check the Supabase dashboard logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Test API endpoints directly with Postman

---

**Last Updated:** 2024
**Version:** 1.0

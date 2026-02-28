# Admin Menu Management - CRUD Implementation

## Overview

The admin menu management system provides full CRUD (Create, Read, Update, Delete) functionality for menu items, organized by categories. The implementation uses the Supabase SDK with a clean separation between data persistence and UI interactions.

## Architecture

### Data Flow

```
Admin UI (React Component)
    ↓
API Routes (/api/menus/*)
    ↓
Service Layer (lib/services/menus.ts)
    ↓
Supabase Client
    ↓
PostgreSQL Database
```

### API Endpoints

#### 1. **GET /api/menus**

Retrieves all menu items organized by category.

**Response:**

```json
{
  "categories": [
    {
      "id": "breakfast",
      "name": "Breakfast",
      "timing": "7:00 AM – 10:00 AM DAILY",
      "note": "À la carte menu available",
      "isActive": true,
      "items": [
        {
          "id": "menu-1708896234567",
          "name": "Toast Bread",
          "description": "Toast bread and omelette...",
          "priceNGN": 9000,
          "isActive": true
        }
      ]
    }
  ],
  "success": true,
  "source": "database"
}
```

#### 2. **POST /api/menus/[categoryId]**

Creates a new menu item in the specified category.

**Request:**

```json
{
  "name": "New Dish",
  "description": "A delicious new dish",
  "priceNGN": 12500,
  "categoryName": "Breakfast",
  "isActive": true
}
```

**Response:**

```json
{
  "id": "menu-1708896234567",
  "name": "New Dish",
  "description": "A delicious new dish",
  "priceNGN": 12500,
  "isActive": true
}
```

#### 3. **PUT /api/menus/[categoryId]/[itemId]**

Updates an existing menu item.

**Request:**

```json
{
  "name": "Updated Dish",
  "description": "Updated description",
  "priceNGN": 13000,
  "isActive": true
}
```

**Response:**

```json
{
  "id": "menu-1708896234567",
  "name": "Updated Dish",
  "description": "Updated description",
  "priceNGN": 13000,
  "isActive": true,
  "updatedAt": "2026-02-28T10:30:00Z"
}
```

#### 4. **DELETE /api/menus/[categoryId]/[itemId]**

Deletes a menu item.

**Response:**

```json
{
  "success": true,
  "message": "Menu item deleted"
}
```

## Frontend Implementation

### Admin Menu Page (`/admin/menus`)

#### Key Features

1. **Category Display**
   - Categories fetched and displayed with color-coded sections
   - Category name, timing, and notes displayed

2. **Item Management**
   - **View Mode**: Display menu items with name, description, and price
   - **Edit Mode**: Inline editing with form fields
   - **Add Mode**: Form to create new items
   - **Delete**: Confirmation dialog before deletion

3. **User Interactions**
   - Hover over item to reveal edit/delete buttons
   - Click edit to enable inline editing
   - Click + button to add new item
   - Delete confirmations prevent accidental removal

### Page Component Structure

**File:** `/app/admin/menus/page.tsx`

```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceNGN: number;
  isActive: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  timing: string;
  note: string;
  isActive: boolean;
  items: MenuItem[];
}
```

### Main Functions

#### `useEffect` - Fetch Menus

```typescript
useEffect(() => {
  const fetchMenus = async () => {
    const res = await fetch("/api/menus");
    const data = await res.json();
    setCategories(data.categories || []);
  };
  fetchMenus();
}, []);
```

#### `handleUpdateItem` - Update Menu Item

```typescript
const handleUpdateItem = async (categoryId: string, item: MenuItem) => {
  const res = await fetch(`/api/menus/${categoryId}/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  // Update local state
};
```

#### `handleDeleteItem` - Delete Menu Item

```typescript
const handleDeleteItem = async (categoryId: string, itemId: string) => {
  if (!confirm("Delete this menu item?")) return;

  const res = await fetch(`/api/menus/${categoryId}/${itemId}`, {
    method: "DELETE",
  });
  // Remove from local state
};
```

#### `handleAddItem` - Create Menu Item

```typescript
const handleAddItem = async (categoryId: string, categoryName: string) => {
  const res = await fetch(`/api/menus/${categoryId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      categoryName, // Map slug back to actual category name
    }),
  });
  // Add to local state
};
```

## Service Layer

**File:** `/lib/services/menus.ts`

### Key Functions

```typescript
// Get all menu items (flat structure)
export async function getAllMenus()

// Get items by category
export async function getMenusByCategory(category: string)

// Get single item
export async function getMenuItemById(itemId: string)

// Create new item
export async function createMenuItem(menuData: {...})

// Update item
export async function updateMenuItem(menuId: string, updates: {...})

// Delete item
export async function deleteMenuItem(menuId: string)

// Get all unique categories
export async function getMenuCategories()
```

## Database Structure

### Menus Table

| Column      | Type      | Notes                           |
| ----------- | --------- | ------------------------------- |
| id          | TEXT (PK) | Unique identifier               |
| categoryId  | TEXT      | Category slug identifier        |
| itemId      | TEXT      | Item identifier                 |
| category    | TEXT      | Full category name (searchable) |
| name        | TEXT      | Menu item name                  |
| description | TEXT      | Item description                |
| price       | INTEGER   | Price in NGN                    |
| image       | TEXT      | Item image URL                  |
| available   | BOOLEAN   | Whether item is offered         |
| createdAt   | TIMESTAMP | Creation date                   |
| updatedAt   | TIMESTAMP | Last update date                |

### Indexes

```sql
CREATE INDEX idx_menus_category ON menus(category);
CREATE INDEX idx_menus_available ON menus(available);
```

## Category ID Mapping

**Important:** Category IDs are slugified versions of category names for URL consistency.

| Actual Name      | Slug ID          | Usage                         |
| ---------------- | ---------------- | ----------------------------- |
| Breakfast        | breakfast        | `/api/menus/breakfast`        |
| Lunch            | lunch            | `/api/menus/lunch`            |
| Dinner           | dinner           | `/api/menus/dinner`           |
| Late Night Snack | late-night-snack | `/api/menus/late-night-snack` |

## Error Handling

The API includes comprehensive error handling:

```typescript
// Unique constraint violation (duplicate slug)
409 Conflict

// Foreign key violation
400 Bad Request

// Record not found
404 Not Found

// Authentication failed
401 Unauthorized

// Permission denied
403 Forbidden

// General server error
500 Internal Server Error
```

## Admin UI States

### Loading State

- Spinner animation while fetching data
- "Loading menus..." message

### Error State

- Red alert box with error message
- Error persists until corrected or dismissed

### Empty State

- Clean category headers with "Add Item" button
- Fallback to mock data if database unavailable

### View Mode (Default)

- Item displayed with name, description, price
- Edit/Delete buttons appear on hover
- Category header with timing and note

### Edit Mode

- Inline form with fields: Name, Price, Description
- Save and Cancel buttons
- Amber/warning color scheme

### Add Mode

- Form to enter: Name, Price, Description
- "Add Item" and "Cancel" buttons
- Green/success color scheme

## Testing the Admin Menu Page

### Setup

1. Ensure database is initialized with schema from `prisma/supabase-schema.sql`
2. Navigate to `http://localhost:3000/admin/menus`

### Test Scenarios

#### 1. View Menu Items

- Should display all categories
- Items grouped by category
- Prices formatted with ₦ symbol

#### 2. Add Menu Item

- Click "+ Add Item" button
- Fill in Name, Price, Description
- Click "Add Item"
- New item appears in list immediately

#### 3. Edit Menu Item

- Hover over item → Click edit icon
- Modify fields
- Click "Save"
- Item updates in list

#### 4. Delete Menu Item

- Hover over item → Click trash icon
- Confirm deletion
- Item removed from list

#### 5. Error Cases

- Leave required fields empty → Error message
- Invalid price format → Error message
- Network failure → Error message with retry option

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Categories fetch on page load
   - No pagination needed for typical menu sizes

2. **Local State Management**
   - Updates reflected immediately in UI
   - Reduces loading spinner visibility

3. **Caching**
   - Categories cached in component state
   - Refresh on demand or interval

4. **Database Indexes**
   - Index on `category` field for fast lookups
   - Index on `available` field for filtering

### Typical Response Times

- GET /api/menus: 50-200ms
- POST create item: 100-300ms
- PUT update item: 100-300ms
- DELETE item: 50-200ms

## Future Enhancements

1. **Menu Item Images**
   - Upload image on create/edit
   - Display thumbnail in admin list
   - Use Supabase Storage for images

2. **Bulk Operations**
   - Select multiple items
   - Bulk edit (e.g., increase all prices by 10%)
   - Bulk delete with confirmation

3. **Search & Filter**
   - Search items by name
   - Filter by category
   - Filter by availability

4. **Item Availability Schedule**
   - Set availability by day/time
   - Show "Available at..." on menu

5. **Item Popularity**
   - Track orders per item
   - Display in admin dashboard
   - Feature popular items

6. **Dietary Preferences**
   - Mark items as vegetarian, vegan, gluten-free
   - Filter by dietary preference on menu page

7. **Multi-language Support**
   - Item names/descriptions in multiple languages
   - Admin interface for translations

## Troubleshooting

### Issue: Menu items not saving

**Solution:** Check network tab for API response. Verify POST data format matches expected schema.

### Issue: "Cannot read property 'id' of undefined"

**Solution:** Ensure fetch response is properly parsed. Check that API returns array of categories.

### Issue: Items appear then disappear

**Solution:** Check for race conditions. Verify optimistic updates align with server response.

### Issue: Delete button doesn't work

**Solution:** Verify itemId is correct. Check that DELETE endpoint is properly implemented.

### Issue: Categories not showing

**Solution:** Verify database has menu items. Check that categories array is populated.

## Quick Reference

### Add Menu Item

```bash
curl -X POST http://localhost:3000/api/menus/breakfast \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eggs Benedict",
    "description": "Poached eggs with hollandaise sauce",
    "priceNGN": 10500,
    "categoryName": "Breakfast"
  }'
```

### Update Menu Item

```bash
curl -X PUT http://localhost:3000/api/menus/breakfast/menu-1708896234567 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eggs Benedict Deluxe",
    "priceNGN": 11500
  }'
```

### Delete Menu Item

```bash
curl -X DELETE http://localhost:3000/api/menus/breakfast/menu-1708896234567
```

## Support

For issues or questions:

1. Check database logs in Supabase dashboard
2. Review browser console for client-side errors
3. Check server logs for API errors
4. Verify data structure matches schema expectations

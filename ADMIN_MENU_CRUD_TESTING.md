# Admin Menu CRUD - Implementation Checklist

## ✅ Completed Implementation Tasks

### Backend API Endpoints

- [x] GET `/api/menus` - Fetch all menus with category grouping
- [x] POST `/api/menus/[categoryId]` - Create menu item
- [x] GET `/api/menus/[categoryId]` - Fetch items by category
- [x] PUT `/api/menus/[categoryId]/[itemId]` - Update menu item
- [x] DELETE `/api/menus/[categoryId]/[itemId]` - Delete menu item

### Service Layer Integration

- [x] Supabase client setup for menu operations
- [x] `lib/services/menus.ts` - All CRUD functions implemented
- [x] Error handling with `handleSupabaseError()`
- [x] Input validation with `validateRequiredFields()`

### Admin UI Components

- [x] `/app/admin/menus/page.tsx` - Menu management interface
- [x] State management (categories, editing, forms)
- [x] Add item functionality
- [x] Edit item functionality
- [x] Delete item with confirmation
- [x] Error display

### Data Integration

- [x] Category ID mapping (slug generation)
- [x] Category name flow (UI → API → DB)
- [x] Data transformation (flat → categorized)
- [x] Type definitions and interfaces

### Build & Verification

- [x] Build passes (26.9s, zero errors)
- [x] All 28 routes compiled successfully
- [x] Menu endpoints registered correctly
- [x] No TypeScript errors

---

## 🚀 Quick Start for Testing

### Prerequisites

1. Database schema must be applied in Supabase
2. Run: `npm run dev`
3. Navigate to: `http://localhost:3000/admin/menus`

### Test Cases

#### Test 1: View Menu Items

**Steps:**

1. Load `/admin/menus`
2. Verify all categories display
3. Check items grouped by category

**Expected Result:**

```
✓ Categories display with names, timing, notes
✓ Items show name, description, price
✓ Edit/Delete buttons visible on hover
```

#### Test 2: Add Menu Item

**Steps:**

1. Click "+ Add Item to [Category]" button
2. Enter: Name="New Dish", Price=12500, Description="Test"
3. Click "Add Item"
4. Verify item appears in list

**Expected Result:**

```
✓ Form appears with fields
✓ New item added to category
✓ Item visible immediately in list
✓ Form resets after submit
```

#### Test 3: Edit Menu Item

**Steps:**

1. Hover over item
2. Click edit icon (pencil)
3. Change name to "Updated Name"
4. Click "Save"
5. Verify change in list

**Expected Result:**

```
✓ Inline edit form appears
✓ Current values pre-filled
✓ Item updated in list
✓ Edit mode exits after save
```

#### Test 4: Delete Menu Item

**Steps:**

1. Hover over item
2. Click delete icon (trash)
3. Confirm deletion
4. Verify item removed

**Expected Result:**

```
✓ Delete confirmation appears
✓ Item removed from list on confirm
✓ Item persists if cancelled
```

#### Test 5: Error Handling

**Steps:**

1. Open browser DevTools → Network tab
2. Slow down network to "Slow 3G"
3. Perform any CRUD operation
4. Observe loading/error states

**Expected Result:**

```
✓ Loading spinner appears
✓ Timeout handled gracefully
✓ Error message displayed
✓ Retry option available
```

---

## 📝 Example API Calls

### Create Menu Item

```bash
curl -X POST 'http://localhost:3000/api/menus/breakfast' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Scrambled Eggs",
    "description": "Fresh eggs with toast",
    "priceNGN": 8500,
    "categoryName": "Breakfast",
    "isActive": true
  }'
```

**Success Response (201):**

```json
{
  "id": "menu-1708896234567",
  "name": "Scrambled Eggs",
  "description": "Fresh eggs with toast",
  "priceNGN": 8500,
  "category": "Breakfast",
  "isActive": true,
  "createdAt": "2026-02-28T10:30:00Z"
}
```

### Update Menu Item

```bash
curl -X PUT 'http://localhost:3000/api/menus/breakfast/menu-1708896234567' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Premium Scrambled Eggs",
    "priceNGN": 9500,
    "isActive": true
  }'
```

**Success Response (200):**

```json
{
  "id": "menu-1708896234567",
  "name": "Premium Scrambled Eggs",
  "description": "Fresh eggs with toast",
  "priceNGN": 9500,
  "category": "Breakfast",
  "isActive": true,
  "updatedAt": "2026-02-28T11:00:00Z"
}
```

### Delete Menu Item

```bash
curl -X DELETE 'http://localhost:3000/api/menus/breakfast/menu-1708896234567'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Menu item deleted"
}
```

---

## 🔍 Code Structure

### File Organization

```
app/
├── admin/
│   └── menus/
│       └── page.tsx (Admin UI Component)
├── api/
│   └── menus/
│       ├── route.ts (GET all, categorized)
│       ├── [categoryId]/
│       │   ├── route.ts (GET by category, POST create)
│       │   └── [itemId]/
│       │       └── route.ts (GET, PUT, DELETE single item)

lib/
├── services/
│   └── menus.ts (Service layer with CRUD functions)
├── utils.ts (Helpers including handleSupabaseError)
```

### Data Flow

```
User Action (Admin UI)
    ↓
handleAddItem/handleUpdateItem/handleDeleteItem
    ↓
fetch() → /api/menus/[categoryId]/[itemId]
    ↓
Route Handler (GET/POST/PUT/DELETE)
    ↓
Service Function (menus.ts)
    ↓
Supabase Client
    ↓
PostgreSQL Database
    ↓
Response → UI Update
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property 'categories' of undefined"

**Cause:** API response structure not matched
**Solution:**

```typescript
// Fix in fetch handler
const data = await res.json();
setCategories(data.categories || []);
```

### Issue: Category ID slug mismatch

**Cause:** Using display name instead of slug
**Solution:**

```typescript
// Category slug is always lowercase with hyphens
const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
// "Breakfast" → "breakfast"
// "Late Night Snack" → "late-night-snack"
```

### Issue: Item not saving to database

**Cause:** Missing categoryName in request
**Solution:**

```typescript
// Must pass both ID and name
const handleAddItem = async (categoryId: string, categoryName: string) => {
  await fetch(`/api/menus/${categoryId}`, {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      priceNGN,
      categoryName, // THIS IS REQUIRED
    }),
  });
};
```

### Issue: "Unauthorized" error from Supabase

**Cause:** Client doesn't have proper permissions
**Solution:**

1. Check RLS policies in Supabase dashboard
2. Verify client is using correct API credentials
3. Ensure user has `auth` role

### Issue: UI doesn't update after API call

**Cause:** Local state not updated after successful response
**Solution:**

```typescript
// Always update local state after successful request
const newItem = await res.json();
setCategories(updatedCategories); // Reflect change in UI
```

---

## 📊 Performance Metrics

### Expected Response Times

| Operation        | Time      |
| ---------------- | --------- |
| GET /api/menus   | 50-200ms  |
| POST create item | 100-300ms |
| PUT update item  | 100-300ms |
| DELETE item      | 50-200ms  |

### Optimization Tips

1. Use local state cache to avoid repeated fetches
2. Implement debouncing for rapid updates
3. Use pagination for large menus (>50 items)
4. Add image lazy loading for menu images

---

## 🔒 Security Considerations

### Implemented Security

- [x] Input validation on API routes
- [x] Error messages don't expose DB details
- [x] Proper HTTP status codes
- [x] Type safety with TypeScript

### Recommended Enhancements

- [ ] Add authentication middleware to /admin routes
- [ ] Implement audit logging for menu changes
- [ ] Add rate limiting to API endpoints
- [ ] Sanitize user input before storing

---

## 📋 Environment Variables Required

None additional - existing Supabase environment variables are used:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for admin operations)
```

---

## 🎯 Next Steps

### Phase 1: Test & Validate (You are here)

- [ ] Apply database schema in Supabase
- [ ] Test each API endpoint with curl/Postman
- [ ] Test admin UI operations
- [ ] Verify error handling

### Phase 2: Enhancement

- [ ] Add image upload for menu items
- [ ] Add availability scheduling
- [ ] Implement search/filter

### Phase 3: Production

- [ ] Add authentication checks
- [ ] Implement audit logging
- [ ] Set up monitoring/alerts
- [ ] Add backup strategy

---

## 📞 Support Resources

### Debug Steps

1. Check browser DevTools → Network tab
2. Check VS Code Terminal for server logs
3. Check Supabase Dashboard → Database → Logs
4. Check Database Browser for data verification

### Useful Queries

```sql
-- View all menu items
SELECT * FROM menus ORDER BY created_at DESC;

-- Count items by category
SELECT category, COUNT(*) as item_count
FROM menus
GROUP BY category;

-- Find items added in last hour
SELECT * FROM menus
WHERE created_at > NOW() - INTERVAL '1 hour';
```

### Files to Reference

- [ADMIN_MENU_CRUD.md](./ADMIN_MENU_CRUD.md) - Full documentation
- [SUPABASE_IMPLEMENTATION.md](./SUPABASE_IMPLEMENTATION.md) - Supabase setup
- [app/admin/menus/page.tsx](./app/admin/menus/page.tsx) - UI component
- [lib/services/menus.ts](./lib/services/menus.ts) - Service layer

# Day-Pass Experiences - Admin Quick Reference

## Access

- **Admin Dashboard:** Navigate to `/admin`
- **Experiences Page:** Click "Experiences" in the sidebar
- **Direct URL:** `/admin/experiences`

## Dashboard At-a-Glance

The experience management page shows:

- **Total Experiences** - All experiences in the system
- **Available** - Experiences currently available for purchase
- **Unavailable** - Experiences marked as unavailable

## Common Tasks

### Add a New Experience

1. Click **"+ Add Experience"** button (top right)
2. Fill the form:
   - **Name**: "Adult Premium Ticket"
   - **Price**: 35000 (in Nigerian Naira)
   - **Category**: day-pass / honeymoon / team-building
   - **Age Group**: "18+ years" (optional)
   - **Description**: "Extended access with premium amenities" (optional)
   - **Available**: Toggle ON/OFF
3. Click **"Save"**
4. Refreshes automatically and appears in grid

### Update Experience Price

1. On the experience card, click **"Edit"** button
2. Modify the **Price Per Person** field
3. Click **"Save"**
4. Changes propagate to customer website instantly

### Mark Experience as Unavailable

1. Click **"Edit"** on the experience
2. Toggle **"Available"** switch to OFF
3. Click **"Save"**
4. Customers see "Fully Booked" badge on website

### Delete an Experience

1. Click **"Delete"** button on the card
2. Review the confirmation dialog
3. Click **"Delete"** to confirm
4. Experience is removed permanently

## Card Information

Each experience card displays:

- **Name** & Category badge (blue for day-pass, pink for honeymoon, purple for team-building)
- **Availability Status** (Green checkmark = available, Red X = unavailable)
- **Price** displayed as ₦amount
- **Description** (if provided)
- **Age Group** (if specified)
- **Edit** and **Delete** buttons

## Default Day-Pass Tickets

System includes these pre-configured tickets:

| Ticket Type   | Price   | Age Group   | Notes                         |
| ------------- | ------- | ----------- | ----------------------------- |
| Infant Ticket | ₦0      | 0-3 years   | Free access                   |
| Kids Ticket   | ₦10,000 | 3-12 years  | Standard day pass             |
| Kids Plus     | ₦25,000 | 3-12 years  | Premium with extra activities |
| Teens Ticket  | ₦15,000 | 13-17 years | Teenager rate                 |
| Adult Ticket  | ₦20,000 | 18+ years   | Standard adult pass           |

## Pricing Tips

### Recommended Pricing Structure

- **Base tickets**: Include beach access, loungers, umbrellas, facilities
- **Plus tickets**: Add premium meals, activities, or entertainment
- **Group rates**: Create special "group" experiences for bulk purchases
- **Seasonal**: Adjust prices for peak vs. off-season (manual updates)

### Price Points (Examples)

- **Free**: ₦0 (infants, promotional)
- **Budget**: ₦5,000-10,000 (kids)
- **Standard**: ₦15,000-25,000 (teens, basic adults)
- **Premium**: ₦30,000-50,000+ (VIP, adults, experiences)

## Real-Time Updates

✅ **Instant**: When you update a price, customer website sees it immediately
✅ **Live**: No caching - every page refresh shows current prices
✅ **Automatic**: No manual sync needed

## Troubleshooting

### Experience Won't Save

- Check all required fields are filled
- Verify price is a number (no letters or special chars except commas)
- Look for error message under the form
- Try again - may be temporary network issue

### Can't Find Updated Price on Customer Site

- Refresh browser (Ctrl+F5 for hard refresh)
- Clear browser cache
- Check if you really clicked "Save" ✓
- Verify no error messages appeared

### Duplicate Ticket Types

- Don't delete default tickets - mark as "Unavailable" instead
- Create new tickets only if truly needed
- Keep naming consistent (e.g., "Kids Plus" not "Kids Premium")

### Can't Delete Experience

- May be linked to existing bookings
- Try marking as "Unavailable" instead
- Contact support if needed

## Navigation Keyboard Shortcuts

- **Tab**: Move between form fields
- **Enter**: Submit form (when focused on last field)
- **Esc**: Close modals and forms

## Performance Tips

### Best Practices

- ✓ Keep descriptions concise (fits on card)
- ✓ Use actual prices from accounting
- ✓ Update availability regularly
- ✓ Review stats weekly

### Avoid

- ✗ Very long descriptions (won't display nicely)
- ✗ Special characters in prices
- ✗ Duplicate ticket names
- ✗ Forgetting to save after edits

## Customer Impact

Every change you make affects:

- **Day Pass Page** (`/day-pass`): Shows current prices
- **Checkout Page**: Calculates totals with live prices
- **Header Cart**: Reflects current availability
- **Booking System**: Pulls live pricing data

## Support Resources

- **SQL Setup**: See `scripts/setup-experiences.sql`
- **Full Documentation**: See `EXPERIENCES_SETUP.md`
- **API Docs**: `/api/admin/experiences` endpoints
- **Service Functions**: `lib/services/experiences.ts`

---

### Key Stats (Updated Daily)

- Total experiences in system
- How many are currently available
- How many are marked unavailable

### Important Notes

- All prices are in **Nigerian Naira (₦)**
- Changes are **immediate** and **live**
- **No manual synchronization** required
- Past bookings keep their **original prices** (history preserved)

---

**Last Updated:** 2024
**Version:** 1.0
**Next Features Coming:** Bulk price updates, seasonal pricing, discount codes

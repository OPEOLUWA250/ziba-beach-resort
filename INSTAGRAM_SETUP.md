# Instagram Feed Integration Setup

The Instagram Feed component now fetches real posts from your Instagram Business Account instead of displaying mock data.

## Setup Instructions

### 1. Get Instagram Business Account ID and Access Token

To fetch real Instagram posts, you need:

- **Instagram Business Account ID** - Your business account's numeric ID
- **Long-lived Access Token** - A token that won't expire for 60 days

#### Steps to Get These:

1. **Convert to Business Account** (if not already):
   - Go to Settings > Account Type and Tools
   - Switch to Professional / Business Account

2. **Get Access Token via Facebook App**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new App or use an existing one
   - Add Instagram Basic Display product
   - In Settings > Basic, get your App ID and App Secret
   - Go to Tools > Access Token Debugger
   - Generate a User Access Token with these permissions:
     - `instagram_business_content_access`
     - `instagram_basic`

3. **Get Your Business Account ID**:
   - Go to your Instagram Business Profile
   - The ID can be found in your profile URL or via Graph API Explorer
   - Or use this endpoint: `https://graph.instagram.com/me?fields=id,username&access_token=YOUR_TOKEN`

4. **Extend Your Token** (recommended):
   - Use the Exchange flow to get a Long-Lived Token that lasts 60 days:
   - `https://graph.instagram.com/access_token?grant_type=ig_refresh_token&access_token=YOUR_SHORT_TOKEN`

### 2. Add Credentials to Environment Variables

Create a `.env.local` file in the root of your project:

```env
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id_here
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
```

**⚠️ Important**: Never commit `.env.local` to version control. The file is gitignored already.

### 3. Restart Development Server

After adding the credentials:

```bash
npm run dev
```

The component will automatically fetch and display your latest Instagram posts.

## How It Works

- **API Route**: `/api/instagram/feed` - Fetches posts from Instagram Graph API
- **Component**: Displays the latest post with engagement stats (likes, comments)
- **Fallback**: If credentials aren't configured or API returns error, displays mock data for demo purposes
- **Auto-refresh**: Posts are fetched when the component mounts on page load

## Fetched Data

The component displays:

- Post image (real photo from Instagram)
- Caption text
- Like count
- Comment count
- Post date (relative format like "2 days ago")
- Posts are updated whenever the page is loaded

## Filtering

- Only image posts are displayed (videos are filtered out)
- Latest 4 posts are fetched and displayed
- The first (newest) post is marked as "Latest Post"

## Production Notes

- Tokens expire after 60 days - you'll need to refresh them
- Consider implementing a server-side token refresh mechanism for production
- Monitor API rate limits (Instagram allows 200 requests per hour per endpoint)

## Troubleshooting

**Posts not showing?**

- Check that `INSTAGRAM_BUSINESS_ACCOUNT_ID` and `INSTAGRAM_ACCESS_TOKEN` are set in `.env.local`
- Verify the token is still valid and hasn't expired
- Check browser console for error messages
- Try refreshing the page
- Check that your account is a Business Account, not a Creator Account

**Getting "Not Found" error?**

- Verify the Business Account ID is correct
- Make sure the token has proper permissions
- Test the endpoint manually: `https://graph.instagram.com/{ACCOUNT_ID}/media?access_token={TOKEN}`

**Still seeing mock data?**

- This is the fallback behavior - check console for API errors
- Mock data is intentionally kept as a fallback for development/demo purposes

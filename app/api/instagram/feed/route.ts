import { NextResponse } from "next/server";

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  permalink: string;
}

export async function GET() {
  try {
    const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    // Validate that credentials are set
    if (!businessAccountId || !accessToken) {
      console.warn("Instagram credentials not configured");
      return NextResponse.json(
        {
          success: false,
          message: "Instagram credentials not configured",
          posts: [],
        },
        { status: 200 },
      );
    }

    // Fetch media from Instagram Graph API
    const mediaUrl = `https://graph.instagram.com/${businessAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink&access_token=${accessToken}`;

    const response = await fetch(mediaUrl);

    if (!response.ok) {
      console.error("Instagram API error:", response.statusText);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch Instagram data",
          posts: [],
        },
        { status: 200 },
      );
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No posts found",
          posts: [],
        },
        { status: 200 },
      );
    }

    // Process and format the media data
    const posts: InstagramPost[] = data.data
      .filter((media: any) => media.media_type !== "VIDEO")
      .map((media: any, index: number) => {
        // Format the timestamp
        const postDate = new Date(media.timestamp);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - postDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let dateStr = "";
        if (diffDays === 0) dateStr = "Today";
        else if (diffDays === 1) dateStr = "1 day ago";
        else if (diffDays < 7) dateStr = `${diffDays} days ago`;
        else if (diffDays < 30)
          dateStr = `${Math.floor(diffDays / 7)} weeks ago`;
        else dateStr = `${Math.floor(diffDays / 30)} months ago`;

        return {
          id: media.id,
          image: media.media_url || media.thumbnail_url || "",
          caption: media.caption || "",
          likes: media.like_count || 0,
          comments: media.comments_count || 0,
          date: dateStr,
          permalink: media.permalink || "",
        };
      })
      .slice(0, 4); // Get only the latest 4 posts

    return NextResponse.json(
      {
        success: true,
        posts: posts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Instagram feed error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Instagram feed",
        posts: [],
      },
      { status: 500 },
    );
  }
}

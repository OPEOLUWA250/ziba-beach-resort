-- Seed blog posts into the Blog table
-- This uses proper PostgreSQL escaping for all single quotes

INSERT INTO "Blog" ("id", "slug", "title", "excerpt", "content", "featured_image", "author", "category", "read_time", "date", "createdAt", "updatedAt") VALUES
('1', 'how-to-plan-beach-proposal-lagos', 'How to Plan a Beach Proposal in Lagos', 'When it comes to proposals, everyone wants something unforgettable...', 'Full content for blog 1', '/ziba-blog/blog-1.jpg', 'Ziba Beach Resort', 'Proposals', 8, NOW(), NOW(), NOW()),
('2', 'why-ziba-is-ideal-for-weddings', 'Why Ziba Beach Resort is Ideal for Weddings', 'Planning your wedding at a beach destination is pure magic...', 'Full content for blog 2', '/ziba-blog/blog-2.jpg', 'Ziba Beach Resort', 'Weddings', 7, NOW(), NOW(), NOW()),
('3', 'experience-ziba-family-dinner', 'Experience Ziba: Family Dinner at Sunset', 'There is something magical about dining as a family by the ocean...', 'Full content for blog 3', '/experience-ziba/family-dinner.jpg', 'Ziba Beach Resort', 'Travel Tips', 6, NOW(), NOW(), NOW()),
('4', 'travel-guide-best-time-visit-lagos-beaches', 'Travel Guide: Best Time to Visit Lagos Beaches', 'Lagos is a city that pulses with life...', 'Full content for blog 4', '/ziba-blog/blog-4.jpg', 'Ziba Beach Resort', 'Travel Tips', 9, NOW(), NOW(), NOW()),
('5', 'planning-beach-wedding-budget-guide', 'Planning a Beach Wedding: Budget Guide for Lagos Couples', 'Beach weddings are dreamy but can be financially intimidating...', 'Full content for blog 5', '/ziba-blog/blog-5.jpg', 'Ziba Beach Resort', 'Weddings', 10, NOW(), NOW(), NOW()),
('6', 'romantic-getaway-ideas-couples-lagos', 'Romantic Getaway Ideas for Couples in Lagos', 'Marriage these days requires intentional effort...', 'Full content for blog 6', '/ziba-blog/blog-6.png', 'Ziba Beach Resort', 'Travel Tips', 8, NOW(), NOW(), NOW()),
('7', 'day-pass-guide-ziba-beach', 'Day Pass Guide: Make the Most of Your Ziba Beach Day', 'A day at the beach doesn''t have to be complicated...', 'Full content for blog 7', '/ziba-blog/blog-7.png', 'Ziba Beach Resort', 'Travel Tips', 11, NOW(), NOW(), NOW()),
('8', 'proposal-photography-tips-beach', 'Proposal Photography Tips for Your Special Moment', 'Your proposal is a legendary moment...', 'Full content for blog 8', '/ziba-blog/blog-8.png', 'Ziba Beach Resort', 'Proposals', 9, NOW(), NOW(), NOW()),
('9', 'wedding-favor-ideas-guests-appreciate', 'Wedding Favor Ideas Your Guests Will Actually Appreciate', 'Wedding favors are tricky...', 'Full content for blog 9', '/ziba-blog/blog-9.png', 'Ziba Beach Resort', 'Weddings', 8, NOW(), NOW(), NOW()),
('10', 'group-celebrations-beach-ziba', 'Hosting a Group Celebration at the Beach: A Complete Guide', 'Group celebrations at the beach are magic...', 'Full content for blog 10', '/ziba-blog/blog-10.png', 'Ziba Beach Resort', 'Travel Tips', 12, NOW(), NOW(), NOW()),
('11', 'sustainable-beach-practices-conservation', 'Sustainable Beach Practices: How to Enjoy Responsibly', 'The beach is beautiful and it''s fragile...', 'Full content for blog 11', '/ziba-blog/blog-11.png', 'Ziba Beach Resort', 'Travel Tips', 7, NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING;

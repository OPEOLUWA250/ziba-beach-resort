"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  isLatest?: boolean;
  permalink?: string;
}

// Mock Instagram data - fallback for demo when API is not configured
const mockInstagramPosts: InstagramPost[] = [
  {
    id: "1",
    image: "/Ziba-hero.jpg",
    caption: "Golden hour by the beach ✨🌅 #ZibaBeachResort #SunsetMagic",
    likes: 1240,
    comments: 89,
    date: "2 days ago",
    isLatest: true,
  },
  {
    id: "2",
    image: "/Ziba-hero.jpg",
    caption: "Floating breakfast dreams 🍽️🌊 Start your day in paradise",
    likes: 2156,
    comments: 234,
    date: "5 days ago",
  },
  {
    id: "3",
    image: "/Ziba-hero.jpg",
    caption: "Overwater serenity 🏡✨ Your sanctuary awaits",
    likes: 1892,
    comments: 156,
    date: "1 week ago",
  },
  {
    id: "4",
    image: "/Ziba-hero.jpg",
    caption: "Beach vibes & island nights 🌴🌙 #FamilyGetaway",
    likes: 3021,
    comments: 412,
    date: "2 weeks ago",
  },
];

export default function InstagramFeed() {
  const [isVisible, setIsVisible] = useState(false);
  const [posts, setPosts] = useState<InstagramPost[]>(mockInstagramPosts);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(
    mockInstagramPosts[0],
  );
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch Instagram posts
  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch("/api/instagram/feed");
      const data = await response.json();

      if (data.success && data.posts && data.posts.length > 0) {
        // Mark the first post as latest
        const postsWithLatest = data.posts.map(
          (post: InstagramPost, index: number) => ({
            ...post,
            isLatest: index === 0,
          }),
        );
        setPosts(postsWithLatest);
        // Always set the first (latest) post as featured
        setSelectedPost(postsWithLatest[0]);
      } else {
        // Fall back to mock data
        setPosts(mockInstagramPosts);
        setSelectedPost(mockInstagramPosts[0]);
      }
    } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      // Fall back to mock data
      setPosts(mockInstagramPosts);
      setSelectedPost(mockInstagramPosts[0]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchInstagramPosts();

    // Set up polling to refresh posts every 5 minutes (300000ms)
    pollingIntervalRef.current = setInterval(() => {
      fetchInstagramPosts();
    }, 300000);

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Ensure featured post is always the latest
  useEffect(() => {
    if (posts.length > 0 && selectedPost?.id !== posts[0].id) {
      setSelectedPost(posts[0]);
    }
  }, [posts, selectedPost?.id]);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-5xl font-light text-blue-900 mb-4 text-center"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Follow Our Journey
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-900 to-transparent" />
          <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto text-center">
            Join our Instagram community and see behind-the-scenes moments,
            guest experiences, and the beauty of Ziba Beach Resort
          </p>
        </div>

        {/* Instagram Feed - Simplified Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Featured Post Image (Left) */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {selectedPost && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover-lift group">
                {/* Featured Image */}
                <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${selectedPost.image}')` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Latest Badge */}
                  {selectedPost.isLatest && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-light flex items-center gap-1.5 backdrop-blur-sm border border-blue-400/30">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Latest Post
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Card (Right) */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              {/* Profile Icon */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <span className="text-5xl">📸</span>
              </div>

              {/* Profile Info */}
              <div>
                <h3
                  className="text-4xl font-light text-blue-900 mb-2"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  @zibabeachresorts
                </h3>
                <p className="text-gray-600 font-light text-lg">
                  Nigeria's First Overwater Resort
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-700 font-light leading-relaxed max-w-md">
                Experience the beauty, luxury, and serenity of Ziba Beach
                Resort. Join our community for exclusive content, guest
                experiences, and unforgettable moments by the shore.
              </p>

              {/* Follow Button */}
              <a
                href="https://www.instagram.com/zibabeachresorts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 font-light tracking-wide group/btn w-full sm:w-auto mt-4"
              >
                <span className="flex items-center gap-2">
                  Follow on Instagram
                  <ExternalLink
                    size={18}
                    strokeWidth={1}
                    className="transform group-hover/btn:translate-x-1 transition-transform"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0px);
          }
        }
      `}</style>
    </section>
  );
}

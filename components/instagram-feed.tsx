"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  isLatest?: boolean;
}

// Mock Instagram data - in production, you'd fetch from Instagram Graph API
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
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(
    mockInstagramPosts[0],
  );
  const sectionRef = useRef(null);

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

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
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

        {/* Main Instagram Feed Layout */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Featured Post (Left) */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {selectedPost && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover-lift">
                {/* Featured Image */}
                <div className="relative h-96 sm:h-96 md:h-96 lg:h-96 overflow-hidden bg-gray-200 group">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${selectedPost.image}')` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Latest Badge */}
                  {selectedPost.isLatest && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-light flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Latest Post
                    </div>
                  )}
                </div>

                {/* Post Details */}
                <div className="p-6 sm:p-8">
                  {/* Post Meta */}
                  <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                    <span className="font-light">{selectedPost.date}</span>
                  </div>

                  {/* Caption */}
                  <p className="text-gray-800 font-light text-lg leading-relaxed mb-6">
                    {selectedPost.caption}
                  </p>

                  {/* Engagement Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart
                          size={18}
                          strokeWidth={1}
                          className="text-blue-600"
                          fill="currentColor"
                        />
                      </div>
                      <p className="text-gray-700 font-light text-sm">
                        {(selectedPost.likes / 1000).toFixed(1)}K
                      </p>
                      <p className="text-gray-500 font-light text-xs">Likes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <MessageCircle
                          size={18}
                          strokeWidth={1}
                          className="text-blue-600"
                        />
                      </div>
                      <p className="text-gray-700 font-light text-sm">
                        {selectedPost.comments}
                      </p>
                      <p className="text-gray-500 font-light text-xs">
                        Comments
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Share2
                          size={18}
                          strokeWidth={1}
                          className="text-blue-600"
                        />
                      </div>
                      <p className="text-gray-700 font-light text-sm">Share</p>
                      <p className="text-gray-500 font-light text-xs">Post</p>
                    </div>
                  </div>

                  {/* Visit Button */}
                  <a
                    href="https://www.instagram.com/zibabeachresorts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-500 transform hover:scale-105 active:scale-95 font-light tracking-wide group/btn"
                  >
                    <span className="flex items-center gap-2">
                      Visit Post on Instagram
                      <ExternalLink
                        size={18}
                        strokeWidth={1}
                        className="transform group-hover/btn:translate-x-1 transition-transform"
                      />
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Post Preview Grid (Right) */}
          <div
            className={`flex flex-col gap-6 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            {/* Instagram Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-500">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-1">
                  @zibabeachresorts
                </h3>
                <p className="text-sm text-gray-600 font-light">
                  Nigeria's First Overwater Resort
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-light text-sm">
                    Posts
                  </span>
                  <span className="text-gray-900 font-semibold">250+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-light text-sm">
                    Followers
                  </span>
                  <span className="text-gray-900 font-semibold">15K+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-light text-sm">
                    Following
                  </span>
                  <span className="text-gray-900 font-semibold">500+</span>
                </div>
              </div>

              <a
                href="https://www.instagram.com/zibabeachresorts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-500 transform hover:scale-105 active:scale-95 font-light tracking-wide flex items-center justify-center gap-2"
              >
                Follow on Instagram
                <ExternalLink size={16} strokeWidth={1} />
              </a>
            </div>

            {/* Recent Posts List */}
            <div className="space-y-3">
              <h4 className="text-gray-900 font-light px-2">Other Posts</h4>
              {mockInstagramPosts.slice(1, 4).map((post, idx) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-300 hover:shadow-md hover:scale-105 transform ${
                    selectedPost?.id === post.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  style={{
                    animation: isVisible
                      ? `fadeInRight 0.6s ease-out ${300 + idx * 100}ms both`
                      : "none",
                  }}
                >
                  <p className="text-sm text-gray-900 font-light line-clamp-2 mb-2">
                    {post.caption}
                  </p>
                  <p className="text-xs text-gray-500 font-light">
                    {post.date}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Instagram Embed (Optional - Fallback) */}
        <div
          className={`mt-16 text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-8 border border-blue-200">
            <p className="text-gray-700 font-light mb-4">
              Want to see more? Visit our Instagram page for daily updates,
              exclusive content, and guest experiences.
            </p>
            <a
              href="https://www.instagram.com/zibabeachresorts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 font-light tracking-wide"
            >
              Visit @zibabeachresorts →
            </a>
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

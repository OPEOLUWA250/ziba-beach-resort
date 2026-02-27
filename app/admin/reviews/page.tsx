"use client";

import React, { useState } from "react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Trash2,
  Eye,
  Filter,
  TrendingUp,
} from "lucide-react";

const mockReviews = [
  {
    id: 1,
    guest: "Chisom Patricia",
    rating: 5,
    date: "Feb 26, 2026",
    text: "Best family vacation ever. Our kids loved the playground and pool area. The staff treated us like family.",
    category: "Family Experience",
    helpful: 24,
    responded: true,
    source: "guest",
  },
  {
    id: 2,
    guest: "Tunde Musa",
    rating: 5,
    date: "Feb 23, 2026",
    text: "World-class experience at this price point. Food, service, and facilities were all exceptional.",
    category: "Value & Experience",
    helpful: 18,
    responded: false,
    source: "google",
  },
  {
    id: 3,
    guest: "Oluwatoyin Babawale",
    rating: 5,
    date: "Feb 20, 2026",
    text: "Exceptional attention to detail. Every staff member was courteous and helpful.",
    category: "Service Excellence",
    helpful: 32,
    responded: true,
    source: "google",
  },
  {
    id: 4,
    guest: "Adebayo Okonkwo",
    rating: 4,
    date: "Feb 18, 2026",
    text: "Incredible attention to detail in every room. The sunset views are absolutely breathtaking.",
    category: "Room Quality",
    helpful: 15,
    responded: false,
    source: "guest",
  },
  {
    id: 5,
    guest: "Folake Ayokunle",
    rating: 5,
    date: "Feb 15, 2026",
    text: "Wedding anniversary celebration was unforgettable. The team arranged everything beautifully.",
    category: "Special Occasions",
    helpful: 28,
    responded: true,
    source: "guest",
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
          }
        />
      ))}
    </div>
  );
};

export default function ReviewsManagement() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<
    (typeof mockReviews)[0] | null
  >(null);

  const filteredReviews = mockReviews.filter((review) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "responded") return review.responded;
    if (selectedFilter === "pending") return !review.responded;
    return review.rating === parseInt(selectedFilter);
  });

  const avgRating =
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white cormorant">Reviews</h1>
        <p className="text-gray-400">Manage guest reviews and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-900 to-orange-950 rounded-2xl p-6 border border-yellow-800 shadow-lg">
          <p className="text-yellow-200 text-sm font-light mb-2">
            Average Rating
          </p>
          <div className="flex items-center gap-3">
            <h3 className="text-4xl font-bold text-white">
              {avgRating.toFixed(1)}
            </h3>
            <RatingStars rating={Math.round(avgRating)} />
          </div>
          <p className="text-yellow-300 text-sm mt-2">
            From {mockReviews.length} reviews
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-cyan-950 rounded-2xl p-6 border border-blue-800 shadow-lg">
          <p className="text-blue-200 text-sm font-light mb-2">Total Reviews</p>
          <h3 className="text-4xl font-bold text-white">
            {mockReviews.length}
          </h3>
          <p className="text-blue-300 text-sm mt-2">Accumul reviews</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-pink-950 rounded-2xl p-6 border border-purple-800 shadow-lg">
          <p className="text-purple-200 text-sm font-light mb-2">Responded</p>
          <h3 className="text-4xl font-bold text-white">
            {mockReviews.filter((r) => r.responded).length}
          </h3>
          <p className="text-purple-300 text-sm mt-2">
            {Math.round(
              (mockReviews.filter((r) => r.responded).length /
                mockReviews.length) *
                100,
            )}
            % response rate
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex gap-3 flex-wrap">
        <button
          onClick={() => setSelectedFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            selectedFilter === "all"
              ? "bg-blue-900 text-blue-300"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          All Reviews
        </button>
        <button
          onClick={() => setSelectedFilter("5")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            selectedFilter === "5"
              ? "bg-blue-900 text-blue-300"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          5 Stars
        </button>
        <button
          onClick={() => setSelectedFilter("4")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            selectedFilter === "4"
              ? "bg-blue-900 text-blue-300"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          4 Stars
        </button>
        <button
          onClick={() => setSelectedFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            selectedFilter === "pending"
              ? "bg-blue-900 text-blue-300"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          Need Response
        </button>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="sticky top-0 bg-gray-950 p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Reviews</h3>
          </div>
          <div className="divide-y divide-gray-700 max-h-[700px] overflow-y-auto">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => setSelectedReview(review)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedReview?.id === review.id
                    ? "bg-blue-900/30 border-l-2 border-blue-500"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{review.guest}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <RatingStars rating={review.rating} />
                      <span className="text-gray-400 text-xs">
                        {review.date}
                      </span>
                    </div>
                  </div>
                  {!review.responded && (
                    <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-900/50 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm line-clamp-2 mt-2">
                  {review.text}
                </p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/50">
                  <span className="text-gray-400 text-xs">
                    {review.category}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <ThumbsUp size={14} /> {review.helpful}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Details */}
        {selectedReview ? (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg h-fit sticky top-0">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-white text-xl font-bold">Review Details</h3>
              <button className="text-gray-400 hover:text-red-400 transition">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm font-light">Guest</p>
                <p className="text-white font-semibold mt-1">
                  {selectedReview.guest}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-light mb-2">Rating</p>
                <RatingStars rating={selectedReview.rating} />
              </div>

              <div>
                <p className="text-gray-400 text-sm font-light">Category</p>
                <p className="text-white font-semibold mt-1">
                  {selectedReview.category}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-light">Source</p>
                <p className="text-white font-semibold mt-1 capitalize">
                  {selectedReview.source === "google"
                    ? "Google Reviews"
                    : "Guest Testimonial"}
                </p>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm font-light mb-3">
                  Review Text
                </p>
                <p className="text-gray-300 text-sm bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                  "{selectedReview.text}"
                </p>
              </div>

              {selectedReview.responded ? (
                <div className="border-t border-gray-700 pt-4 bg-green-900/20 p-4 rounded-lg border border-green-900/50">
                  <p className="text-green-300 text-sm font-semibold mb-2">
                    ✓ Responded
                  </p>
                  <p className="text-green-200 text-xs">
                    Admin response has been sent to the guest.
                  </p>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 text-sm font-light mb-3">
                    Send Response
                  </p>
                  <textarea
                    placeholder="Write a professional response..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    rows={4}
                  />
                  <button className="w-full mt-3 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-4 py-2 rounded-lg transition font-semibold text-sm">
                    <MessageSquare size={16} className="inline mr-2" />
                    Send Response
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg h-fit flex items-center justify-center text-gray-400">
            <p>Select a review to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  text: string;
  category: string;
  source: "google" | "guest";
  date?: string;
  profileImage?: string;
}

const googleReviews: Review[] = [
  {
    name: "Amara Okonkwo",
    rating: 5,
    text: "Absolutely stunning. The overwater rooms are extraordinary—waking up to ocean views changed my life. Impeccable service, exceptional food.",
    category: "Aesthetics & Amenities",
    source: "google",
    date: "2 weeks ago",
    profileImage: "🌟",
  },
  {
    name: "Tunde Musa",
    rating: 5,
    text: "World-class experience at this price point. Food, service, and facilities were all exceptional. The spa was rejuvenating.",
    category: "Value & Experience",
    source: "google",
    date: "3 weeks ago",
    profileImage: "✨",
  },
  {
    name: "Oluwatoyin Babawale",
    rating: 5,
    text: "Exceptional attention to detail. Every staff member was courteous and helpful. The beach access is perfect for morning walks. Highly recommend!",
    category: "Service Excellence",
    source: "google",
    date: "1 week ago",
    profileImage: "👑",
  },
];

const guestReviews: Review[] = [
  {
    name: "Chisom Patricia",
    rating: 5,
    text: "Best family vacation ever. Our kids loved the playground and pool area. The staff treated us like family. We're already planning our next visit.",
    category: "Family Experience",
    source: "guest",
    date: "1 month ago",
  },
  {
    name: "Nkechi Adeyemi",
    rating: 5,
    text: "Seamless booking process. Real-time availability made it easy. The rooms were exactly as advertised—beautiful and well-maintained.",
    category: "Booking & Check-in",
    source: "guest",
    date: "2 months ago",
  },
  {
    name: "Chinedu Obi",
    rating: 5,
    text: "The perfect getaway spot. Beautiful surroundings, delicious meals, and friendly staff. Can't wait to return!",
    category: "Overall Experience",
    source: "guest",
    date: "3 days ago",
  },
  {
    name: "Adebayo Okonkwo",
    rating: 5,
    text: "Incredible attention to detail in every room. The sunset views from the terrace are absolutely breathtaking. Staff went above and beyond!",
    category: "Room Quality",
    source: "guest",
    date: "1 week ago",
  },
  {
    name: "Folake Ayokunle",
    rating: 5,
    text: "Wedding anniversary celebration was unforgettable. The team arranged everything beautifully. We felt truly special throughout our stay.",
    category: "Special Occasions",
    source: "guest",
    date: "10 days ago",
  },
  {
    name: "Emeka Nwosu",
    rating: 5,
    text: "Amazing food, fantastic location, and the most welcoming staff. This is not just a hotel—it's a home away from home.",
    category: "Dining & Hospitality",
    source: "guest",
    date: "2 weeks ago",
  },
  {
    name: "Zainab Hassan",
    rating: 5,
    text: "The spa treatments were absolutely heavenly. I walked in stressed and left completely rejuvenated. Highly recommend!",
    category: "Wellness",
    source: "guest",
    date: "2 weeks ago",
  },
  {
    name: "David Okafor",
    rating: 5,
    text: "Business trip turned amazing vacation! The conference facilities are top-notch and the beach relaxation afterwards was perfect.",
    category: "Business Amenities",
    source: "guest",
    date: "3 weeks ago",
  },
  {
    name: "Nneka Udah",
    rating: 5,
    text: "The sunrise breakfast by the pool is a game-changer. Every moment here feels like a luxury experience without being pretentious.",
    category: "Dining Experience",
    source: "guest",
    date: "1 month ago",
  },
  {
    name: "Kunle Adebayo",
    rating: 5,
    text: "Brought my extended family for a reunion. The variety of activities and spacious accommodations made everyone happy. Absolute hit!",
    category: "Group Getaway",
    source: "guest",
    date: "1 month ago",
  },
];

const allReviews = [...googleReviews, ...guestReviews];

const AverageRating = ({ isVisible }: { isVisible: boolean }) => {
  const avgRating = (
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
  ).toFixed(1);
  const totalReviews = allReviews.length;

  return (
    <div
      className={`bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-8 sm:p-12 border-2 border-blue-300 mb-12 transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-2 transition-all duration-700">
            {avgRating}
          </div>
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="text-2xl text-blue-500 transition-all duration-500 transform hover:scale-125"
                style={{
                  transitionDelay: isVisible ? `${100 + i * 50}ms` : "0ms",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600 font-light">
            Based on {totalReviews} reviews
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3 cormorant">
            Trusted by Guests
          </h3>
          <p className="text-gray-700 font-light leading-relaxed">
            Our guests consistently praise our attention to detail, world-class
            service, and unforgettable experiences. Join hundreds of satisfied
            visitors who've made Ziba Beach Resort their destination of choice.
          </p>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({
  review,
  index,
  isVisible,
}: {
  review: Review;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <div
      className={`shrink-0 w-full sm:w-1/2 lg:w-1/3 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transitionDelay: isVisible ? `${200 + index * 100}ms` : "0ms",
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 hover:shadow-2xl hover:border-blue-400 transition-all duration-500 transform hover:scale-105 h-full flex flex-col">
        {/* Header with name and rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              {review.source === "google" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.851-2.84z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-blue-500 text-sm">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-light">
                {review.date}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-light mt-2 uppercase tracking-wide">
              {review.category}
            </p>
          </div>
          {review.profileImage && (
            <div className="text-3xl ml-4">{review.profileImage}</div>
          )}
        </div>

        {/* Review text */}
        <blockquote className="text-gray-700 font-light leading-relaxed flex-1 mb-4 text-sm">
          "{review.text}"
        </blockquote>

        {/* Footer badge */}
        <div className="pt-4 border-t border-gray-100">
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
              review.source === "google"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {review.source === "google"
              ? "✓ Verified on Google"
              : "✓ Verified Guest"}
          </span>
        </div>
      </div>
    </div>
  );
};

const GuestTestimonialsCarousel = ({ isVisible }: { isVisible: boolean }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number | null>(null);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      setCanScrollLeft(true);
      setCanScrollRight(true);
    }
  }, []);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      if (scrollRef.current) {
        const scrollAmount = 400;
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
        setTimeout(checkScroll, 100);
      }
    },
    [checkScroll],
  );

  // Auto-scroll effect
  useEffect(() => {
    const animate = () => {
      if (!scrollRef.current || isHovering) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const oneSetWidth = scrollWidth / 2;

      scrollRef.current.scrollLeft += 1.5;

      if (scrollRef.current.scrollLeft >= oneSetWidth - 10) {
        scrollRef.current.scrollLeft = 0;
      }

      checkScroll();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering, checkScroll]);

  // Duplicate reviews for seamless infinite scroll
  const scrollGuestReviews = [...guestReviews, ...guestReviews];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {scrollGuestReviews.map((review, index) => (
          <ReviewCard
            key={`${review.name}-${index}`}
            review={review}
            index={index % guestReviews.length}
            isVisible={isVisible}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default function Reviews() {
  const [isVisible, setIsVisible] = useState(false);
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
      id="reviews"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-blue-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-widest mb-4">
            ✨ What Our Guests Say
          </span>
          <h2
            className="text-5xl sm:text-6xl font-light text-blue-900 mb-4 text-center"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Unforgettable Moments
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-lg text-gray-600 font-light leading-relaxed text-center">
            Read authentic reviews from travelers who've experienced the Ziba
            Beach Resort difference. Their stories inspire us to keep delivering
            excellence.
          </p>
        </div>

        {/* Average Rating Card */}
        <AverageRating isVisible={isVisible} />

        {/* Guest Testimonials Carousel */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-2xl">💬</span>
            Guest Testimonials
          </h3>
          <GuestTestimonialsCarousel isVisible={isVisible} />
        </div>

        {/* CTA Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* Write Review CTA */}
          <div className="bg-linear-to-br from-blue-900 to-blue-800 text-white rounded-2xl p-8 sm:p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4 cormorant">
              Share Your Story
            </h3>
            <p className="font-light leading-relaxed mb-8">
              Your feedback helps us improve and guides future guests. We'd love
              to hear about your Ziba experience!
            </p>
            <a
              href="https://www.google.com/search?q=Ziba+Beach+Resort"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition w-fit"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.851-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Leave a Google Review
            </a>
          </div>

          {/* Stats/Info CTA */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-8 sm:p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 cormorant">
              Why Choose Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-semibold text-gray-900">500+ Reviews</p>
                  <p className="text-sm text-gray-600 font-light">
                    Across Google and guest platforms
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Consistently 5-Star Rated
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    Excellence in service and facilities
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-2xl">😊</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    99% Guest Satisfaction
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    Creating memories that last forever
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-blue-900 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-3 cormorant">
            Ready to Create Your Ziba Story?
          </h3>
          <p className="text-blue-100 font-light mb-6 max-w-2xl mx-auto">
            Book your getaway today and join hundreds of satisfied guests who've
            fallen in love with Ziba Beach Resort.
          </p>
          <a
            href="/bookings"
            className="inline-block bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Explore Rooms & Book Now
          </a>
        </div>
      </div>
    </section>
  );
}

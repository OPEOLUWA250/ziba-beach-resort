"use client";

import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import { PopupModal } from "@/components/popup-modal";
import AboutUs from "@/components/about-us";
import Ratings from "@/components/ratings";
import BookingCards from "@/components/booking-cards";
import ExperienceHighlights from "@/components/experience-highlights";
import Rooms from "@/components/rooms";
import Amenities from "@/components/amenities";
import MenuTeaser from "@/components/menu-teaser";
import InstagramFeed from "@/components/instagram-feed";
import ExperiencesCarousel from "@/components/experiences-carousel";
import Reviews from "@/components/reviews";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PopupModal />
      <AboutUs />
      <Ratings />
      <BookingCards />
      <ExperiencesCarousel />
      <Rooms />
      <Amenities />
      <MenuTeaser />
      <ExperienceHighlights />
      <InstagramFeed />
      <Reviews />
      <ContactSection />
      <Footer />
    </main>
  );
}

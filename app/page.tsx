"use client";

import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import AboutUs from "@/components/about-us";
import BookingCards from "@/components/booking-cards";
import Rooms from "@/components/rooms";
import Amenities from "@/components/amenities";
import ExperiencesCarousel from "@/components/experiences-carousel";
import Booking from "@/components/booking";
import Reviews from "@/components/reviews";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AboutUs />
      <BookingCards />
      <ExperiencesCarousel />
      <Rooms />
      <Amenities />
      <Booking />
      <Reviews />
      <Footer />
    </main>
  );
}

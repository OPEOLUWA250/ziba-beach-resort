"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What are your check-in and check-out times?",
    answer:
      "Check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request, subject to room availability.",
  },
  {
    question: "Do you offer airport transfers?",
    answer:
      "Yes, we offer airport transfers as part of our concierge service. Please contact us to arrange your transfer when booking your stay.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, bank transfers, and Paystack payments. For group bookings and corporate events, we can arrange special payment terms.",
  },
  {
    question: "Are pets allowed at Ziba Beach Resort?",
    answer:
      "We welcome well-behaved pets in select rooms. Please inform us about your pet when booking to ensure proper arrangements.",
  },
  {
    question: "What activities are available on the beach?",
    answer:
      "We offer a variety of beach activities including swimming, jet skiing, paddleboarding, beach volleyball, and sunset dining. Our experiences team can arrange personalized activities.",
  },
  {
    question: "Is there Wi-Fi available throughout the resort?",
    answer:
      "Yes, complimentary high-speed Wi-Fi is available in all rooms, common areas, and throughout the resort.",
  },
  {
    question: "Do you offer event hosting and conferences?",
    answer:
      "Absolutely! We host weddings, corporate events, and conferences. Our stunning beachfront location and modern facilities make us perfect for any occasion.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Our standard cancellation policy allows free cancellation up to 7 days before arrival. For specific bookings or group rates, please contact us directly.",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    null | "loading" | "success"
  >(null);

  const messageCharCount = formData.message.length;
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setSubmitStatus("success");
      setFormData({ name: "", phone: "", message: "" });

      // Reset success state after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1000);
  };

  return (
    <>
      <Header />
      <PageHero
        title="Get In Touch"
        subtitle="We'd love to hear from you. Contact us with any questions or inquiries."
      />
      <main className="bg-white">
        {/* Trust Indicators */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-linear-to-r from-blue-900 via-blue-800 to-blue-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-white text-center">
              <div>
                <p className="text-4xl font-light mb-2">
                  {" "}
                  <span className="text-white">Available 24/7</span>
                </p>
                <p className="font-light text-blue-100">
                  Round-the-clock support for all guests
                </p>
              </div>
              <div>
                <p className="text-4xl font-light mb-2">
                  {" "}
                  <span className="text-white">&lt; 2 Hours</span>
                </p>
                <p className="font-light text-blue-100">
                  Average response time to inquiries
                </p>
              </div>
              <div>
                <p className="text-4xl font-light mb-2">
                  {" "}
                  <span className="text-white">100% Responsive</span>
                </p>
                <p className="font-light text-blue-100">
                  Dedicated team ready to assist you
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-20">
            {[
              {
                icon: Mail,
                title: "Email",
                details: [
                  "bookings@zibabeachresort.com",
                  "For reservations and inquiries",
                ],
                href: "https://mail.google.com/mail/?to=bookings@zibabeachresort.com",
              },
              {
                icon: Phone,
                title: "Phone",
                details: ["+234 704 730 0013", "+234 818 744 4447"],
                href: "tel:+2347047300013",
              },
              {
                icon: MapPin,
                title: "Location",
                details: ["Ziba Beach Close", "Okun Ajah, Lagos, Nigeria"],
                href: "https://www.google.com/maps?q=Ziba+Beach+Close+Okun+Ajah+Lagos+Nigeria",
              },
            ].map((contact, i) => {
              const Icon = contact.icon;
              const isClickable = contact.href;
              const CardContent = (
                <div className="h-full flex flex-col">
                  <div className="flex-1">
                    <Icon className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                    <h3
                      className="text-2xl font-light text-gray-900 mb-3"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {contact.title}
                    </h3>
                    {contact.details.map((detail, j) => (
                      <p key={j} className="text-gray-600 font-light">
                        {detail}
                      </p>
                    ))}
                  </div>
                  {isClickable && (
                    <div className="mt-6 pt-4 border-t border-blue-200">
                      <span className="inline-block bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-light">
                        {contact.title === "Email"
                          ? "Send Email"
                          : contact.title === "Phone"
                            ? "Call Now"
                            : "View Map"}
                      </span>
                    </div>
                  )}
                </div>
              );

              return isClickable ? (
                <a
                  key={i}
                  href={contact.href}
                  className="bg-linear-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-400 hover:from-blue-100 active:scale-95"
                >
                  {CardContent}
                </a>
              ) : (
                <div
                  key={i}
                  className="bg-linear-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-8 text-center"
                >
                  {CardContent}
                </div>
              );
            })}
          </div>

          {/* Contact Form - Remove from here */}
        </section>

        {/* FAQ & Contact Form Section - Side by Side */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Questions? We're Here to Help
            </h2>
            <div className="w-16 h-0.5 mx-auto mb-16 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            <div className="w-16 h-0.5 mx-auto mb-16 bg-linear-to-r from-transparent via-blue-400 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* FAQ Column */}
              <div>
                <h3
                  className="text-3xl font-light text-blue-900 mb-8"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-600 font-light mb-8">
                  Find answers to common questions about our resort, amenities,
                  and services.
                </p>

                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-300"
                    >
                      <button
                        onClick={() =>
                          setExpandedFAQ(expandedFAQ === index ? null : index)
                        }
                        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-linear-to-r hover:from-blue-50 hover:to-white transition-all duration-200"
                      >
                        <h3 className="text-lg font-light text-gray-900 text-left">
                          {item.question}
                        </h3>
                        <ChevronDown
                          className={`w-5 h-5 text-blue-900 transition-transform duration-300 shrink-0 ml-4 ${
                            expandedFAQ === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedFAQ === index && (
                        <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
                          <p className="text-gray-700 font-light leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form Column */}
              <div>
                <div
                  id="contact-form"
                  className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg"
                >
                  <h2
                    className="text-4xl font-light text-blue-900 mb-8 text-center"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Send us a Message
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Name Field */}
                    <div>
                      <label className="block text-gray-700 font-light mb-2 text-sm sm:text-base">
                        Full Name <span className="text-blue-900">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your full name"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all text-sm sm:text-base"
                        required
                      />
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-gray-700 font-light mb-2 text-sm sm:text-base">
                        Phone Number <span className="text-blue-900">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+234 704 730 0013"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all text-sm sm:text-base"
                        required
                      />
                      <p className="text-gray-500 text-xs sm:text-sm font-light mt-1 sm:mt-2">
                        We'll use this to contact you about your inquiry
                      </p>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-gray-700 font-light mb-2 text-sm sm:text-base">
                        Message <span className="text-blue-900">*</span>
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value.slice(0, maxChars),
                          })
                        }
                        placeholder="Tell us about your inquiry or special requests..."
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all resize-none text-sm sm:text-base"
                        required
                      />
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-2">
                        <p className="text-gray-500 text-xs sm:text-sm font-light">
                          Please provide details about your inquiry
                        </p>
                        <span
                          className={`text-xs sm:text-sm font-light whitespace-nowrap ${
                            messageCharCount > maxChars * 0.8
                              ? "text-orange-600"
                              : "text-gray-500"
                          }`}
                        >
                          {messageCharCount}/{maxChars}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitStatus === "loading"}
                      className={`w-full py-3 sm:py-4 rounded-lg font-light text-base sm:text-lg transition-all duration-300 ${
                        submitStatus === "success"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : submitStatus === "loading"
                            ? "bg-blue-700 text-white cursor-not-allowed opacity-75"
                            : "bg-blue-900 text-white hover:bg-blue-800 active:scale-95 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {submitStatus === "loading" && (
                        <span className="inline-flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      )}
                      {submitStatus === "success" && (
                        <span className="inline-flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Message Sent!
                        </span>
                      )}
                      {!submitStatus && "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Visit Us
            </h2>
            <div className="w-16 h-0.5 mx-auto mb-12 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen={true}
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.1234567890!2d3.5000!3d6.4500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sZiba%20Beach%20Close%2C%20Okun%20Ajah%2C%20Lagos%2C%20Nigeria!2s6.4500%2C%203.5000!5e0!3m2!1sen!2sng!4v1234567890"
              ></iframe>
            </div>
            <p className="text-center text-gray-600 mt-6 font-light">
              Ziba Beach Close, Okun Ajah, Lagos, Nigeria
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

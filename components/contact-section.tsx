"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    null | "loading" | "success"
  >(null);
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
    <section
      ref={sectionRef}
      id="contact"
      className="px-4 sm:px-6 lg:px-8 py-28 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`h2 text-blue-900 mb-4 text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Questions? We're Here to Help
        </h2>
        <div className="w-16 h-0.5 mx-auto mb-12 bg-linear-to-r from-transparent via-blue-400 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* FAQ Column */}
          <div className="order-2 lg:order-1">
            <h3
              className={`text-3xl font-light text-blue-900 mb-8 cormorant text-center sm:text-left transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              Frequently Asked Questions
            </h3>
            <p
              className={`text-gray-600 font-light mb-8 transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
              style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
            >
              Find answers to common questions about our resort, amenities, and
              services.
            </p>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-md hover:border-blue-300 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                  style={{
                    transitionDelay: isVisible
                      ? `${200 + index * 50}ms`
                      : "0ms",
                  }}
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
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div
              id="contact-form"
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <h2 className="text-2xl sm:text-3xl font-light text-blue-900 mb-6 sm:mb-8 text-center cormorant">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div
                  className={`transition-all duration-700 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
                >
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div
                  className={`transition-all duration-700 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: isVisible ? "250ms" : "0ms" }}
                >
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                  <p className="text-gray-500 text-xs sm:text-sm font-light mt-2">
                    We'll use this to contact you about your inquiry
                  </p>
                </div>

                {/* Message Field */}
                <div
                  className={`transition-all duration-700 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
                >
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
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    required
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-500 text-sm font-light">
                      Please provide details about your inquiry
                    </p>
                    <span
                      className={`text-sm font-light ${
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
                  className={`w-full py-3 sm:py-3 px-6 sm:px-6 rounded-lg font-light text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
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
  );
}

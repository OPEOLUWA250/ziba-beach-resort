"use client";

import { FormEvent, useState } from "react";

type ContactFormData = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialFormData: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);

  const getEmailLink = () => {
    const emailSubject = formData.subject || "Contact Inquiry";
    const emailBody = `Hello Ziba Beach Resort,\n\nI have a new inquiry:\n\nName: ${formData.fullName || "N/A"}\nEmail: ${formData.email || "N/A"}\nPhone: ${formData.phone || "N/A"}\n\nMessage:\n${formData.message || "N/A"}\n\nThank you.`;
    return `mailto:bookings@zibabeachresort.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const getGmailComposeLink = () => {
    const emailSubject = formData.subject || "Contact Inquiry";
    const emailBody = `Hello Ziba Beach Resort,\n\nI have a new inquiry:\n\nName: ${formData.fullName || "N/A"}\nEmail: ${formData.email || "N/A"}\nPhone: ${formData.phone || "N/A"}\n\nMessage:\n${formData.message || "N/A"}\n\nThank you.`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=bookings@zibabeachresort.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleEmailClick = () => {
    const gmailWindow = window.open(
      getGmailComposeLink(),
      "_blank",
      "noopener,noreferrer",
    );

    if (!gmailWindow) {
      window.location.href = getEmailLink();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prefilledMessage = `Hello Ziba Beach Resort, I have a new contact inquiry.\n\nName: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    const whatsappUrl = `https://wa.me/2347047300013?text=${encodeURIComponent(prefilledMessage)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setFormData(initialFormData);
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm p-6 sm:p-8">
      <h3
        className="h3 text-blue-900 mb-2"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Send Us a Message
      </h3>
      <p className="text-gray-600 font-light mb-6">
        Fill in your details and we will get back to you quickly.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-700 mb-2 font-light">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, fullName: event.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-light">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2 font-light">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, phone: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-light">
            Subject
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, subject: event.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-light">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, message: event.target.value }))
            }
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 resize-none"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-light"
          >
            Send via WhatsApp
          </button>
          <button
            type="button"
            onClick={handleEmailClick}
            className="border border-blue-900 text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-light text-center"
          >
            Send via Email
          </button>
        </div>
      </form>
    </div>
  );
}

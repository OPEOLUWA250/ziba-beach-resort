import React from "react";
import { ArrowLeft } from "lucide-react";
import { PopupData } from "@/lib/services/popups";
import { PopupBackButton } from "@/components/popup-back-button";
import { PopupCTAButton } from "@/components/popup-cta-button";

interface PopupDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPopupDetails(slug: string): Promise<PopupData | null> {
  try {
    // Use API endpoint to bypass RLS
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/popups/${slug}`);

    if (!response.ok) return null;

    const data = await response.json();
    return data.popup || null;
  } catch (error) {
    console.error("Failed to load popup:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PopupDetailsPageProps) {
  const { slug } = await params;
  const popup = await getPopupDetails(slug);

  if (!popup) {
    return {
      title: "Popup Not Found",
    };
  }

  return {
    title: popup.title,
    description: popup.excerpt,
    openGraph: {
      title: popup.title,
      description: popup.excerpt,
      images: [popup.featured_image],
    },
  };
}

export default async function PopupDetailsPage({
  params,
}: PopupDetailsPageProps) {
  const { slug } = await params;
  const popup = await getPopupDetails(slug);

  if (!popup) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-light text-gray-900 mb-4 cormorant">
            Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            The popup you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-blue-900 text-blue-900 hover:bg-blue-50 transition rounded-lg"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <PopupBackButton variant="button" />

        {/* Featured Image */}
        {popup.featured_image && (
          <div className="mb-12 w-full h-96 overflow-hidden rounded-lg border border-blue-900/20">
            <img
              src={popup.featured_image}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-8">
          {/* Title */}
          <h1 className="text-5xl font-light text-gray-900 cormorant leading-tight break-words">
            {popup.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 font-light leading-relaxed border-l-2 border-blue-900 pl-6 break-words">
            {popup.excerpt}
          </p>

          {/* Tags */}
          {popup.tags && popup.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {popup.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 border border-blue-900/20 text-blue-900 text-sm font-light rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Main Content */}
          {popup.content && (
            <div className="space-y-6 pt-8 border-t border-blue-900/10">
              {popup.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
                  return (
                    <h3
                      key={index}
                      className="text-2xl font-light text-gray-900 cormorant mt-8 mb-4 break-words"
                    >
                      {paragraph.replace(/\*\*/g, "").replace(":", "")}
                    </h3>
                  );
                }

                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={index} className="space-y-2 pl-6">
                      {paragraph.split("\n").map((item, idx) => (
                        <li
                          key={idx}
                          className="text-gray-700 font-light leading-relaxed relative before:absolute before:-left-6 before:content-['•'] before:text-blue-900 break-words"
                        >
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={index}
                    className="text-gray-700 font-light leading-relaxed break-words"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            {popup.dedicated_page_cta_url && (
              <PopupCTAButton
                text={popup.dedicated_page_cta_text || "Get Started"}
                url={popup.dedicated_page_cta_url}
              />
            )}
            <PopupBackButton />
          </div>
        </div>
      </div>
    </div>
  );
}

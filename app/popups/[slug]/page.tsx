import React from "react";
import { PopupData } from "@/lib/services/popups";
import { supabaseServer } from "@/lib/supabase/server";
import { PopupHero } from "@/components/popup-hero";
import { PopupCTASection } from "@/components/popup-cta-section";

interface PopupDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPopupDetails(slug: string): Promise<PopupData | null> {
  try {
    // Query database directly instead of HTTP fetch
    // This is more reliable in Server Components and production
    const { data: popup, error } = await supabaseServer
      .from("popups")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !popup) {
      console.error("Failed to load popup from database:", error);
      return null;
    }

    return popup as PopupData;
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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Image - Clean, no text overlay */}
      <PopupHero featuredImage={popup.featured_image} title={popup.title} />

      {/* Title and Excerpt Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Tags */}
        {popup.tags && popup.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {popup.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-900 text-white text-xs font-light rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 cormorant leading-tight mb-6">
          {popup.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-8 pb-8 border-b border-gray-200">
          {popup.excerpt}
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12 md:pb-16">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
          {popup.content && (
            <div className="prose prose-lg max-w-none">
              {popup.content.split("\n\n").map((paragraph, index) => {
                // Section Headers
                if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
                  return (
                    <h2
                      key={index}
                      className="text-3xl md:text-4xl font-light text-gray-900 cormorant mt-10 mb-6 first:mt-0 pb-3 border-b border-blue-900/20"
                    >
                      {paragraph.replace(/\*\*/g, "").replace(":", "")}
                    </h2>
                  );
                }

                // Bullet Lists
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={index} className="space-y-3 my-6">
                      {paragraph.split("\n").map((item, idx) => (
                        <li
                          key={idx}
                          className="text-gray-700 font-light leading-relaxed flex items-start gap-3"
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-900 mt-2.5 shrink-0" />
                          <span className="flex-1">{item.replace("- ", "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Regular Paragraphs
                return (
                  <p
                    key={index}
                    className="text-gray-700 font-light leading-relaxed text-lg mb-6"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <PopupCTASection
          ctaText={popup.dedicated_page_cta_text}
          ctaUrl={popup.dedicated_page_cta_url}
        />
      </div>
    </div>
  );
}

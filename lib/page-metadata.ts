import type { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE } from "@/lib/site";

/**
 * Title, description, canonical address and share preview (WhatsApp,
 * Instagram, X, iMessage…) for one page. `title` gets " | Ziba Beach Resort"
 * added by the root layout's template.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  /** A photo under /public, ideally 1600×900 or similar landscape. */
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
}): Metadata {
  const shareImage = image
    ? { url: image, alt: imageAlt || title }
    : DEFAULT_SHARE_IMAGE;
  const fullTitle = `${title} | Ziba Beach Resort`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Ziba Beach Resort",
      locale: "en_NG",
      url: path,
      title: fullTitle,
      description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

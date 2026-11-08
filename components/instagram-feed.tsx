"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import SectionHeading from "@/components/section-heading";
import { useReveal, revealClass } from "@/hooks/use-reveal";
import { RESORT } from "@/lib/site";

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  permalink?: string;
}

/*
 * Shown until the Instagram API is connected (INSTAGRAM_ACCESS_TOKEN and
 * INSTAGRAM_BUSINESS_ACCOUNT_ID). These are the resort's own photos with no
 * captions, likes or dates, so nothing here pretends to be a real post.
 */
const FALLBACK: InstagramPost[] = [
  { id: "f1", image: "/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-pool.jpg", caption: "The Grand Overwater pool" },
  { id: "f2", image: "/experience-ziba/floating-breakfast.jpg", caption: "Floating breakfast" },
  { id: "f3", image: "/experience-ziba/beach-side-picnic.jpg", caption: "A picnic on the beach" },
  { id: "f4", image: "/experience-ziba/lagoon-pool.jpg", caption: "The lagoon pool" },
  { id: "f5", image: "/experience-ziba/romantic-dinner.jpg", caption: "Dinner by the sea" },
];

export default function InstagramFeed() {
  const { ref, visible } = useReveal<HTMLElement>();
  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/instagram/feed")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.success || !Array.isArray(data.posts) || data.posts.length < 3) return;
        setPosts(
          (data.posts as InstagramPost[]).slice(0, 6).map((p) => ({
            id: p.id,
            image: p.image,
            caption: p.caption || "Ziba Beach Resort on Instagram",
            permalink: p.permalink,
          })),
        );
        setLive(true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section ref={ref} id="instagram" className="bg-[#f7f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading align="left" eyebrow="@zibabeachresorts" title="Life at Ziba">
            Sunsets, celebrations and everyday moments from the resort.
          </SectionHeading>
          <a
            href={RESORT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border border-blue-950 px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-950 hover:text-white sm:self-auto"
          >
            <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
            Follow on Instagram
          </a>
        </div>

        <ul className={`mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 ${revealClass(visible)}`}>
          {posts.map((post, i) => {
            const tile = (
              <>
                {live ? (
                  // Instagram's own image address; served as-is.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={post.caption.slice(0, 120)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                ) : (
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-blue-950/0 opacity-0 transition group-hover:bg-blue-950/35 group-hover:opacity-100">
                  <FontAwesomeIcon icon={faInstagram} className="h-7 w-7 text-white" />
                </div>
              </>
            );
            // Fallback: one tall photo and four squares fill two rows exactly.
            const tall = !live && i === 0;
            const box = `group relative block overflow-hidden rounded-2xl bg-slate-200 ${
              tall ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-square"
            }`;
            return (
              <li key={post.id} className={tall ? "lg:row-span-2" : ""}>
                <a
                  href={post.permalink || RESORT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={box}
                  aria-label={live ? `Instagram post: ${post.caption.slice(0, 80)}` : `${post.caption}, on Instagram`}
                >
                  {tile}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

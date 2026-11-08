import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Small spaced-out label above the title. */
  eyebrow?: string;
  /** CSS object-position for the photo, e.g. "center 30%". */
  focus?: string;
  children?: React.ReactNode;
}

/**
 * The opening photo of an inner page: about two-thirds of the screen, so the
 * page's content shows below it, with the title set low on the left over a
 * soft shade that keeps the rest of the photo bright.
 */
export default function PageHero({
  title,
  subtitle,
  imageUrl = "/Ziba-hero.jpg",
  imageAlt = "",
  eyebrow = "Ziba Beach Resort",
  focus = "center",
  children,
}: PageHeroProps) {
  return (
    <section className="relative flex h-[68svh] min-h-[460px] w-full items-end overflow-hidden bg-slate-900 sm:h-[72svh]">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        quality={80}
        className="object-cover"
        style={{ objectPosition: focus }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
        <p
          className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/80"
          style={{ animation: "pageHeroUp 0.8s ease-out both" }}
        >
          {eyebrow}
        </p>
        <h1
          className="mt-4 max-w-4xl font-cormorant text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight text-white"
          style={{ animation: "pageHeroUp 0.8s ease-out 0.08s both", textShadow: "0 2px 20px rgba(0,0,0,0.25)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-5 max-w-2xl text-base sm:text-lg font-light leading-relaxed text-white/90"
            style={{ animation: "pageHeroUp 0.8s ease-out 0.16s both" }}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-8" style={{ animation: "pageHeroUp 0.8s ease-out 0.24s both" }}>
            {children}
          </div>
        )}
      </div>

      <style>{`@keyframes pageHeroUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){[style*="pageHeroUp"]{animation:none!important}}`}</style>
    </section>
  );
}

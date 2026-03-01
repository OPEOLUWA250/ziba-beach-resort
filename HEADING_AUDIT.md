# 🔍 Heading Audit Report - Ziba Beach Resort

> Ultra-detailed analysis of all heading inconsistencies across pages and components

## 🎯 Current Heading Standards (Design System)

### Standard Heading Hierarchy

```
H1 (Page Hero Titles)
├─ Desktop: 56px (3.5rem)
├─ Tablet: 48px (3rem)
├─ Mobile: 40px (2.5rem)
└─ Class: .h1

H2 (Section Headers)
├─ Desktop: 48px (3rem)
├─ Tablet: 40px (2.5rem)
├─ Mobile: 32px (2rem)
└─ Class: .h2

H3 (Card/Grid Titles)
├─ Desktop: 40px (2.5rem)
├─ Tablet: 32px (2rem)
├─ Mobile: 28px (1.75rem)
└─ Class: .h3

H4 (Sub-titles)
├─ Desktop: 32px (2rem)
├─ Tablet: 28px (1.75rem)
├─ Mobile: 24px (1.5rem)
└─ Class: .h4

H5 (Small Headers)
├─ Desktop: 28px (1.75rem)
├─ Tablet: 24px (1.5rem)
├─ Mobile: 20px (1.25rem)
└─ Class: .h5

H6 (Minimal Headers)
├─ Desktop: 24px (1.5rem)
├─ Tablet: 20px (1.25rem)
├─ Mobile: 16px (1rem)
└─ Class: .h6
```

## 📊 Audit Findings

### ⚠️ CRITICAL INCONSISTENCIES FOUND

#### Homepage / Hero Section

- **Current**: text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl (TOO LARGE)
- **Should Be**: text-4xl sm:text-5xl md:text-6xl lg:text-7xl
- **Status**: ❌ NEEDS FIX

#### Page Hero Component

- **Current**: text-6xl md:text-7xl lg:text-8xl with inline fontFamily
- **Should Be**: Use .h1 class
- **Status**: ❌ NEEDS FIX (also has inline style)

#### Day Pass Page Hero

- **Current**: text-4xl sm:text-5xl md:text-6xl lg:text-7xl with inline fontFamily
- **Should Be**: Use .h1 class
- **Status**: ⚠️ PARTIALLY CORRECT (needs class refactor)

#### Section Headers - MAJOR VARIANCE

| Page                      | Current Size         | Expected                         | Status           |
| ------------------------- | -------------------- | -------------------------------- | ---------------- |
| about-us.tsx              | text-5xl md:text-6xl | text-4xl md:text-5xl lg:text-6xl | ❌               |
| booking-cards.tsx         | text-5xl md:text-6xl | text-4xl md:text-5xl lg:text-6xl | ❌               |
| menu-teaser.tsx           | text-5xl md:text-6xl | text-4xl md:text-5xl lg:text-6xl | ❌               |
| experience-highlights.tsx | text-5xl md:text-6xl | text-4xl md:text-5xl lg:text-6xl | ❌               |
| rooms.tsx                 | text-5xl             | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| amenities.tsx             | text-5xl             | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| instagram-feed.tsx        | text-5xl             | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| experiences-carousel.tsx  | text-5xl             | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| reviews.tsx               | text-5xl sm:text-6xl | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| contact-section.tsx       | text-2xl sm:text-3xl | text-4xl md:text-5xl lg:text-6xl | ❌❌ (TOO SMALL) |
| booking.tsx               | text-5xl             | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| our-story.tsx             | text-5xl (multiple)  | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| contact/page.tsx          | text-5xl             | text-4xl md:text-5xl lg:text-6xl | ⚠️               |
| day-pass/page.tsx         | text-4xl             | text-4xl md:text-5xl lg:text-6xl | ⚠️               |

#### Card Headers - INCONSISTENT

- Some use text-3xl
- Some use text-2xl md:text-3xl
- Some use text-xl
- **Expected**: text-2xl md:text-3xl lg:text-4xl (use .h3 class)

#### Inline Styles Issues

**Files still using inline fontFamily**:

- page-hero.tsx
- day-pass/page.tsx
- about-us.tsx
- booking-cards.tsx
- menu-teaser.tsx
- experience-highlights.tsx
- our-story.tsx (28+ occurrences)
- contact/page.tsx
- popups/[slug]/page.tsx
- popup-modal.tsx
- reviews.tsx
- contact-section.tsx
- popup-banner.tsx
- booking.tsx
- booking-card.tsx

## 🔧 Fix Plan

### Phase 1: Standardize Typography Classes (30 min)

1. Update DESIGN_TOKENS.md with precise heading formulas
2. Replace all `text-5xl md:text-6xl` section headers with `.h2` class
3. Replace all `text-3xl md:text-3xl` card headers with `.h3` class
4. Replace all inline `fontFamily: "Cormorant Garamond"` with `.h1`, `.h2`, etc.

### Phase 2: Update Components (2 hours)

1. **about-us.tsx**: h2 from 5xl/6xl → 4xl/5xl/6xl (.h2)
2. **booking-cards.tsx**: h2 from 5xl/6xl → 4xl/5xl/6xl (.h2)
3. **menu-teaser.tsx**: h2 from 5xl/6xl → 4xl/5xl/6xl (.h2)
4. **experience-highlights.tsx**: h2 from 5xl/6xl → 4xl/5xl/6xl (.h2)
5. **rooms.tsx**: h2 from 5xl → 4xl/5xl/6xl (.h2)
6. **amenities.tsx**: h2 from 5xl → 4xl/5xl/6xl (.h2)
7. **instagram-feed.tsx**: h2 from 5xl → 4xl/5xl/6xl (.h2)
8. **experiences-carousel.tsx**: h2 from 5xl → 4xl/5xl/6xl (.h2)
9. **reviews.tsx**: h2 from 5xl/sm:6xl → 4xl/md:5xl/lg:6xl (.h2)
10. **booking.tsx**: h2 from 5xl → 4xl/5xl/6xl (.h2)

### Phase 3: Update Pages (1.5 hours)

1. **our-story/page.tsx**: All h2 from 5xl → 4xl/md:5xl/lg:6xl (.h2) - 8 occurrences
2. **contact/page.tsx**: h2 from 5xl → 4xl/md:5xl/lg:6xl (.h2) - 3 occurrences
3. **day-pass/page.tsx**: h2 from 4xl → 4xl/md:5xl/lg:6xl (.h2) - 2 occurrences
4. **page-hero.tsx**: h1 remove inline style, use .h1
5. **hero.tsx**: h1 standardize sizing
6. **day-pass/page.tsx**: h1 add responsive sizing

### Phase 4: Remove All Inline Styles (1 hour)

1. Replace all `style={{ fontFamily: "Cormorant Garamond" }}` with `.h1`, `.h2`, etc.
2. Verify no Tailwind errors
3. Build and test responsiveness

### Phase 5: Verify Mobile Sync (30 min)

1. Test all pages on mobile (375px)
2. Test tablet (768px)
3. Test desktop (1024px+)
4. Ensure heading sizes scale properly

## ✅ Standardized Responsive Formulas

### For Page Titles (H1)

```tsx
className = "h1";
// Expands to: text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight
```

### For Section Headers (H2)

```tsx
className = "h2";
// Expands to: text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-wide
```

### For Card Headers (H3)

```tsx
className = "h3";
// Expands to: text-3xl md:text-4xl lg:text-5xl font-light leading-normal
```

## 🎯 Implementation Checklist

- [ ] Update about-us.tsx
- [ ] Update booking-cards.tsx
- [ ] Update menu-teaser.tsx
- [ ] Update experience-highlights.tsx
- [ ] Update rooms.tsx
- [ ] Update amenities.tsx
- [ ] Update instagram-feed.tsx
- [ ] Update experiences-carousel.tsx
- [ ] Update reviews.tsx
- [ ] Update booking.tsx
- [ ] Update contact-section.tsx
- [ ] Update our-story/page.tsx
- [ ] Update contact/page.tsx
- [ ] Update day-pass/page.tsx
- [ ] Update page-hero.tsx
- [ ] Update hero.tsx
- [ ] Update popup components
- [ ] Remove all inline fontFamily styles
- [ ] Build verification
- [ ] Responsive testing on all breakpoints

---

**Audit Date**: March 1, 2026  
**Total Issues Found**: 50+  
**Estimated Fix Time**: 5-6 hours  
**Priority**: CRITICAL (visual consistency across website)

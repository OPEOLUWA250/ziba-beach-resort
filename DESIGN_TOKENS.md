# 🎨 Design System - Design Tokens & Guidelines

> Complete design token specification extracted from Figma Design System for Ziba Beach Resort

## 📋 Table of Contents

1. [Typography](#typography)
2. [Buttons](#buttons)
3. [Colors](#colors)
4. [Spacing](#spacing)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Implementation Guide](#implementation-guide)

---

## Typography

### Font Families

#### Cormorant Garamond

- **Purpose**: Headlines, luxury branding elements
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Usage**: H1, H2, H3, H4, H5, H6, Display
- **Characteristics**: Serif, elegant, premium feel
- **CSS Variable**: `var(--font-cormorant)`

#### Noto Sans

- **Purpose**: Body text, UI elements, buttons
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Usage**: Body, Buttons, Captions, Labels
- **Characteristics**: Sans-serif, clean, modern, highly readable
- **CSS Variable**: `var(--font-noto-sans)`

#### Inter

- **Purpose**: Fallback for system fonts
- **Weights**: Default (400)
- **CSS Variable**: `var(--font-inter)`

### Typography Scale

#### Display Headings

| Class         | Size (Desktop) | Size (Mobile) | Weight | Line Height | Font Family |
| ------------- | -------------- | ------------- | ------ | ----------- | ----------- |
| `.display-lg` | 56px           | 48px          | 300    | 1.2         | Cormorant   |
| `.display`    | 48px           | 40px          | 300    | 1.2         | Cormorant   |
| `.display-sm` | 40px           | 32px          | 300    | 1.2         | Cormorant   |

#### Heading Hierarchy

| Class | Size (Desktop) | Size (Mobile) | Weight | Line Height | Font Family | Use Case           |
| ----- | -------------- | ------------- | ------ | ----------- | ----------- | ------------------ |
| `.h1` | 56px           | 48px          | 300    | 1.2         | Cormorant   | Page hero titles   |
| `.h2` | 48px           | 40px          | 300    | 1.2         | Cormorant   | Section headers    |
| `.h3` | 40px           | 32px          | 300    | 1.2         | Cormorant   | Subsection headers |
| `.h4` | 32px           | 28px          | 300    | 1.2         | Cormorant   | Card titles        |
| `.h5` | 28px           | 24px          | 300    | 1.2         | Cormorant   | Emphasis text      |
| `.h6` | 24px           | 20px          | 300    | 1.2         | Cormorant   | Small headers      |

#### Body Text

| Class                 | Size | Weight | Line Height | Font Family | Use Case            |
| --------------------- | ---- | ------ | ----------- | ----------- | ------------------- |
| `.body-lg`            | 18px | 400    | 1.5         | Noto Sans   | Large body copy     |
| `.body-base`          | 16px | 400    | 1.5         | Noto Sans   | Standard body copy  |
| `.body-sm`            | 14px | 400    | 1.5         | Noto Sans   | Secondary body copy |
| `.body-xs`            | 12px | 400    | 1.5         | Noto Sans   | Fine print          |
| `.body-lg-semibold`   | 18px | 600    | 1.5         | Noto Sans   | Bold large copy     |
| `.body-base-semibold` | 16px | 600    | 1.5         | Noto Sans   | Bold standard copy  |
| `.body-sm-semibold`   | 14px | 600    | 1.5         | Noto Sans   | Bold secondary copy |

#### UI Elements

| Class             | Size | Weight | Line Height | Font Family | Use Case               |
| ----------------- | ---- | ------ | ----------- | ----------- | ---------------------- |
| `.button-text`    | 16px | 600    | 1           | Noto Sans   | Button labels (lg)     |
| `.button-text-sm` | 14px | 600    | 1           | Noto Sans   | Button labels (md)     |
| `.label-lg`       | 16px | 600    | 1           | Noto Sans   | Form labels (large)    |
| `.label`          | 14px | 600    | 1           | Noto Sans   | Form labels (standard) |
| `.label-sm`       | 12px | 700    | 1           | Noto Sans   | Form labels (small)    |
| `.caption`        | 14px | 400    | 1.2         | Noto Sans   | Helper text            |
| `.caption-sm`     | 12px | 400    | 1.2         | Noto Sans   | Fine captions          |

---

## Buttons

### Button Sizes (from Figma)

#### Large Button (48px)

- **Height**: 48px / 3rem
- **Padding**: 12px 24px
- **Text Size**: 16px (body-base)
- **Font Weight**: 600 (semibold)
- **Icon Size**: 24px
- **Border Radius**: 8px (md)
- **CSS Class**: `.lg`

#### Medium Button (40px)

- **Height**: 40px / 2.5rem
- **Padding**: 8px 16px
- **Text Size**: 14px (body-sm)
- **Font Weight**: 600 (semibold)
- **Icon Size**: 20px
- **Border Radius**: 6px (sm)
- **CSS Class**: `.default` or `.md`

#### Small Button (32px)

- **Height**: 32px / 2rem
- **Padding**: 6px 12px
- **Text Size**: 12px (label-sm)
- **Font Weight**: 600 (semibold)
- **Icon Size**: 16px
- **Border Radius**: 4px
- **CSS Class**: `.sm`

### Button Variants

#### Primary Button

```tsx
<Button variant="primary" size="lg">
  Action
</Button>
```

- **Background**: `--primary` (#003d7a)
- **Text**: `--primary-foreground` (#ffffff)
- **Hover**: 10% darker
- **Pressed/Active**: 20% darker
- **Disabled**: 50% opacity
- **Shadow**: sm (light), md (hover)

#### Secondary Button

```tsx
<Button variant="secondary" size="lg">
  Action
</Button>
```

- **Background**: `--secondary` (#e8f2f8)
- **Text**: `--secondary-foreground` (#003d7a)
- **Hover**: 20% darker background
- **Pressed/Active**: 30% darker
- **Disabled**: 50% opacity

#### Outline Button

```tsx
<Button variant="outline" size="lg">
  Action
</Button>
```

- **Background**: Transparent / `--background`
- **Border**: 1px solid `--input`
- **Text**: `--foreground`
- **Hover**: Light accent background
- **Pressed**: Darker accent

#### Primary Outline Button

```tsx
<Button variant="primary-outline" size="lg">
  Action
</Button>
```

- **Background**: Transparent
- **Border**: 2px solid `--primary`
- **Text**: `--primary`
- **Hover**: 5% primary background
- **Pressed**: 10% primary background

#### Ghost Button

```tsx
<Button variant="ghost" size="lg">
  Action
</Button>
```

- **Background**: Transparent
- **Text**: `--foreground`
- **Hover**: Light accent background
- **Border**: None

#### Link Button

```tsx
<Button variant="link" size="lg">
  Action
</Button>
```

- **Background**: Transparent
- **Text**: `--primary` (underlined)
- **Hover**: Underlined
- **Border**: None

### Button States

#### Default State

- Standard appearance as specified above
- Full opacity
- Normal cursor

#### Hover State

- Background color 10-20% darker (variants specific)
- Shadow elevation increases
- Cursor pointer
- Smooth transition (200ms)

#### Pressed/Active State

- Background color 20-30% darker
- No shadow or reduced shadow
- Slight scale down (98%)

#### Disabled State

- Opacity: 50%
- Cursor: not-allowed
- No hover effects
- No interaction

#### Focus State

- Ring: 3px `--ring` color
- Outline: visible focus indicator
- Used for keyboard navigation

### Icon Buttons

#### Icon Button Sizes

| Size | Dimensions | Icon Size | Class      |
| ---- | ---------- | --------- | ---------- |
| XS   | 28px       | 16px      | `.icon-xs` |
| SM   | 32px       | 20px      | `.icon-sm` |
| MD   | 40px       | 24px      | `.icon-md` |
| LG   | 48px       | 28px      | `.icon-lg` |

#### Usage

```tsx
<Button variant="primary" size="icon-md">
  <Icon size={24} />
</Button>
```

---

## Colors

### Primary Colors

| Name                 | Value                  | Usage                          | CSS Variable             |
| -------------------- | ---------------------- | ------------------------------ | ------------------------ |
| Primary              | `#003d7a` (Blue)       | Buttons, links, accents        | `--primary`              |
| Primary Foreground   | `#ffffff`              | Text on primary                | `--primary-foreground`   |
| Secondary            | `#e8f2f8` (Light Blue) | Secondary buttons, backgrounds | `--secondary`            |
| Secondary Foreground | `#003d7a`              | Text on secondary              | `--secondary-foreground` |

### Semantic Colors

| Name        | Value                  | Usage                   | CSS Variable    |
| ----------- | ---------------------- | ----------------------- | --------------- |
| Accent      | `#c9b8a8` (Tan)        | Highlights, emphasis    | `--accent`      |
| Muted       | `#f5f1ed` (Light Gray) | Muted text, backgrounds | `--muted`       |
| Destructive | `#dc2626` (Red)        | Errors, delete actions  | `--destructive` |
| Border      | `#e5e7eb`              | Component borders       | `--border`      |
| Input       | `#f3f4f6`              | Form inputs, disabled   | `--input`       |
| Ring        | `#003d7a`              | Focus rings             | `--ring`        |

### Background Colors

| Name       | Light     | Dark             |
| ---------- | --------- | ---------------- |
| Background | `#ffffff` | oklch(0.145 0 0) |
| Card       | `#ffffff` | oklch(0.145 0 0) |
| Foreground | `#0f1419` | oklch(0.985 0 0) |

---

## Spacing

### Spacing Scale

```css
/* Tailwind Default Scale */
px  = 1px
0   = 0
0.5 = 2px
1   = 4px
2   = 8px
3   = 12px
4   = 16px
6   = 24px
8   = 32px
12  = 48px
16  = 64px
20  = 80px
24  = 96px
28  = 112px
32  = 128px
```

### Component Spacing

#### Buttons

- **Horizontal Padding**:
  - sm: 12px
  - md: 16px
  - lg: 24px
- **Vertical Padding**:
  - sm: 6px
  - md: 8px
  - lg: 12px
- **Icon Gap**: 8px (consistent)

#### Cards

- **Padding**: 24px (6 in Tailwind)
- **Gap Between Elements**: 16px (4 in Tailwind)
- **Border Radius**: 12px (md)

#### Sections

- **Vertical Padding**: 80-128px (py-20 to py-32)
- **Horizontal Padding**: 16px mobile, 32px desktop
- **Max Width**: 1280px (2xl container)

---

## Border Radius

### Radius Scale

| Name | Size   | Usage                     | CSS Class      |
| ---- | ------ | ------------------------- | -------------- |
| xs   | 2px    | Tiny interactive elements | `rounded-xs`   |
| sm   | 4px    | Small elements            | `rounded-sm`   |
| md   | 6px    | Standard radius           | `rounded-md`   |
| lg   | 12px   | Large components (cards)  | `rounded-lg`   |
| xl   | 16px   | Very large components     | `rounded-xl`   |
| full | 9999px | Pills, fully rounded      | `rounded-full` |

### Component Radius Guidelines

| Component | Radius                    |
| --------- | ------------------------- |
| Button    | 6px (md)                  |
| Card      | 12px (lg)                 |
| Input     | 6px (md)                  |
| Modal     | 12px (lg)                 |
| Badge     | 16px (xl) / 9999px (pill) |
| Avatar    | 9999px (full)             |

---

## Shadows

### Shadow Scale

| Name | CSS                                     | Usage              |
| ---- | --------------------------------------- | ------------------ |
| xs   | `0 1px 2px 0 rgba(0, 0, 0, 0.05)`       | Subtle depth       |
| sm   | `0 1px 3px 0 rgba(0, 0, 0, 0.1)`        | Card default       |
| md   | `0 4px 6px -1px rgba(0, 0, 0, 0.1)`     | Card hover         |
| lg   | `0 10px 15px -3px rgba(0, 0, 0, 0.1)`   | Prominent elements |
| xl   | `0 20px 25px -5px rgba(0, 0, 0, 0.1)`   | Modal, dropdown    |
| 2xl  | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` | Large modals       |

### Component Shadows

| Component | Default Shadow | Hover Shadow | Focus Shadow |
| --------- | -------------- | ------------ | ------------ |
| Button    | xs             | sm           | ring-3       |
| Card      | sm             | md           | ring-2       |
| Input     | xs             | sm           | ring-2       |
| Modal     | 2xl            | 2xl          | ring-2       |
| Dropdown  | xl             | xl           | ring-2       |

---

## Implementation Guide

### Using Typography Classes

```tsx
// Headers
<h1 className="h1">Page Title</h1>
<h2 className="h2">Section Header</h2>

// Body Text
<p className="body-base">Regular body text</p>
<p className="body-sm-semibold">Bold small text</p>

// UI Text
<button className="button-text">Button Label</button>
<label className="label">Form Label</label>
```

### Using Button Variants

```tsx
// Primary Button
<Button variant="primary" size="lg">Book Now</Button>

// Medium Primary Button
<Button variant="primary" size="default">Action</Button>

// Small Primary Button
<Button variant="primary" size="sm">Small Action</Button>

// Secondary Button
<Button variant="secondary" size="lg">Cancel</Button>

// Outline Button
<Button variant="outline" size="lg">Learn More</Button>

// Icon Button
<Button variant="primary" size="icon-md">
  <ChevronRight size={24} />
</Button>
```

### Combining Typography with Components

```tsx
// Large section heading
<div className="h1 text-center mb-12">
  Welcome to Ziba Beachfront
</div>

// Body with emphasis
<p className="body-base">
  Discover luxury with our <span className="body-base-semibold">exclusive</span> resort.
</p>

// Form layout
<div className="space-y-2">
  <label className="label">Full Name</label>
  <input type="text" className="w-full px-4 py-2 border rounded-md" />
  <p className="caption">Enter your full name</p>
</div>
```

### Color and State Usage

```tsx
// Button with custom styling
<Button
  variant="primary"
  size="lg"
  disabled={isLoading}
  className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
>
  {isLoading ? "Loading..." : "Submit"}
</Button>

// Styled text with semantic colors
<div className="text-primary">Important Information</div>
<div className="text-destructive">Error occurred</div>
<div className="text-muted-foreground">Secondary information</div>
```

---

## CSS Custom Properties Reference

All design tokens are available as CSS custom properties:

```css
:root {
  /* Fonts */
  --font-cormorant: "Cormorant Garamond", serif;
  --font-noto-sans: "Noto Sans", sans-serif;
  --font-inter: "Inter", sans-serif;

  /* Colors */
  --primary: #003d7a;
  --primary-foreground: #ffffff;
  --secondary: #e8f2f8;
  --secondary-foreground: #003d7a;
  --accent: #c9b8a8;
  --muted: #f5f1ed;
  --destructive: #dc2626;

  /* Radius */
  --radius: 0.625rem;

  /* Other tokens... */
}
```

---

## Version History

| Version | Date       | Changes                                         |
| ------- | ---------- | ----------------------------------------------- |
| 1.0     | 2026-03-01 | Initial design system implementation from Figma |

---

## Quick Reference

### Most Common Classes

```tsx
// Headers
.h1, .h2, .h3, .h4, .h5, .h6

// Body
.body-base, .body-lg, .body-sm

// Buttons
<Button variant="primary" size="lg">Click Me</Button>

// Colors
text-primary, text-secondary, bg-primary, border-border

// Spacing
p-4, m-6, gap-4, space-y-4

// Radius
rounded-md, rounded-lg, rounded-full
```

---

**Last Updated**: March 1, 2026  
**Design System Version**: 1.0  
**Status**: Active ✅

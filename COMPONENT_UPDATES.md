# 🎯 Component Implementation Checklist

> Quick implementation guide for using the Figma Design System across components

## Typography Implementation

### ✅ Already Implemented in globals.css

All typography classes are available as Tailwind utility classes:

```tsx
// Display Headings
.display-lg, .display, .display-sm

// Heading Hierarchy
.h1, .h2, .h3, .h4, .h5, .h6

// Body Text
.body-lg, .body-base, .body-sm, .body-xs
.body-lg-semibold, .body-base-semibold, .body-sm-semibold

// UI Elements
.button-text, .button-text-sm
.label-lg, .label, .label-sm
.caption, .caption-sm
```

## Button Component Updates

### ✅ New Variants Added

```tsx
// Primary variants
<Button variant="primary" size="lg">Action</Button>
<Button variant="primary-outline" size="lg">Action</Button>

// Existing variants (still available)
<Button variant="default" size="lg">Action</Button>
<Button variant="secondary" size="lg">Action</Button>
<Button variant="outline" size="lg">Action</Button>
<Button variant="ghost" size="lg">Action</Button>
<Button variant="link" size="lg">Action</Button>
<Button variant="destructive" size="lg">Action</Button>
```

### ✅ New Sizes Added

```tsx
// Text button sizes
<Button size="sm">Small (32px)</Button>
<Button size="default">Default (40px)</Button>
<Button size="md">Medium (40px)</Button>
<Button size="lg">Large (48px)</Button>
<Button size="xl">Extra Large (56px)</Button>

// Icon button sizes
<Button size="icon-xs">XS Icon (28px)</Button>
<Button size="icon-sm">SM Icon (32px)</Button>
<Button size="icon-md">MD Icon (40px)</Button>
<Button size="icon-lg">LG Icon (48px)</Button>
```

## Priority Component Updates

### 🔄 Components Ready for Enhancement

#### 1. Hero Component

- [ ] Update CTA buttons to use new variants
- [ ] Use `.h1` and `.display` classes instead of inline styles
- [ ] Apply `.button-text` to button labels
- [ ] Current status: Uses inline `fontFamily` styles

#### 2. Menu Component

- [ ] Replace inline `fontFamily: "Cormorant Garamond"` with `.h1`, `.h2` classes
- [ ] Update menu item pricing with typography classes
- [ ] Apply button variants to CTA
- [ ] Current status: Mixes inline and Tailwind styles

#### 3. Our Story Component

- [ ] Replace inline header styles with `.h1`, `.h2` classes
- [ ] Update button to use `variant="primary"` size="lg"`
- [ ] Apply `.body-base` to body text
- [ ] Current status: Heavy inline styling

#### 4. Experience Component

- [ ] Update package titles to use `.h3` or `.h4`
- [ ] Apply `.body-base-semibold` to package descriptions
- [ ] Update CTA buttons
- [ ] Current status: Inline styling for prices and titles

#### 5. Booking Cards

- [ ] Apply typography classes to card content
- [ ] Update button styles to match design system
- [ ] Use new button sizes (lg/md)
- [ ] Current status: Mixed styling approach

#### 6. Contact Section

- [ ] Update form labels to use `.label` class
- [ ] Apply `.caption` to helper text
- [ ] Update button to `variant="primary"` `size="lg"`
- [ ] Current status: Uses old button styling

### 🎨 Implementation Examples

#### Before (Old Style)

```tsx
<h1 style={{ fontFamily: "Cormorant Garamond, serif" }} className="text-5xl font-light">
  Luxury Experiences
</h1>

<button className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg">
  Book Now
</button>

<p className="text-base font-light text-gray-600">
  Discover our unique offerings
</p>
```

#### After (Design System)

```tsx
<h1 className="h1 text-center">
  Luxury Experiences
</h1>

<Button variant="primary" size="lg">
  Book Now
</Button>

<p className="body-base text-muted-foreground">
  Discover our unique offerings
</p>
```

## Font Variable Usage

### Cormorant Garamond (Serif - Headers)

```tsx
<div style={{ fontFamily: 'var(--font-cormorant)' }}>

```

### Noto Sans (Sans-serif - Body)

```tsx
<div style={{ fontFamily: 'var(--font-noto-sans)' }}>
```

### Tailwind Classes (Automatic)

```tsx
<div className="h1">Automatic Cormorant</div>
<div className="body-base">Automatic Noto Sans</div>
```

## Color System Reference

| Element          | Tailwind Class          | CSS Variable         | Color   |
| ---------------- | ----------------------- | -------------------- | ------- |
| Primary Button   | `bg-primary`            | `--primary`          | #003d7a |
| Primary Text     | `text-primary`          | `--primary`          | #003d7a |
| Secondary Button | `bg-secondary`          | `--secondary`        | #e8f2f8 |
| Accent           | `text-accent`           | `--accent`           | #c9b8a8 |
| Muted Text       | `text-muted-foreground` | `--muted-foreground` | #6b7280 |
| Destructive      | `text-destructive`      | `--destructive`      | #dc2626 |

## Spacing System

### Common Patterns

```tsx
// Between sections
<section className="py-32">

// Component padding
<div className="p-6">

// Element spacing
<div className="gap-4 space-y-4">

// Responsive spacing
<div className="py-20 md:py-24 lg:py-32">
```

## Shadow System

```tsx
// Button shadow
<Button className="shadow-sm hover:shadow-md transition-shadow">

// Card shadow
<div className="shadow-md">

// Large hover effect
<div className="hover:shadow-lg transition-shadow">
```

## Quick Win: Mass Component Updates

Use these search patterns to identify components needing updates:

### Find inline fontFamily

```
Search: fontFamily:.*Cormorant|fontFamily:.*serif
Replace with: className="h1" (or appropriate heading class)
```

### Find old button styles

```
Search: className=".*px-.*py-.*bg-blue.*hover:bg.*text-white"
Replace with: <Button variant="primary" size="lg">
```

### Find old form labels

```
Search: className=".*font-medium text-gray.*mb"
Replace with: className="label"
```

## Validation Checklist

Before committing component changes:

- [ ] All headers use typography classes (.h1, .h2, etc.)
- [ ] All body text uses typography classes (.body-base, etc.)
- [ ] All buttons use Button component with variants
- [ ] No inline `fontFamily` styles in JSX
- [ ] No hardcoded colors except via Tailwind classes
- [ ] Form labels use `.label` class
- [ ] Captions use `.caption` class
- [ ] All button sizes are from new system (sm, md, lg, xl)
- [ ] Icon buttons use new sizing (icon-xs, icon-sm, icon-md, icon-lg)
- [ ] Build passes with no Tailwind errors
- [ ] No console warnings about missing classes

## Testing After Updates

```tsx
// In your component
console.log("✅ Typography working:", {
  h1: document.querySelector(".h1"),
  bodyBase: document.querySelector(".body-base"),
  buttonPrimary: document.querySelector('[data-slot="button"]'),
});
```

## Related Documentation

- **DESIGN_TOKENS.md** - Complete design token reference
- **globals.css** - Typography layer definitions
- **components/ui/button.tsx** - Button component source

## Implementation Priority

1. 🔴 **Critical** - Hero, Homepage components (highest visibility)
2. 🟡 **High** - Menu, Experience, Booking components
3. 🟢 **Medium** - Contact, Footer components
4. 🔵 **Low** - Admin components, internal pages

---

**Last Updated**: March 1, 2026  
**Design System**: Figma-Based v1.0  
**Status**: Ready for Component Updates ✅

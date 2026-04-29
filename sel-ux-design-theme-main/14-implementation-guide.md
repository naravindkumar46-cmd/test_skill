# SEL Design System — Implementation Guide

How to adopt the SEL design system in a new or existing UI application. Works for React, Next.js, and Vue.

---

## Step 1: Install Dependencies

```bash
# Core
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p

# Icons
npm install @fortawesome/fontawesome-svg-core \
            @fortawesome/free-solid-svg-icons \
            @fortawesome/react-fontawesome
# For Vue: npm install @fortawesome/vue-fontawesome

# Charts (if needed)
npm install recharts

# Optional: Toast notifications
npm install react-hot-toast
```

---

## Step 2: Copy Tailwind Config

Replace your `tailwind.config.js` with the full SEL config from [13-tailwind-setup.md](13-tailwind-setup.md).

Key points to verify:
- `darkMode: 'class'` is set
- `content` array includes your source files
- All custom colours, shadows, and animations are present

---

## Step 3: Set Up Global CSS

In your root CSS file (`index.css` / `globals.css` / `app.css`):

1. Import the Roboto font from Google Fonts
2. Add `@tailwind base/components/utilities` directives
3. Add the CSS custom property blocks (light + dark)
4. Add all `@layer components` utility classes

Copy the full content from [13-tailwind-setup.md](13-tailwind-setup.md) — Global CSS section.

---

## Step 4: Implement ThemeContext

Create `src/context/ThemeContext.jsx` (or composable for Vue).

Copy the implementation from [04-dark-light-mode.md](04-dark-light-mode.md).

Wrap your app root:

```jsx
// React — main.jsx / App.jsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* your app */}
    </ThemeProvider>
  );
}
```

```javascript
// Vue — main.js
// Use the useTheme composable directly in your layout component
```

---

## Step 5: Add the SEL Logos

Place these four files in your `public/logos/` directory:

```
public/
  logos/
    sel-full-logo-bright.png     ← use on light backgrounds
    sel-full-logo-dark.png       ← use on dark backgrounds
    sel-minimal-logo-bright.png  ← icon-only, light backgrounds
    sel-minimal-logo-dark.png    ← icon-only, dark backgrounds
```

Reference assets from the existing SEL projects or request them from the design team.

---

## Step 6: Build the Layout Shell

Create a `Layout` component using the patterns from [06-navigation-layout.md](06-navigation-layout.md):

```
Layout
├── Sidebar (collapsible, resizable)
│   ├── Logo area
│   ├── Navigation items
│   └── Footer / user info
├── Main
│   ├── Header (h-12)
│   └── <slot> / {children}
└── (Optional) Right Panel
```

Persist sidebar state to `localStorage`:

```javascript
const SIDEBAR_KEY = 'sel_sidebar_collapsed';
const SIDEBAR_WIDTH_KEY = 'sel_sidebar_width';
```

---

## Step 7: Copy the Component Library

The following components are ready to use from the existing SEL projects. Copy them into your `src/components/common/` folder:

| Component | Source Path | Priority |
|-----------|------------|---------|
| `Button` | `sel-frontend/src/components/common/Button.js` | Must-have |
| `Card` | `sel-frontend/src/components/common/Card.js` | Must-have |
| `Input` | `sel-frontend/src/components/common/Input.js` | Must-have |
| `Modal` | `sel-frontend/src/components/common/Modal.js` | Must-have |
| `Badge` | `sel-frontend/src/components/common/Badge.js` | Must-have |
| `LoadingSpinner` | `sel-frontend/src/components/common/LoadingSpinner.js` | Must-have |
| `ThemeToggle` | `sel-frontend/src/components/common/ThemeToggle.js` | Must-have |
| `Avatar` | `sel-frontend/src/components/common/Avatar.js` | Standard |
| `Toast` | `knowledge-mining-agent/src/components/common/Toast.jsx` | Standard |
| `DataTable` | `knowledge-mining-agent/src/components/common/DataTable.jsx` | If tables needed |
| `Pagination` | `sel-frontend/src/components/common/Pagination.js` | If tables needed |

---

## Step 8: Apply Dark Mode to Existing Components

When refactoring an existing UI, go class by class:

1. Find all `bg-white`, `bg-gray-*`, `bg-slate-*` — replace with `bg-bg-secondary dark:bg-bg-dark-secondary`
2. Find all `text-gray-*`, `text-slate-*` — replace with `text-text-primary dark:text-text-dark` or `text-text-secondary dark:text-text-dark-secondary`
3. Find all `border-gray-*` — replace with `border-border dark:border-border-dark`
4. Find all hardcoded colours like `#fff`, `#000` — replace with CSS variables
5. Find all `shadow-*` — ensure dark mode variants are included
6. Test by toggling the `.dark` class on `<html>` in browser DevTools

---

## Step 9: Add Animation Classes

Sprinkle entry animations on key elements:

```html
<!-- Page load -->
<main class="animate-fade-in">

<!-- Card list item -->
<div class="stagger-item animate-fade-in-up">

<!-- Modal open -->
<div class="animate-scale-in">

<!-- Slide-in panel -->
<aside class="animate-slide-in-right">
```

---

## Step 10: Validate Compliance

Run through this checklist before calling your app SEL-compliant:

### Visual
- [ ] Roboto font loads correctly
- [ ] Primary blue (`#0078d4`) is used for main CTAs
- [ ] All backgrounds use `bg-bg-*` tokens, not raw greys
- [ ] All text uses `text-text-*` tokens, not raw greys
- [ ] FontAwesome Solid icons throughout (no other icon sets)

### Dark Mode
- [ ] Every component has full `dark:` variants
- [ ] Theme toggle is visible in header
- [ ] Logo swaps correctly (bright/dark variants)
- [ ] Charts respond to theme changes
- [ ] localStorage key saves preference

### Layout
- [ ] Sidebar is collapsible and resizable
- [ ] Header is `h-12` fixed height
- [ ] Main content scrolls independently
- [ ] Responsive: sidebar auto-collapses on mobile

### Interaction
- [ ] Buttons have `active:scale-95` press feedback
- [ ] Hover states are consistent
- [ ] Focus rings visible on all interactive elements
- [ ] Modals trap focus and close on ESC

### Typography
- [ ] Single Roboto font family throughout
- [ ] Heading hierarchy (h1 → h4) is semantic
- [ ] Markdown content uses `.enhanced-markdown` class

---

## Next.js Setup Notes

For Next.js, the setup is identical except:

```javascript
// globals.css — at the top
@import url('https://fonts.googleapis.com/...');
// OR use next/font/google for better performance

// next.config.js
module.exports = {
  // no special config needed for Tailwind
};
```

```javascript
// app/layout.tsx or _app.tsx
import '../styles/globals.css';
// Wrap with ThemeProvider
```

## Vue 3 (Vite) Notes

```javascript
// vite.config.js — ensure Tailwind PostCSS plugin is active
// tailwind.config.js — same file, no changes needed
// main.js — import './index.css'
// Use the useTheme composable instead of ThemeContext
```

For FontAwesome in Vue:
```javascript
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);
app.component('font-awesome-icon', FontAwesomeIcon);
```

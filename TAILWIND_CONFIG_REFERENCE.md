# Frontend Tailwind Config Reference

This document explains the complete Tailwind CSS configuration for the SEL frontend, including all design tokens and utility classes available.

## Quick Start

The Tailwind config extends Tailwind's default theme with SEL brand colors, typography, shadows, and animations. All utilities are pre-configured—no additional setup needed.

### Color System

#### Brand Colors (Semantic)

Use these for main UI elements:

```jsx
// Primary Blue
<button className="bg-primary dark:bg-primary-dark">Sign In</button>

// Secondary Purple  
<div className="bg-secondary dark:bg-secondary-dark">...</div>

// Success Green
<div className="bg-success dark:bg-success-dark">✓ Success</div>

// Warning Orange
<div className="bg-warning dark:bg-warning-dark">⚠ Warning</div>

// Error Red
<div className="bg-error dark:bg-error-dark">✗ Error</div>

// Info Blue
<div className="bg-info dark:bg-info-dark">ℹ Info</div>
```

#### Background Colors

Use for page backgrounds, cards, surfaces:

```jsx
// Primary background (white / dark)
<div className="bg-bg-primary dark:bg-bg-dark">Page content</div>

// Secondary (light gray / dark gray)
<div className="bg-bg-secondary dark:bg-bg-dark-secondary">Card</div>

// Tertiary (gray / darker gray)  
<div className="bg-bg-tertiary dark:bg-bg-dark-tertiary">Hover state</div>
```

| Light | Dark | Value | Usage |
|-------|------|-------|-------|
| `bg-primary` | `bg-bg-dark` | `#ffffff` / `#1e1e1e` | Main content area |
| `bg-secondary` | `bg-bg-dark-secondary` | `#f5f5f5` / `#252526` | Cards, sidebars |
| `bg-tertiary` | `bg-bg-dark-tertiary` | `#e8e8e8` / `#2d2d30` | Hover states |

#### Text Colors

Use for typography:

```jsx
// Primary text
<p className="text-text-primary dark:text-text-dark">Main heading</p>

// Secondary text
<p className="text-text-secondary dark:text-text-dark-secondary">Subtitle</p>

// Muted text
<p className="text-text-muted dark:text-text-dark-muted">Helper text</p>
```

| Light | Dark | Value |
|-------|------|-------|
| `text-primary` | `text-text-dark` | `#1e1e1e` / `#cccccc` |
| `text-secondary` | `text-text-dark-secondary` | `#616161` / `#9d9d9d` |
| `text-muted` | `text-text-dark-muted` | `#858585` / `#6e6e6e` |

#### Border Colors

```jsx
<div className="border-2 border-border dark:border-border-dark">Content</div>
```

### Shadow System

```jsx
// Light shadow (subtle)
<div className="shadow-light dark:shadow-light-dark">Subtle elevation</div>

// Medium shadow (prominent)
<div className="shadow-medium dark:shadow-medium-dark">More prominent</div>

// Card shadow
<div className="shadow-card dark:shadow-card-hover">Standard card</div>

// Card hover (lifted)
<div className="shadow-card-hover dark:shadow-card-hover">Elevated card</div>
```

| Class | Light Value | Dark Value |
|-------|-------------|-----------|
| `shadow-light` | `0 2px 8px rgba(0,0,0,0.10)` | `0 2px 8px rgba(0,0,0,0.30)` |
| `shadow-medium` | `0 4px 12px rgba(0,0,0,0.15)` | `0 4px 12px rgba(0,0,0,0.50)` |
| `shadow-card` | `0 4px 6px -1px rgba(0,0,0,0.10)` | — |
| `shadow-card-hover` | `0 20px 25px -5px rgba(0,0,0,0.10)` | — |

### Typography

All text uses **Roboto** font family:

```jsx
// Sans (body text, default)
<p className="font-sans">Regular text</p>

// Display (headings)
<h1 className="font-display text-3xl">Heading</h1>

// Mono (code)
<code className="font-mono">const x = 1;</code>
```

### Spacing & Sizing

Standard Tailwind with custom animations. For forms/cards:

```jsx
<div className="space-y-4">
  <input /> {/* 1rem spacing between inputs */}
  <input />
  <textarea />
</div>
```

### Border Radius

| Class | Value | Used For |
|-------|-------|----------|
| `rounded` | 4px | Badge text, small inlines |
| `rounded-md` | 6px | Small elements |
| `rounded-lg` | 8px | Buttons, inputs, small cards |
| `rounded-xl` | 12px | Cards, panels |
| `rounded-2xl` | 16px | Modals, large panels |
| `rounded-3xl` | 24px | Hero cards, login panels |
| `rounded-full` | 50% | Avatars, badges |

### Animations

#### Fade Animations

```jsx
// Fade in with vertical shift
<div className="animate-fade-in">Content</div>

// Fade in from bottom
<div className="animate-fade-in-up">Slide up</div>

// Fade in from top
<div className="animate-fade-in-down">Slide down</div>
```

#### Slide Animations

```jsx
// Slide from left
<div className="animate-slide-in-left">...</div>

// Slide from right
<div className="animate-slide-in-right">...</div>
```

#### Scale & Transform

```jsx
// Scale and fade in
<div className="animate-scale-in">Scale in</div>

// Floating effect
<div className="animate-float">Floating</div>

// Subtle bounce
<div className="animate-bounce-subtle">Bouncing</div>

// Wiggle/shake
<div className="animate-wiggle">Shaking</div>

// Glow effect
<div className="animate-glow">Glowing</div>

// Shimmer effect
<div className="animate-shimmer">Shimmering</div>

// Slow spin
<div className="animate-spin-slow">Spinning</div>
```

### Transitions

```jsx
// Default transition (300ms)
<div className="transition-all duration-300 ease-out">Content</div>

// Custom durations
<div className="transition-colors duration-400">Colors change</div>
<div className="transition-transform duration-600">Transform</div>

// Timing functions
<div className="transition-all ease-out">Smooth ease out</div>
<div className="transition-all ease-smooth">Cubic bezier smooth</div>
```

## Common Patterns

### Form Input with Error

```jsx
<div className="space-y-1.5">
  <label className="block text-sm font-semibold text-text-primary dark:text-text-dark">
    Email
  </label>
  
  <input
    type="email"
    className="w-full px-4 py-3 rounded-lg
      bg-bg-secondary dark:bg-bg-dark-secondary
      border-2 border-border dark:border-border-dark
      text-text-primary dark:text-text-dark
      focus:outline-none focus:ring-4 focus:ring-primary/10
      focus:border-primary dark:focus:border-primary-dark
      transition-all duration-300"
  />
  
  {/* Error state */}
  <p className="text-sm text-error dark:text-error-dark">
    Invalid email address
  </p>
</div>
```

### Card Container

```jsx
<div className="p-6 rounded-xl
  border border-border dark:border-border-dark
  shadow-card
  bg-bg-secondary dark:bg-bg-dark-secondary
  hover:shadow-card-hover transition-all duration-300">
  <h3 className="font-semibold text-text-primary dark:text-text-dark mb-4">
    Card Title
  </h3>
  <p className="text-text-secondary dark:text-text-dark-secondary">
    Card content goes here
  </p>
</div>
```

### Button with Shimmer

```jsx
<button className="relative px-6 py-3 rounded-lg font-semibold
  bg-gradient-to-r from-primary to-primary/90
  dark:from-primary-dark dark:to-primary-dark/90
  text-white
  hover:shadow-lg hover:shadow-primary/30
  dark:hover:shadow-primary-dark/30
  focus:outline-none focus:ring-2 focus:ring-primary
  transition-all duration-300 active:scale-95
  overflow-hidden">
  
  {/* Shimmer sweep effect */}
  <span className="absolute inset-0 w-full h-full
    bg-gradient-to-r from-transparent via-white/20 to-transparent
    -translate-x-full group-hover:translate-x-full
    transition-transform duration-700 pointer-events-none" />
  
  Click Me
</button>
```

### Alert Banner

```jsx
<div className="bg-warning/10 dark:bg-warning-dark/10
  border-l-4 border-warning dark:border-warning-dark
  p-4 rounded-lg animate-fade-in">
  <p className="font-semibold text-warning dark:text-warning-dark">
    Warning Title
  </p>
  <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
    This is a warning message
  </p>
</div>
```

### Navigation Bar

```jsx
<nav className="bg-bg-secondary dark:bg-bg-dark-secondary
  border-b border-border dark:border-border-dark">
  <div className="max-w-7xl mx-auto px-4 py-4
    flex items-center justify-between">
    <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark">
      App Name
    </h1>
    <button className="px-4 py-2 rounded-lg
      bg-primary dark:bg-primary-dark text-white
      font-semibold transition-all duration-300
      hover:shadow-lg hover:shadow-primary/30">
      Action
    </button>
  </div>
</nav>
```

## CSS Custom Properties

All colors are also available as CSS variables for non-Tailwind code:

```css
/* Light mode (:root) */
:root {
  --bg-primary:    #ffffff;
  --bg-secondary:  #f5f5f5;
  --bg-tertiary:   #e8e8e8;
  
  --text-primary:   #1e1e1e;
  --text-secondary: #616161;
  --text-muted:     #858585;
  
  --border-color:  #d4d4d4;
  
  --accent-primary: #0078d4;
  --success: #10b981;
  --warning: #f59e0b;
  --error:   #ef4444;
  --info:    #3b82f6;
}

/* Dark mode (.dark body) */
.dark body {
  --bg-primary:    #1e1e1e;
  --bg-secondary:  #252526;
  --bg-tertiary:   #2d2d30;
  
  --text-primary:   #cccccc;
  --text-secondary: #9d9d9d;
  --text-muted:     #6e6e6e;
  
  --border-color:  #3e3e42;
  
  --accent-primary: #60a5fa;
  --success: #34d399;
  --warning: #fbbf24;
  --error:   #f87171;
  --info:    #60a5fa;
}
```

Usage in CSS:
```css
.custom-element {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

## Best Practices

1. **Always use dark variants**: `dark:bg-bg-dark`, `dark:text-text-dark`, etc.
2. **Group responsive/dark together**: `className="bg-primary dark:bg-primary-dark hover:shadow-lg dark:hover:shadow-primary-dark/30"`
3. **Use animations sparingly**: Only add `animate-*` to important elements to avoid motion overload
4. **Leverage shadows for depth**: Use `shadow-light` for subtle, `shadow-card` for standard
5. **Consistent spacing**: Use `space-y-4` between form fields, `p-6` for cards
6. **Focus rings required**: Always include `focus:ring-2 focus:ring-primary` for accessibility
7. **Transitions for polish**: Add `transition-all duration-300` to interactive elements

## Extending the Config

To add new utilities, edit `frontend/tailwind.config.ts`:

```typescript
// Add new colors
colors: {
  custom: {
    DEFAULT: '#xxx',
    dark: '#yyy',
  },
}

// Add new animations
animation: {
  'my-animation': 'myKeyframe 1s ease-out',
},

keyframes: {
  myKeyframe: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
}
```

Then run `npm run build:frontend` to apply changes.

---

**Reference:** [Tailwind CSS Docs](https://tailwindcss.com)  
**Design System:** SEL UX/UI Standards  
**Last Updated:** April 28, 2026

# SEL Animations & Transitions

All animations in SEL apps are defined in `tailwind.config.js` as custom keyframes and animation names. They are deliberately lightweight and purposeful — they provide feedback without distracting.

---

## Tailwind Config — Full Animation Block

```javascript
// tailwind.config.js → theme.extend
{
  animation: {
    'fade-in':       'fadeIn 0.6s ease-out',
    'fade-in-up':    'fadeInUp 0.5s ease-out',
    'fade-in-down':  'fadeInDown 0.5s ease-out',
    'slide-in-right':'slideInRight 0.4s ease-out',
    'slide-in-left': 'slideInLeft 0.4s ease-out',
    'float':         'float 3s ease-in-out infinite',
    'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
    'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'scale-in':      'scaleIn 0.3s ease-out',
    'wiggle':        'wiggle 0.5s ease-in-out',
    'glow':          'glow 2s ease-in-out infinite',
    'shimmer':       'shimmer 2s linear infinite',
    'spin-slow':     'spin 3s linear infinite',
    'ping-slow':     'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
  },
  keyframes: {
    fadeIn: {
      '0%':   { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    fadeInUp: {
      '0%':   { opacity: '0', transform: 'translateY(20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    fadeInDown: {
      '0%':   { opacity: '0', transform: 'translateY(-20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    slideInRight: {
      '0%':   { opacity: '0', transform: 'translateX(-30px)' },
      '100%': { opacity: '1', transform: 'translateX(0)' },
    },
    slideInLeft: {
      '0%':   { opacity: '0', transform: 'translateX(30px)' },
      '100%': { opacity: '1', transform: 'translateX(0)' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%':      { transform: 'translateY(-10px)' },
    },
    bounceSubtle: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%':      { transform: 'translateY(-5px)' },
    },
    scaleIn: {
      '0%':   { opacity: '0', transform: 'scale(0.9)' },
      '100%': { opacity: '1', transform: 'scale(1)' },
    },
    wiggle: {
      '0%, 100%': { transform: 'rotate(0deg)' },
      '25%':      { transform: 'rotate(-3deg)' },
      '75%':      { transform: 'rotate(3deg)' },
    },
    glow: {
      '0%, 100%': { opacity: '1', boxShadow: '0 0 5px currentColor' },
      '50%':      { opacity: '0.8', boxShadow: '0 0 20px currentColor' },
    },
    shimmer: {
      '0%':   { backgroundPosition: '-1000px 0' },
      '100%': { backgroundPosition: '1000px 0' },
    },
  },
  transitionDuration: {
    '400': '400ms',
    '600': '600ms',
  },
  transitionTimingFunction: {
    'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'smooth':    'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}
```

---

## Animation Usage Guide

| Animation Class | Duration | Use For |
|----------------|----------|---------|
| `animate-fade-in` | 0.6s | Page load, section appearance |
| `animate-fade-in-up` | 0.5s | Card / list item entrance |
| `animate-fade-in-down` | 0.5s | Dropdown open, error message appearance |
| `animate-slide-in-right` | 0.4s | Sidebar panel slide in |
| `animate-slide-in-left` | 0.4s | Toast notifications (from right) |
| `animate-scale-in` | 0.3s | Modal open, popover open |
| `animate-float` | 3s ∞ | Hero logo, decorative elements |
| `animate-bounce-subtle` | 2s ∞ | Background orbs, decorative shapes |
| `animate-pulse-slow` | 3s ∞ | Status indicators (running), skeleton loading |
| `animate-glow` | 2s ∞ | Active workflow node, highlighted element |
| `animate-shimmer` | 2s ∞ | Skeleton loaders, button hover effects |
| `animate-spin-slow` | 3s ∞ | Subtle loading icons |
| `animate-wiggle` | 0.5s | Attention-grabbing micro-animation |
| `animate-ping-slow` | 3s ∞ | Status dot pulse (online indicators) |

---

## Staggered List Animations

For rendering lists of items (cards, table rows), use CSS `animation-delay` to stagger entrances:

```css
/* index.css */
.stagger-item:nth-child(1) { animation-delay: 0.05s; }
.stagger-item:nth-child(2) { animation-delay: 0.10s; }
.stagger-item:nth-child(3) { animation-delay: 0.15s; }
.stagger-item:nth-child(4) { animation-delay: 0.20s; }
.stagger-item:nth-child(5) { animation-delay: 0.25s; }
.stagger-item:nth-child(6) { animation-delay: 0.30s; }
.stagger-item:nth-child(7) { animation-delay: 0.35s; }
.stagger-item:nth-child(8) { animation-delay: 0.40s; }
```

```html
<ul>
  <li class="stagger-item animate-fade-in-up">Item 1</li>
  <li class="stagger-item animate-fade-in-up">Item 2</li>
  <li class="stagger-item animate-fade-in-up">Item 3</li>
</ul>
```

---

## Hover & Interaction States

### Hover Lift

```css
/* Slight elevation lift + shadow increase on hover */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}
```

```html
<!-- Tailwind inline -->
<div class="hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200">
```

### Hover Scale

```html
<div class="hover:scale-105 transition-transform duration-200">
```

### Active Press Effect

All interactive elements use `active:scale-95` to provide tactile feedback:

```html
<button class="... active:scale-95 transition-transform duration-100">
```

### Ripple Effect

Used on filled buttons to create a material-style click ripple:

```css
/* index.css */
.ripple::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  transform: scale(0);
  transition: transform 0.6s ease, opacity 0.6s ease;
  opacity: 0;
}
.ripple:active::after {
  transform: scale(2);
  opacity: 0;
  transition: 0s;
}
```

---

## Shimmer Hover Effect

The button shimmer sweep is a key SEL micro-interaction. A white gradient overlay slides left-to-right on hover:

```html
<!-- Inside any filled button -->
<button class="relative overflow-hidden group ...">
  <!-- Shimmer overlay -->
  <span class="absolute inset-0 w-full h-full
    bg-gradient-to-r from-transparent via-white/20 to-transparent
    -translate-x-full group-hover:translate-x-full
    transition-transform duration-700 pointer-events-none" />

  Button Label
</button>
```

---

## Gradient Background Animation (Hero Sections)

```css
/* index.css */
.gradient-shift {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## Transition Duration Defaults

| Context | Duration | Class |
|---------|----------|-------|
| Hover colours | 150ms | `duration-150` |
| Hover transforms | 200ms | `duration-200` |
| Component entry | 300ms | `duration-300` |
| Page / panel slide | 400ms | `duration-400` (custom) |
| Complex transitions | 600ms | `duration-600` (custom) |
| Theme toggle | 300ms | `transition: background 0.3s ease` |

Always pair transitions with `ease-out` for exits and entries: `transition-all duration-300 ease-out`.

---

## Running / Active State Animations

Workflow nodes and status indicators use these combinations for "live" states:

```html
<!-- Running node: pulsing ring -->
<div class="relative">
  <div class="absolute -inset-1 rounded-xl bg-primary/30 animate-ping-slow" />
  <div class="relative rounded-xl border-2 border-primary ...">
    Node content
  </div>
</div>

<!-- Active status dot -->
<span class="w-2 h-2 rounded-full bg-success dark:bg-success-dark animate-pulse" />

<!-- Processing indicator (three dots) -->
<div class="flex gap-1">
  <span class="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style="animation-delay:0ms" />
  <span class="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style="animation-delay:150ms" />
  <span class="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style="animation-delay:300ms" />
</div>
```

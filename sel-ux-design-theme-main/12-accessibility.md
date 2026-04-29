# SEL Accessibility

All SEL UIs follow WCAG 2.1 AA compliance targets. This document covers the patterns enforced across all three projects.

---

## Focus Management

### Focus Ring Pattern

All interactive elements must display a visible focus ring when focused via keyboard.

```css
/* Standard focus ring — applied via Tailwind utilities */
focus:outline-none
focus-visible:ring-2
focus-visible:ring-primary
dark:focus-visible:ring-primary-dark
focus-visible:ring-offset-2
focus-visible:ring-offset-bg-primary
dark:focus-visible:ring-offset-bg-dark
```

Use `focus-visible:ring-*` (not `focus:ring-*`) so the ring only shows for keyboard users, not mouse clicks.

### Form Input Focus

```
focus:outline-none
focus:border-primary dark:focus:border-primary-dark
focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
focus:shadow-lg
```

---

## ARIA Attributes

### Buttons

```html
<!-- Icon-only button — always needs aria-label -->
<button aria-label="Close dialog" class="...">
  <FontAwesomeIcon icon={faTimes} />
</button>

<!-- Toggle button -->
<button
  aria-pressed={isDarkMode}
  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  class="...">
  <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
</button>

<!-- Loading state -->
<button aria-busy="true" aria-disabled="true" disabled class="...">
  <FontAwesomeIcon icon={faSpinner} class="animate-spin mr-2" />
  Saving...
</button>
```

### Modal

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  class="...">
  <h2 id="modal-title" class="...">Modal Title</h2>
  <!-- ... -->
</div>
```

### Interactive Badge / Chip

```html
<span
  role="button"
  tabIndex={0}
  aria-label="Remove tag: React"
  onKeyDown={(e) => e.key === 'Enter' && handleRemove()}
  class="... cursor-pointer">
  React ×
</span>
```

### Status Indicators

```html
<!-- Status with icon -->
<span role="status" aria-live="polite" class="...">
  <FontAwesomeIcon icon={faCheckCircle} aria-hidden="true" />
  <span>Completed</span>
</span>

<!-- Live activity / progress -->
<div aria-live="polite" aria-atomic="false" class="...">
  <!-- Agent activity updates -->
</div>
```

### Navigation

```html
<nav aria-label="Main navigation">
  <ul>
    <li>
      <a href="/reactor"
        aria-current={isActive ? 'page' : undefined}
        class="...">
        Reactor
      </a>
    </li>
  </ul>
</nav>
```

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Move between focusable elements |
| `Enter` / `Space` | Activate button, toggle checkbox |
| `Escape` | Close modal, dropdown, drawer |
| `Arrow keys` | Navigate within a component (menu items) |
| `Ctrl + B` | Toggle sidebar collapse |
| `Enter` (chat) | Submit message |
| `Shift + Enter` (chat) | New line in message |

### Focus Trap in Modals

When a modal is open, focus must be trapped inside it:

```javascript
// On modal open
const focusableElements = modal.querySelectorAll(
  'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
);
const firstFocusable = focusableElements[0];
const lastFocusable  = focusableElements[focusableElements.length - 1];

firstFocusable.focus();

modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
});
```

### Scroll Lock

```javascript
// When modal opens
document.body.style.overflow = 'hidden';

// When modal closes
document.body.style.overflow = '';
```

---

## Semantic HTML

```html
<!-- Page structure -->
<header>   <!-- top navigation bar -->
<nav>      <!-- sidebar navigation -->
<main>     <!-- primary content -->
<aside>    <!-- secondary panels (events sidebar, settings drawer) -->
<footer>   <!-- bottom status bars (if used) -->

<!-- Content structure -->
<h1>       <!-- page title (one per page) -->
<h2>       <!-- section headings -->
<h3>       <!-- card / sub-section headings -->
<article>  <!-- self-contained content (chat message, workflow card) -->
<section>  <!-- grouped content with a heading -->
<figure>   <!-- charts, diagrams -->

<!-- Forms -->
<form>
<fieldset> <!-- group related inputs -->
<legend>   <!-- fieldset label -->
<label>    <!-- always linked to inputs via for/htmlFor -->
<input>
<select>
<textarea>
```

---

## Colour Contrast

All foreground/background colour pairs meet WCAG AA (4.5:1 for body text, 3:1 for large text/UI components).

| Combination | Light Ratio | Dark Ratio | Pass |
|-------------|------------|------------|------|
| `text-primary` on `bg-primary` | 16.5:1 | 12.1:1 | AA |
| `text-secondary` on `bg-primary` | 6.4:1 | 4.7:1 | AA |
| White on `#0078d4` (primary buttons) | 4.6:1 | — | AA |
| White on `#10b981` (success buttons) | 3.8:1 | — | AA (large text) |
| White on `#ef4444` (error buttons) | 4.0:1 | — | AA (large text) |

---

## Screen Reader Utilities

```css
/* Visually hidden but available to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```html
<!-- Add descriptive text for icons used without visible labels -->
<button class="...">
  <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" />
  <span class="sr-only">Delete item</span>
</button>
```

---

## Reduced Motion

Respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Tailwind, this is handled automatically with `motion-safe:` and `motion-reduce:` variants:

```html
<div class="motion-safe:animate-bounce motion-reduce:animate-none">
```

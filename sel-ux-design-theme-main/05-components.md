# SEL Component Library

This document covers every reusable UI component extracted from the three SEL frontend projects. Copy the patterns directly into your app or port them to Vue/Svelte using the class specifications.

---

## Button

### Visual Specification

| Prop | Options |
|------|---------|
| `variant` | `primary` `secondary` `success` `danger` `warning` `info` `outline` `ghost` |
| `size` | `sm` `md` `lg` |

### Base Classes (all variants)

```
rounded-lg font-medium transition-all duration-300 ease-out
focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark
transform active:scale-95
disabled:opacity-60 disabled:cursor-not-allowed
relative overflow-hidden
flex items-center justify-center gap-2
```

### Size Classes

| Size | Padding | Text |
|------|---------|------|
| `sm` | `px-3 py-1.5` | `text-sm` |
| `md` | `px-4 py-2` | `text-base` |
| `lg` | `px-6 py-3` | `text-lg` |

### Variant Classes

| Variant | Light | Dark | Text |
|---------|-------|------|------|
| `primary` | `bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:shadow-primary/30` | `dark:from-primary-dark dark:to-primary-dark/90` | `text-white` |
| `secondary` | `bg-gradient-to-r from-secondary to-secondary/90 hover:shadow-lg hover:shadow-secondary/30` | `dark:from-secondary-dark dark:to-secondary-dark/90` | `text-white` |
| `success` | `bg-gradient-to-r from-success to-success/90` | `dark:from-success-dark dark:to-success-dark/90` | `text-white` |
| `danger` | `bg-gradient-to-r from-error to-error/90` | `dark:from-error-dark dark:to-error-dark/90` | `text-white` |
| `warning` | `bg-gradient-to-r from-warning to-warning/90` | `dark:from-warning-dark dark:to-warning-dark/90` | `text-white` |
| `info` | `bg-gradient-to-r from-info to-info/90` | `dark:from-info-dark dark:to-info-dark/90` | `text-white` |
| `outline` | `border-2 border-primary hover:bg-primary/10` | `dark:border-primary-dark dark:hover:bg-primary-dark/10` | `text-primary dark:text-primary-dark` |
| `ghost` | `hover:bg-bg-tertiary` | `dark:hover:bg-bg-dark-tertiary` | `text-text-primary dark:text-text-dark` |

### Shimmer Hover Effect

Add this child span inside every filled button for the shimmer sweep:

```html
<span class="absolute inset-0 w-full h-full
  bg-gradient-to-r from-transparent via-white/20 to-transparent
  -translate-x-full group-hover:translate-x-full transition-transform duration-700
  pointer-events-none" />
```

---

## Card

### Base Classes

```
p-6 rounded-xl
border border-border dark:border-border-dark
shadow-card
transition-all duration-300 ease-out
bg-bg-secondary dark:bg-bg-dark-secondary
```

### Variants

| Variant | Additional Classes |
|---------|------------------|
| `gradient` | `bg-gradient-to-br from-bg-secondary to-bg-tertiary dark:from-bg-dark-secondary dark:to-bg-dark-tertiary` |
| `glass` | `bg-white/80 dark:bg-black/50 backdrop-blur-xl border-white/40 dark:border-white/20` |
| `hover` | Add: `hover:border-primary dark:hover:border-primary-dark hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer` |
| `glow` | Add: `hover:shadow-primary/30 dark:hover:shadow-primary-dark/30` |

### Card with Header Pattern

```html
<div class="rounded-xl border border-border dark:border-border-dark shadow-card
            bg-bg-secondary dark:bg-bg-dark-secondary overflow-hidden">
  <div class="px-6 py-4 border-b border-border dark:border-border-dark
              flex items-center justify-between">
    <h3 class="text-base font-semibold text-text-primary dark:text-text-dark">
      Card Title
    </h3>
    <button><!-- optional action --></button>
  </div>
  <div class="p-6">
    <!-- card body -->
  </div>
</div>
```

---

## Input

### Base Classes

```
w-full px-4 py-3 rounded-lg
bg-bg-secondary dark:bg-bg-dark-secondary
border-2 border-border dark:border-border-dark
text-text-primary dark:text-text-dark
placeholder-text-muted dark:placeholder-text-dark-muted
focus:border-primary dark:focus:border-primary-dark
focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
focus:shadow-lg
hover:border-primary/50 dark:hover:border-primary-dark/50
transition-all duration-300 ease-out
disabled:opacity-60 disabled:cursor-not-allowed
```

### Error State

Replace border classes with:
```
border-error dark:border-error-dark
focus:ring-error/10 dark:focus:ring-error-dark/10
```

### Label

```html
<label class="block text-sm font-semibold text-text-primary dark:text-text-dark mb-1.5">
  Field Name
</label>
```

### Error Message

```html
<p class="mt-1 text-sm text-error dark:text-error-dark animate-fade-in-down">
  This field is required
</p>
```

### Full Input Block Pattern

```html
<div class="space-y-1.5">
  <label class="block text-sm font-semibold text-text-primary dark:text-text-dark">
    Email Address
  </label>
  <input
    type="email"
    class="w-full px-4 py-3 rounded-lg bg-bg-secondary dark:bg-bg-dark-secondary
           border-2 border-border dark:border-border-dark
           text-text-primary dark:text-text-dark
           placeholder-text-muted dark:placeholder-text-dark-muted
           focus:border-primary dark:focus:border-primary-dark
           focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
           transition-all duration-300"
    placeholder="you@example.com"
  />
  <!-- Error message here if applicable -->
</div>
```

---

## Modal

### Structure

```html
<!-- Backdrop -->
<div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in
            flex items-center justify-center p-4">

  <!-- Content panel -->
  <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto
              bg-bg-primary dark:bg-bg-dark-secondary
              rounded-2xl shadow-2xl
              border border-border dark:border-border-dark
              animate-scale-in">

    <!-- Header -->
    <div class="flex items-center justify-between p-6
                border-b border-border dark:border-border-dark">
      <h2 class="text-xl font-semibold text-text-primary dark:text-text-dark">
        Modal Title
      </h2>
      <button class="text-text-secondary dark:text-text-dark-secondary
                     hover:text-text-primary dark:hover:text-text-dark
                     transition-colors p-1 rounded-lg
                     hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary">
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-6"><!-- content --></div>

    <!-- Footer (optional) -->
    <div class="flex justify-end gap-3 p-6
                border-t border-border dark:border-border-dark">
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </div>
  </div>
</div>
```

### Size Variants

| Size | Max Width |
|------|----------|
| `sm` | `max-w-md` (448px) |
| `md` | `max-w-2xl` (672px) |
| `lg` | `max-w-4xl` (896px) |
| `xl` | `max-w-6xl` (1152px) |
| `full` | `max-w-7xl` (1280px) |

### Behaviour Rules
- ESC key closes the modal
- Click on backdrop closes (if configured)
- Body scroll is locked while open (`overflow: hidden` on `<body>`)
- Entry animation: `animate-scale-in` (0.3s ease-out)

---

## Badge

### Base Classes

```
inline-flex items-center rounded-full font-medium
```

### Size Classes

| Size | Padding | Text |
|------|---------|------|
| `sm` | `px-2 py-0.5` | `text-xs` |
| `md` | `px-2.5 py-1` | `text-sm` |
| `lg` | `px-3 py-1.5` | `text-base` |

### Variant Classes

| Variant | Classes |
|---------|---------|
| `default` | `bg-bg-tertiary dark:bg-bg-dark-tertiary text-text-primary dark:text-text-dark` |
| `primary` | `bg-primary dark:bg-primary-dark text-white` |
| `secondary` | `bg-secondary dark:bg-secondary-dark text-white` |
| `success` | `bg-success dark:bg-success-dark text-white` |
| `warning` | `bg-warning dark:bg-warning-dark text-white` |
| `error` | `bg-error dark:bg-error-dark text-white` |
| `info` | `bg-info dark:bg-info-dark text-white` |

Add `hover:brightness-110 cursor-pointer` for clickable badges.

---

## Avatar

### Sizes

| Size | Classes | Text |
|------|---------|------|
| `sm` | `w-8 h-8` | `text-sm` |
| `md` | `w-10 h-10` | `text-base` |
| `lg` | `w-12 h-12` | `text-lg` |
| `xl` | `w-16 h-16` | `text-2xl` |

### Base Classes

```
rounded-full object-cover border-2 border-border dark:border-border-dark
```

### Fallback (No Image)

```html
<div class="rounded-full flex items-center justify-center
            bg-gradient-to-br from-primary to-secondary
            dark:from-primary-dark dark:to-secondary-dark
            text-white font-semibold">
  R
</div>
```

### Status Indicator

```html
<div class="relative inline-block">
  <img class="w-10 h-10 rounded-full ..." src="..." />
  <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-primary
               bg-success dark:bg-success-dark animate-pulse" />
  <!-- Status colours: online=success, offline=text-muted, busy=error, away=warning -->
</div>
```

---

## Loading Spinner

### Size Classes

| Size | Container | Border |
|------|-----------|--------|
| `sm` | `w-4 h-4` | `border-2` |
| `md` | `w-8 h-8` | `border-[3px]` |
| `lg` | `w-12 h-12` | `border-4` |
| `xl` | `w-16 h-16` | `border-4` |

### Pattern

```html
<div class="w-8 h-8 rounded-full border-[3px]
            border-t-transparent
            border-b-primary dark:border-b-primary-dark
            animate-spin">
</div>
```

### Full-Screen Loading

```html
<div class="fixed inset-0 z-50 flex flex-col items-center justify-center
            bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary
            dark:from-bg-dark dark:via-bg-dark-secondary dark:to-bg-dark-tertiary
            animate-fade-in">
  <div class="w-12 h-12 rounded-full border-4 border-t-transparent
              border-b-primary dark:border-b-primary-dark animate-spin mb-4" />
  <p class="text-text-secondary dark:text-text-dark-secondary text-sm">Loading...</p>

  <!-- Bouncing dots -->
  <div class="flex gap-1 mt-3">
    <div class="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark animate-bounce" style="animation-delay: 0ms" />
    <div class="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark animate-bounce" style="animation-delay: 150ms" />
    <div class="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark animate-bounce" style="animation-delay: 300ms" />
  </div>
</div>
```

---

## Toast / Notification

### Container Positioning

```html
<!-- Mount this at the root level -->
<div class="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
  <!-- toasts rendered here -->
</div>
```

### Individual Toast

```html
<div class="flex items-start gap-3 p-4 rounded-xl shadow-lg
            min-w-[300px] max-w-[500px] pointer-events-auto
            animate-slide-in-right backdrop-blur-sm
            bg-success/10 dark:bg-success-dark/10
            border border-success/20 dark:border-success-dark/20">

  <FontAwesomeIcon icon={faCheckCircle}
    class="text-success dark:text-success-dark text-lg mt-0.5 flex-shrink-0" />

  <div class="flex-1 min-w-0">
    <p class="text-sm font-medium text-text-primary dark:text-text-dark">Success</p>
    <p class="text-xs text-text-secondary dark:text-text-dark-secondary mt-0.5 truncate">
      Operation completed.
    </p>
  </div>

  <button class="text-text-muted dark:text-text-dark-muted hover:text-text-primary
                 dark:hover:text-text-dark transition-colors flex-shrink-0">
    ✕
  </button>
</div>
```

### Toast Type → Colour Mapping

| Type | Background | Border | Icon | Icon Colour |
|------|-----------|--------|------|-------------|
| `success` | `bg-success/10` | `border-success/20` | `faCheckCircle` | `text-success` |
| `error` | `bg-error/10` | `border-error/20` | `faExclamationCircle` | `text-error` |
| `warning` | `bg-warning/10` | `border-warning/20` | `faExclamationTriangle` | `text-warning` |
| `info` | `bg-info/10` | `border-info/20` | `faInfoCircle` | `text-info` |

Auto-dismiss after **5 seconds**.

---

## Pagination

```html
<div class="flex items-center justify-between">
  <!-- Info text -->
  <span class="text-sm text-text-secondary dark:text-text-dark-secondary">
    Showing 1–10 of 47 results
  </span>

  <!-- Controls -->
  <div class="flex items-center gap-1">
    <button class="px-3 py-1.5 rounded-lg text-sm border border-border dark:border-border-dark
                   text-text-primary dark:text-text-dark
                   hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary
                   disabled:opacity-40 disabled:cursor-not-allowed transition-all">
      Previous
    </button>

    <!-- Page buttons -->
    <button class="w-8 h-8 rounded-lg text-sm font-medium
                   bg-primary dark:bg-primary-dark text-white">
      1
    </button>
    <button class="w-8 h-8 rounded-lg text-sm
                   hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary
                   text-text-primary dark:text-text-dark transition-all">
      2
    </button>

    <button class="px-3 py-1.5 rounded-lg text-sm border border-border dark:border-border-dark
                   text-text-primary dark:text-text-dark
                   hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary
                   disabled:opacity-40 disabled:cursor-not-allowed transition-all">
      Next
    </button>
  </div>
</div>
```

---

## Divider

```html
<!-- Horizontal -->
<hr class="border-t border-border dark:border-border-dark my-4" />

<!-- With label -->
<div class="relative my-6">
  <hr class="border-t border-border dark:border-border-dark" />
  <span class="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3
               bg-bg-primary dark:bg-bg-dark text-xs text-text-muted dark:text-text-dark-muted">
    OR
  </span>
</div>
```

---

## Empty State

```html
<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="w-16 h-16 rounded-full bg-bg-tertiary dark:bg-bg-dark-tertiary
              flex items-center justify-center mb-4">
    <FontAwesomeIcon icon={faInbox} class="text-2xl text-text-muted dark:text-text-dark-muted" />
  </div>
  <h3 class="text-base font-semibold text-text-primary dark:text-text-dark mb-1">
    No items yet
  </h3>
  <p class="text-sm text-text-secondary dark:text-text-dark-secondary max-w-xs">
    Get started by creating your first item.
  </p>
  <Button variant="primary" class="mt-4">Create Item</Button>
</div>
```

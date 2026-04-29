# SEL Spacing & Layout System

---

## Spacing Scale

SEL uses the standard Tailwind spacing scale (base unit = 4px / 0.25rem). No custom spacing tokens are added — all spacing comes from the Tailwind defaults.

| Class | Value | Common Use |
|-------|-------|-----------|
| `p-1` / `m-1` | 4px | Tight inline spacing |
| `p-1.5` | 6px | Vertical padding on compact inputs |
| `p-2` | 8px | Button padding (sm), icon wrappers |
| `p-3` | 12px | Standard button padding (md) |
| `p-4` | 16px | Section padding, card body (sm) |
| `p-5` | 20px | Card body (md, knowledge-mining-agent) |
| `p-6` | 24px | Card body (default, sel-frontend) |
| `p-8` | 32px | Page padding, large sections |
| `gap-1` | 4px | Tight flex gaps |
| `gap-2` | 8px | Icon + text gaps |
| `gap-3` | 12px | Form field rows |
| `gap-4` | 16px | Card grid gaps |
| `gap-6` | 24px | Page section gaps |

---

## Page Layout Structure

All three SEL apps share the same macro layout:

```
┌─────────────────────────────────────────────────────────┐
│ Header (h-12, fixed top)                                 │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│   Sidebar    │         Main Content Area                 │
│  (resizable) │         (flex-1, overflow-y-auto)         │
│              │                                           │
│              │                              ┌──────────┐│
│              │                              │  Events  ││
│              │                              │  Panel   ││
│              │                              │(optional)││
│              │                              └──────────┘│
└──────────────┴──────────────────────────────────────────┘
```

### Outer Shell

```html
<div class="flex h-screen bg-bg-primary dark:bg-bg-dark overflow-hidden">
  <Sidebar />
  <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
    <Header />
    <main class="flex-1 overflow-y-auto p-6">
      <!-- page content -->
    </main>
  </div>
  <EventsPanel /> <!-- optional, on right -->
</div>
```

---

## Sidebar Dimensions

| State | Width |
|-------|-------|
| Expanded (default) | 256px |
| Minimum (drag) | 200px |
| Maximum (drag) | 320px |
| Collapsed | 56px |

```css
/* Sidebar base */
.sidebar {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  /* Tailwind: bg-bg-secondary dark:bg-bg-dark-secondary
               border-r border-border/50 dark:border-border-dark/20 */
}
```

**Collapse Keyboard Shortcut:** `Ctrl + B`

**Persistence:** Width and collapse state stored in `localStorage`.

**Auto-collapse breakpoint:** `<= 1024px` (Tailwind `lg`). At smaller viewports the sidebar collapses automatically and a hamburger icon appears in the header.

---

## Header Dimensions

```css
.header {
  height: 48px; /* h-12 */
  background: var(--bg-secondary);
  border-bottom: 1px solid rgba(var(--border-color), 0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  /* Tailwind: h-12 bg-bg-secondary dark:bg-bg-dark-secondary
               border-b border-border/50 dark:border-border-dark/20
               flex items-center justify-between px-4 shadow-sm flex-shrink-0 */
}
```

---

## Events / Right Panel (coding-ai-agent)

| State | Width |
|-------|-------|
| Minimum | 192px |
| Default | 240px |
| Maximum | 384px |

Drag handle on **left** edge. Width persisted to `localStorage`.

---

## Content Area Constraints

### Dashboard Grid

```html
<div class="max-w-[1600px] mx-auto">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="lg:col-span-2"><!-- full width row --></div>
    <div><!-- half width --></div>
    <div><!-- half width --></div>
  </div>
</div>
```

### Login / Auth Pages

```html
<div class="min-h-screen flex items-center justify-center">
  <div class="w-full max-w-md">
    <!-- card content -->
  </div>
</div>
```

---

## Responsive Breakpoints

Standard Tailwind breakpoints are used throughout. No custom breakpoints are defined.

| Breakpoint | Min Width | Common Usage |
|------------|----------|-------------|
| `sm:` | 640px | Hide/show helper text |
| `md:` | 768px | Show desktop nav, hide hamburger |
| `lg:` | 1024px | Expand sidebar, two-column grid |
| `xl:` | 1280px | Wider content containers |
| `2xl:` | 1536px | Max content width on ultra-wide |

### Mobile Patterns

```html
<!-- Hide on mobile, show on desktop -->
<span class="hidden md:block">Desktop label</span>

<!-- Hamburger visible on mobile only -->
<button class="md:hidden">☰</button>

<!-- Adaptive text size -->
<h1 class="text-2xl md:text-3xl font-bold">Title</h1>

<!-- Adaptive padding -->
<div class="p-4 md:p-6">Content</div>
```

---

## Z-Index Scale

| Layer | Value | Element |
|-------|-------|---------|
| Base | 0 | Page content |
| Raised | 10 | Sticky table headers |
| Overlay | 20 | Sidebar drag handle |
| Dropdown | 30–40 | Menus, tooltips |
| Modal backdrop | 50 | `z-50` |
| Modal content | 50 | Stacked on top of backdrop |
| Toast | 60 | `z-[60]` |

All modals use `fixed inset-0 z-50`. Toast notifications use `z-[60]` to always appear on top.

---

## Scrollbar Styling

Applied globally via `index.css`:

```css
::-webkit-scrollbar       { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
```

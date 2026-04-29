# SEL Design System — Quick Reference

Copy-paste ready values for everyday development. Everything a developer needs on one page.

---

## Colour Tokens

```
PRIMARY      #0078d4    (dark: #1177bb)   text-primary / dark:text-primary-dark
SECONDARY    #8b5cf6    (dark: #a78bfa)   text-secondary
SUCCESS      #10b981    (dark: #34d399)   text-success
WARNING      #f59e0b    (dark: #fbbf24)   text-warning
ERROR        #ef4444    (dark: #f87171)   text-error
INFO         #3b82f6    (dark: #60a5fa)   text-info

BG PRIMARY   #ffffff    (dark: #1e1e1e)   bg-bg-primary / dark:bg-bg-dark
BG SECONDARY #f5f5f5    (dark: #252526)   bg-bg-secondary / dark:bg-bg-dark-secondary
BG TERTIARY  #e8e8e8    (dark: #2d2d30)   bg-bg-tertiary / dark:bg-bg-dark-tertiary

TEXT PRIMARY  #1e1e1e   (dark: #cccccc)   text-text-primary / dark:text-text-dark
TEXT SECONDARY #616161  (dark: #9d9d9d)   text-text-secondary / dark:text-text-dark-secondary
TEXT MUTED    #858585   (dark: #6e6e6e)   text-text-muted / dark:text-text-dark-muted

BORDER        #d4d4d4   (dark: #3e3e42)   border-border / dark:border-border-dark
```

---

## Most-Used Component Classes

### Button — Primary

```
bg-gradient-to-r from-primary to-primary/90 dark:from-primary-dark dark:to-primary-dark/90
text-white font-medium rounded-lg px-4 py-2
hover:shadow-lg hover:shadow-primary/30 active:scale-95
transition-all duration-300 ease-out
focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
```

### Card

```
p-6 rounded-xl border border-border dark:border-border-dark
bg-bg-secondary dark:bg-bg-dark-secondary shadow-card
transition-all duration-300 ease-out
```

### Input

```
w-full px-4 py-3 rounded-lg
bg-bg-secondary dark:bg-bg-dark-secondary
border-2 border-border dark:border-border-dark
text-text-primary dark:text-text-dark
placeholder-text-muted dark:placeholder-text-dark-muted
focus:outline-none focus:border-primary dark:focus:border-primary-dark
focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
transition-all duration-300 ease-out
```

### Badge — Variant map

```
primary:   bg-primary dark:bg-primary-dark text-white
secondary: bg-secondary dark:bg-secondary-dark text-white
success:   bg-success dark:bg-success-dark text-white
warning:   bg-warning dark:bg-warning-dark text-white
error:     bg-error dark:bg-error-dark text-white
info:      bg-info dark:bg-info-dark text-white
default:   bg-bg-tertiary dark:bg-bg-dark-tertiary text-text-primary dark:text-text-dark

+ base: inline-flex items-center rounded-full font-medium px-2.5 py-1 text-sm
```

### Modal Overlay

```
fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in
flex items-center justify-center p-4
```

### Modal Panel

```
w-full max-w-2xl max-h-[90vh] overflow-y-auto
bg-bg-primary dark:bg-bg-dark-secondary
rounded-2xl shadow-2xl border border-border dark:border-border-dark
animate-scale-in
```

---

## Animation Quick-Picks

| Need | Class |
|------|-------|
| Component entering page | `animate-fade-in-up` |
| Modal opening | `animate-scale-in` |
| Panel sliding in from left | `animate-slide-in-right` |
| Toast sliding in from right | `animate-slide-in-left` |
| Dropdown appearing | `animate-fade-in-down` |
| Logo floating | `animate-float` |
| Background decoration | `animate-bounce-subtle` |
| Status dot (running) | `animate-pulse` |
| Workflow node (running) | `animate-ping-slow` + ring |
| Button shimmer hover | Group + translate-x shimmer span |

---

## Layout Shell Classes

```
Outer:    flex h-screen bg-bg-primary dark:bg-bg-dark overflow-hidden
Sidebar:  flex-shrink-0 bg-bg-secondary dark:bg-bg-dark-secondary border-r border-border/50 dark:border-border-dark/20
Header:   h-12 flex-shrink-0 bg-bg-secondary dark:bg-bg-dark-secondary border-b border-border/50 shadow-sm flex items-center
Main:     flex-1 overflow-y-auto p-6
```

---

## Status → Colour Map

| Status | Tailwind (bg / text) | Hex |
|--------|---------------------|-----|
| Running | `bg-primary/10 text-primary` | #0078d4 |
| Completed | `bg-success/10 text-success` | #10b981 |
| Failed | `bg-error/10 text-error` | #ef4444 |
| Pending | `bg-warning/10 text-warning` | #f59e0b |
| Cancelled | `bg-bg-tertiary text-text-muted` | #858585 |
| Created | `bg-info/10 text-info` | #3b82f6 |

---

## Typography Classes

```
Page title:       text-2xl md:text-3xl font-bold text-text-primary dark:text-text-dark
Section heading:  text-xl font-bold text-text-primary dark:text-text-dark
Card title:       text-base font-semibold text-text-primary dark:text-text-dark
Label:            text-sm font-semibold text-text-primary dark:text-text-dark
Body:             text-sm text-text-primary dark:text-text-dark
Secondary text:   text-sm text-text-secondary dark:text-text-dark-secondary
Hint / muted:     text-xs text-text-muted dark:text-text-dark-muted
Monospace / log:  text-[11px] font-mono text-text-muted dark:text-text-dark-muted
Gradient heading: bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent
```

---

## Border Radius Scale

```
Inputs / Buttons: rounded-lg   (8px)
Cards:            rounded-xl   (12px)
Modals:           rounded-2xl  (16px)
Login card:       rounded-3xl  (24px)
Avatar / badge:   rounded-full (50%)
```

---

## Spacing Cheat Sheet

```
Tight inline:  p-1 / gap-1  (4px)
Icon + text:   gap-2        (8px)
Button:        px-4 py-2    (16px / 8px)
Card body:     p-6          (24px)
Section gap:   gap-6        (24px)
Page padding:  p-6          (24px)
Large section: p-8          (32px)
```

---

## FontAwesome Icons — Top 20

```jsx
import {
  faRobot, faBars, faTimes, faChevronDown, faChevronRight,
  faSun, faMoon, faUser, faSignOutAlt, faSearch,
  faCheckCircle, faExclamationCircle, faExclamationTriangle,
  faTrashAlt, faPlus, faSyncAlt, faClock, faServer,
  faCode, faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
```

---

## Dark Mode Checklist (per component)

```
✓ bg-*        → dark:bg-*
✓ text-*      → dark:text-*
✓ border-*    → dark:border-*
✓ shadow-*    → dark:shadow-*
✓ from-/to-*  → dark:from-/dark:to-*
✓ Logo img    → show bright.png / dark.png using dark:hidden / hidden dark:block
✓ Charts      → pass isDarkMode to chart colour configs
```

---

## SEL CSS Variables Reference

```css
var(--bg-primary)       /* page background */
var(--bg-secondary)     /* card / sidebar background */
var(--bg-tertiary)      /* hover backgrounds */
var(--text-primary)     /* main text */
var(--text-secondary)   /* subtitles, labels */
var(--text-muted)       /* hints, timestamps */
var(--border-color)     /* all borders */
var(--accent-primary)   /* links, focus colour */
var(--accent-hover)     /* hover state for accent */
var(--shadow-light)     /* subtle shadow */
var(--shadow-medium)    /* medium shadow */
var(--success)          /* #10b981 */
var(--warning)          /* #f59e0b */
var(--error)            /* #ef4444 */
var(--info)             /* #3b82f6 */
```

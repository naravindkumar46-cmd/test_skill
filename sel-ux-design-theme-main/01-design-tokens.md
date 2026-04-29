# SEL Design Tokens

Design tokens are the single source of truth for all visual decisions in SEL UIs. Every colour, shadow, and radius below maps directly to Tailwind utility class names and CSS custom properties used across `sel-frontend`, `coding-ai-agent`, and `knowledge-mining-agent`.

---

## Colour Palette

### Brand / Semantic Colours

| Token | Tailwind Class | Light Value | Dark Value | Usage |
|-------|---------------|-------------|------------|-------|
| Primary | `primary` | `#0078d4` | `#1177bb` | Main CTA, active nav, focus rings |
| Secondary | `secondary` | `#8b5cf6` | `#a78bfa` | Secondary actions, accents |
| Success | `success` | `#10b981` | `#34d399` | Completed states, positive feedback |
| Warning | `warning` | `#f59e0b` | `#fbbf24` | Caution states, pending approval |
| Error | `error` | `#ef4444` | `#f87171` | Failures, destructive actions |
| Info | `info` | `#3b82f6` | `#60a5fa` | Informational messages, links |

### Background Colours

| Token | Tailwind Class | Light Value | Dark Value | Usage |
|-------|---------------|-------------|------------|-------|
| BG Primary | `bg-primary` | `#ffffff` | `#1e1e1e` | Page / main content area |
| BG Secondary | `bg-secondary` | `#f5f5f5` | `#252526` | Sidebar, card surfaces |
| BG Tertiary | `bg-tertiary` | `#e8e8e8` | `#2d2d30` | Hover states, nested surfaces |

> **Note:** In `coding-ai-agent` the dark BG primary shifts to a deeper navy (`#0b1120` / `#020617`) for a richer contrast. The sel-frontend and knowledge-mining-agent use the VS Code-inspired near-black palette above.

### Text Colours

| Token | Tailwind Class | Light Value | Dark Value | Usage |
|-------|---------------|-------------|------------|-------|
| Text Primary | `text-primary` | `#1e1e1e` | `#cccccc` | Body copy, headings |
| Text Secondary | `text-secondary` | `#616161` | `#9d9d9d` | Labels, subtitles |
| Text Muted | `text-muted` | `#858585` | `#6e6e6e` | Timestamps, hints, placeholders |

### Border Colours

| Token | Tailwind Class | Light Value | Dark Value |
|-------|---------------|-------------|------------|
| Border | `border` | `#d4d4d4` | `#3e3e42` |

---

## CSS Custom Properties

All colours above are also available as CSS variables so non-Tailwind code can consume them.

### Light Mode (`:root`)

```css
:root {
  --bg-primary:    #ffffff;
  --bg-secondary:  #f5f5f5;
  --bg-tertiary:   #e8e8e8;

  --text-primary:   #1e1e1e;
  --text-secondary: #616161;
  --text-muted:     #858585;

  --border-color:  #d4d4d4;

  --shadow-light:  rgba(0, 0, 0, 0.10);
  --shadow-medium: rgba(0, 0, 0, 0.15);

  --accent-primary: #0078d4;
  --accent-hover:   #106ebe;

  --success: #10b981;
  --warning: #f59e0b;
  --error:   #ef4444;
  --info:    #3b82f6;

  /* Graph / dependency link colours */
  --link-dependency:   #3F51B5;
  --link-method-call:  #FF5722;
}
```

### Dark Mode (`.dark body` or `html.dark`)

```css
.dark body {
  --bg-primary:    #1e1e1e;
  --bg-secondary:  #252526;
  --bg-tertiary:   #2d2d30;

  --text-primary:   #cccccc;
  --text-secondary: #9d9d9d;
  --text-muted:     #6e6e6e;

  --border-color:  #3e3e42;

  --shadow-light:  rgba(0, 0, 0, 0.30);
  --shadow-medium: rgba(0, 0, 0, 0.50);

  --accent-primary: #60a5fa;
  --accent-hover:   #3b82f6;
}
```

---

## Shadow Scale

```javascript
// tailwind.config.js → theme.extend.boxShadow
boxShadow: {
  light:       '0 2px 8px  rgba(0, 0, 0, 0.10)',
  medium:      '0 4px 12px rgba(0, 0, 0, 0.15)',
  'light-dark':'0 2px 8px  rgba(0, 0, 0, 0.30)',
  'medium-dark':'0 4px 12px rgba(0, 0, 0, 0.50)',
  card:        '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)',
  'card-hover':'0 20px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)',
}
```

| Class | Use |
|-------|-----|
| `shadow-light` | Subtle card elevation (resting) |
| `shadow-medium` | Card elevation on hover |
| `shadow-card` | Standard card container |
| `shadow-card-hover` | Lifted card on hover |
| `shadow-2xl` | Modals, drawers, popovers |
| `shadow-light-dark` / `shadow-medium-dark` | Dark mode equivalents |

---

## Border Radius Scale

| Tailwind Class | Value | Used For |
|---------------|-------|---------|
| `rounded` | 4px | Small inlines (badges xs) |
| `rounded-md` | 6px | Small elements |
| `rounded-lg` | 8px | Buttons, inputs, small cards |
| `rounded-xl` | 12px | Cards, panels |
| `rounded-2xl` | 16px | Modals, drawers, large panels |
| `rounded-3xl` | 24px | Hero cards, login panel |
| `rounded-full` | 50% | Avatars, status dots, pill badges |

---

## Vendor / Chart Accent Colours

Used in quota dashboards and cost charts. Do not use these as brand colours.

```javascript
const VENDOR_COLORS = {
  anthropic:  '#d4a27f',
  qwen:       '#6366f1',
  mistral:    '#f97316',
  openai_oss: '#10b981',
  zhipuai:    '#3b82f6',
  moonshot:   '#ec4899',
  deepseek:   '#06b6d4',
  azure:      '#0078d4',
  unknown:    '#858585',
};

const BAR_COLORS = [
  '#0078d4','#8b5cf6','#10b981','#f59e0b','#ef4444','#3b82f6',
  '#ec4899','#14b8a6','#f97316','#6366f1','#84cc16','#06b6d4',
  '#e11d48','#a855f7','#22d3ee','#facc15',
];
```

---

## Persona / Role Colours

Used in SEL workflow agent badges.

| Persona | Background Token | Text |
|---------|----------------|------|
| Architect | `bg-indigo-100 dark:bg-indigo-900/30` | `text-indigo-800 dark:text-indigo-300` |
| Senior Developer | `bg-blue-100 dark:bg-blue-900/30` | `text-blue-800 dark:text-blue-300` |
| Developer | `bg-sky-100 dark:bg-sky-900/30` | `text-sky-800 dark:text-sky-300` |
| Test Engineer | `bg-green-100 dark:bg-green-900/30` | `text-green-800 dark:text-green-300` |
| DevOps Engineer | `bg-orange-100 dark:bg-orange-900/30` | `text-orange-800 dark:text-orange-300` |
| Code Reviewer | `bg-purple-100 dark:bg-purple-900/30` | `text-purple-800 dark:text-purple-300` |

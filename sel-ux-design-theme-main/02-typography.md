# SEL Typography System

---

## Font Family

**Roboto** is the single font used across all SEL applications.

```css
/* Google Fonts import — add to your global CSS */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
```

```css
body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      sans:    ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      display: ['Roboto', 'system-ui', 'sans-serif'],
      mono:    ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
    },
  },
}
```

---

## Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| 300 | `font-light` | Large display text, decorative subtitles |
| 400 | `font-normal` | Body copy (default) |
| 500 | `font-medium` | Labels, navigation items, button text |
| 600 | `font-semibold` | Sub-headings, card titles, form labels |
| 700 | `font-bold` | Page headings, emphasis |
| 900 | `font-black` | Hero numbers, large stats |

---

## Type Scale

Uses Tailwind's default scale. The table below shows common usage patterns.

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 1.5 | Timestamps, hints, monospace event logs |
| `text-sm` | 14px | 1.5 | Secondary labels, badge text, table cells |
| `text-base` | 16px | 1.5 | Body copy, chat messages (desktop) |
| `text-lg` | 18px | 1.75 | Card titles, section headers |
| `text-xl` | 20px | 1.75 | Page section headings |
| `text-2xl` | 24px | 2 | Page titles (mobile hero) |
| `text-3xl` | 30px | 2.25 | Page titles (desktop hero) |
| `text-4xl` | 36px | 2.5 | Hero / landing numbers |

### Responsive Title Pattern

```html
<h1 class="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-dark">
  Page Title
</h1>
```

---

## Heading Hierarchy

When rendering in prose or markdown areas, headings follow this scale:

```css
h1 { font-size: 1.8rem; font-weight: 700; margin-top: 2em;   margin-bottom: 0.75em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.75em; margin-bottom: 0.5em; }
h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5em;  margin-bottom: 0.5em; }
h4 { font-size: 1.1rem;  font-weight: 600; margin-top: 1.25em; margin-bottom: 0.25em; }
```

---

## Gradient Text

Use for hero headings, product names, and important titles.

```html
<h1 class="bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark
           bg-clip-text text-transparent font-bold text-3xl">
  SEL Platform
</h1>
```

---

## Code / Monospace

Inline code and terminal output use the mono font stack.

```html
<!-- Inline code -->
<code class="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono
             text-text-primary dark:text-text-dark">
  some_code()
</code>

<!-- Block / event log text -->
<pre class="font-mono text-[11px] text-text-muted dark:text-text-dark-muted leading-relaxed">
  ...event output...
</pre>
```

---

## Prose / Markdown Styling

The `.enhanced-markdown` class is applied to any container rendering user-generated or AI-generated markdown content.

```css
.enhanced-markdown {
  line-height: 1.6;
}

.enhanced-markdown h1, .enhanced-markdown h2, .enhanced-markdown h3 {
  scroll-margin-top: 100px;
}

.enhanced-markdown p {
  margin-bottom: 1.25em;
}

.enhanced-markdown ul { list-style: disc;    padding-left: 1.5em; }
.enhanced-markdown ol { list-style: decimal; padding-left: 1.5em; }
.enhanced-markdown li { margin-bottom: 0.5em; }

.enhanced-markdown blockquote {
  border-left: 4px solid var(--border-color);
  padding-left: 1em;
  font-style: italic;
  color: var(--text-secondary);
  margin: 1em 0;
}

.enhanced-markdown table {
  width: 100%;
  border-collapse: collapse;
}
.enhanced-markdown th, .enhanced-markdown td {
  border: 1px solid var(--border-color);
  padding: 0.5em 0.75em;
  text-align: left;
}
.enhanced-markdown th {
  background: var(--bg-secondary);
  font-weight: 600;
}

.enhanced-markdown a {
  color: var(--accent-primary);
  text-decoration: underline;
}
.enhanced-markdown a:hover {
  opacity: 0.8;
}
```

---

## Line Heights

```css
body          { line-height: 1.5; }
prose content { line-height: 1.6; }
compact UI    { line-height: 1.25; /* leading-tight */ }
```

---

## Text Color Patterns

Always use semantic text tokens, never raw hex:

```html
<!-- Primary content -->
<p class="text-text-primary dark:text-text-dark">Main body</p>

<!-- Supporting / secondary -->
<span class="text-text-secondary dark:text-text-dark-secondary">Subtitle</span>

<!-- De-emphasised / hints -->
<time class="text-text-muted dark:text-text-dark-muted text-xs">12:34</time>

<!-- Error text -->
<p class="text-error dark:text-error-dark text-sm">This field is required</p>

<!-- Success text -->
<p class="text-success dark:text-success-dark text-sm">Saved successfully</p>
```

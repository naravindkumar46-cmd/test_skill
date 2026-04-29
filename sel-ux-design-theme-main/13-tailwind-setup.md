# SEL Tailwind CSS Setup

This is the complete Tailwind configuration used across all SEL frontend projects. Copy this into any new SEL app.

---

## Installation

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p
```

---

## tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],

  theme: {
    extend: {
      // ── Brand / Semantic Colours ───────────────────────
      colors: {
        primary: {
          DEFAULT: '#0078d4',
          dark:    '#1177bb',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          dark:    '#a78bfa',
        },
        success: {
          DEFAULT: '#10b981',
          dark:    '#34d399',
          text:    '#047857',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark:    '#fbbf24',
        },
        error: {
          DEFAULT: '#ef4444',
          dark:    '#f87171',
        },
        info: {
          DEFAULT: '#3b82f6',
          dark:    '#60a5fa',
        },

        // ── Background Colours ─────────────────────────
        bg: {
          DEFAULT:        '#ffffff',
          primary:        '#ffffff',
          secondary:      '#f5f5f5',
          tertiary:       '#e8e8e8',
          dark:           '#1e1e1e',
          'dark-secondary': '#252526',
          'dark-tertiary':  '#2d2d30',
        },

        // ── Text Colours ───────────────────────────────
        text: {
          DEFAULT:          '#1e1e1e',
          primary:          '#1e1e1e',
          secondary:        '#616161',
          muted:            '#858585',
          dark:             '#cccccc',
          'dark-secondary': '#9d9d9d',
          'dark-muted':     '#6e6e6e',
        },

        // ── Border Colours ─────────────────────────────
        border: {
          DEFAULT: '#d4d4d4',
          dark:    '#3e3e42',
        },
      },

      // ── Font Families ──────────────────────────────────
      fontFamily: {
        sans:    ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Roboto', 'system-ui', 'sans-serif'],
        mono:    ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },

      // ── Shadows ────────────────────────────────────────
      boxShadow: {
        light:        '0 2px 8px  rgba(0, 0, 0, 0.10)',
        medium:       '0 4px 12px rgba(0, 0, 0, 0.15)',
        'light-dark': '0 2px 8px  rgba(0, 0, 0, 0.30)',
        'medium-dark':'0 4px 12px rgba(0, 0, 0, 0.50)',
        card:         '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)',
      },

      // ── Transitions ────────────────────────────────────
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth':    'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ── Animations ─────────────────────────────────────
      animation: {
        'fade-in':        'fadeIn 0.6s ease-out',
        'fade-in-up':     'fadeInUp 0.5s ease-out',
        'fade-in-down':   'fadeInDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left':  'slideInLeft 0.4s ease-out',
        'float':          'float 3s ease-in-out infinite',
        'bounce-subtle':  'bounceSubtle 2s ease-in-out infinite',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in':       'scaleIn 0.3s ease-out',
        'wiggle':         'wiggle 0.5s ease-in-out',
        'glow':           'glow 2s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'spin-slow':      'spin 3s linear infinite',
        'ping-slow':      'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },

      // ── Keyframes ──────────────────────────────────────
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
          '100%': { backgroundPosition:  '1000px 0' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

---

## postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Global CSS (index.css / globals.css)

```css
/* ── Fonts ──────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Base / Reset ───────────────────────────────────── */
@layer base {
  body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow: hidden; /* prevent body scroll — each panel scrolls independently */
  }

  /* Scrollbar */
  ::-webkit-scrollbar       { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg-secondary); }
  ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

/* ── CSS Variables — Light ──────────────────────────── */
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
  /* Graph link colours */
  --link-dependency:  #3F51B5;
  --link-method-call: #FF5722;
}

/* ── CSS Variables — Dark ───────────────────────────── */
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

/* ── Component Layer ────────────────────────────────── */
@layer components {
  /* ── Utility classes ── */

  .hover-lift {
    @apply transition-all duration-200;
  }
  .hover-lift:hover {
    @apply -translate-y-0.5 shadow-2xl;
  }

  .glass {
    @apply bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10;
  }
  .glass-strong {
    @apply bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/20;
  }

  .text-gradient {
    @apply bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark
           bg-clip-text text-transparent;
  }

  /* ── Staggered animation delays ── */
  .stagger-item:nth-child(1) { animation-delay: 0.05s; }
  .stagger-item:nth-child(2) { animation-delay: 0.10s; }
  .stagger-item:nth-child(3) { animation-delay: 0.15s; }
  .stagger-item:nth-child(4) { animation-delay: 0.20s; }
  .stagger-item:nth-child(5) { animation-delay: 0.25s; }
  .stagger-item:nth-child(6) { animation-delay: 0.30s; }
  .stagger-item:nth-child(7) { animation-delay: 0.35s; }
  .stagger-item:nth-child(8) { animation-delay: 0.40s; }

  /* ── Ripple effect ── */
  .ripple::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    transition: transform 0.6s ease, opacity 0.6s ease;
    opacity: 0;
  }
  .ripple:active::after {
    transform: scale(2);
    opacity: 0;
    transition: 0s;
  }

  /* ── Gradient background animation ── */
  .gradient-shift {
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* ── Focus ring utility ── */
  .focus-ring {
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
           dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2;
  }

  /* ── Markdown / Prose ── */
  .enhanced-markdown {
    line-height: 1.6;
  }
  .enhanced-markdown h1 { @apply text-2xl font-bold mt-6 mb-3 pb-2 border-b border-border dark:border-border-dark; scroll-margin-top: 100px; }
  .enhanced-markdown h2 { @apply text-xl font-bold mt-5 mb-3; scroll-margin-top: 100px; }
  .enhanced-markdown h3 { @apply text-lg font-semibold mt-4 mb-2; scroll-margin-top: 100px; }
  .enhanced-markdown h4 { @apply text-base font-semibold mt-3 mb-2; }
  .enhanced-markdown p  { @apply mb-4; }
  .enhanced-markdown ul { @apply list-disc pl-6 mb-4 space-y-1; }
  .enhanced-markdown ol { @apply list-decimal pl-6 mb-4 space-y-1; }
  .enhanced-markdown code {
    @apply bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono;
  }
  .enhanced-markdown pre {
    @apply bg-bg-tertiary dark:bg-bg-dark-tertiary rounded-lg p-4 overflow-x-auto mb-4;
  }
  .enhanced-markdown blockquote {
    @apply border-l-4 border-border dark:border-border-dark pl-4 italic
           text-text-secondary dark:text-text-dark-secondary my-4;
  }
  .enhanced-markdown table {
    @apply w-full border-collapse mb-4;
  }
  .enhanced-markdown th, .enhanced-markdown td {
    @apply border border-border dark:border-border-dark px-3 py-2 text-sm;
  }
  .enhanced-markdown th {
    @apply bg-bg-tertiary dark:bg-bg-dark-tertiary font-semibold;
  }
  .enhanced-markdown a {
    @apply text-primary dark:text-primary-dark underline hover:opacity-80 transition-opacity;
  }
}
```

---

## package.json Design Dependencies

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome":    "^0.2.2",
    "recharts":    "^3.8.0",
    "react-hot-toast": "^2.6.0"
  },
  "devDependencies": {
    "tailwindcss":            "^3.4.0",
    "postcss":                "^8.4.0",
    "autoprefixer":           "^10.4.0",
    "@tailwindcss/typography":"^0.5.0"
  }
}
```

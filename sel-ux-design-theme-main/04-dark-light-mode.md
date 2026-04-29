# SEL Dark / Light Mode

SEL apps are **dark-first** in visual design and support both modes with a seamless toggle. The implementation is consistent across all three projects.

---

## Strategy: Class-Based Dark Mode

Tailwind's `darkMode: 'class'` strategy is used. Adding the `dark` class to the `<html>` element activates the dark theme.

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

---

## ThemeContext

Each app has a `ThemeContext` that:
1. Reads the saved preference from `localStorage`
2. Falls back to `window.matchMedia('(prefers-color-scheme: dark)')` if no preference is saved
3. Applies/removes the `dark` class on `document.documentElement`
4. Exposes `isDarkMode` and `toggleTheme()` to all components

### React Implementation

```jsx
// src/context/ThemeContext.jsx (or .js)
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const STORAGE_KEY = 'sel_theme'; // use app-specific key

  const getInitialTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Vue 3 Equivalent

```javascript
// composables/useTheme.js
import { ref, watch } from 'vue';

const STORAGE_KEY = 'sel_theme';

const isDarkMode = ref(
  localStorage.getItem(STORAGE_KEY)
    ? localStorage.getItem(STORAGE_KEY) === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
);

watch(isDarkMode, (dark) => {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
}, { immediate: true });

export function useTheme() {
  return {
    isDarkMode,
    toggleTheme: () => { isDarkMode.value = !isDarkMode.value; },
  };
}
```

---

## ThemeToggle Component

```jsx
// src/components/common/ThemeToggle.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
      className="relative p-3 rounded-xl
        bg-gradient-to-br from-bg-secondary to-bg-tertiary
        dark:from-bg-dark-secondary dark:to-bg-dark-tertiary
        hover:shadow-xl active:scale-95 transition-all duration-300
        shadow-md border border-border dark:border-border-dark
        overflow-hidden group focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Shimmer overlay on hover */}
      <span className="absolute inset-0 w-full h-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        -translate-x-full group-hover:translate-x-full transition-transform duration-700
        pointer-events-none" />

      <FontAwesomeIcon
        icon={isDarkMode ? faSun : faMoon}
        className="text-xl text-primary dark:text-primary-dark transition-all duration-300"
      />
    </button>
  );
}
```

---

## CSS Variable Overrides

Define both states in your global CSS file:

```css
/* index.css */

/* ── Light mode (default) ─────────────────────────── */
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
}

/* ── Dark mode ────────────────────────────────────── */
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

/* Smooth transition when toggling */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## Applying Dark Mode in Components

### Tailwind `dark:` Prefix Pattern

Every class that affects colour must have a `dark:` variant:

```html
<!-- Background -->
<div class="bg-bg-secondary dark:bg-bg-dark-secondary">

<!-- Text -->
<p class="text-text-primary dark:text-text-dark">

<!-- Border -->
<div class="border border-border dark:border-border-dark">

<!-- Shadow -->
<div class="shadow-light dark:shadow-light-dark">

<!-- Placeholder -->
<input class="placeholder-text-muted dark:placeholder-text-dark-muted">

<!-- Icon / accent -->
<i class="text-primary dark:text-primary-dark">
```

### Chart / Recharts Theme Awareness

```javascript
// Pass theme-aware colors from React state
const { isDarkMode } = useTheme();

const chartTheme = {
  gridColor:    isDarkMode ? '#3e3e42' : '#e8e8e8',
  axisColor:    isDarkMode ? '#9d9d9d' : '#616161',
  tooltipBg:    isDarkMode ? '#252526' : '#ffffff',
  tooltipBorder:isDarkMode ? '#3e3e42' : '#d4d4d4',
};
```

---

## Dark Mode Checklist

Before releasing any SEL UI component, verify:

- [ ] All background classes have `dark:` variant
- [ ] All text classes have `dark:` variant
- [ ] All border classes have `dark:` variant
- [ ] All shadow values are appropriate for dark backgrounds
- [ ] Icon colours are adjusted (primary → primary-dark)
- [ ] Chart colors are theme-aware
- [ ] Images / logos use the correct dark variant (`sel-full-logo-dark.png`)
- [ ] Focus rings are visible in both modes
- [ ] Gradients have `dark:from-*` and `dark:to-*` variants

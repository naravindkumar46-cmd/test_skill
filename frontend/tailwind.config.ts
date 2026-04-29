import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',

  content: [
    './src/**/*.{js,jsx,ts,tsx}',
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

  plugins: [],
};

export default config;

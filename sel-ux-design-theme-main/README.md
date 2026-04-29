# SEL Design & Theme System — Documentation Index

**Software Engineering Loop (SEL)** — Official UI/UX Design Standards

This documentation is extracted directly from the three production SEL frontend applications:
- `sel-frontend` — Core orchestration portal
- `coding-ai-agent` (Reactor) — Coding agent chat interface
- `knowledge-mining-agent` — Knowledge vault & RAG search UI

All three share the same design language. Use this documentation to build new SEL-compliant UI apps or refactor existing ones.

---

## Documents

| File | What It Covers |
|------|---------------|
| [01-design-tokens.md](01-design-tokens.md) | Colors, shadows, border-radius — the raw token values |
| [02-typography.md](02-typography.md) | Fonts, scale, weights, line-heights, markdown prose |
| [03-spacing-layout.md](03-spacing-layout.md) | Spacing scale, grid, breakpoints, sidebar, header |
| [04-dark-light-mode.md](04-dark-light-mode.md) | Full dark/light mode implementation guide with code |
| [05-components.md](05-components.md) | Every reusable component — Button, Card, Input, Modal, Badge, Avatar, Spinner, Toast |
| [06-navigation-layout.md](06-navigation-layout.md) | MainLayout, Sidebar, Header, page structure patterns |
| [07-animations-transitions.md](07-animations-transitions.md) | All keyframes, animation names, timing, interaction states |
| [08-icons-imagery.md](08-icons-imagery.md) | FontAwesome usage, icon catalogue, logos, branding assets |
| [09-forms.md](09-forms.md) | Input, Select, Textarea, Checkbox, validation states |
| [10-data-visualization.md](10-data-visualization.md) | Charts (Recharts), tables, progress bars, status indicators |
| [11-chat-ui-patterns.md](11-chat-ui-patterns.md) | Chat messages, thinking states, activity indicators, events panel |
| [12-accessibility.md](12-accessibility.md) | Focus rings, ARIA, keyboard nav, colour contrast |
| [13-tailwind-setup.md](13-tailwind-setup.md) | Full tailwind.config.js, PostCSS setup, custom plugins |
| [14-implementation-guide.md](14-implementation-guide.md) | How to adopt this design system in a new React/Next.js/Vue app |
| [15-quick-reference.md](15-quick-reference.md) | Cheat-sheet — copy/paste values for everyday use |

---

## Core Principles

1. **Consistent tokens** — every colour, shadow and radius comes from the token table. Never hardcode hex values outside the config.
2. **Dark-first** — all components carry `dark:` Tailwind variants. Test both modes before shipping.
3. **Roboto everywhere** — one font family across all SEL products.
4. **Blue primary, purple secondary** — `#0078d4` and `#8b5cf6` are the brand anchors.
5. **Ease-out motion** — entry animations use `ease-out`; hover transitions are 200–300 ms.
6. **FontAwesome Solid** — the only approved icon set.
7. **Accessible by default** — every interactive element has a focus ring and appropriate ARIA label.

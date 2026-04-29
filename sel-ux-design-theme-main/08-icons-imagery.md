# SEL Icons & Imagery

---

## Icon Library: FontAwesome Solid

**Only FontAwesome Free Solid icons are used.** No other icon library is permitted in SEL UIs.

### Packages

```json
{
  "@fortawesome/fontawesome-svg-core": "^6.7+ or ^7.1.0",
  "@fortawesome/free-solid-svg-icons": "^6.7+ or ^7.1.0",
  "@fortawesome/react-fontawesome": "^0.2+ or ^3.1.0"
}
```

### Basic Usage (React)

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faChevronDown } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faRobot} className="text-primary dark:text-primary-dark" />

// Size via text-* classes:
<FontAwesomeIcon icon={faRobot} className="text-xs" />   // ~12px
<FontAwesomeIcon icon={faRobot} className="text-sm" />   // ~14px
<FontAwesomeIcon icon={faRobot} className="text-base" /> // ~16px
<FontAwesomeIcon icon={faRobot} className="text-lg" />   // ~18px
<FontAwesomeIcon icon={faRobot} className="text-xl" />   // ~20px
<FontAwesomeIcon icon={faRobot} className="text-2xl" />  // ~24px
```

### Vue Usage (via CDN or vue-fontawesome)

```html
<font-awesome-icon :icon="['fas', 'robot']" class="text-sm" />
```

---

## Icon Catalogue by Category

### Navigation & Layout

| Icon | Import Name | Usage |
|------|------------|-------|
| Robot | `faRobot` | SEL agent, Reactor nav item |
| Bars | `faBars` | Hamburger menu (mobile) |
| Times | `faTimes` | Close / dismiss |
| ChevronDown | `faChevronDown` | Dropdown indicator, expand |
| ChevronUp | `faChevronUp` | Collapse indicator |
| ChevronLeft | `faChevronLeft` | Back, previous |
| ChevronRight | `faChevronRight` | Forward, next |
| GripVertical | `faGripVertical` | Drag handle |
| LayerGroup | `faLayerGroup` | Sections / groups |
| ExchangeAlt | `faExchangeAlt` | Toggle / switch |

### Features & Pages

| Icon | Import Name | Usage |
|------|------------|-------|
| ChartBar | `faChartBar` | Quota / analytics page |
| ChartLine | `faChartLine` | Trends / reports |
| Clock | `faClock` | Sessions, timestamps |
| Tools | `faTools` | Tools page |
| Server | `faServer` | MCP servers, backend |
| Code | `faCode` | Code blocks, coding agent |
| Bug | `faBug` | Debugging, test failures |
| FileUpload | `faFileUpload` | File ingestion |
| Trash | `faTrashAlt` | Delete action |
| Plus | `faPlus` | Add / create |
| ClipboardList | `faClipboardList` | Workflows, tasks |
| Microchip | `faMicrochip` | LLM / model context |
| Database | `faDatabase` | Knowledge vault, storage |
| ProjectDiagram | `faProjectDiagram` | Workflow graph |
| Search | `faSearch` | Search input |
| FileImport | `faFileImport` | Import document |
| Eye | `faEye` | View / inspect |
| UserCog | `faUserCog` | Admin / settings |
| TachometerAlt | `faTachometerAlt` | Dashboard |

### Status & Feedback

| Icon | Import Name | Usage |
|------|------------|-------|
| CheckCircle | `faCheckCircle` | Success, completed |
| ExclamationCircle | `faExclamationCircle` | Error, critical |
| ExclamationTriangle | `faExclamationTriangle` | Warning |
| InfoCircle | `faInfoCircle` | Info toast |
| TimesCircle | `faTimesCircle` | Cancelled |
| Spinner | `faSpinner` | Loading (with animate-spin) |
| SyncAlt | `faSyncAlt` | Refresh / reload |

### User / Auth

| Icon | Import Name | Usage |
|------|------------|-------|
| User | `faUser` | User avatar fallback, profile |
| ShieldAlt | `faShieldAlt` | Security, auth |
| Envelope | `faEnvelope` | Email field |
| CalendarAlt | `faCalendarAlt` | Date display |
| IdBadge | `faIdBadge` | Role / persona |
| SignOutAlt | `faSignOutAlt` | Logout |

### Theme

| Icon | Import Name | Usage |
|------|------------|-------|
| Sun | `faSun` | Light mode indicator |
| Moon | `faMoon` | Dark mode indicator |

### Sort / Table

| Icon | Import Name | Usage |
|------|------------|-------|
| Sort | `faSort` | Unsorted column header |
| SortUp | `faSortUp` | Ascending sort |
| SortDown | `faSortDown` | Descending sort |
| Star | `faStar` | Starred / favourite |
| StarHalfAlt | `faStarHalfAlt` | Half star rating |
| Tag | `faTag` | Label / tag |

---

## Icon Wrapper Pattern

Icons in nav items use a styled box wrapper:

```html
<!-- Standard icon box (nav items) -->
<span class="w-8 h-8 flex items-center justify-center rounded-md
  bg-primary/10 dark:bg-primary-dark/10 flex-shrink-0">
  <FontAwesomeIcon icon={faRobot}
    class="text-sm text-primary dark:text-primary-dark" />
</span>

<!-- Larger icon box (feature cards) -->
<span class="w-12 h-12 flex items-center justify-center rounded-xl
  bg-primary/10 dark:bg-primary-dark/10">
  <FontAwesomeIcon icon={faDatabase} class="text-xl text-primary dark:text-primary-dark" />
</span>

<!-- Status icon (no box) -->
<FontAwesomeIcon icon={faCheckCircle}
  class="text-success dark:text-success-dark text-base" />
```

---

## SEL Logos & Brand Assets

Four logo variants are provided. Always use the correct one for context.

| File | Use |
|------|-----|
| `sel-full-logo-bright.png` | Full logo (wordmark + icon) — light backgrounds |
| `sel-full-logo-dark.png` | Full logo (wordmark + icon) — dark backgrounds |
| `sel-minimal-logo-bright.png` | Icon only — light backgrounds, compact spaces |
| `sel-minimal-logo-dark.png` | Icon only — dark backgrounds, compact spaces |

### Usage Pattern

```html
<!-- Always show both, toggle with dark: -->
<img src="/logos/sel-full-logo-bright.png"
     class="h-7 dark:hidden" alt="SEL" />
<img src="/logos/sel-full-logo-dark.png"
     class="h-7 hidden dark:block" alt="SEL" />
```

### Logo Sizes

| Context | Height |
|---------|--------|
| Sidebar header | `h-7` (28px) |
| Login hero | `w-12 h-12` inside 80px circle |
| Page heading companion | `h-8` (32px) |

---

## Vendor / LLM Provider Favicons

The model selector displays 16×16px provider favicons for visual recognition. Use `onerror` fallback for missing icons:

```html
<img
  src={`https://www.google.com/s2/favicons?domain=${providerDomain}&sz=16`}
  width="16" height="16"
  class="rounded-sm"
  onError={(e) => { e.target.style.display = 'none'; }}
  alt={providerName}
/>
```

---

## Background Imagery & Decorative Elements

### Hero Gradient Orbs

Used on the login page and dashboard hero areas:

```html
<!-- Primary orb (top-left area) -->
<div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full
  bg-primary/20 dark:bg-primary-dark/10 blur-3xl animate-pulse-slow
  pointer-events-none" />

<!-- Secondary orb (bottom-right area) -->
<div class="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full
  bg-secondary/20 dark:bg-secondary-dark/10 blur-3xl animate-bounce-subtle
  pointer-events-none" />
```

These are always `pointer-events-none` and `absolute`/`fixed` so they never interfere with interactions.

---

## No SVG Inline Icons

Do not use inline SVG or heroicons — FontAwesome is the approved and only icon set. This ensures visual consistency and reduces bundle fragmentation.

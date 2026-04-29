# SEL Navigation & Layout Patterns

---

## Main Layout Shell

Every SEL application uses the same outer shell. The three-panel structure (sidebar + main + optional right panel) is the SEL standard.

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER  h-12  bg-bg-secondary / dark:bg-bg-dark-secondary      │
├────────────────┬───────────────────────────────┬───────────────┤
│                │                               │               │
│   SIDEBAR      │   MAIN CONTENT                │  RIGHT PANEL  │
│   (256px def)  │   (flex-1, overflow-y-auto)   │  (240px def)  │
│   Resizable    │   p-6                         │  Optional     │
│   Collapsible  │                               │  Resizable    │
│                │                               │               │
└────────────────┴───────────────────────────────┴───────────────┘
```

### CSS

```html
<!-- Root shell -->
<div class="flex h-screen bg-bg-primary dark:bg-bg-dark overflow-hidden">

  <aside id="sidebar" class="flex-shrink-0 flex flex-col
    bg-bg-secondary dark:bg-bg-dark-secondary
    border-r border-border/50 dark:border-border-dark/20
    transition-all duration-300">
    <!-- sidebar content -->
  </aside>

  <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
    <header class="h-12 flex-shrink-0 flex items-center justify-between px-4
      bg-bg-secondary dark:bg-bg-dark-secondary
      border-b border-border/50 dark:border-border-dark/20
      shadow-sm">
      <!-- header content -->
    </header>
    <main class="flex-1 overflow-y-auto p-6">
      <!-- page content -->
    </main>
  </div>

  <!-- Optional right panel (coding-ai-agent / events) -->
  <aside id="right-panel" class="flex-shrink-0
    bg-bg-secondary dark:bg-bg-dark-secondary
    border-l border-border/50 dark:border-border-dark/20">
    <!-- events / context panel -->
  </aside>

</div>
```

---

## Sidebar

### Navigation Item Anatomy

```html
<!-- Navigation section button -->
<button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg
  text-sm font-medium transition-all duration-200
  text-text-primary dark:text-text-dark
  hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary
  /* Active state: */
  bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark">

  <!-- Icon wrapper -->
  <span class="w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0
    bg-primary/10 dark:bg-primary-dark/10
    /* Active: bg-white/20 */">
    <FontAwesomeIcon icon={faRobot} class="text-sm text-primary dark:text-primary-dark" />
  </span>

  <!-- Label (hidden when collapsed) -->
  <span class="flex-1 text-left truncate">Reactor</span>

  <!-- Expand chevron for nested items -->
  <FontAwesomeIcon icon={faChevronDown} class="text-xs transition-transform duration-200" />
</button>

<!-- Sub-item (indented) -->
<div class="ml-5 border-l-2 border-primary/20 dark:border-primary-dark/20 pl-3 mt-1 space-y-1">
  <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm
    text-text-secondary dark:text-text-dark-secondary
    hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary
    /* Active: bg-primary dark:bg-primary-dark text-white */">
    Sub-item label
  </button>
</div>
```

### Collapsed Sidebar (icon-only, 56px)

When collapsed, hide all text labels and show only the icon wrappers. The sidebar becomes `w-14` (56px).

```html
<!-- Collapsed nav item -->
<button class="w-full flex items-center justify-center py-2 rounded-lg
  hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-all"
  title="Reactor"> <!-- tooltip on hover -->
  <span class="w-8 h-8 flex items-center justify-center rounded-md
    bg-primary/10 dark:bg-primary-dark/10">
    <FontAwesomeIcon icon={faRobot} class="text-sm text-primary dark:text-primary-dark" />
  </span>
</button>
```

### Sidebar Logo Area

```html
<div class="h-12 flex items-center px-3 border-b border-border/50 dark:border-border-dark/20">
  <!-- Expanded: full logo -->
  <img src="/logos/sel-full-logo-bright.png" class="h-7 dark:hidden" alt="SEL" />
  <img src="/logos/sel-full-logo-dark.png"   class="h-7 hidden dark:block" alt="SEL" />

  <!-- Collapsed: icon-only logo -->
  <img src="/logos/sel-minimal-logo-bright.png" class="h-7 dark:hidden" alt="SEL" />
  <img src="/logos/sel-minimal-logo-dark.png"   class="h-7 hidden dark:block" alt="SEL" />
</div>
```

### Resize Handle

```html
<div class="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize
  hover:bg-primary/20 dark:hover:bg-primary-dark/20 transition-colors z-10"
  onMouseDown={startResize} />
```

---

## Header

### Standard Header Layout

```html
<header class="h-12 flex-shrink-0 flex items-center justify-between px-4
  bg-bg-secondary dark:bg-bg-dark-secondary
  border-b border-border/50 dark:border-border-dark/20 shadow-sm">

  <!-- Left: hamburger (mobile) + title -->
  <div class="flex items-center gap-3">
    <button class="md:hidden p-2 rounded-lg text-text-secondary dark:text-text-dark-secondary
      hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary">
      <FontAwesomeIcon icon={faBars} />
    </button>
    <div class="hidden md:block">
      <h1 class="text-sm font-semibold text-text-primary dark:text-text-dark leading-none">
        Page Title
      </h1>
      <p class="text-xs text-text-muted dark:text-text-dark-muted mt-0.5">
        Subtitle or session info
      </p>
    </div>
  </div>

  <!-- Right: actions -->
  <div class="flex items-center gap-2">
    <ThemeToggle />
    <UserProfileDropdown />
  </div>
</header>
```

### User Profile Dropdown

```html
<div class="relative">
  <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg
    text-text-primary dark:text-text-dark text-sm
    hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-all">
    <Avatar size="sm" />
    <span class="hidden md:block font-medium">Username</span>
    <FontAwesomeIcon icon={faChevronDown} class="text-xs" />
  </button>

  <!-- Dropdown panel — portal-rendered to avoid clipping -->
  <div class="absolute right-0 top-full mt-1 w-48 rounded-xl shadow-2xl
    bg-bg-primary dark:bg-bg-dark-secondary
    border border-border dark:border-border-dark
    py-1 z-[40] animate-scale-in">

    <button class="w-full flex items-center gap-3 px-4 py-2 text-sm
      text-text-primary dark:text-text-dark
      hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-colors">
      <FontAwesomeIcon icon={faUser} class="w-4 text-text-muted" />
      Profile
    </button>

    <hr class="border-t border-border dark:border-border-dark my-1" />

    <button class="w-full flex items-center gap-3 px-4 py-2 text-sm
      text-error dark:text-error-dark
      hover:bg-error/10 dark:hover:bg-error-dark/10 transition-colors">
      <FontAwesomeIcon icon={faSignOutAlt} class="w-4" />
      Sign Out
    </button>
  </div>
</div>
```

---

## Page Content Patterns

### Standard Page Wrapper

```html
<main class="flex-1 overflow-y-auto">
  <div class="max-w-[1600px] mx-auto p-6 space-y-6">
    <!-- Page header row -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-text-primary dark:text-text-dark">Page Name</h2>
        <p class="text-sm text-text-secondary dark:text-text-dark-secondary mt-0.5">
          Brief description
        </p>
      </div>
      <Button variant="primary">Primary Action</Button>
    </div>

    <!-- Stats / metric row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- metric cards -->
    </div>

    <!-- Main content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- content panels -->
    </div>
  </div>
</main>
```

### Stats / KPI Card

```html
<div class="p-4 rounded-xl border border-border dark:border-border-dark
  bg-bg-secondary dark:bg-bg-dark-secondary shadow-card">
  <p class="text-xs text-text-muted dark:text-text-dark-muted font-medium uppercase tracking-wide">
    Total Tokens
  </p>
  <p class="text-2xl font-black text-text-primary dark:text-text-dark mt-1">
    1,234,567
  </p>
  <p class="text-xs text-success dark:text-success-dark mt-1">
    ↑ 12% vs last week
  </p>
</div>
```

---

## Login Page Layout

```html
<div class="min-h-screen flex items-center justify-center
  bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10
  dark:from-bg-dark dark:via-bg-dark-secondary dark:to-bg-dark relative overflow-hidden">

  <!-- Animated background orbs -->
  <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full
    bg-primary/20 dark:bg-primary-dark/10 blur-3xl animate-pulse-slow" />
  <div class="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full
    bg-secondary/20 dark:bg-secondary-dark/10 blur-3xl animate-bounce-subtle" />

  <!-- Theme toggle -->
  <div class="absolute top-4 right-4">
    <ThemeToggle />
  </div>

  <!-- Login card -->
  <div class="relative w-full max-w-md mx-4
    bg-bg-primary/80 dark:bg-bg-dark-secondary/80 backdrop-blur-xl
    rounded-3xl shadow-2xl border border-border/50 dark:border-border-dark/50
    p-8 animate-fade-in-up">

    <!-- Logo + headline -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-xl animate-float
        bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <img src="/logos/sel-minimal-logo-bright.png" class="w-12 h-12" alt="SEL" />
      </div>
      <h1 class="text-2xl md:text-3xl font-bold
        bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        SEL Platform
      </h1>
      <p class="text-text-secondary dark:text-text-dark-secondary text-sm mt-2">
        Sign in to continue
      </p>
    </div>

    <!-- Form -->
    <form class="space-y-4">
      <!-- inputs -->
      <Button variant="primary" size="lg" class="w-full">Sign In</Button>
    </form>
  </div>
</div>
```

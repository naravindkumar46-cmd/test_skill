# SEL Forms

Forms in SEL follow a consistent pattern: labelled fields with 2-state borders (normal / error), focus rings, and inline error messages.

---

## General Form Principles

1. **Labels above fields** — never inline placeholders as labels
2. **2px border** on inputs — upgrades to primary colour on focus
3. **Error state** — red border + error text below the field
4. **Disabled state** — `opacity-60 cursor-not-allowed`
5. **Vertical spacing** — `space-y-4` between fields in a form

---

## Text Input

```html
<div class="space-y-1.5">
  <label for="email" class="block text-sm font-semibold
    text-text-primary dark:text-text-dark">
    Email Address
  </label>

  <div class="relative">
    <!-- Optional leading icon -->
    <span class="absolute left-3 top-1/2 -translate-y-1/2
      text-text-muted dark:text-text-dark-muted pointer-events-none">
      <FontAwesomeIcon icon={faEnvelope} class="text-sm" />
    </span>

    <input
      id="email"
      type="email"
      placeholder="you@example.com"
      class="w-full px-4 py-3 pl-9 rounded-lg
        bg-bg-secondary dark:bg-bg-dark-secondary
        border-2 border-border dark:border-border-dark
        text-text-primary dark:text-text-dark
        placeholder-text-muted dark:placeholder-text-dark-muted
        focus:outline-none
        focus:border-primary dark:focus:border-primary-dark
        focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
        focus:shadow-lg
        hover:border-primary/50 dark:hover:border-primary-dark/50
        transition-all duration-300 ease-out"
    />
  </div>

  <!-- Error message (only shown when invalid) -->
  <p class="text-sm text-error dark:text-error-dark animate-fade-in-down">
    Please enter a valid email address.
  </p>

  <!-- Help text (optional) -->
  <p class="text-xs text-text-secondary dark:text-text-dark-secondary">
    We'll never share your email.
  </p>
</div>
```

### Error State — Replace the border classes

```html
<!-- Normal border -->
border-2 border-border dark:border-border-dark
focus:border-primary dark:focus:border-primary-dark
focus:ring-primary/10 dark:focus:ring-primary-dark/10

<!-- Error border (when hasError) -->
border-2 border-error dark:border-error-dark
focus:border-error dark:focus:border-error-dark
focus:ring-error/10 dark:focus:ring-error-dark/10
```

---

## Textarea

```html
<div class="space-y-1.5">
  <label class="block text-sm font-semibold
    text-text-primary dark:text-text-dark">
    Description
  </label>

  <textarea
    rows="4"
    placeholder="Write something..."
    class="w-full px-4 py-3 rounded-lg resize-none
      bg-bg-secondary dark:bg-bg-dark-secondary
      border-2 border-border dark:border-border-dark
      text-text-primary dark:text-text-dark
      placeholder-text-muted dark:placeholder-text-dark-muted
      focus:outline-none
      focus:border-primary dark:focus:border-primary-dark
      focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
      transition-all duration-300 ease-out"
  />
</div>
```

---

## Select / Dropdown

```html
<div class="space-y-1.5">
  <label class="block text-sm font-semibold
    text-text-primary dark:text-text-dark">
    Role
  </label>

  <div class="relative">
    <select class="w-full px-4 py-3 pr-10 rounded-lg appearance-none
      bg-bg-secondary dark:bg-bg-dark-secondary
      border-2 border-border dark:border-border-dark
      text-text-primary dark:text-text-dark
      focus:outline-none
      focus:border-primary dark:focus:border-primary-dark
      focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
      transition-all duration-300 ease-out cursor-pointer">
      <option value="">Select role...</option>
      <option value="admin">Admin</option>
      <option value="developer">Developer</option>
    </select>

    <!-- Chevron icon -->
    <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
      text-text-muted dark:text-text-dark-muted">
      <FontAwesomeIcon icon={faChevronDown} class="text-xs" />
    </span>
  </div>
</div>
```

---

## Checkbox

```html
<label class="flex items-start gap-3 cursor-pointer group">
  <div class="relative mt-0.5">
    <input type="checkbox" class="sr-only peer" />
    <!-- Custom checkbox box -->
    <div class="w-4 h-4 rounded border-2 border-border dark:border-border-dark
      bg-bg-secondary dark:bg-bg-dark-secondary
      peer-checked:bg-primary dark:peer-checked:bg-primary-dark
      peer-checked:border-primary dark:peer-checked:border-primary-dark
      peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30
      transition-all duration-200 flex items-center justify-center">
      <!-- Check mark (visible when checked) -->
      <FontAwesomeIcon icon={faCheck}
        class="text-white text-[10px] opacity-0 peer-checked:opacity-100
               transition-opacity duration-200" />
    </div>
  </div>
  <span class="text-sm text-text-primary dark:text-text-dark leading-tight">
    Accept terms and conditions
  </span>
</label>
```

---

## Toggle Switch

```html
<label class="flex items-center gap-3 cursor-pointer">
  <div class="relative">
    <input type="checkbox" class="sr-only peer" />
    <div class="w-10 h-5 rounded-full
      bg-bg-tertiary dark:bg-bg-dark-tertiary
      peer-checked:bg-primary dark:peer-checked:bg-primary-dark
      transition-colors duration-200 border border-border dark:border-border-dark" />
    <div class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
      peer-checked:translate-x-5
      transition-transform duration-200" />
  </div>
  <span class="text-sm font-medium text-text-primary dark:text-text-dark">
    Enable feature
  </span>
</label>
```

---

## Search Input

```html
<div class="relative">
  <span class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none
    text-text-muted dark:text-text-dark-muted">
    <FontAwesomeIcon icon={faSearch} class="text-sm" />
  </span>

  <input
    type="search"
    placeholder="Search..."
    class="w-full pl-9 pr-4 py-2 rounded-lg text-sm
      bg-bg-secondary dark:bg-bg-dark-secondary
      border border-border dark:border-border-dark
      text-text-primary dark:text-text-dark
      placeholder-text-muted dark:placeholder-text-dark-muted
      focus:outline-none
      focus:border-primary dark:focus:border-primary-dark
      focus:ring-2 focus:ring-primary/10 dark:focus:ring-primary-dark/10
      transition-all duration-200"
  />
</div>
```

---

## Form Layout Patterns

### Single Column (default)

```html
<form class="space-y-4">
  <Input label="Name" />
  <Input label="Email" type="email" />
  <Select label="Role" />
  <div class="pt-2">
    <Button variant="primary" size="lg" class="w-full">Submit</Button>
  </div>
</form>
```

### Two-Column Grid

```html
<form class="space-y-4">
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Input label="First Name" />
    <Input label="Last Name" />
  </div>
  <Input label="Email" type="email" />
  <div class="flex justify-end gap-3 pt-2">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </div>
</form>
```

---

## Form Field Validation States Summary

| State | Border | Ring | Text |
|-------|--------|------|------|
| Resting | `border-border dark:border-border-dark` | none | — |
| Hover | `border-primary/50 dark:border-primary-dark/50` | none | — |
| Focus | `border-primary dark:border-primary-dark` | `ring-4 ring-primary/10` | — |
| Error | `border-error dark:border-error-dark` | `ring-4 ring-error/10` | `text-error text-sm mt-1` |
| Disabled | `border-border` | none | `opacity-60 cursor-not-allowed` |

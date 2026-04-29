# SEL Chat UI Patterns

The chat interface is the primary interaction surface in `coding-ai-agent` (Reactor) and also appears in `sel-frontend`. This document covers every message type, state, and chat-specific component.

---

## Chat Container

```html
<div class="flex flex-col h-full overflow-hidden
  bg-bg-primary dark:bg-bg-dark">

  <!-- Messages scrollable area -->
  <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3"
    ref={messagesEndRef}>
    <!-- MessageBubble components -->
  </div>

  <!-- Input area (pinned to bottom) -->
  <div class="flex-shrink-0 border-t border-border dark:border-border-dark p-4">
    <!-- Chat input -->
  </div>
</div>
```

Auto-scroll to bottom on new messages using `scrollIntoView({ behavior: 'smooth' })`.

---

## Message Bubble Types

### 1. User Message

Right-aligned, primary colour background.

```html
<div class="flex justify-end gap-2 animate-fade-in-up">
  <div class="max-w-[80%] md:max-w-[70%]">
    <div class="px-4 py-3 rounded-2xl rounded-tr-none
      bg-primary dark:bg-primary-dark text-white
      shadow-sm text-sm md:text-base leading-relaxed">
      User message text
    </div>
    <time class="block text-right text-xs text-text-muted dark:text-text-dark-muted mt-1 pr-1">
      12:34
    </time>
  </div>

  <!-- Avatar -->
  <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
    bg-primary dark:bg-primary-dark text-white text-sm font-semibold self-end">
    R
  </div>
</div>
```

### 2. Agent / Assistant Message

Left-aligned, secondary surface background.

```html
<div class="flex justify-start gap-2 animate-fade-in-up">
  <!-- Avatar -->
  <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
    bg-bg-tertiary dark:bg-bg-dark-tertiary
    border border-border/50 dark:border-border-dark/50 self-start mt-1">
    <FontAwesomeIcon icon={faRobot} class="text-xs text-primary dark:text-primary-dark" />
  </div>

  <div class="max-w-[80%] md:max-w-[75%]">
    <div class="px-4 py-3 rounded-2xl rounded-tl-none
      bg-bg-secondary dark:bg-bg-dark-secondary
      border border-border dark:border-border-dark
      text-text-primary dark:text-text-dark
      text-sm md:text-base leading-relaxed shadow-sm">
      <div class="enhanced-markdown">
        <!-- Rendered markdown content -->
      </div>
    </div>
    <time class="block text-xs text-text-muted dark:text-text-dark-muted mt-1 pl-1">
      12:34
    </time>
  </div>
</div>
```

### 3. Thinking / Reasoning Message

Used to show the AI's internal reasoning (collapsed by default).

```html
<div class="flex justify-start gap-2 animate-fade-in">
  <!-- Small avatar -->
  <div class="w-6 h-6 rounded-full flex-shrink-0 self-start mt-1
    bg-bg-tertiary dark:bg-bg-dark-tertiary border border-dashed
    border-border/50 dark:border-border-dark/50 flex items-center justify-center">
    <FontAwesomeIcon icon={faBrain} class="text-[10px] text-text-muted dark:text-text-dark-muted" />
  </div>

  <div class="max-w-[75%]">
    <!-- Header row with "Thinking" label -->
    <div class="flex items-center gap-2 mb-1">
      <span class="text-xs font-medium text-text-muted dark:text-text-dark-muted italic">
        Thinking
      </span>
      <!-- Blinking indicator -->
      <span class="w-1.5 h-1.5 rounded-full bg-text-muted dark:bg-text-dark-muted animate-pulse" />
      <!-- Expand/collapse toggle -->
      <button class="text-[10px] text-text-secondary dark:text-text-dark-secondary
        hover:text-text-primary dark:hover:text-text-dark transition-colors">
        Show
      </button>
    </div>

    <!-- Collapsed content -->
    <div class="px-3 py-2 rounded-lg rounded-tl-none
      bg-bg-tertiary/40 dark:bg-bg-dark-tertiary/40
      border border-dashed border-border/50 dark:border-border-dark/50
      text-xs text-text-muted dark:text-text-dark-muted italic leading-relaxed">
      Thinking content (shown when expanded)
    </div>
  </div>
</div>
```

### 4. System / Progress Message

Compact, monospace, left-border accented. Used for tool calls, memory updates, LLM events.

```html
<div class="flex justify-start pl-10 animate-fade-in">
  <div class="max-w-[90%] px-3 py-2 rounded-md
    bg-bg-tertiary/60 dark:bg-bg-dark-tertiary/60 backdrop-blur-sm
    border-l-2 border-success dark:border-success-dark   <!-- colour by subtype -->
    text-[11px] md:text-xs font-mono
    text-text-muted dark:text-text-dark-muted leading-relaxed">

    <span class="font-semibold text-success dark:text-success-dark mr-1">
      [tool]
    </span>
    Tool call: read_file("/src/main.py")
  </div>
</div>
```

#### Left-Border Colour by Subtype

| Subtype | Border Colour |
|---------|--------------|
| `tool` | `border-success dark:border-success-dark` |
| `memory` | `border-warning dark:border-warning-dark` |
| `llm` | `border-secondary dark:border-secondary-dark` |
| `agent` | `border-info dark:border-info-dark` |
| `error` | `border-error dark:border-error-dark` |
| `success` | `border-success dark:border-success-dark` |
| default | `border-border dark:border-border-dark` |

---

## Chat Input

```html
<div class="flex items-end gap-2">
  <div class="flex-1 relative">
    <textarea
      rows="1"
      placeholder="Ask the agent..."
      class="w-full px-4 py-3 pr-12 rounded-xl resize-none
        bg-bg-secondary dark:bg-bg-dark-secondary
        border-2 border-border dark:border-border-dark
        text-text-primary dark:text-text-dark
        placeholder-text-muted dark:placeholder-text-dark-muted
        focus:outline-none focus:border-primary dark:focus:border-primary-dark
        focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-dark/10
        transition-all duration-300 max-h-40 overflow-y-auto"
      onKeyDown={handleKeyDown}
    />
    <!-- Character count or attachment button -->
  </div>

  <!-- Send button -->
  <button
    disabled={!canSend}
    class="w-11 h-11 rounded-xl flex items-center justify-center
      bg-gradient-to-r from-primary to-primary/90
      dark:from-primary-dark dark:to-primary-dark/90
      text-white shadow-md
      hover:shadow-lg hover:shadow-primary/30
      active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
      transition-all duration-200">
    <FontAwesomeIcon icon={faPaperPlane} class="text-sm" />
  </button>
</div>
```

**Submit shortcut:** `Enter` sends, `Shift+Enter` adds a newline.

---

## Activity Indicator

Shown at the top of the chat area while the agent is processing, displaying the latest event.

```html
<div class="px-4 py-2 border-b border-border/50 dark:border-border-dark/20
  bg-bg-secondary/50 dark:bg-bg-dark-secondary/50 animate-fade-in">

  <!-- Summary line -->
  <div class="flex items-center gap-2 cursor-pointer
    hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary rounded px-1 py-0.5 -mx-1"
    onClick={toggleExpand}>
    <span class="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark animate-pulse flex-shrink-0" />
    <span class="text-[11px] font-mono text-text-secondary dark:text-text-dark-secondary truncate flex-1">
      Calling tool: execute_command("pytest tests/")
    </span>
    <FontAwesomeIcon icon={faChevronDown}
      class="text-[10px] text-text-muted transition-transform {{expanded ? 'rotate-180' : ''}}" />
  </div>

  <!-- Expanded event list -->
  <div class="mt-1 ml-5 border-l-2 border-border/50 dark:border-border-dark/50
    max-h-60 overflow-y-auto space-y-0.5">
    <!-- Individual event lines -->
    <div class="pl-2 py-0.5 text-[11px] font-mono
      text-text-muted dark:text-text-dark-muted">
      [12:34:01] tool → execute_command
    </div>
  </div>
</div>
```

---

## Events Sidebar (coding-ai-agent)

Right-side panel showing a live stream of agent events with category filters.

```html
<aside class="flex-shrink-0 flex flex-col
  bg-bg-secondary dark:bg-bg-dark-secondary
  border-l border-border/50 dark:border-border-dark/20"
  style="width: 240px">

  <!-- Header -->
  <div class="h-12 flex items-center justify-between px-3
    border-b border-border/50 dark:border-border-dark/20">
    <span class="text-xs font-semibold text-text-primary dark:text-text-dark uppercase tracking-wide">
      Events
    </span>
  </div>

  <!-- Filters -->
  <div class="px-2 py-2 border-b border-border/50 dark:border-border-dark/20
    flex flex-wrap gap-1">
    <!-- Filter chips -->
    <button class="px-2 py-0.5 rounded-full text-[10px] font-medium
      bg-primary/10 dark:bg-primary-dark/10
      text-primary dark:text-primary-dark
      border border-primary/20 dark:border-primary-dark/20">
      🤖 agent
    </button>
    <!-- ... more filter chips ... -->
  </div>

  <!-- Event list -->
  <div class="flex-1 overflow-y-auto p-2 space-y-1">
    <div class="rounded-md px-2 py-1.5 cursor-pointer
      bg-bg-tertiary/50 dark:bg-bg-dark-tertiary/50
      hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-colors">
      <div class="flex items-start gap-1.5">
        <span class="text-[10px] flex-shrink-0 mt-0.5">🔧</span>
        <div class="min-w-0">
          <p class="text-[10px] font-mono text-text-primary dark:text-text-dark leading-tight truncate">
            execute_command
          </p>
          <p class="text-[9px] text-text-muted dark:text-text-dark-muted mt-0.5">
            12:34:05
          </p>
        </div>
      </div>
    </div>
  </div>
</aside>
```

### Event Category Icons

| Category | Emoji | Description |
|----------|-------|-------------|
| `agent` | 🤖 | Agent decisions / messages |
| `tool` | 🔧 | Tool invocations |
| `llm` | 🧠 | LLM API calls |
| `sub-agent` | 🔗 | Sub-agent spawns |
| `status` | ℹ️ | Status updates |
| `websocket` | 🔌 | WebSocket events |

---

## Typing Indicator

Shown while the agent is generating a response:

```html
<div class="flex justify-start gap-2">
  <div class="w-8 h-8 rounded-full bg-bg-tertiary dark:bg-bg-dark-tertiary
    border border-border/50 flex items-center justify-center">
    <FontAwesomeIcon icon={faRobot} class="text-xs text-primary dark:text-primary-dark" />
  </div>

  <div class="px-4 py-3 rounded-2xl rounded-tl-none
    bg-bg-secondary dark:bg-bg-dark-secondary
    border border-border dark:border-border-dark shadow-sm">
    <div class="flex gap-1 items-center">
      <span class="w-2 h-2 rounded-full bg-text-muted dark:bg-text-dark-muted
        animate-bounce" style="animation-delay: 0ms" />
      <span class="w-2 h-2 rounded-full bg-text-muted dark:bg-text-dark-muted
        animate-bounce" style="animation-delay: 150ms" />
      <span class="w-2 h-2 rounded-full bg-text-muted dark:bg-text-dark-muted
        animate-bounce" style="animation-delay: 300ms" />
    </div>
  </div>
</div>
```

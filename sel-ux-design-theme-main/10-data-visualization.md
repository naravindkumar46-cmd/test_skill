# SEL Data Visualization

SEL uses **Recharts** for all charting and **custom CSS/Tailwind** for progress bars, status indicators, and data tables.

---

## Dependencies

```json
{
  "recharts": "^3.8.0",
  "d3": "^6.7.0 or ^7.9.0"
}
```

---

## Theme-Aware Chart Colours

All chart elements must respond to dark/light mode. Pass theme state as props to chart containers:

```jsx
const { isDarkMode } = useTheme();

const chartTheme = {
  gridColor:       isDarkMode ? '#3e3e42' : '#e8e8e8',
  axisTickColor:   isDarkMode ? '#9d9d9d' : '#616161',
  tooltipBg:       isDarkMode ? '#252526' : '#ffffff',
  tooltipBorder:   isDarkMode ? '#3e3e42' : '#d4d4d4',
  tooltipTextColor:isDarkMode ? '#cccccc' : '#1e1e1e',
  labelColor:      isDarkMode ? '#cccccc' : '#1e1e1e',
};
```

---

## Bar Chart (Recharts)

```jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BAR_COLORS = [
  '#0078d4','#8b5cf6','#10b981','#f59e0b','#ef4444','#3b82f6',
  '#ec4899','#14b8a6','#f97316','#6366f1','#84cc16','#06b6d4',
];

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
    <XAxis
      dataKey="name"
      tick={{ fill: chartTheme.axisTickColor, fontSize: 11 }}
      axisLine={{ stroke: chartTheme.gridColor }}
    />
    <YAxis
      tick={{ fill: chartTheme.axisTickColor, fontSize: 11 }}
      axisLine={{ stroke: chartTheme.gridColor }}
    />
    <Tooltip
      contentStyle={{
        background: chartTheme.tooltipBg,
        border: `1px solid ${chartTheme.tooltipBorder}`,
        borderRadius: '8px',
        color: chartTheme.tooltipTextColor,
        fontSize: '12px',
      }}
    />
    <Legend wrapperStyle={{ color: chartTheme.labelColor, fontSize: '12px' }} />
    <Bar dataKey="value" fill={BAR_COLORS[0]} radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

## Pie / Donut Chart

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={60}   // 0 for pie, >0 for donut
      outerRadius={100}
      paddingAngle={3}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
      ))}
    </Pie>
    <Tooltip contentStyle={{ background: chartTheme.tooltipBg, ... }} />
    <Legend wrapperStyle={{ color: chartTheme.labelColor, fontSize: '12px' }} />
  </PieChart>
</ResponsiveContainer>
```

---

## Progress Bar

### Single Progress Bar

```html
<div class="space-y-1">
  <div class="flex justify-between text-xs">
    <span class="text-text-secondary dark:text-text-dark-secondary">Token Usage</span>
    <span class="text-text-primary dark:text-text-dark font-medium">72%</span>
  </div>
  <div class="w-full h-2 rounded-full bg-bg-tertiary dark:bg-bg-dark-tertiary overflow-hidden">
    <div class="h-full rounded-full bg-gradient-to-r from-primary to-primary/80
      dark:from-primary-dark dark:to-primary-dark/80 transition-all duration-500"
      style="width: 72%" />
  </div>
</div>
```

### Status-Coloured Progress Bar

```javascript
// Colour by percentage
const progressColor = (pct) => {
  if (pct >= 90) return 'from-error to-error/80 dark:from-error-dark dark:to-error-dark/80';
  if (pct >= 70) return 'from-warning to-warning/80 dark:from-warning-dark dark:to-warning-dark/80';
  return 'from-success to-success/80 dark:from-success-dark dark:to-success-dark/80';
};
```

### Multi-Step Progress (Workflow Phases)

```html
<div class="flex items-center gap-1">
  <!-- Steps -->
  <div class="flex-1 h-1.5 rounded-full bg-success dark:bg-success-dark" /> <!-- completed -->
  <div class="flex-1 h-1.5 rounded-full bg-success dark:bg-success-dark" /> <!-- completed -->
  <div class="flex-1 h-1.5 rounded-full bg-primary dark:bg-primary-dark animate-pulse" /> <!-- active -->
  <div class="flex-1 h-1.5 rounded-full bg-bg-tertiary dark:bg-bg-dark-tertiary" /> <!-- pending -->
  <div class="flex-1 h-1.5 rounded-full bg-bg-tertiary dark:bg-bg-dark-tertiary" /> <!-- pending -->
</div>
```

---

## Data Table

Full-featured table with sorting, filtering, and pagination.

### Table Structure

```html
<div class="rounded-xl border border-border dark:border-border-dark overflow-hidden shadow-card">
  <!-- Table controls -->
  <div class="flex items-center justify-between px-4 py-3
    border-b border-border dark:border-border-dark
    bg-bg-secondary dark:bg-bg-dark-secondary">
    <div class="flex items-center gap-2">
      <!-- Search -->
      <SearchInput />
      <!-- Filters -->
    </div>
    <div class="flex items-center gap-2">
      <!-- Actions -->
      <Button variant="primary" size="sm">Add New</Button>
    </div>
  </div>

  <!-- Table -->
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b-2 border-border dark:border-border-dark
          bg-bg-tertiary dark:bg-bg-dark-tertiary">
          <th class="px-4 py-3 text-left font-semibold
            text-text-primary dark:text-text-dark cursor-pointer
            hover:bg-bg-secondary dark:hover:bg-bg-dark-secondary transition-colors
            select-none">
            <div class="flex items-center gap-2">
              Column Name
              <FontAwesomeIcon icon={faSort} class="text-text-muted text-xs" />
            </div>
          </th>
          <!-- more columns -->
        </tr>
        <!-- Optional filter row -->
        <tr class="border-b border-border dark:border-border-dark
          bg-bg-secondary dark:bg-bg-dark-secondary">
          <th class="px-4 py-2">
            <input class="w-full px-2 py-1 text-xs rounded border border-border dark:border-border-dark
              bg-bg-primary dark:bg-bg-dark
              text-text-primary dark:text-text-dark
              placeholder-text-muted dark:placeholder-text-dark-muted
              focus:outline-none focus:border-primary dark:focus:border-primary-dark"
              placeholder="Filter..." />
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border dark:divide-border-dark">
        <tr class="hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-colors">
          <td class="px-4 py-3 text-text-primary dark:text-text-dark">
            Cell value
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div class="px-4 py-3 border-t border-border dark:border-border-dark
    bg-bg-secondary dark:bg-bg-dark-secondary flex items-center justify-between">
    <!-- Pagination component -->
  </div>
</div>
```

### Sort Icon States

| State | Icon | Colour |
|-------|------|--------|
| None | `faSort` | `text-text-muted` |
| Ascending | `faSortUp` | `text-primary` |
| Descending | `faSortDown` | `text-primary` |

---

## Status Indicator Cells

```html
<!-- Workflow status cell -->
<td class="px-4 py-3">
  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
    bg-success/10 dark:bg-success-dark/10 text-success dark:text-success-dark">
    <span class="w-1.5 h-1.5 rounded-full bg-success dark:bg-success-dark" />
    Completed
  </span>
</td>
```

### Status → Colour Mapping

| Status | Badge BG | Badge Text | Dot |
|--------|---------|-----------|-----|
| `completed` | `bg-success/10` | `text-success` | `bg-success animate-pulse` (no pulse for done) |
| `running` | `bg-primary/10` | `text-primary` | `bg-primary animate-pulse` |
| `failed` | `bg-error/10` | `text-error` | `bg-error` |
| `pending` | `bg-warning/10` | `text-warning` | `bg-warning` |
| `cancelled` | `bg-bg-tertiary` | `text-text-muted` | `bg-text-muted` |
| `created` | `bg-info/10` | `text-info` | `bg-info` |

---

## Skeleton Loading

Use while data is loading to prevent layout shift:

```html
<!-- Text skeleton -->
<div class="h-4 rounded bg-bg-tertiary dark:bg-bg-dark-tertiary animate-pulse w-3/4" />
<div class="h-4 rounded bg-bg-tertiary dark:bg-bg-dark-tertiary animate-pulse w-1/2 mt-2" />

<!-- Card skeleton -->
<div class="rounded-xl border border-border dark:border-border-dark p-5 space-y-3
  bg-bg-secondary dark:bg-bg-dark-secondary">
  <div class="h-5 rounded bg-bg-tertiary dark:bg-bg-dark-tertiary animate-pulse w-2/3" />
  <div class="h-3 rounded bg-bg-tertiary dark:bg-bg-dark-tertiary animate-pulse w-full" />
  <div class="h-3 rounded bg-bg-tertiary dark:bg-bg-dark-tertiary animate-pulse w-5/6" />
  <div class="flex gap-2 pt-2">
    <div class="h-7 w-20 rounded-lg bg-bg-tertiary dark:bg-bg-dark-tertiary animate-pulse" />
    <div class="h-7 w-20 rounded-lg bg-bg-tertiary dark:bg-bg-dark-tertiary animate-pulse" />
  </div>
</div>
```

---

## Metric / KPI Display

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">

  <div class="p-4 rounded-xl border border-border dark:border-border-dark
    bg-bg-secondary dark:bg-bg-dark-secondary shadow-card">

    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-medium text-text-secondary dark:text-text-dark-secondary
        uppercase tracking-wide">
        Total Sessions
      </span>
      <span class="w-8 h-8 rounded-lg flex items-center justify-center
        bg-primary/10 dark:bg-primary-dark/10">
        <FontAwesomeIcon icon={faClock} class="text-sm text-primary dark:text-primary-dark" />
      </span>
    </div>

    <p class="text-2xl font-black text-text-primary dark:text-text-dark">
      1,247
    </p>

    <p class="text-xs mt-1 text-success dark:text-success-dark">
      ↑ 8.3% from last month
    </p>
  </div>

</div>
```

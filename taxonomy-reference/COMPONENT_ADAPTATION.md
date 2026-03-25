# Quick Reference: Adapting ArxivDigest Components to Taxonomy Patterns

This guide shows before/after examples for your current components.

---

## 1. SIDEBAR NAVIGATION

**Current:** components/sidebar-nav.tsx (basic)
**→ Adopt:** Taxonomy pattern with configuration-driven items

**Before:**
```typescript
// Hardcoded sidebar items in component
export function SidebarNav() {
  return (
    <nav>
      <Link href="/history">History</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  )
}
```

**After:**
```typescript
// config/dashboard.ts
export const dashboardConfig = {
  sidebarNav: [
    { title: "Dashboard", items: [{ title: "Overview", href: "/dashboard" }] },
    { title: "Papers", items: [{ title: "History", href: "/history" }] },
  ],
}

// components/layout/sidebar-nav.tsx
export function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  // Reusable component - import items from config
}

// In layout: <SidebarNav items={dashboardConfig.sidebarNav} />
```

**Benefits:** Changes reflected everywhere, type-safe, reusable

---

## 2. PAPER SUMMARY DISPLAY

**Current:** components/sections/paper-summary-display.tsx
**→ Wrap in:** DashboardShell for consistent spacing

**Before:**
```typescript
export function PaperSummaryDisplay({ paper }: Props) {
  return (
    <div className="p-6 space-y-4">
      <h1>{paper.title}</h1>
      <p>{paper.summary}</p>
    </div>
  )
}
```

**After:**
```typescript
import { DashboardShell } from "@/components/layout/shell"
import { PageHeader } from "@/components/page-header"

export function PaperSummaryDisplay({ paper }: Props) {
  return (
    <DashboardShell>
      <PageHeader heading={paper.title} text={paper.authors} />
      <div className="grid gap-8">
        <Card>
          <CardContent>
            <p>{paper.summary}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
```

**Benefits:** Consistent spacing (gap-8), proper hierarchy with PageHeader

---

## 3. HISTORY VIEW

**Current:** components/sections/history-view.tsx with inline styling
**→ Adopt:** Card-based list with DashboardShell wrapper

**Before:**
```typescript
export function HistoryView({ papers }: Props) {
  return (
    <div className="space-y-4 p-4">
      {papers.map(paper => (
        <div className="border p-4 rounded">{paper.title}</div>
      ))}
    </div>
  )
}
```

**After:**
```typescript
import { DashboardShell } from "@/components/layout/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function HistoryView({ papers }: Props) {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Paper History</h2>
        <Button>New Search</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {papers.map(paper => (
          <Card key={paper.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="line-clamp-2">{paper.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {paper.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
}
```

**Benefits:** 
- Consistent card styling from Shadcn
- Built-in hover states
- Responsive grid
- Proper typography hierarchy
- Muted foreground for secondary text

---

## 4. THEME TOGGLE

**Current:** components/sections/theme-toggle.tsx (manual)
**→ Use:** next-themes for production-ready dark mode

**Before:**
```typescript
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  
  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? "🌙" : "☀️"}
    </button>
  )
}
```

**After:**
```typescript
"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

**Benefits:**
- Respects system preferences
- Smooth transitions
- Persists user choice
- Accessible (aria-labels)
- Lucide icons instead of emoji

---

## 5. PAGE LAYOUT

**Current:** app/page.tsx (standalone)
**→ Adopt:** Route group + layout pattern

**Before:**
```
app/
├── page.tsx
├── history/page.tsx
├── settings/page.tsx
└── docs/page.tsx
```

**After:**
```
app/
├── layout.tsx                 # Root + fonts + theme
├── page.tsx                   # Marketing/home
├── (dashboard)/layout.tsx     # Dashboard layout with sidebar
│   ├── dashboard/page.tsx
│   ├── history/page.tsx
│   └── settings/page.tsx
└── (docs)/layout.tsx          # Docs layout (if needed)
    └── page.tsx
```

**Benefits:**
- Different layouts per section
- Shared layout code per group
- Cleaner URL structure
- Better code organization

---

## 6. MOCK DATA SELECTOR

**Current:** components/sections/mock-data-selector.tsx
**→ Enhance with:** Radix UI Select component + form validation

**Before:**
```typescript
export function MockDataSelector({ onSelect }: Props) {
  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option>Select dataset...</option>
      {datasets.map(d => <option key={d.id}>{d.name}</option>)}
    </select>
  )
}
```

**After:**
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

const schema = z.object({
  dataset: z.string().min(1, "Please select a dataset"),
})

export function MockDataSelector({ onSelect }: Props) {
  const form = useForm({ resolver: zodResolver(schema) })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => onSelect(data.dataset))}>
        <FormField
          control={form.control}
          name="dataset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Research Dataset</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a dataset..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {datasets.map(d => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

**Benefits:**
- Type-safe form handling
- Built-in validation
- Accessible labels
- Proper error display
- Consistent styling

---

## 7. BENTO GRID COMPONENT

**Current:** components/sections/bento-grid.tsx with hardcoded grid
**→ Keep pattern but enhance with** proper Shadcn cards

**Before:**
```typescript
export function BentoGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>Stat 1</div>
      <div>Stat 2</div>
    </div>
  )
}
```

**After:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, TrendingUp, Users } from "lucide-react"

export function BentoGrid() {
  const stats = [
    {
      title: "Papers Analyzed",
      value: "1,234",
      icon: FileText,
      description: "This month",
    },
    {
      title: "Avg. Read Time",
      value: "3m 42s",
      icon: Activity,
      description: "Per paper",
    },
    {
      title: "Categories Tracked",
      value: "12",
      icon: TrendingUp,
      description: "Active",
    },
    {
      title: "Saved Papers",
      value: "456",
      icon: Users,
      description: "In collection",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
```

**Benefits:**
- Lucide icons integrated
- Consistent card styling
- Responsive grid
- Proper typography scale
- Muted secondary text

---

## 8. PAGE HEADER COMPONENT

**Pattern:** Create simple PageHeader for consistency

**New File:** components/page-header.tsx
```typescript
export interface PageHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, text, children }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
```

**Usage:**
```typescript
<PageHeader
  heading="Paper History"
  text="Browse and manage all papers you've analyzed"
>
  <Button>Export as CSV</Button>
</PageHeader>
```

---

## 9. DASHBOARD SHELL USAGE

**Pattern:** Use DashboardShell for consistent spacing on all pages

**Before:**
```typescript
export default function HistoryPage() {
  return (
    <div className="p-6">
      <h1>History</h1>
      {/* content */}
    </div>
  )
}
```

**After:**
```typescript
import { DashboardShell } from "@/components/layout/shell"
import { PageHeader } from "@/components/page-header"

export default function HistoryPage() {
  return (
    <DashboardShell>
      <PageHeader heading="Paper History" />
      {/* content */}
    </DashboardShell>
  )
}
```

**Grid structure inside DashboardShell:**
```
DashboardShell (grid gap-8)
├── PageHeader
├── Filters (optional)
└── Content Grid (gap-4)
    ├── Card 1
    ├── Card 2
    └── Card 3
```

---

## 10. TYPE DEFINITIONS

**Pattern:** Share types across components

**Before:**
```typescript
// Scattered in different files
type Paper = { title: string }
type Summary = { text: string }
```

**After:**
```typescript
// types/index.ts - Single source of truth
export interface Paper {
  id: string
  title: string
  authors: string
  arxivId: string
  publishedAt: Date
  summary: string
  fullText?: string
  category: string
  tags: string[]
  savedAt: Date
}

export interface ParsedPaperData {
  title: string
  authors: string[]
  abstract: string
  category: string
}

export interface SummaryResult {
  summary: string
  keyInsights: string[]
  confidence: number
}

// Then import everywhere
import type { Paper, SummaryResult } from "@/types"
```

---

## Migration Priority Order

1. **Phase 1 (Foundation)**
   - Update root layout with fonts & theme provider
   - Create config/ files
   - Update tailwind.config.js with CSS variables
   - Update styles/globals.css

2. **Phase 2 (Layout)**
   - Create route groups structure
   - Create layout components (dashboard-layout.tsx, shell.tsx, sidebar-nav.tsx)
   - Migrate page.tsx files to proper routes

3. **Phase 3 (Components)**
   - Replace paper-summary-display with Card-based layout
   - Enhance history-view with responsive grid
   - Update theme-toggle to use next-themes
   - Add PageHeader to all pages

4. **Phase 4 (Enhancement)**
   - Add Shadcn UI components (form, select, dialog, etc.)
   - Implement React Hook Form + Zod validation
   - Add error boundaries
   - Polish responsive design

---

## Common Patterns to Remember

### 1. Always Wrap Pages in DashboardShell
```typescript
return (
  <DashboardShell>
    <PageHeader heading="..." />
    {/* content */}
  </DashboardShell>
)
```

### 2. Use CSS Variable Colors
```typescript
// ✅ Good
className="bg-primary text-primary-foreground"
className="border border-border"
className="text-muted-foreground"

// ❌ Avoid
className="bg-blue-600"  // Hard to theme
className="text-gray-500"
```

### 3. Responsive Grids
```typescript
// ✅ Good - Mobile-first
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// ❌ Avoid
className="grid grid-cols-3"  // Breaks on mobile
```

### 4. Configuration Over Hardcoding
```typescript
// ✅ Good - Reusable
const config = { items: [...] }
<SidebarNav items={config.sidebarNav} />

// ❌ Avoid - Hardcoded in component
<SidebarNav>
  <Link href="...">Item</Link>
</SidebarNav>
```

### 5. Icon+Text Combinations
```typescript
import { Package } from "lucide-react"

<div className="flex items-center gap-2">
  <Package className="h-4 w-4 text-muted-foreground" />
  <span>My Papers</span>
</div>
```

---

## Dependencies to Add

```bash
npm install next-themes @hookform/resolvers react-hook-form zod class-variance-authority tailwindcss-animate lucide-react
```

---

## Testing Checklist After Migration

- [ ] Root layout renders correctly
- [ ] Dark mode toggle works
- [ ] Sidebar navigation highlights active page
- [ ] Route groups don't affect URLs (e.g., /history, not /dashboard/history)
- [ ] Cards and components use CSS variables
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Page transitions are smooth
- [ ] Forms validate with Zod
- [ ] No console errors or warnings
- [ ] TypeScript compilation passes

---

## Common Gotchas

**Problem:** Sidebar not showing active page
**Solution:** Import `usePathname` from `next/navigation`, use it to detect current path

**Problem:** CSS variables not working
**Solution:** Make sure `styles/globals.css` is imported in root layout before any component styles

**Problem:** Dark mode not persisting
**Solution:** Use `next-themes` ThemeProvider in root layout with `storageKey` option

**Problem:** Children not rendering in layout
**Solution:** Ensure route groups have their own `layout.tsx` file that returns `{children}`

**Problem:** Grade-1 inconsistent spacing
**Solution:** Always use `DashboardShell` wrapper, maintain `gap-8` for top-level, `gap-4` for sub-items

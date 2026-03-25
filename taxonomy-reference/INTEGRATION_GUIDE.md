# Taxonomy Pattern Integration Guide for ArxivDigest

This guide shows how to integrate Shadcn Taxonomy patterns into ArxivDigest.

---

## STEP 1: Restructure App Router with Route Groups

**From:** Flat structure
```
app/
  ├── page.tsx
  ├── docs/page.tsx
  ├── history/page.tsx
  └── settings/page.tsx
```

**To:** Route groups for organization
```
app/
  ├── layout.tsx                    # Root layout
  ├── page.tsx                      # Home page
  ├── api/
  │   └── summarize/route.ts
  ├── (dashboard)/                  # Protected dashboard group
  │   ├── layout.tsx                # Dashboard layout with sidebar
  │   ├── dashboard/page.tsx        # Main dashboard/history
  │   ├── history/page.tsx          # Paper history
  │   └── settings/page.tsx         # User settings
  ├── (docs)/                       # Public docs group
  │   ├── layout.tsx                # Docs layout with sidebar
  │   └── page.tsx                  # Docs home
  └── (marketing)/                  # Public marketing group (optional)
      └── page.tsx
```

**Benefits:**
- Separate layouts per section without URL changes
- Different sidebars and navigation per group
- Cleaner organization as app grows
- Each group can have its own theme/styling

---

## STEP 2: Update Configuration Structure

Create configuration files in `config/`:

### config/site.ts
```typescript
import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "ArxivDigest",
  description: "Summarize and organize research papers from arXiv",
  url: "https://arxivdigest.com",
  ogImage: "https://arxivdigest.com/og.jpg",
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername/arxivdigest",
  },
}
```

### config/dashboard.ts
```typescript
import { SidebarNavItem } from "@/types"

export const dashboardConfig: {
  mainNav: SidebarNavItem[]
  sidebarNav: SidebarNavItem[]
} = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "credit",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          href: "/dashboard",
        },
        {
          title: "History",
          href: "/dashboard/history",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Account",
          href: "/dashboard/settings",
        },
        {
          title: "Preferences",
          href: "/dashboard/settings/preferences",
        },
      ],
    },
  ],
}
```

---

## STEP 3: Create Layout Components

### components/layout/shell.tsx
Minimal wrapper for consistent spacing:
```typescript
import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: ShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  )
}
```

### components/layout/dashboard-layout.tsx
Main dashboard layout with sidebar:
```typescript
import Link from "next/link"
import { dashboardConfig } from "@/config/dashboard"
import { MainNav } from "./main-nav"
import { SidebarNav } from "./sidebar-nav"
import { SiteFooter } from "./site-footer"

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav items={dashboardConfig.mainNav} />
      <div className="flex-1">
        <div className="container grid gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
          <aside className="hidden md:flex md:flex-col">
            <SidebarNav items={dashboardConfig.sidebarNav} />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
```

---

## STEP 4: Implement Navigation Components

### components/layout/sidebar-nav.tsx
```typescript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarNavItem } from "@/types"

export interface SidebarNavProps {
  items: SidebarNavItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
    <nav className="w-full">
      {items.map((item, index) => (
        <div key={index} className="pb-8">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
            {item.title}
          </h4>
          {item.items && (
            <SidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </nav>
  ) : null
}

function SidebarNavItems({
  items,
  pathname,
}: {
  items: SidebarNavItem[]
  pathname: string | null
}) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        !item.disabled && item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex w-full items-center rounded-md p-2 hover:underline",
              {
                "bg-muted": pathname === item.href,
              }
            )}
          >
            {item.title}
          </Link>
        ) : (
          <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null
}
```

---

## STEP 5: Update Global Styles

### styles/globals.css
Add CSS variables for theming:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.6%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 9.1%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --primary: 0 0% 9.1%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9.1%;
    --ring: 0 0% 3.6%;
    --radius: 0.5rem;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: 0 0% 3.6%;
      --foreground: 0 0% 98%;
      --card: 0 0% 3.6%;
      --card-foreground: 0 0% 98%;
      --popover: 0 0% 3.6%;
      --popover-foreground: 0 0% 98%;
      --muted: 0 0% 14.9%;
      --muted-foreground: 0 0% 63.9%;
      --accent: 0 0% 98%;
      --accent-foreground: 0 0% 9.1%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 0 0% 98%;
      --border: 0 0% 14.9%;
      --input: 0 0% 14.9%;
      --primary: 0 0% 98%;
      --primary-foreground: 0 0% 9.1%;
      --secondary: 0 0% 14.9%;
      --secondary-foreground: 0 0% 98%;
      --ring: 0 0% 83.1%;
    }
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }
}
```

---

## STEP 6: Update tailwind.config.js

```javascript
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## STEP 7: Update Root Layout

### app/layout.tsx
```typescript
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { siteConfig } from "@/config/site"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["arXiv", "papers", "research", "summarization", "AI"],
  authors: [{ name: "ArxivDigest" }],
  creator: "ArxivDigest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@arxivdigest",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## STEP 8: Create Dashboard Layout

### app/(dashboard)/layout.tsx
```typescript
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
```

### app/(dashboard)/dashboard/page.tsx
```typescript
import { DashboardShell } from "@/components/layout/shell"
import { PageHeader } from "@/components/page-header"
import { BentoGrid } from "@/components/sections/bento-grid"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <PageHeader
        heading="Dashboard"
        text="Welcome back to ArxivDigest. Here's your recent activity."
      />
      <BentoGrid />
    </DashboardShell>
  )
}
```

---

## STEP 9: Type Definitions

### types/index.ts
```typescript
export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter?: string
    github?: string
  }
}

export interface SidebarNavItem {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
  href?: string
  items?: SidebarNavItem[]
}

export interface NavItem extends SidebarNavItem {}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}
```

---

## STEP 10: Utility Functions

### lib/utils.ts
Already has `cn()` function, add:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
```

---

## STEP 11: Install Additional Dependencies

```bash
npm install next-themes @hookform/resolvers react-hook-form zod class-variance-authority tailwindcss-animate
```

---

## Integration Checklist

- [ ] Create route groups structure
- [ ] Add configuration files in `config/`
- [ ] Create layout components
- [ ] Update global styles with CSS variables
- [ ] Update tailwind.config.js
- [ ] Update root layout.tsx
- [ ] Create dashboard layout
- [ ] Add type definitions
- [ ] Update utility functions
- [ ] Install additional dependencies
- [ ] Test route group navigation
- [ ] Verify dark mode switching
- [ ] Test responsive sidebar

---

## Key Pattern Differences from Current ArxivDigest

| Aspect | Current | Taxonomy Pattern |
|--------|---------|------------------|
| Layout | Per-route | Shared layout in route group |
| Navigation | Hardcoded | Configuration-driven |
| Styling | Direct Tailwind | CSS variables + Tailwind |
| Dark Mode | Manual | next-themes + system |
| Type Safety | Partial | Full TypeScript types |
| Reusability | Component-based | Shell wrapper pattern |

---

## Reference

- Full analysis: See `TAXONOMY_ANALYSIS.md`
- Original repo: https://github.com/shadcn-ui/taxonomy
- Next.js routing: https://nextjs.org/docs/app/building-your-application/routing
- Radix UI: https://www.radix-ui.com/
- Tailwind CSS: https://tailwindcss.com/

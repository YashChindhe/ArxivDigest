# Shadcn Taxonomy - Key Files Reference

**Repository:** https://github.com/shadcn-ui/taxonomy

Study these files in order from the actual repository for latest, up-to-date code.

---

## CORE CONFIGURATION FILES

Essential files that define the project structure and styling.

### 1. **tailwind.config.js**
- **Purpose:** Tailwind theme configuration with CSS variables
- **Key Learning:** How to organize color system, extend theme, use HSL variables
- **Location:** `/tailwind.config.js`
- **Key Features:**
  - Color system using CSS variables (primary, secondary, destructive, etc.)
  - Dark mode with class strategy
  - Custom border radius and font family variables
  - Animation definitions
  - Tailwindcss-animate and typography plugins

### 2. **tsconfig.json**
- **Purpose:** TypeScript configuration with path aliases
- **Key Learning:** How to set up path aliases (@/*), strict checking
- **Location:** `/tsconfig.json`
- **Key Settings:**
  - `baseUrl: "."` with paths for `@/*`
  - `strictNullChecks: true` for better type safety
  - `jsx: "preserve"` for Next.js
  - Contentlayer path mapping

### 3. **next.config.mjs**
- **Purpose:** Next.js 13 configuration with App Router
- **Key Learning:** Contentlayer integration, image optimization, experimental features
- **Location:** `/next.config.mjs`
- **Key Features:**
  - `withContentlayer` wrapper for MDX support
  - App dir enabled (`experimental.appDir`)
  - Server components external packages configuration

### 4. **package.json**
- **Purpose:** Project dependencies and scripts
- **Key Learning:** Full list of production and dev dependencies
- **Location:** `/package.json`
- **Notable Dependencies:**
  - All @radix-ui/* packages
  - next-auth, @prisma/client for auth/database
  - contentlayer for MDX
  - stripe for payments
  - react-hook-form + zod for forms

---

## STYLING & THEME FILES

### 5. **styles/globals.css**
- **Purpose:** Global styles with CSS variables and dark mode
- **Key Learning:** CSS variable organization, Tailwind directives, dark mode strategy
- **Location:** `/styles/globals.css`
- **Patterns:**
  - `:root` block with all CSS variables in light mode
  - `@media (prefers-color-scheme: dark)` for dark variants
  - `@layer` directives for base/components/utilities
  - Dark mode overrides

---

## ROOT LAYOUT & APP STRUCTURE

### 6. **app/layout.tsx**
- **Purpose:** Root layout for entire application
- **Key Learning:** Font integration, metadata setup, theme provider, layout wrapper
- **Location:** `/app/layout.tsx`
- **Key Patterns:**
  - Font Sans and custom heading font setup
  - Metadata object for OG, Twitter, icons
  - ThemeProvider wrapping children
  - Layout composition with providers

### 7. **app/page.tsx**
- **Purpose:** Home/root page
- **Location:** `/app/page.tsx`
- **Learn:** How to structure marketing/landing pages

### 8. **app/(dashboard)/dashboard/page.tsx**
- **Purpose:** Protected dashboard page example
- **Location:** `/app/(dashboard)/dashboard/page.tsx`
- **Learn:** Route group usage, dashboard layout pattern

### 9. **app/(dashboard)/dashboard/[postId]/page.tsx**
- **Purpose:** Dynamic route example
- **Location:** `/app/(dashboard)/dashboard/[postId]/page.tsx`
- **Learn:** Dynamic segments, metadata generation, nested layouts

### 10. **app/(docs)/docs/[[...slug]]/page.tsx**
- **Purpose:** Catch-all route for docs pages
- **Location:** `/app/(docs)/docs/[[...slug]]/page.tsx`
- **Learn:** Optional catch-all syntax, markdown rendering

---

## COMPONENT LIBRARY

### 11. **components/ui/** (40+ components)
- **Purpose:** Shadcn UI component library (Radix + Tailwind)
- **Key Learning:** How to wrap Radix UI with Tailwind
- **Location:** `/components/ui/*.tsx`

**Study These Core UI Components:**
- `button.tsx` - Base button with CVA variants
- `card.tsx` - Card container
- `input.tsx` - Form input
- `select.tsx` - Radix select wrapper
- `dialog.tsx` - Modal dialog
- `sheet.tsx` - Drawer/sidebar sheet
- `form.tsx` - React Hook Form wrapper (if exists)
- `use-toast.ts` - Toast hook
- `toaster.tsx` - Toast container

### 12. **components/shell.tsx**
- **Purpose:** Dashboard shell/wrapper component
- **Key Learning:** Minimal, reusable layout wrapper
- **Location:** `/components/shell.tsx`
- **Pattern:** Grid with gap-8, extends HTMLAttributes

### 13. **components/sidebar-nav.tsx**
- **Purpose:** Sidebar navigation component
- **Key Learning:** Configuration-driven navigation, active page highlighting
- **Location:** `/components/sidebar-nav.tsx`
- **Features:**
  - `usePathname()` for active state
  - Maps over `SidebarNavItem[]` array
  - Supports nested items, disabled items, external links
  - Accessibility attributes

### 14. **components/main-nav.tsx**
- **Purpose:** Main header navigation
- **Location:** `/components/main-nav.tsx`
- **Features:** Responsive navigation, mobile drawer, logo, user menu

### 15. **components/mobile-nav.tsx**
- **Purpose:** Mobile drawer navigation
- **Location:** `/components/mobile-nav.tsx`
- **Features:** Sheet component, responsive visibility

### 16. **components/user-account-nav.tsx**
- **Purpose:** User dropdown menu in header
- **Location:** `/components/user-account-nav.tsx`
- **Features:** DropdownMenu, user avatar, sign out button, settings links

### 17. **components/header.tsx**
- **Purpose:** Page header wrapper
- **Location:** `/components/header.tsx`
- **Pattern:** Consistent header styling across pages

### 18. **components/site-footer.tsx**
- **Purpose:** Footer component
- **Location:** `/components/site-footer.tsx`
- **Features:** Links, copyright, responsive layout

### 19. **components/page-header.tsx**
- **Purpose:** Page title and description section
- **Location:** `/components/page-header.tsx`
- **Pattern:** Heading + text + optional children

### 20. **components/mdx-components.tsx**
- **Purpose:** Custom MDX component overrides
- **Location:** `/components/mdx-components.tsx`
- **Features:** Custom heading, link, code components for MDX content

### 21. **components/theme-provider.tsx**
- **Purpose:** next-themes provider wrapper
- **Location:** `/components/theme-provider.tsx`
- **Learn:** Dark mode provider setup and configuration

### 22. **components/mode-toggle.tsx**
- **Purpose:** Light/dark mode toggle button
- **Location:** `/components/mode-toggle.tsx`
- **Features:** useTheme hook, smooth icon transitions

---

## CONFIGURATION FILES

### 23. **config/site.ts**
- **Purpose:** Site-wide configuration (name, description, links)
- **Location:** `/config/site.ts`
- **Pattern:** Exported object used throughout app

### 24. **config/docs.ts**
- **Purpose:** Documentation navigation structure
- **Location:** `/config/docs.ts`
- **Pattern:** Array of navigation items with hierarchy

### 25. **config/dashboard.ts**
- **Purpose:** Dashboard navigation structure
- **Location:** `/config/dashboard.ts`
- **Pattern:** Main nav and sidebar nav items

---

## UTILITY & HELPER FILES

### 26. **lib/utils.ts**
- **Purpose:** Shared utility functions
- **Location:** `/lib/utils.ts`
- **Functions:**
  - `cn()` - Class name merging (clsx + tailwind-merge)
  - `formatDate()` - Date formatting
  - `absoluteUrl()` - URL resolution

### 27. **env.mjs**
- **Purpose:** Environment variable validation with Zod
- **Location:** `/env.mjs`
- **Learn:** Type-safe environment variables

### 28. **middleware.ts**
- **Purpose:** Next.js middleware (auth checks, redirects)
- **Location:** `/middleware.ts`
- **Learn:** Middleware patterns for route protection

---

## TYPE DEFINITIONS

### 29. **types/index.ts** (or individual type files)
- **Purpose:** Shared TypeScript types
- **Location:** `/types/` or `/types/index.ts`
- **Key Types:**
  - `SiteConfig`
  - `SidebarNavItem`
  - `NavItem`
  - `User`
  - `Post`

---

## CONTENT & DATABASE

### 30. **contentlayer.config.js**
- **Purpose:** Contentlayer configuration for MDX processing
- **Location:** `/contentlayer.config.js`
- **Learn:** MDX document schema, computed fields

### 31. **prisma/schema.prisma**
- **Purpose:** Database schema
- **Location:** `/prisma/schema.prisma`
- **Learn:** Database models for users, posts, accounts

### 32. **app/api/auth/[...nextauth]/route.ts**
- **Purpose:** NextAuth.js authentication route
- **Location:** `/app/api/auth/[...nextauth]/route.ts`
- **Learn:** Authentication provider setup, session management

---

## ADVANCED PATTERNS

### 33. **app/(dashboard)/dashboard/billing/page.tsx**
- **Purpose:** Billing page with subscription management
- **Learn:** Complex dashboard page patterns

### 34. **app/api/users/[userId]/route.ts**
- **Purpose:** API route example
- **Location:** `/app/api/users/[userId]/route.ts`
- **Learn:** Dynamic API routes, request handling

### 35. **components/user-auth-form.tsx**
- **Purpose:** Login/register form with React Hook Form
- **Location:** `/components/user-auth-form.tsx`
- **Learn:** Form validation, error handling, loading states

### 36. **components/post-create-button.tsx**
- **Purpose:** Button to create new content
- **Location:** `/components/post-create-button.tsx`
- **Learn:** Client-side navigation, modal patterns

### 37. **components/post-item.tsx**
- **Purpose:** Individual post/item card
- **Location:** `/components/post-item.tsx`
- **Learn:** Reusable list item component, operation buttons

### 38. **components/empty-placeholder.tsx**
- **Purpose:** Empty state component
- **Location:** `/components/empty-placeholder.tsx`
- **Learn:** How to display empty states

---

## STUDY ORDER RECOMMENDATION

**Day 1 - Foundation (Understand Structure)**
1. tailwind.config.js - Understand theme system
2. styles/globals.css - CSS variable organization
3. tsconfig.json - Path aliases
4. types/index.ts - Data structures

**Day 2 - Core Setup (Root & Layout)**
1. app/layout.tsx - Root layout
2. components/theme-provider.tsx - Theme setup
3. components/shell.tsx - Layout wrapper
4. lib/utils.ts - Utilities

**Day 3 - Navigation & Configuration**
1. config/site.ts - Configuration pattern
2. config/dashboard.ts - Navigation structure
3. components/sidebar-nav.tsx - Navigation component
4. components/main-nav.tsx - Header navigation

**Day 4 - Components & Patterns**
1. components/ui/button.tsx - UI component pattern
2. components/page-header.tsx - Page structure
3. components/post-item.tsx - List item pattern
4. components/card.tsx - Card component

**Day 5 - Advanced (Advanced Patterns)**
1. app/(dashboard)/dashboard/page.tsx - Route group usage
2. components/user-auth-form.tsx - Form validation
3. app/api/auth/[...nextauth]/route.ts - Authentication
4. contentlayer.config.js - Content processing

---

## KEY FILES FOR YOUR USE CASE (ArxivDigest)

**Most Relevant to Your Project:**

1. **For Navigation/Layout:**
   - components/sidebar-nav.tsx
   - components/shell.tsx
   - app/(dashboard)/layout.tsx (if exists)

2. **For Paper Display:**
   - components/post-item.tsx → Adapt for papers
   - components/page-header.tsx
   - components/empty-placeholder.tsx

3. **For History/Search:**
   - app/(dashboard)/dashboard/page.tsx → Dashboard layout
   - components/card.tsx
   - lib/utils.ts → cn() function

4. **For Configuration:**
   - config/site.ts → Copy and adapt
   - config/dashboard.ts → Copy and adapt
   - types/index.ts → Copy and extend

5. **For Styling:**
   - tailwind.config.js → Copy and adapt
   - styles/globals.css → Copy and adapt
   - components/theme-provider.tsx

---

## EXTERNAL LIBRARY DOCUMENTATION

While studying the files, reference these external resources:

| Library | Docs | Purpose |
|---------|------|---------|
| Radix UI | https://radix-ui.com/ | Component primitives |
| React Hook Form | https://react-hook-form.com/ | Form state management |
| Zod | https://zod.dev/ | Schema validation |
| next-themes | https://github.com/pacocoursey/next-themes | Dark mode |
| Tailwind CSS | https://tailwindcss.com/ | Styling |
| Next.js App Router | https://nextjs.org/docs/app | Routing |
| Prisma | https://www.prisma.io/docs/ | Database ORM |
| NextAuth.js | https://next-auth.js.org/ | Authentication |

---

## File Size Reference

To help prioritize which files to read:

| File | Size | Why Important |
|------|------|---------------|
| tailwind.config.js | ~2KB | Foundation for styling |
| app/layout.tsx | ~1.5KB | How to structure root |
| components/sidebar-nav.tsx | ~1.2KB | Navigation pattern |
| config/dashboard.ts | ~1.5KB | Configuration pattern |
| components/shell.tsx | ~0.3KB | Simple but important |
| components/ui/button.tsx | ~0.8KB | UI component pattern |
| types/index.ts | ~1.2KB | Type definitions |

**Total:** Most files are <2KB - quick reads once you understand the patterns.

---

## Cloned Repository Location

On your machine:
```
c:\Users\Acer\OneDrive\Desktop\projects\taxonomy-repo\
```

**Navigate with:**
```bash
cd c:\Users\Acer\OneDrive\Desktop\projects\taxonomy-repo
git log --oneline | head  # See recent commits
git show HEAD             # View latest changes
```

---

## How to Keep It Updated

To ensure you have the latest code:

1. **Pull latest changes:**
   ```bash
   cd c:\Users\Acer\OneDrive\Desktop\projects\taxonomy-repo
   git pull origin main
   ```

2. **Check for changes:**
   ```bash
   git log --oneline -20
   git diff HEAD~5
   ```

3. **Specific file history:**
   ```bash
   git log -p --follow -- tailwind.config.js
   ```

---

## Summary: What Each File Teaches You

| File | Teaches |
|------|--------|
| tailwind.config.js | How to organize theme system |
| types/index.ts | Data structure design |
| config/site.ts | Configuration-driven architecture |
| components/sidebar-nav.tsx | Component composition patterns |
| components/shell.tsx | Reusable wrapper mindset |
| lib/utils.ts | Utility function organization |
| app/layout.tsx | Root setup with providers |
| components/ui/* | Radix + Tailwind integration |
| app/(dashboard)/ | Route groups in practice |
| config/dashboard.ts | Navigation as data pattern |

---

## Next Steps

1. ✅ Read through `TAXONOMY_ANALYSIS.md` (comprehensive overview)
2. ✅ Read through `INTEGRATION_GUIDE.md` (step-by-step integration)
3. ✅ Read through `COMPONENT_ADAPTATION.md` (before/after examples)
4. 📖 **Study actual files** - Start with foundation (see study order above)
5. 🔧 **Implement incrementally** - Follow the phase breakdown in INTEGRATION_GUIDE.md
6. 🧪 **Test each phase** - Don't rush to next phase until current one works
7. 📝 **Take notes** - Keep track of patterns you like/dislike

---

## Questions to Ask While Reading

- How does this file relate to the overall architecture?
- What pattern is this demonstrating?
- How would I adapt this for ArxivDigest?
- What dependencies does this require?
- Is this pattern reusable in my project?

---

**Last Updated:** March 25, 2026  
**Repository:** https://github.com/shadcn-ui/taxonomy  
**License:** MIT

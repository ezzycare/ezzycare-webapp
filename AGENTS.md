<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview
This is a Next.js application using the App Router. All new features should follow Next.js 16 conventions unless the project is pinned to an older version.

The application serves as a healthcare platform (Ezzycare) where users can find doctors, book appointments, request lab tests, and manage medicine deliveries. It contains complex dashboards tailored for different user roles: Care Seekers (`SEEKER`), Hospitals (`HOSPITAL`), Agents (`AGENT`), Doctors (`DOCTOR`), and Administrators (`ADMIN`).

---

## Technical Stack & Tooling
- **Framework:** Next.js `16.2.4` (App Router)
- **Runtime & Language:** React `19.2.4` (React Compiler enabled via `next.config.ts`) & TypeScript (strict mode enabled)
- **Package Manager:** **Yarn** (`yarn.lock` present)
- **Styling:** Tailwind CSS **v4** (`@tailwindcss/postcss` and `tailwindcss` version `4`) + custom variables configured in `src/app/globals.css`.
- **UI & Components:** HeroUI (formerly NextUI) (`@heroui/react` & `@heroui/styles`) for primitive widgets (popover, datepicker, progressbar).
- **Animations:** GSAP (`gsap`, `@gsap/react`) and Framer Motion (`framer-motion`).
- **State Management:** Zustand (global states) and standard React state (local).
- **Data Fetching:** TanStack React Query (`@tanstack/react-query`) with custom hooks co-located in `src/apiQuery/` and Axios client wrapper.
- **Form Handling:** React Hook Form (`react-hook-form`) with Zod schema validation (`@hookform/resolvers`, `zod`).

---

## Core Dev Commands
Since this repository uses **Yarn**, execute the following commands for development and validation:
- `yarn dev` - Start the Next.js development server
- `yarn build` - Build the application for production
- `yarn lint` - Run ESLint checks (using the project's Flat Config `eslint.config.mjs`)
- `yarn tsc --noEmit` - Run TypeScript compiler checks

---

## Project Structure
```
src/
├── apiQuery/             # TanStack React Query functions, hooks, and types grouped by feature
│   ├── auth/             # Login, signup, verification, reset password queries
│   ├── users/            # Profile retrieval, update, photo upload
│   ├── doctor/           # Doctor details, invites, registration queries
│   ├── categories/       # Category management queries
│   └── ...               # (healthcareAppointments, hospital, payment, etc.)
├── app/                  # Next.js App Router root
│   ├── (app)/            # Authenticated pages (auth layouts, dashboard pages/routes)
│   ├── (landing)/        # Public-facing routes (homepage, blog, how it works, our doctors)
│   ├── globals.css       # Tailwind CSS v4 variables & custom global stylesheet
│   └── layout.tsx        # Root HTML shell wrapper
├── assets/               # Local fonts (SF Pro, Menlo) and static image assets
├── components/           # UI and component layer
│   ├── Base/             # Global base widgets (Nav, QueryProvider, SplashScreen, ThemeToggle, Table, Pagination)
│   ├── Ui/               # Reusable atomic wrappers (Button, Card, Checkbox, Dropdown, Modal, Inputs)
│   ├── Auth/             # Form components for auth states (VerifyEmail, CareSeekerSignup, select signup types)
│   └── Dashboard/        # Dashboard layout & sub-views grouped by role (Admin, Agent, CareSeeker, Hospital, etc.)
├── data/                 # Static mock data / content files (blog post markdown, FAQs)
├── enums/                # Global enums & storage keys (e.g., local/session storage identifiers)
├── hooks/                # Custom utility React hooks (useSession, useTheme, useIsMobile)
├── icons/                # Inline custom SVG icons mapped to React components
├── lib/                  # Library setups (fonts configuration, AppToaster, utils helper)
├── providers/            # Shared Context/Authentication providers
├── proxy.ts              # Custom routing verification and navigation guard logic
├── serverActions/        # Next.js Server Actions (loginAction, getSession, updateSession, removeSession)
├── services/             # Low-level service utilities (Axios instance config, cookie management)
├── types/                # Dedicated typescript interface/type definitions (table, doctors, blog)
└── utils/                # Pure utility functions (formatting, route maps, timeslots generator)
```

---

## Crucial Architecture Details & Patterns

### 1. Styling & Theme System (Tailwind CSS v4)
- **Tailwind CSS v4 CSS-First Approach:** All theme tokens and colors (such as `--color-primary`, `--color-blue-1`, `--color-success`) are declared under `@theme inline` within `src/app/globals.css`. Do **not** use a JS-based `tailwind.config.js`.
- **Theme Mode State:** Managed by `useThemeStore` (`src/stores/themeStore.ts`). It persists user preference (`light` | `dark` | `system`) as `'theme-preference'` in local storage.
- **Theme Toggle Component:** Available at `src/components/Base/ThemeToogle.tsx` (Note the filename typo: `ThemeToogle.tsx`, whereas the exported component name is `ThemeToggle`).
- **Dark Mode Styling:** Apply dark-mode variants using `dark:` prefix or by styling elements that inherit variables modified under the `.dark` selector in `globals.css`.

### 2. Authentication, Session & HTTP Client
- **Auth Token Storage:** Session details (access token, user info) are stored in the client-side cookie `auth-user` (defined in `src/enums/index.ts` under `general.COOKIE_NAME`).
- **Next.js Server Actions:** Session state edits and retrieval on the server side are handled via Server Actions under `src/serverActions/getSession.ts` (`getSession`, `updateSession`, `removeSession`) and `src/serverActions/login.ts` (`loginAction`).
- **HTTP client Axios Interceptor:** Authenticated requests must use `axiosClient` imported from `@/services/axiosClient`. It intercepts requests, grabs the token via `getAuthToken()`, appends the `Authorization: Bearer <token>` header, and intercepts 401 response errors to automatically trigger logouts. Unauthenticated requests should use raw `axios`.
- **Session hook:** The client-side hook `useSession.ts` fetches `/api/auth/session` which is currently a placeholder; be aware that no physical route handler directory `src/app/api/auth/session/` exists in the repository.
- **Route Guard Middleware:** `src/proxy.ts` contains the logic that protects authenticated routes and restricts nav access by user role (`blockedNavItems`). However, **no root `middleware.ts` file is currently registered**. To enable automatic route guards, a root `src/middleware.ts` must export this proxy function.

### 3. State Management & Navigation Maps
- **Zustand Stores:** Located in `src/stores/` (e.g., `authStore.ts`, `themeStore.ts`, `bookAppointmentStore.ts`). Never mutate Zustand state directly.
- **Navigation & Role Permissions:** Inside `src/utils/route.tsx`, routes are mapped to roles via `getAccountNavItems`. `SideNav.tsx` filters nav items dynamically based on the active role parsed via the `useGetAccountType` hook.
- **Dashboard Toggle:** `src/app/(app)/dashboard/page.tsx` renders different dashboards according to the user's role. **Note:** It is currently hardcoded to render the Care Seeker dashboard (`dashboards['SEEKER']`) for testing. Make sure to revert this or switch dynamic rendering if working on active role routing.

### 4. Custom UI Kit & Core Primitives
Do not write custom CSS elements, raw inputs, or default HTML buttons if a wrapper exists. Use and extend the standard components located in `src/components/Ui/`:
- **`Button`**: Supports `primary` | `secondary` | `outline` variants, loading states, and optional `href` attribute (which uses `<a>` fallback. Internal app transitions should still wrap with Next.js `<Link>`).
- **`TextInput`, `TextArea`, `OtpInput`**: Pre-styled wrapper controls with error states and outline focuses.
- **`DatePicker`, `Dropdown`**: Wrap `@heroui/react` primitives styled to conform to the design system.
- **`BaseTable`**: Located in `src/components/Base/Table/index.tsx`. Handles client-side sorting, text truncation tooltips, filters, search, custom row rendering, and falls back to `MobileTable` on small viewport screens.

---

## Coding Conventions

### General React & TypeScript
- Use **TypeScript** for every file — no `any` unless absolutely unavoidable and explicitly commented.
- Prefer **named exports** over default exports for components.
- Use **arrow functions** for components: `const MyComponent = () => {}`.
- Keep files under **200 lines** — split into smaller modules if needed.
- Co-locate tests next to their source file: `component.test.tsx`.
- Use Next.js `<Link>` for internal links to preserve SPA page state transitions.
- Use Next.js `<Image>` instead of the raw `<img>` tag to optimize image payloads.

### Next.js Specifics
- **Default to Server Components** — only add `"use client"` when the component needs interactivity or browser APIs.
- Use **Route Handlers** (`app/api/*/route.ts`) for API endpoints — not the old `pages/api` pattern.
- **Never fetch data in Client Components** if a Server Component can do it.
- Use `loading.tsx` and `error.tsx` files for suspense and error boundaries at the route level.
- Metadata should be exported from `layout.tsx` or `page.tsx` using the `Metadata` type.

### Styling & Class Merging
- Use Tailwind utility classes — avoid inline styles.
- Extract repeated class combinations into a component, not a custom CSS class.
- Conditionally apply class names using the `cn()` helper (located in `src/lib/utils.ts` which combines `clsx` and `tailwind-merge`).
- Dark mode via Tailwind's `dark:` variant or by styling elements that inherit variables modified under the `.dark` selector in `globals.css`.

### Form Validation
- Validate form payloads and API structures with **Zod** schemas, integrating them with `react-hook-form` using `@hookform/resolvers/zod`.

### API & Data Fetching
- Server Components fetch directly (async/await) — no `useEffect` for initial data.
- Client-side mutations use **Server Actions** (`"use server"`) or API route handlers.
- Define queries, mutations, and matching hooks inside `src/apiQuery/` under their respective folders.
- Wrap query hooks in descriptive hooks, e.g. `useGetProfile` or `useLogin`.
- Always handle loading, success, and error states explicitly.
- Validate all external API responses — do not trust shapes blindly.

### TypeScript
- Define prop types inline with the component or in a co-located `types.ts`.
- Use `interface` for object shapes, `type` for unions/intersections.
- Avoid enums — use `const` objects with `as const` instead.
- Always type Server Action return values and API response shapes.

---

## File Naming Conventions
| File Type | Pattern | Example |
|---|---|---|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuthSession.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Zustand Stores | camelCase with `Store` suffix | `authStore.ts` |
| Types / Interfaces | PascalCase | `UserTypes.ts` |
| Route Pages | `page.tsx` inside folder | `app/dashboard/page.tsx` |
| API Route Handlers | `route.ts` inside folder | `app/api/users/route.ts` |

---

## Do's and Don'ts

### ✅ Do
- Run `yarn lint` and build check before concluding a task.
- Retrieve configuration keys and API hosts from environment variables (e.g., `process.env.NEXT_PUBLIC_API_URL`). All env vars must be declared in `.env.example` with placeholder values.
- Always handle async operations with `try/catch` and log errors via `console.error` (with proper tags).
- Utilize the custom components in `src/components/Ui/` to maintain design consistency.
- Write accessible HTML — use semantic elements and ARIA attributes where needed.

### ❌ Don't
- Do **not** use `pages/` directory; the application is built entirely on Next.js App Router.
- Do **not** add `"use client"` directive to layout wrappers or pages unless interactivity or browser APIs are explicitly needed.
- Do **not** mutate Zustand store states directly; use the setter actions.
- Do **not** bypass `axiosClient` for authenticated actions, as it handles the auth token injection.
- Do **not** install secondary utility libraries (such as date formatters) without verifying if the feature is already supported by direct dependencies (like `dayjs`).
- Do **not** use `console.log` in production code — use a logger utility or `console.error`/`console.warn` as appropriate.

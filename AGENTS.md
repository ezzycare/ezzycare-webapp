<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview
This is a Next.js application using the App Router. All new features should follow Next.js 16 conventions unless the project is pinned to an older version.

---

## Stack & Tooling
- **Framework:** Next.js (App Router)
- **Language:** TypeScript — strict mode enabled
- **Styling:** Tailwind CSS
- **Styling:** Tailwind CSS (project also uses styled-components)
- **State:** Zustand (global) / React state (local)
- **Data fetching:** Server Components by default; SWR or React Query for client-side
- **Auth:** Custom API routes (see src/app/api/auth)
- **ORM:** Frontend only app. Not needed
- **Package manager:** yarn (this repo contains a `yarn.lock`)

---

## Project Structure
```
src/
├── app/                  # App Router — pages, layouts, API routes
│   ├── (app)/            # Route groups (no URL segment)
│   ├── api/              # Route handlers
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable primitives (Button, Input, Modal…)
│   └── features/         # Feature-specific components
├── lib/                  # Shared utilities, helpers, configs
├── hooks/                # Custom React hooks (use-*.ts)
├── stores/               # Zustand stores (plural `stores/` in this repo)
├── types/                # Shared TypeScript types/interfaces
└── styles/               # Global styles
```

---

## Coding Conventions

### General
- Use **TypeScript** for every file — no `any` unless absolutely unavoidable and explicitly commented
- Prefer **named exports** over default exports for components
- Use **arrow functions** for components: `const MyComponent = () => {}`
- Keep files under **200 lines** — split into smaller modules if needed
- Co-locate tests next to their source file: `component.test.tsx`

### Next.js Specifics
- **Default to Server Components** — only add `"use client"` when the component needs interactivity or browser APIs
- Use `next/image` for all images — never raw `<img>` tags
- Use `next/link` for all internal navigation — never `<a href>`
- Use **Route Handlers** (`app/api/*/route.ts`) for API endpoints — not the old `pages/api` pattern
- **Never fetch data in Client Components** if a Server Component can do it
- Use `loading.tsx` and `error.tsx` files for suspense and error boundaries at the route level
- Metadata should be exported from `layout.tsx` or `page.tsx` using the `Metadata` type

### Data Fetching
- Server Components fetch directly (async/await) — no `useEffect` for initial data
- Client-side mutations use **Server Actions** (`"use server"`) or API route handlers
- Always handle loading and error states explicitly
- Validate all external API responses — do not trust shapes blindly

### Styling
- Use **Tailwind utility classes** — avoid inline styles
- Extract repeated class combinations into a component, not a custom CSS class
- Use `cn()` (from `clsx` + `tailwind-merge`) for conditional classes
- Dark mode via Tailwind's `dark:` variant — not manual theme toggling

### TypeScript
- Define prop types inline with the component or in a co-located `types.ts`
- Use `interface` for object shapes, `type` for unions/intersections
- Avoid enums — use `const` objects with `as const` instead
- Always type Server Action return values and API response shapes

---

## File Naming
| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuthSession.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Store | camelCase with `Store` suffix | `authStore.ts` |
| Types | PascalCase | `UserTypes.ts` |
| API routes | `route.ts` inside folder | `app/api/users/route.ts` |
| Pages | `page.tsx` inside folder | `app/dashboard/page.tsx` |

---

## Do's and Don'ts

### ✅ Do
- Run `pnpm lint` and `pnpm type-check` before finishing a task
- Use environment variables for all secrets — never hardcode keys
- Add `try/catch` to all async functions that can fail
- Use `zod` to validate form inputs and API request bodies
- Keep Server Actions in a separate `actions/` folder or co-located `actions.ts`
- Write accessible HTML — use semantic elements and ARIA attributes where needed

### ❌ Don't
- Don't use `pages/` directory — this project uses App Router exclusively
- Don't add `"use client"` to layouts or pages unless strictly necessary
- Don't mutate state directly — always return new objects/arrays
- Don't commit `.env.local` or any file with real secrets
- Don't use `console.log` in production code — use a logger utility
- Don't install a new package without checking if the functionality already exists in the project

---

## Environment Variables
- All env vars must be declared in `.env.example` with placeholder values
- Client-side vars must be prefixed with `NEXT_PUBLIC_`
- Validate env vars at startup using a `lib/env.ts` file (e.g. with `zod`)

---

## Performance Guidelines
- Use `next/dynamic` with `{ ssr: false }` for heavy client-only components (charts, editors)
- Add `loading="lazy"` to below-the-fold images via `next/image`
- Avoid large bundles in Client Components — keep them lean
- Use React `Suspense` boundaries to avoid full-page loading blocks
- Cache data fetches with `fetch` options: `{ next: { revalidate: 60 } }` or `{ cache: 'no-store' }` as appropriate

---

## Testing
- Unit tests: **Vitest** + **React Testing Library**
- E2E tests: **Playwright** (in `/e2e` folder)
- Test files: `*.test.tsx` or `*.spec.ts` co-located with source
- Always test: form validation, error states, loading states, and auth-gated routes

---

## Git Conventions
- Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`
- Commit messages: conventional commits (`feat: add user profile page`)
- Never commit directly to `main` — use PRs
- Each PR should do one thing — avoid bundling unrelated changes

---

## When Cline Creates New Files
1. Check if a similar component or utility already exists — reuse before creating
2. Follow the file naming and folder structure above
3. Always add TypeScript types — no implicit `any`
4. Add a brief JSDoc comment above exported functions describing their purpose
5. For new pages, create `loading.tsx` and `error.tsx` siblings if data is fetched

---

## When Cline Edits Existing Files
1. Preserve existing code style and formatting
2. Don't refactor unrelated code in the same edit
3. Don't change or remove existing exports without checking all imports first
4. Run type-check after changes to catch any regressions

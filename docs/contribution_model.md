# Contribution Model — How Developers Add Features Safely

## The Core Question

> How does a contributor add a new page/feature without breaking existing ones?

---

## Backstage vs Our Architecture

### What Backstage Does

[Backstage](https://backstage.io) (by Spotify) uses a **formal plugin architecture**:

```
backstage/
├── packages/
│   ├── app/              # Shell (sidebar, routing, theme)
│   └── backend/          # Backend-for-frontend
├── plugins/
│   ├── catalog/          # Independent npm package
│   ├── techdocs/         # Independent npm package
│   └── my-custom-plugin/ # Your plugin — independent npm package
```

| Backstage Feature | How It Works |
|-------------------|-------------|
| **Plugin = npm package** | Each plugin is a separate package with its own `package.json`, built and tested independently |
| **Plugin API contract** | Plugins implement a `createPlugin()` API and export routes/components via a strict interface |
| **Core is untouched** | Contributors never modify the shell — they register plugins via config |
| **Plugin discovery** | The app imports plugins in `App.tsx` and maps them to routes |
| **Independent dev** | `yarn workspace` lets you `cd plugins/my-plugin && yarn start` in isolation |

### Our Feature-Based Architecture — Where It Stands

Our current approach is **similar in spirit** but **less formal**:

| Aspect | Backstage | Our Feature-Based |
|--------|-----------|-------------------|
| Isolation | ⭐⭐⭐⭐⭐ (separate npm packages) | ⭐⭐⭐ (folders, but same codebase) |
| Plugin API contract | Formal `createPlugin()` | None — just conventions |
| Independent build/test | Yes (monorepo workspaces) | No — single build |
| Risk of breaking others | Very low | Medium (shared imports, routing) |
| Setup complexity | High (monorepo tooling) | Low |
| Right for 5–10 devs? | Over-engineered | ✅ With the right conventions |

---

## Three Approaches (Pick One)

### Approach A: Feature-Based with Conventions ⭐ Recommended

Keep the current architecture but add a **feature registration pattern** so contributors never touch core files.

#### How a contributor adds a new feature:

**Step 1**: Create a feature folder with a standard structure:

```
src/features/my-new-feature/
├── index.ts              # Public API — exports everything
├── feature.ts            # Feature registration (route, sidebar item)
├── components/
│   └── MyFeaturePage.tsx
├── hooks/
│   └── useMyFeature.ts
└── api/
    └── myFeatureApi.ts
```

**Step 2**: Define the feature registration:

```typescript
// src/features/my-new-feature/feature.ts
import { lazy } from 'react';
import { BarChart3 } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

const MyFeaturePage = lazy(() => import('./components/MyFeaturePage'));

export const myNewFeature: FeatureDefinition = {
  id: 'my-new-feature',
  label: 'My Feature',
  icon: BarChart3,
  path: '/my-feature',
  component: MyFeaturePage,
  requiredRoles: ['admin', 'contributor'],  // RBAC
};
```

**Step 3**: Register it in ONE file (the only core file they touch):

```typescript
// src/features/index.ts  — Feature Registry
import { dashboard } from './dashboard/feature';
import { users } from './users/feature';
import { analytics } from './analytics/feature';
import { settings } from './settings/feature';
import { myNewFeature } from './my-new-feature/feature';  // ← Add this line

export const features = [
  dashboard,
  users,
  analytics,
  settings,
  myNewFeature,  // ← Add this line
];
```

**That's it.** The sidebar, routes, and lazy loading are all driven by the `features` array automatically:

```typescript
// src/app/routes.tsx — Auto-generates routes from registry
import { features } from '@/features';

export const appRoutes = features.map((feature) => ({
  path: feature.path,
  element: <feature.component />,
}));
```

```typescript
// src/shared/components/layout/Sidebar.tsx — Auto-generates nav items
import { features } from '@/features';

export const Sidebar = () => (
  <nav>
    {features.map((f) => (
      <SidebarItem key={f.id} icon={f.icon} label={f.label} path={f.path} />
    ))}
  </nav>
);
```

#### Contributor workflow:

```
1. git checkout -b feature/my-new-feature
2. Create src/features/my-new-feature/ folder
3. Build components, hooks, API calls inside your folder
4. Register feature in src/features/index.ts (1 line)
5. npm run dev → see your feature in the sidebar
6. git push → open PR → code review → merge
```

#### Isolation guarantees:

| Rule | Enforcement |
|------|-------------|
| Never import from another feature | ESLint rule (`no-restricted-imports`) |
| Only import from `@/shared/*` | ESLint rule |
| Each feature has a single public API (`index.ts`) | Convention + PR review |
| Features are lazy-loaded | `React.lazy()` in feature.ts — no bundle impact |
| Features can be disabled | Remove from registry array (or add `enabled: false` flag) |

```typescript
// .eslintrc — Prevent cross-feature imports
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["@/features/*/components/*", "@/features/*/hooks/*", "@/features/*/api/*"],
          "message": "Import from the feature's index.ts, not internal files."
        }
      ]
    }]
  }
}
```

---

### Approach B: Lightweight Plugin System

A middle ground — features are in separate directories but use a formal `createFeature()` factory:

```typescript
// shared/lib/createFeature.ts
export function createFeature(config: FeatureConfig): FeatureDefinition {
  return {
    ...config,
    component: lazy(config.loader),
    // Wraps with error boundary, auth guard, etc. automatically
  };
}
```

```typescript
// features/my-new-feature/feature.ts
import { createFeature } from '@/shared/lib/createFeature';

export default createFeature({
  id: 'my-feature',
  label: 'My Feature',
  icon: BarChart3,
  path: '/my-feature',
  loader: () => import('./components/MyFeaturePage'),
  requiredRoles: ['admin'],
});
```

This gives you:
- Automatic error boundary wrapping per feature
- Automatic auth/role guard per feature
- Consistent loading states
- A contract that contributors follow

---

### Approach C: Full Backstage-Style (Monorepo + Plugin Packages)

Only if you plan to scale beyond 10+ contributors or need fully independent build/deploy:

```
admin-portal/
├── packages/
│   ├── core/           # Shell, auth, layout — owned by platform team
│   ├── shared/         # Shared UI components, types
│   └── plugin-sdk/     # createPlugin API, types, test utilities
├── plugins/
│   ├── dashboard/      # Own package.json, own tests
│   ├── users/          # Own package.json, own tests
│   └── analytics/      # Own package.json, own tests
├── package.json        # Workspace root
└── turbo.json          # Turborepo config
```

Uses **Turborepo** or **Nx** for monorepo orchestration. Each plugin builds/tests independently.

> [!WARNING]
> This is significant overhead for 5–10 contributors. Only consider this if you expect the team to grow to 15+ or need independently deployable features (micro-frontends).

---

## Recommendation

| Scale | Approach | Why |
|-------|----------|-----|
| **5–10 devs (you)** | **A: Feature-Based + Registry** | Low setup, clear conventions, contributors never touch core |
| 10–20 devs | B: Lightweight Plugin System | Formal contract, auto-wrapping, still single repo |
| 20+ devs | C: Full Monorepo Plugin System | Independent builds, Backstage-level isolation |

### What I recommend building:

**Approach A** with the **feature registry pattern**. Contributors:
1. Create a folder in `src/features/`
2. Export a `FeatureDefinition` 
3. Add one line to the registry
4. Never touch core files (sidebar, routing, auth — all auto-generated from registry)

This gives you **90% of Backstage's contribution model** at **10% of the complexity**.

---

## Shall I update the architecture to use this registry pattern?

If you approve Approach A, I'll update the architecture doc and scaffold the project with:
- `FeatureDefinition` type
- Feature registry (`src/features/index.ts`)
- Auto-generated sidebar from registry
- Auto-generated routes from registry
- ESLint rules preventing cross-feature imports
- A `CONTRIBUTING.md` documenting the contributor workflow

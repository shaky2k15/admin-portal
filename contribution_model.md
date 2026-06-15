# Contribution Model — Architecture Design Record

## The Core Question

> How does a contributor add a new page/feature without breaking existing ones?

---

## Finalized Approach: Feature Registry Pattern

After evaluating several options (including a formal Backstage-style plugin architecture), we have chosen and implemented the **Feature Registry Pattern**. 

This approach provides **90% of Backstage's isolation at 10% of the complexity**, making it the perfect fit for a team of 5–10 contributors.

### How it works (vs. Backstage)

| Aspect | Backstage Plugins | Our Feature Registry |
|--------|-----------|-------------------|
| **Isolation** | Separate npm packages | Separate folders (`src/features/*`), enforced by ESLint |
| **Registration** | Configured in `App.tsx` | Registered in `src/features/index.ts` |
| **API Contract** | `createPlugin()` factory | `FeatureDefinition` interface |
| **Impact on Core** | None | None — Sidebar and Routes auto-generate |
| **Setup Overhead** | High (Monorepo/Turborepo) | Very Low (Standard Vite SPA) |

---

## Contributor Workflow

We have designed the architecture so that contributors **never need to touch core files** (like `App.tsx`, router configs, or layout sidebars).

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

**Step 3**: Register it in ONE file (`src/features/index.ts`):

```typescript
import { dashboard } from './dashboard/feature';
import { myNewFeature } from './my-new-feature/feature';  // ← Add this line

export const features = [
  dashboard,
  myNewFeature,  // ← Add this line
];
```

**That's it.** The sidebar, routes, and lazy loading are all driven by the `features` array automatically.

---

## Isolation Guarantees

To ensure features remain decoupled, the following rules are enforced:

| Rule | Enforcement |
|------|-------------|
| Never import from another feature | ESLint rule (`no-restricted-imports`) |
| Only import from `@/shared/*` | ESLint rule |
| Each feature has a single public API (`index.ts`) | Convention + PR review |
| Features are lazy-loaded | `React.lazy()` in `feature.ts` — zero impact on initial bundle size |

```json
// ESLint configuration to prevent cross-feature imports
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

## Summary

This architecture gives developers a completely safe sandbox (`src/features/their-feature`) to build in, while ensuring the platform remains stable, portable, and easy to maintain.

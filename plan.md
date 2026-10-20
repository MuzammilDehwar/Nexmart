# NexMart Enterprise Marketplace — Implementation Plan

## Scope

Continue the supplied React + TypeScript + Vite NexMart marketplace in a managed Webdev project. Preserve the existing yellow/black marketplace identity, customer storefront, product catalogue, cart, checkout, orders, wishlist, vendor dashboard, admin moderation views, architecture/blueprint views, schema planner, and demo persona controls. Keep the supplied local catalogue fallback so the storefront remains useful when Firebase is unavailable.

The primary engineering goal is to resolve the reported Firestore permission errors securely without weakening rules. Public product synchronization will use an approved-only query. Authenticated customer order synchronization will use a customer UID query; vendor synchronization will use vendor ownership indexes; admin synchronization will use privileged access only after trusted claims are resolved. Protected order listeners will not start for signed-out visitors. Firestore writes will remain optimistic/local only for demo personas and will use the authenticated Firebase identity for real sessions.

## Architecture and project structure

- `src/App.tsx`: top-level provider composition, navigation, storefront, vendor, admin, blueprint and schema views.
- `src/components/`: preserved marketplace UI and role-gated dashboards.
- `src/components/nextjs14/`: customer storefront, product cards, filters, cart drawer, checkout, orders and wishlist.
- `src/context/AuthContext.tsx`: Firebase auth lifecycle, trusted-claim role resolution, customer-default registration, vendor application flow, and clearly separated demo persona switching.
- `src/context/CartContext.tsx`: local demo persistence, cart/order state, Firestore product/order synchronization, ownership-aware queries, and guarded writes.
- `src/lib/firebase.ts`: browser-safe Firebase initialization from Vite environment variables.
- `firestore.rules`: default-deny RBAC rules aligned with the actual query and document schema.
- `scripts/test-rules-logic.ts`: static rule checks.
- `tests/firestore.rules.test.ts`: emulator tests for ownership, moderation, role escalation and default deny.
- `public/manus-routes.json`: route manifest for the managed preview/runtime.

## Design

The archive already establishes the design direction, so no new visual direction is introduced.

- **Design movement:** restrained enterprise commerce / modern marketplace operations UI.
- **Core principles:** high information density without clutter; yellow/black NexMart signal color; slate surfaces and borders for trust; role context always visible.
- **Color philosophy:** warm amber marks action, marketplace energy and verified attention; near-black anchors the brand; slate neutrals keep dense dashboards calm and readable.
- **Layout paradigm:** persistent operations header with horizontal role navigation, wide storefront workbench, and compact card clusters rather than a marketing-only landing page.
- **Signature elements:** amber `N` wordmark tile, thin status pills, and compact mono metadata for SKUs, roles and operational states.
- **Interaction philosophy:** demo controls are immediate and reversible; real Firebase sessions are conservative and claim-driven; protected areas explain why access is restricted instead of silently failing.
- **Animation:** retain light hover and transition states only; avoid decorative motion in admin/vendor workflows.
- **Typography:** Plus Jakarta Sans for application text, Outfit for display/brand labels, JetBrains Mono for technical metadata.
- **Brand essence:** a governed multi-vendor marketplace for high-consideration goods; precise, credible, operational.
- **Brand voice:** direct and audit-friendly. Example lines: “Verified inventory, clear ownership.” and “Every approval has an audit trail.”
- **Wordmark & logo:** amber rounded-square `N` tile paired with the NexMart wordmark.
- **Signature brand color:** NexMart amber `#f59e0b` / `#fbbf24`.

## Implementation decisions

1. Copy the supplied source and assets into the managed project without copying its standalone Git metadata.
2. Normalize the package toolchain so Vite and esbuild install cleanly in the current environment.
3. Add the managed runtime route manifest and project logo metadata.
4. Update Firebase listeners to use `where('approvalStatus', '==', 'approved')`, `where('customerId', '==', uid)`, or vendor ownership array queries as appropriate; merge approved catalogue data with a vendor’s own records where needed.
5. Remove product seeding from the client. Empty/error Firestore states retain local demo data and expose distinct sync status instead of masking permission failures as cache success.
6. Resolve real Firebase roles only from token claims (admin/vendor), default every new account to customer, and keep localStorage vendor approvals/demo role switching out of real authorization.
7. Add `customerId`, `vendorUids`, and `vendorSlugs` to real order documents and keep payment/refund privilege fields server-controlled by rules.
8. Preserve local demo ordering and dashboards when Firebase is absent or the active identity is a demo persona; never write those demo mutations to Firestore.
9. Validate with typecheck, production build, static rules checks, and emulator tests when Java/Firebase Emulator prerequisites are available. Document any unavailable checks honestly.
10. Add an Amazon-style guest account entry point with separate Sign in and Create account actions, a concise Firebase-backed auth modal, a browser-safe Firebase Web SDK fallback for the supplied `nexmart-a6309` project, and an initial unauthenticated guest state when Firebase is configured.
11. Add a deployment gate for Firestore listeners so Auth remains usable without permission-denied noise; enable product/order sync only after the reviewed rules are deployed and `VITE_FIREBASE_ENABLE_FIRESTORE_SYNC=true` is set.

## Build workflow

- `npm install`
- `npm run lint`
- `npm run build`
- `npm run test:rules`
- `npm run test:emulator` when Java and Firebase Emulator dependencies are available
- `npm run dev` for the managed preview on port 3000

Firebase rules will be delivered as files and documented for manual publication; they will not be published automatically.

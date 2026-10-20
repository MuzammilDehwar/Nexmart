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

## Approved Phase 1 extension — demo-safe growth and commerce layer

The next phase is intentionally demo-safe: no live money movement, gateway API calls, or client-exposed AI secrets. The UI will simulate JazzCash, EasyPaisa, bank-transfer transaction verification, COD confirmation, SMS/WhatsApp events, AI recommendations, image matching, vendor chat, loyalty points, scratch cards, and referrals while preserving explicit test-mode labels. Real integrations will later attach to server-side functions and secrets without changing the customer-facing contracts.

### New modules

- `src/context/EngagementContext.tsx`: browser-local, demo-only rewards wallet, daily bonus, scratch-card claims, referral attribution, assistant history, visual-search history, and chat threads. It will expose clear demo-mode metadata and never be treated as authorization.
- `src/components/phase1/Phase1CommerceTools.tsx`: recommendation assistant using product/search context, visual-search upload simulation, buyer/vendor chat widget, and rewards/referral panels. It keeps provider integration behind future adapter boundaries.

### Integration decisions

- Extend the existing order contract with `jazzcash`, `easypaisa`, and `bank_transfer` payment methods plus a non-sensitive demo payment reference; keep Firestore writes behind the existing sync gate and default-deny rules.
- Keep current storefront and portals intact; add Phase 1 tools as responsive overlays/panels rather than duplicating the catalogue.
- Add no client-side role escalation. Rewards, referrals, chat and assistant state are local demo state until trusted server-side ownership rules are added.
- Keep the current SPA route manifest because Phase 1 tools are integrated into the storefront and checkout rather than new routes.

### Validation workflow

Run TypeScript diagnostics, production build, static Firestore rule checks, and emulator tests when available. Use one read-only implementation review before checkpointing. Re-publish only after the approved checkpoint is validated.


## Approved Phase 2 extension — real-time commerce foundation

The next implementation slice upgrades the reversible Phase 1 seams to real-time Firebase behavior wherever secure browser access is appropriate. Authenticated chat threads and messages will use Firestore listeners, customer/admin order listeners will remain live and ownership-scoped, and notification events will be stored as per-user records. Demo/local fallback remains available for guests and when the deployment gate is disabled. No payment provider will be represented as live until a server-side adapter, webhook verification, and provider credentials are configured; checkout will continue to label local payment methods as simulation until then.

### Real-time data model

- `chat_threads/{threadId}` stores only participants, product/vendor context, last-message metadata and timestamps.
- `chat_threads/{threadId}/messages/{messageId}` stores message body, sender UID/role, and event timestamps; only thread participants may read or create messages.
- `notifications/{notificationId}` stores user-scoped order/chat/system events; only the target user may read, and only trusted server/admin paths may create or mutate them.
- Existing `orders` and `orders/{orderId}/packages/{packageId}` listeners remain the source of truth for live customer tracking and vendor fulfillment status; client payment fields remain server-controlled.

### Integration boundary

The browser may subscribe to and write only user-owned chat messages allowed by rules. A future server adapter will handle payment initiation, JazzCash/EasyPaisa callbacks, bank-transfer verification, COD status, SMS/WhatsApp delivery, reward settlement, referral attribution and AI provider calls. These adapters require secrets and webhook verification; they will not be simulated as completed real-world actions.

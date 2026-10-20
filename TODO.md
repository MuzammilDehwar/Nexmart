# NexMart Delivery TODO

## 1. Preserve the supplied marketplace experience

- Keep NexMart yellow/black branding and the responsive product-card experience with images, prices, discounts, ratings, stock, variants and Add to Cart.
- Keep search, department/category navigation, filtering and sorting.
- Keep wishlist, cart, checkout and orders.
- Keep the customer storefront, seller/vendor dashboard and product management, admin dashboard for moderation/governance, blueprint/architecture documentation, database schema/capacity planner, and demo personas with role-based preview controls.
- Keep the headphones, wristwatch and desk lamp catalogue fallback when Firebase is unavailable.

## 2. Make the project runnable in the managed Webdev workspace

- Preserve the React + TypeScript + Vite stack from the archive.
- Add the managed route manifest, project metadata, runnable package scripts, and safe environment template.
- Keep startup command `npm run dev` and production command `npm run build`.

## 3. Fix Firestore product synchronization without weakening security

- Visitors may read only products intended to be publicly visible and approved.
- Pending, rejected or suspended products must not be exposed publicly.
- Only verified, authorized vendors may manage their own products.
- Only trusted admins may approve or reject products.
- Align product listeners with the published rules because Firestore rules are not filters.
- Do not seed or write demo products into Firestore from an unauthenticated client.
- Preserve the local catalogue fallback while distinguishing loading, empty, permission-denied, and offline/network failures.

## 4. Fix Firestore order synchronization and ownership

- Do not start a protected orders listener for an unauthenticated visitor.
- A customer may read only their own orders.
- Vendors may read only supported order data belonging to their vendor account.
- Trusted admins may access administrative order data.
- Users must not change another user’s ownership, totals, payment status, refund status, or privileged fields.
- Clients must not mark payments as paid or approve refunds.
- Clean up listeners on unmount and sign-out and prevent stale data from one Firebase user appearing in another session.

## 5. Enforce trusted authentication and role behavior

- Verify email/password signup, login, logout, persistent auth sessions and friendly errors.
- Every new public registration defaults to Customer.
- Vendor onboarding creates a pending application and does not grant vendor privileges immediately.
- Admin and verified-vendor access uses trusted Firebase Custom Claims or secured server-side authorization.
- Do not trust a role submitted by signup or a client-editable profile.
- Clearly label demo persona switching as demo-only; it must never grant real Firebase privileges.
- If an admin provisioning backend is missing, document that limitation rather than inventing a client-side mechanism.

## 6. Add Amazon-style Firebase account access

- Show separate `Sign in` and `Create account` actions for guests in the global account area.
- Use Firebase Email/Password Authentication for real sign-in, sign-up, logout, and friendly error states.
- Keep ordinary sign-in focused on email and password; preserve vendor onboarding and trusted-role messaging during account creation.
- Start published Firebase builds as an unauthenticated guest rather than presenting a demo customer session.
- Keep the supplied browser-safe Firebase Web App configuration in the environment template/default client config without adding private service credentials.

## 7. Keep storage and payments honest

- Verify whether the current UI uses Firebase Storage; if not, document that no Storage rules are needed.
- Keep checkout identified as demo/test because no secure server-side payment provider and verification are present.

## 8. Validate and package

- Run dependency installation, TypeScript typecheck, production build, static rules checks, and the Firebase Emulator suite when its prerequisites are available.
- If emulator tests cannot run, record the exact reason and the command.
- Deliver the final `firestore.rules`, `.env.example`, setup guide, changed-file report, remaining manual setup list, and a complete runnable project archive.
- Do not publish Firebase rules automatically.

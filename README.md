# NexMart Enterprise Marketplace

NexMart is a React + TypeScript + Vite multi-vendor marketplace prototype with a customer storefront, cart, demo checkout, orders, vendor operations, admin moderation, blueprint documentation, and schema planning views. The supplied catalogue remains available locally when Firebase is not configured or is unreachable.

Firestore listeners are intentionally disabled by default with `VITE_FIREBASE_ENABLE_FIRESTORE_SYNC="false"` until the reviewed `firestore.rules` file is deployed to `nexmart-a6309`; Firebase Email/Password Auth remains active. After deployment, set the flag to `true`, rebuild, and redeploy.

## Run locally

```bash
npm install
cp .env.example .env.local
# Add only the Firebase browser configuration values to .env.local
npm run dev
```

The development server listens on port 3000. Production checks are:

```bash
npm run lint
npm run build
npm run test:rules
```

The emulator suite is available with `npm run test:emulator`; it downloads the Firebase CLI/emulator on demand and requires Java. The suite currently covers 16 Firestore permission cases. The rules are not published automatically.

## Firebase configuration

Use the existing Firebase project `nexmart-a6309`, enable Email/Password Authentication, and add `localhost` plus the published domain to Firebase Authentication → Settings → Authorized domains. The browser-safe values belong in `.env.local` or the hosting environment using the names in `.env.example`. The supplied Firebase Web App configuration is included as a browser-safe default and can still be overridden with `.env.local`. Never add a service-account JSON or private key to the frontend.

Real admin and vendor privileges are resolved from trusted Firebase Custom Claims or admin-managed Firestore records. `VITE_ADMIN_EMAILS` is not used as an authorization mechanism. A secure admin provisioning backend or Firebase Admin SDK deployment is still required to assign those claims; the client cannot safely create them.

## Firestore rules

The final `firestore.rules` uses default-deny behavior. Public catalogue listeners query `approvalStatus == approved`; authenticated customers query `customerId == auth.uid`; verified vendors query `vendorUid == auth.uid` and `vendorUids array-contains auth.uid`; admins use trusted claims/records. Firestore rules must be published manually from the Firebase Console or CLI after review.

The current UI does not use Firebase Storage uploads, so no `storage.rules` file is included. Checkout remains explicitly demo/test: no server-side payment provider or payment verification is implemented.

## Beginner Android setup

1. Open Firebase Console on your phone and select project `nexmart-a6309`.
2. Open Authentication, choose Sign-in method, and enable Email/Password.
3. Open Project settings, select the registered Web App, and copy the browser configuration values into `.env.local` or your host settings.
4. In Firestore Database, review `firestore.rules` and publish it only after checking the ownership fields used by your documents.
5. Create a real customer account from the app to verify signup/login.
6. Use a trusted backend/Admin SDK to set `admin: true` or `vendor: true` Custom Claims for privileged test accounts, then sign out and sign in again so the ID token refreshes.
7. Do not treat the demo persona switcher as real Firebase authorization.

# Manual GitHub Push Guide

This ZIP contains the updated NexMart source, including Firebase Email/Password sign-in and sign-up, separate guest `Sign in` / `Create account` actions, trusted Firebase role handling, and the supplied browser-safe Firebase Web App configuration.

## Run locally

```bash
npm ci
npm run lint
npm run build
npm run dev
```

## Push to the selected GitHub repository

From the extracted `nexmart` directory:

```bash
git init
git branch -M main
git remote add origin https://github.com/MuzammilDehwar/Nexmart.git
git add -A
git commit -m "Update NexMart Firebase authentication"
git push -u origin main
```

If the repository already has commits, use this safer flow instead:

```bash
git fetch origin main
git merge --ff-only origin/main
git add -A
git commit -m "Update NexMart Firebase authentication"
git push origin main
```

Do not add Firebase service-account JSON, private keys, `.env`, or `.env.local` files to GitHub. The Firebase Web SDK values in `src/lib/firebase.ts` and `.env.example` are browser-safe client configuration; privileged roles still require trusted Firebase Custom Claims/server-side authorization.

# Nexmart Firebase setup (Roman Urdu)

Ye starter files hain; Firebase project abhi connect nahi hua. Existing demo AuthContext ko jaan-boojh kar replace nahi kiya, taake bina Firebase config ke current UI na tootay.

## 1. Firebase project banao
1. https://console.firebase.google.com/ kholo aur Add project karo.
2. Project banne ke baad Project settings > General > Your apps > Web app (</>) add karo.
3. Web app config se apiKey, authDomain, projectId, storageBucket, messagingSenderId aur appId lo. Frontend Firebase web config normal hoti hai; **service-account JSON/private key kabhi frontend mein mat daalna**.

## 2. Services enable karo
1. Authentication > Sign-in method > Email/Password enable karo.
2. Firestore Database create karo (production mode prefer karo).
3. Storage enable karo agar product images upload karni hain.

## 3. Config set karo
- `.env.example` ki copy `.env` banao (ya hosting/AI Studio ke environment variables mein values set karo).
- `VITE_FIREBASE_*` variables mein apni Firebase web config values add karo.
- Vite env values build-time par bundle hoti hain; ismein private secrets kabhi na rakho.

## 4. Rules
- `firestore.rules` aur `storage.rules` starter rules hain, production launch se pehle Firebase Emulator/Rules Playground mein test karo.
- Admin role ko client-side profile se kabhi grant na karo. `request.auth.token.admin` trusted Admin SDK custom claim se aana chahiye; us claim ko sirf trusted server environment set kare.
- Seller approval ke liye bhi trusted backend/custom claims aur specific seller-owned product rules banana honge. Current starter rules products writes sirf admin tak restrict karti hain.

## 5. Dependencies
`firebase` SDK package.json mein add kiya gaya hai. Project root mein terminal ho to `npm install` chalao, phir `npm run build`. Agar AI Studio terminal dependency installation allow na kare to app ke package manager se install karo.

## Important status
`src/lib/firebase.ts` Firebase app/Auth/Firestore/Storage ko tab initialize karta hai jab config set ho. Authentication UI abhi demo mode mein hai; real signup/login, profile creation, seller approval, product CRUD, order transactions aur rules tests next implementation phase mein connect karne honge.


## Nexmart project config added
The supplied Firebase Web App config has been placed in `.env.local` for both project folders. Restart the Vite dev server after setting environment variables. This only initializes Firebase SDK services; it does not by itself replace the demo AuthContext or connect product/order flows to Firestore. Configure/test Firebase Authentication and database rules before production use.

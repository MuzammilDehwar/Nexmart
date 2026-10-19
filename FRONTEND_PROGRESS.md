# Nexmart frontend progress

This update adds a dedicated Wishlist page to the existing React + TypeScript + Vite demo frontend.

## Included
- Dedicated wishlist view reachable from the storefront header.
- Saved products are read from `nexmart_wishlist_v1`, matching the existing product-card heart controls.
- Remove saved products, add saved products to cart, empty state, responsive product grid, and local-only storage notice.
- Existing cart and demo data persistence remains in place.
- Changes are mirrored into the `nexmart_next` duplicate source tree to reduce drift between the two copies.

## Important limitations
- Wishlist and cart data are browser-local only; no account sync or multi-device persistence.
- Authentication and role switching remain demo-only.
- No Firebase integration, real payment processing, production authorization, or server-side order persistence is included.
- Build/test could not be completed in this environment because `npm install` timed out. Run `npm install`, `npm run lint`, and `npm run build` in the target environment before treating this update as verified.

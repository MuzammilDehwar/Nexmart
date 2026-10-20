# NexMart Firestore Security Specification & Attack Invariant Matrix

## 1. Core Data Invariants

1. **User Profile Invariant (`/users/{userId}`)**:
   - A user profile can ONLY be created by an authenticated user where `request.auth.uid == userId`.
   - The initial `role` must strictly equal `'customer'`.
   - A user cannot set or modify privileged fields: `role`, `isAdmin`, `admin`, `vendor`, `isVendor`.
   - Users can only read their own profile (`isOwner(userId)`). Blanket user directory listing is forbidden.
   - Profile deletion is restricted to platform administrators.

2. **Catalog Product Invariant (`/products/{productId}`)**:
   - Public / guest visitors can ONLY read active, approved products (`approvalStatus == 'approved'`).
   - Draft, pending, or rejected products are inaccessible to the general public.
   - Only authorized, verified sellers or admins may create catalog products.
   - When a seller creates a product, the initial status must be `'pending'`. Sellers CANNOT self-approve products.
   - Only platform administrators can transition a product to `'approved'` or `'rejected'`.
   - Product updates by sellers cannot touch `approvalStatus` or `rejectionReason`.

3. **Customer Order Invariant (`/orders/{orderId}`)**:
   - An order can only be created by an authenticated customer for their own identity (`customerId == request.auth.uid` or verified customer email).
   - An order cannot be created with falsified statuses like `'Delivered'` or `'Paid'` directly by a client.
   - Customers CANNOT update immutable transaction fields: `total`, `subtotal`, `tax`, `shipping`, `paymentMethod`, `paymentStatus`, `customerId`, `customerEmail`.
   - Customers can read ONLY their own orders. Blanket listing or cross-tenant reading is blocked.
   - Sellers can only inspect order data pertaining to their fulfilled items/packages.
   - Only trusted admins have global oversight over all customer orders.

4. **Vendor Application Invariant (`/vendor_applications/{appId}`)**:
   - Prospective sellers can submit applications for their own UID with status `'pending'`.
   - Sellers cannot self-approve applications. Only admins can update the application status to `'approved'` or `'rejected'`.
   - Applicants can only read their own application status; admins can read and review all applications.

5. **Global Default-Deny Catch-All**:
   - Any document path not explicitly authorized is completely denied (`allow read, write: if false;`).
   - Unbounded string and field injections are rejected.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following 12 adversarial payloads demonstrate attacks against NexMart's identity, integrity, and authorization boundaries:

### Payload 1: Self-Assignment of Admin Role on User Registration
- **Target Path:** `/users/cust-attacker-99`
- **Auth Context:** User UID `cust-attacker-99` (standard customer)
- **Operation:** `CREATE`
- **Malicious Payload:**
  ```json
  {
    "id": "cust-attacker-99",
    "name": "Attacker",
    "email": "attacker@darkweb.io",
    "role": "admin",
    "isAdmin": true
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Clients cannot self-grant 'admin' or 'vendor' roles).

### Payload 2: Privilege Escalation via User Profile Update
- **Target Path:** `/users/cust-user-12`
- **Auth Context:** User UID `cust-user-12` (customer)
- **Operation:** `UPDATE`
- **Malicious Payload:**
  ```json
  {
    "role": "admin",
    "isAdmin": true
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Users cannot modify RBAC fields).

### Payload 3: Shadow Update / Ghost Field Injection on User Document
- **Target Path:** `/users/cust-user-12`
- **Auth Context:** User UID `cust-user-12`
- **Operation:** `UPDATE`
- **Malicious Payload:**
  ```json
  {
    "name": "Legit Name",
    "isSuperUser": true,
    "bypassedEscrow": true
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Affected keys must not include unapproved shadow fields).

### Payload 4: Unauthorized Reading of Another User's Profile
- **Target Path:** `/users/victim-user-88`
- **Auth Context:** User UID `cust-attacker-99`
- **Operation:** `GET`
- **Expected Outcome:** `PERMISSION_DENIED` (Users can read only their own profile; no PII leaks).

### Payload 5: Public Storefront Scraping of Unapproved Products
- **Target Path:** `/products/unreleased-leak-01` (document has `approvalStatus: 'pending'`)
- **Auth Context:** Unauthenticated (`null`) or standard customer
- **Operation:** `GET`
- **Expected Outcome:** `PERMISSION_DENIED` (Public reads allowed ONLY when `approvalStatus == 'approved'`).

### Payload 6: Customer Attempting to Create a Product
- **Target Path:** `/products/fake-merch-01`
- **Auth Context:** User UID `cust-regular-05` (Customer role, not an authorized seller)
- **Operation:** `CREATE`
- **Malicious Payload:**
  ```json
  {
    "id": "fake-merch-01",
    "title": "Bootleg Product",
    "storeSlug": "scam-store",
    "basePrice": 999.00,
    "approvalStatus": "pending"
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Only verified vendors and platform admins can create products).

### Payload 7: Seller Self-Approving Product on Creation
- **Target Path:** `/products/artisan-vase-01`
- **Auth Context:** User UID `seller-marcus-01` (Verified vendor)
- **Operation:** `CREATE`
- **Malicious Payload:**
  ```json
  {
    "id": "artisan-vase-01",
    "title": "Ceramic Artisan Vase",
    "storeSlug": "lumina-audio",
    "basePrice": 120.00,
    "approvalStatus": "approved"
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Vendors can only create products with `approvalStatus == 'pending'`).

### Payload 8: Seller Approving Their Own Existing Product via Update
- **Target Path:** `/products/pending-watch-02` (currently `approvalStatus: 'pending'`)
- **Auth Context:** User UID `seller-marcus-01` (Verified vendor)
- **Operation:** `UPDATE`
- **Malicious Payload:**
  ```json
  {
    "approvalStatus": "approved"
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Only trusted admins may approve or reject products).

### Payload 9: Customer Creating Order for Another Customer (Identity Spoofing)
- **Target Path:** `/orders/ord-spoofed-01`
- **Auth Context:** User UID `cust-attacker-99`
- **Operation:** `CREATE`
- **Malicious Payload:**
  ```json
  {
    "id": "ord-spoofed-01",
    "customerId": "victim-user-88",
    "customerEmail": "victim@example.com",
    "total": 5400.00,
    "overallStatus": "Ordered"
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Customers can create orders only for their own UID).

### Payload 10: Customer Modifying Order Totals or Payment Status
- **Target Path:** `/orders/ord-legit-77`
- **Auth Context:** User UID `cust-buyer-10` (Owner of the order)
- **Operation:** `UPDATE`
- **Malicious Payload:**
  ```json
  {
    "total": 0.01,
    "subtotal": 0.01,
    "paymentStatus": "paid",
    "overallStatus": "Delivered"
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Customers cannot change payment status, order ownership, totals, or admin-only fields).

### Payload 11: Customer Peeking at Another Customer's Order
- **Target Path:** `/orders/ord-confidential-33` (Owned by `victim-user-88`)
- **Auth Context:** User UID `cust-attacker-99`
- **Operation:** `GET`
- **Expected Outcome:** `PERMISSION_DENIED` (Order reads restricted to owning customer and platform admins).

### Payload 12: Non-Admin Self-Approving Vendor Application
- **Target Path:** `/vendor_applications/app-seller-02`
- **Auth Context:** User UID `applicant-seller-02`
- **Operation:** `UPDATE`
- **Malicious Payload:**
  ```json
  {
    "status": "approved"
  }
  ```
- **Expected Outcome:** `PERMISSION_DENIED` (Only trusted platform administrators may approve vendor applications).


## Deployment gate

The client keeps Firestore synchronization disabled until the reviewed rules are deployed. Set `VITE_FIREBASE_ENABLE_FIRESTORE_SYNC=true` only after deploying `firestore.rules` to `nexmart-a6309`. Firebase Authentication is independent and remains available while the gate is false.

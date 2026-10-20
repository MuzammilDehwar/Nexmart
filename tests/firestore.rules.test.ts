/**
 * NexMart Firestore Security Rules Unit & Emulator Test Suite
 * Compatible with @firebase/rules-unit-testing
 *
 * To run locally with Firebase Emulator:
 *   1. Ensure Java (JRE 11+) is installed: java -version
 *   2. Run emulator test: firebase emulators:exec --only firestore "npx mocha tests/firestore.rules.test.ts"
 */

import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ID = 'nexmart-a6309';

describe('NexMart Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    const rules = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  // =========================================================================
  // 1. USER PROFILE PERMISSIONS (/users/{userId})
  // =========================================================================
  describe('User Profiles (/users/{userId})', () => {
    const customerUid = 'cust-julian-01';
    const otherUserUid = 'cust-stranger-02';

    it('allows a customer to create their own profile as "customer"', async () => {
      const db = testEnv.authenticatedContext(customerUid, { email: 'julian@example.com' }).firestore();
      const profileDoc = db.collection('users').doc(customerUid);

      await assertSucceeds(
        profileDoc.set({
          id: customerUid,
          name: 'Julian Vance',
          email: 'julian@example.com',
          role: 'customer',
          createdAt: new Date().toISOString(),
        })
      );
    });

    it('DENIES a user from granting themselves "admin" or "vendor" role on registration', async () => {
      const db = testEnv.authenticatedContext(customerUid, { email: 'attacker@example.com' }).firestore();
      const profileDoc = db.collection('users').doc(customerUid);

      // Attempting to self-grant admin
      await assertFails(
        profileDoc.set({
          id: customerUid,
          name: 'Hacker',
          email: 'attacker@example.com',
          role: 'admin',
          isAdmin: true,
        })
      );

      // Attempting to self-grant vendor
      await assertFails(
        profileDoc.set({
          id: customerUid,
          name: 'Hacker',
          email: 'attacker@example.com',
          role: 'vendor',
        })
      );
    });

    it('DENIES a user from modifying their role or admin status on update', async () => {
      await testEnv.withSecurityRulesDisabled(async (adminContext) => {
        const adminDb = adminContext.firestore();
        await adminDb.collection('users').doc(customerUid).set({
          id: customerUid,
          name: 'Julian Vance',
          email: 'julian@example.com',
          role: 'customer',
        });
      });

      const db = testEnv.authenticatedContext(customerUid).firestore();
      const profileDoc = db.collection('users').doc(customerUid);

      // User tries to elevate to admin
      await assertFails(profileDoc.update({ role: 'admin' }));
      await assertFails(profileDoc.update({ isAdmin: true }));

      // User can update legitimate personal fields like name
      await assertSucceeds(profileDoc.update({ name: 'Julian Vance Updated' }));
    });

    it('DENIES users from reading another person’s profile (PII protection)', async () => {
      await testEnv.withSecurityRulesDisabled(async (adminContext) => {
        const adminDb = adminContext.firestore();
        await adminDb.collection('users').doc(otherUserUid).set({
          id: otherUserUid,
          name: 'Private User',
          email: 'private@example.com',
          role: 'customer',
        });
      });

      const db = testEnv.authenticatedContext(customerUid).firestore();
      await assertFails(db.collection('users').doc(otherUserUid).get());
    });
  });

  // =========================================================================
  // 2. PRODUCT CATALOG PERMISSIONS (/products/{productId})
  // =========================================================================
  describe('Product Catalog (/products/{productId})', () => {
    const unauthenticatedDb = () => testEnv.unauthenticatedContext().firestore();
    const vendorUid = 'seller-marcus-01';
    const adminUid = 'admin-elena-01';

    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (adminContext) => {
        const adminDb = adminContext.firestore();
        // Seed approved product
        await adminDb.collection('products').doc('prod-approved-01').set({
          id: 'prod-approved-01',
          title: 'Lumina Studio Headphones',
          storeSlug: 'lumina-audio',
          basePrice: 349.0,
          approvalStatus: 'approved',
          vendorUid,
        });

        // Seed pending product
        await adminDb.collection('products').doc('prod-pending-02').set({
          id: 'prod-pending-02',
          title: 'Unreviewed Prototype Watch',
          storeSlug: 'lumina-audio',
          basePrice: 880.0,
          approvalStatus: 'pending',
          vendorUid,
        });
      });
    });

    it('allows public / unauthenticated guests to read approved products', async () => {
      const db = unauthenticatedDb();
      await assertSucceeds(db.collection('products').doc('prod-approved-01').get());
    });

    it('DENIES public / unauthenticated guests from reading pending products', async () => {
      const db = unauthenticatedDb();
      await assertFails(db.collection('products').doc('prod-pending-02').get());
    });

    it('allows verified vendor to create a product in "pending" status', async () => {
      const vendorDb = testEnv
        .authenticatedContext(vendorUid, {
          role: 'vendor',
          vendor: true,
          storeSlug: 'lumina-audio',
        })
        .firestore();

      await assertSucceeds(
        vendorDb.collection('products').doc('prod-new-03').set({
          id: 'prod-new-03',
          title: 'Nordic Lamp',
          storeSlug: 'lumina-audio',
          basePrice: 210.0,
          approvalStatus: 'pending',
          vendorUid,
        })
      );
    });

    it('DENIES vendor from self-approving a product on creation', async () => {
      const vendorDb = testEnv
        .authenticatedContext(vendorUid, {
          role: 'vendor',
          vendor: true,
          storeSlug: 'lumina-audio',
        })
        .firestore();

      await assertFails(
        vendorDb.collection('products').doc('prod-self-approved').set({
          id: 'prod-self-approved',
          title: 'Rogue Product',
          storeSlug: 'lumina-audio',
          basePrice: 99.0,
          approvalStatus: 'approved',
          vendorUid,
        })
      );
    });

    it('DENIES vendor from updating approvalStatus on an existing product', async () => {
      const vendorDb = testEnv
        .authenticatedContext(vendorUid, {
          role: 'vendor',
          vendor: true,
          storeSlug: 'lumina-audio',
        })
        .firestore();

      await assertFails(
        vendorDb.collection('products').doc('prod-pending-02').update({
          approvalStatus: 'approved',
        })
      );
    });

    it('allows platform administrator to approve or reject products', async () => {
      const adminDb = testEnv
        .authenticatedContext(adminUid, {
          role: 'admin',
          admin: true,
          email: 'elena@nexmart.internal',
          email_verified: true,
        })
        .firestore();

      await assertSucceeds(
        adminDb.collection('products').doc('prod-pending-02').update({
          approvalStatus: 'approved',
        })
      );
    });
  });

  // =========================================================================
  // 3. ORDERS PERMISSIONS (/orders/{orderId})
  // =========================================================================
  describe('Customer Orders (/orders/{orderId})', () => {
    const customerUid = 'cust-buyer-10';
    const attackerUid = 'cust-intruder-99';
    const adminUid = 'admin-elena-01';

    it('allows customer to create order for themselves with initial status "Ordered"', async () => {
      const db = testEnv.authenticatedContext(customerUid, { email: 'buyer@example.com' }).firestore();

      await assertSucceeds(
        db.collection('orders').doc('ord-1001').set({
          id: 'ord-1001',
          customerId: customerUid,
          customerEmail: 'buyer@example.com',
          total: 250.0,
          subtotal: 230.0,
          tax: 20.0,
          shipping: 0,
          overallStatus: 'Ordered',
          createdAt: new Date().toISOString(),
        })
      );
    });

    it('DENIES customer from creating an order for another user UID (Identity spoofing)', async () => {
      const db = testEnv.authenticatedContext(attackerUid, { email: 'attacker@example.com' }).firestore();

      await assertFails(
        db.collection('orders').doc('ord-spoofed-99').set({
          id: 'ord-spoofed-99',
          customerId: customerUid,
          customerEmail: 'buyer@example.com',
          total: 1000.0,
          overallStatus: 'Ordered',
        })
      );
    });

    it('DENIES customer from altering order totals, payment status, or customer ownership', async () => {
      await testEnv.withSecurityRulesDisabled(async (adminContext) => {
        const adminDb = adminContext.firestore();
        await adminDb.collection('orders').doc('ord-1001').set({
          id: 'ord-1001',
          customerId: customerUid,
          customerEmail: 'buyer@example.com',
          total: 250.0,
          paymentStatus: 'pending',
          overallStatus: 'Ordered',
        });
      });

      const db = testEnv.authenticatedContext(customerUid).firestore();
      const orderDoc = db.collection('orders').doc('ord-1001');

      await assertFails(orderDoc.update({ total: 1.0 }));
      await assertFails(orderDoc.update({ paymentStatus: 'paid' }));
      await assertFails(orderDoc.update({ customerId: attackerUid }));
    });

    it('DENIES customer from reading other customers’ orders', async () => {
      await testEnv.withSecurityRulesDisabled(async (adminContext) => {
        const adminDb = adminContext.firestore();
        await adminDb.collection('orders').doc('ord-confidential').set({
          id: 'ord-confidential',
          customerId: customerUid,
          customerEmail: 'buyer@example.com',
          total: 990.0,
          overallStatus: 'Ordered',
        });
      });

      const attackerDb = testEnv.authenticatedContext(attackerUid).firestore();
      await assertFails(attackerDb.collection('orders').doc('ord-confidential').get());
    });

    it('allows platform administrator to read and manage all orders', async () => {
      const adminDb = testEnv
        .authenticatedContext(adminUid, {
          role: 'admin',
          admin: true,
          email: 'elena@nexmart.internal',
          email_verified: true,
        })
        .firestore();

      await assertSucceeds(adminDb.collection('orders').doc('ord-confidential').get());
    });
  });

  // =========================================================================
  // 4. DEFAULT-DENY ON UNREGISTERED COLLECTIONS
  // =========================================================================
  describe('Global Default Deny', () => {
    it('DENIES read and write to arbitrary, unconfigured collections', async () => {
      const db = testEnv.authenticatedContext('any-user').firestore();
      await assertFails(db.collection('system_logs').doc('log-1').get());
      await assertFails(db.collection('system_logs').doc('log-1').set({ foo: 'bar' }));
      await assertFails(db.collection('internal_secrets').doc('api_keys').get());
    });
  });
});

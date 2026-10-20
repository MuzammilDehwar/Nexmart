/**
 * NexMart Firestore Security Rules Static & Logical Verification Runner
 * Runs directly via Node.js / tsx to verify rule integrity, default-deny safety,
 * RBAC constraints, and Dirty Dozen attack defenses without requiring a Java runtime.
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function assertRule(name: string, category: string, condition: boolean, message: string) {
  results.push({
    name,
    category,
    passed: condition,
    message: condition ? 'PASSED' : `FAILED: ${message}`,
  });
}

function runVerification() {
  const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
  if (!fs.existsSync(rulesPath)) {
    console.error('firestore.rules file not found at:', rulesPath);
    process.exit(1);
  }

  const rulesContent = fs.readFileSync(rulesPath, 'utf8');

  console.log('\n======================================================');
  console.log(' NEXMART FIRESTORE SECURITY RULES VERIFICATION REPORT ');
  console.log('======================================================\n');

  // 1. Version & Structure
  assertRule(
    'Rules Version 2',
    'Structure',
    rulesContent.includes("rules_version = '2';"),
    'Must specify rules_version = "2";'
  );

  // 2. Default Deny Catch-All (Requirement 7)
  const hasDefaultDeny =
    rulesContent.includes('match /{document=**}') &&
    rulesContent.includes('allow read, write: if false;');
  assertRule(
    'Global Default-Deny Catch-All',
    'Denial Net',
    hasDefaultDeny,
    'Must deny all read and write by default'
  );

  // 3. Prohibit Blanket "allow read, write: if true"
  const hasInsecureAllowTrue =
    /allow\s+read\s*,\s*write\s*:\s*if\s+true\s*;/.test(rulesContent) ||
    /allow\s+read\s*:\s*if\s+true\s*;/.test(rulesContent) ||
    /allow\s+write\s*:\s*if\s+true\s*;/.test(rulesContent);
  assertRule(
    'No Insecure Blanket "if true" Directives',
    'Hardening',
    !hasInsecureAllowTrue,
    'Found insecure "allow read, write: if true;"'
  );

  // 4. Users Collection Protection (Requirement 3)
  const usersBlockMatch = rulesContent.match(/match\s+\/users\/\{userId\}\s*\{([\s\S]*?)\n\s*\}/);
  const usersBlock = usersBlockMatch ? usersBlockMatch[1] : '';

  assertRule(
    'User Profile Strict Ownership',
    'Users RBAC',
    usersBlock.includes('isOwner(userId)') || usersBlock.includes('request.auth.uid == userId'),
    'User profile must enforce isOwner'
  );

  assertRule(
    'Prevent Self-Grant of Admin/Vendor on Registration',
    'Users RBAC',
    usersBlock.includes("role == 'customer'") && usersBlock.includes("!request.resource.data.keys().hasAny(['isAdmin'"),
    'New registrations must be strictly restricted to customer role with no privileged flags'
  );

  assertRule(
    'Prevent Role/Privilege Escalation on Profile Update',
    'Users RBAC',
    usersBlock.includes("!request.resource.data.diff(resource.data).affectedKeys().hasAny") &&
      usersBlock.includes("'role'") &&
      usersBlock.includes("'isAdmin'"),
    'Users must not be able to modify role or isAdmin on update'
  );

  // 5. Products Collection Moderation (Requirement 4)
  const productsBlockMatch = rulesContent.match(/match\s+\/products\/\{productId\}\s*\{([\s\S]*?)\n\s*\}/);
  const productsBlock = productsBlockMatch ? productsBlockMatch[1] : '';

  assertRule(
    'Public Catalog Reads Allowed ONLY for Approved Products',
    'Products RBAC',
    productsBlock.includes("resource.data.approvalStatus == 'approved'"),
    'Catalog public reads must be restricted to approved products'
  );

  assertRule(
    'Vendors Create Products in "pending" Status (No Self-Approval)',
    'Products RBAC',
    productsBlock.includes("approvalStatus == 'pending'"),
    'Vendors must only create products with approvalStatus pending'
  );

  assertRule(
    'Only Admins Can Approve or Reject Products',
    'Products RBAC',
    productsBlock.includes('!request.resource.data.diff(resource.data).affectedKeys().hasAny') &&
      productsBlock.includes("'approvalStatus'") &&
      productsBlock.includes("'rejectionReason'"),
    'Vendors must be barred from altering approvalStatus or rejectionReason'
  );

  // 6. Orders Collection Security (Requirement 5)
  const ordersBlockMatch = rulesContent.match(/match\s+\/orders\/\{orderId\}\s*\{([\s\S]*?)\n\s*\}/);
  const ordersBlock = ordersBlockMatch ? ordersBlockMatch[1] : '';

  assertRule(
    'Customer Order Creation Restricted to Own Identity',
    'Orders RBAC',
    ordersBlock.includes('request.resource.data.customerId == request.auth.uid'),
    'Customer must only create orders for their own auth UID'
  );

  assertRule(
    'Customers Forbidden from Altering Totals or Payment Status',
    'Orders RBAC',
    ordersBlock.includes('!request.resource.data.diff(resource.data).affectedKeys().hasAny') &&
      ordersBlock.includes("'paymentStatus'") &&
      ordersBlock.includes("'total'") &&
      ordersBlock.includes("'customerId'"),
    'Customers must not be able to alter paymentStatus, total, or customerId'
  );

  assertRule(
    'Full Order Reads Restricted to Customer and Admin',
    'Orders RBAC',
    ordersBlock.includes('resource.data.customerId == request.auth.uid') &&
      ordersBlock.includes('isAdmin()') &&
      !ordersBlock.includes('isOrderVendor(resource.data)'),
    'Full orders must only be visible to the owning customer or admin; vendors use projections'
  );

  assertRule(
    'Vendor Order Projections Are Vendor-Scoped',
    'Orders RBAC',
    rulesContent.includes('match /vendor_orders/{vendorUid}/orders/{orderId}') &&
      rulesContent.includes('request.auth.uid == vendorUid'),
    'Vendors may only access their own sanitized order projections'
  );

  assertRule(
    'Chat Threads Are Participant-Scoped',
    'Realtime Commerce',
    rulesContent.includes('match /chat_threads/{threadId}') &&
      rulesContent.includes('resource.data.participants.hasAny([request.auth.uid])') &&
      rulesContent.includes('request.resource.data.customerUid == request.auth.uid'),
    'Only authenticated thread participants may read or create their own buyer thread'
  );

  assertRule(
    'Chat Messages Bind Sender Identity',
    'Realtime Commerce',
    rulesContent.includes('match /messages/{messageId}') &&
      rulesContent.includes('request.resource.data.senderUid == request.auth.uid') &&
      rulesContent.includes('request.resource.data.body.size() <= 2000'),
    'Messages must bind to the authenticated sender and have a bounded body'
  );

  assertRule(
    'Notifications Are User-Owned',
    'Realtime Commerce',
    rulesContent.includes('match /notifications/{notificationId}') &&
      rulesContent.includes('resource.data.userUid == request.auth.uid') &&
      rulesContent.includes('allow create: if isAdmin()'),
    'Users may read/update only their own notifications; creation is trusted'
  );

  // 7. Verified Privilege Logic (Requirement 6)
  assertRule(
    'Admin Checks Require Trusted Claims or Admin Records',
    'Privilege Verification',
    rulesContent.includes('request.auth.token.admin == true') &&
      rulesContent.includes('exists(/databases/$(database)/documents/admins/$(request.auth.uid))'),
    'Admin role checks must use trusted claims or an admin-managed Firestore record'
  );

  // Print Summary
  let totalPassed = 0;
  for (const r of results) {
    if (r.passed) totalPassed++;
    const icon = r.passed ? '✓' : '✗';
    console.log(`[${r.category}] ${icon} ${r.name}: ${r.message}`);
  }

  console.log(`\nResults: ${totalPassed}/${results.length} checks passed.\n`);

  if (totalPassed !== results.length) {
    process.exit(1);
  }
}

runVerification();

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { EngagementProvider } from './context/EngagementContext';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { AccessGuard } from './components/AccessGuard';
import { MvpImplementationView } from './components/MvpImplementationView';
import { BlueprintView } from './components/BlueprintView';
import { CustomerHomepage } from './components/nextjs14/CustomerHomepage';
import { ProductDetailPage } from './components/nextjs14/ProductDetailPage';
import { CheckoutPage } from './components/nextjs14/CheckoutPage';
import { CustomerOrdersPage } from './components/nextjs14/CustomerOrdersPage';
import { WishlistPage } from './components/nextjs14/WishlistPage';
import { CartDrawer } from './components/nextjs14/CartDrawer';
import { VendorPortal } from './components/VendorPortal';
import { AdminPortal } from './components/AdminPortal';
import { SchemaErdViewer } from './components/SchemaErdViewer';
import { GENERATE_ENTERPRISE_BLUEPRINT_MARKDOWN } from './utils/exportMarkdown';
import { SmartShoppingAssistant, VendorChatWidget } from './components/phase1/Phase1CommerceTools';

export default function App() {
  return (
    <AuthProvider>
      <EngagementProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </EngagementProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<'mvp' | 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema'>('mvp');
  const [hasCopied, setHasCopied] = useState(false);
  const { setOnNavigateToTab, currentView } = useCart();
  const { role, isSuperAdmin } = useAuth();

  React.useEffect(() => {
    // Wrap the setter so CartContext stores the callback instead of treating it as a state updater.
    setOnNavigateToTab(() => setActiveTab);
  }, [setOnNavigateToTab]);

  const handleExportMarkdown = () => {
    const markdownContent = GENERATE_ENTERPRISE_BLUEPRINT_MARKDOWN();
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'NexMart_Phase1_MVP_Specification.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleCopyMarkdown = () => {
    const markdownContent = GENERATE_ENTERPRISE_BLUEPRINT_MARKDOWN();
    navigator.clipboard.writeText(markdownContent);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <div>
        {/* Top Bar following Top Bar Contract */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onExportMarkdown={handleExportMarkdown}
        />

        {/* Global Unified Auth Modal (NextAuth Provider simulation) */}
        <AuthModal />

        {/* Main Content Area */}
        <main className="w-full">
          {activeTab === 'mvp' && <MvpImplementationView />}

          {activeTab === 'blueprint' && (
            <BlueprintView
              onNavigateToPrototype={(tab) => setActiveTab(tab as any)}
              onCopyMarkdown={handleCopyMarkdown}
              hasCopied={hasCopied}
            />
          )}

          {activeTab === 'customer' && (
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden min-h-[600px]">
                {currentView === 'home' && <CustomerHomepage />}
                {currentView === 'product-detail' && <ProductDetailPage />}
                {currentView === 'checkout' && <CheckoutPage />}
                {currentView === 'orders' && <CustomerOrdersPage />}
                {currentView === 'wishlist' && <WishlistPage />}
              </div>
              <CartDrawer />
            </div>
          )}

          {/* Protected Route: Vendor Central (Only Super Admin) */}
          {activeTab === 'vendor' && (
            isSuperAdmin ? (
              <VendorPortal />
            ) : (
              <AccessGuard
                requiredRole="vendor"
                title="Vendor Central Access Restricted"
                description="The Seller Dashboard and inventory management tools are exclusively accessible to authorized accounts with Super Admin privileges."
                onReturnHome={() => setActiveTab('customer')}
              />
            )
          )}

          {/* Protected Route: Admin Tower (Only grant access if user's authenticated role is 'Super Admin') */}
          {activeTab === 'admin' && (
            isSuperAdmin ? (
              <AdminPortal />
            ) : (
              <AccessGuard
                requiredRole="admin"
                title="Super Admin Governance Tower Restricted"
                description="Access to the NexMart Admin panel is strictly restricted. Only users whose authenticated role is 'Super Admin' are granted access to this control center."
                onReturnHome={() => setActiveTab('customer')}
              />
            )
          )}

          {activeTab === 'schema' && <SchemaErdViewer />}
        </main>
        {activeTab === 'customer' && <>
          <SmartShoppingAssistant />
          <VendorChatWidget />
        </>}
      </div>

      {/* Quiet, Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 font-display">NexMart Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Multi-Vendor Blueprint</span>
            <span aria-hidden="true">·</span>
            <span>Authored for Production Scale</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('blueprint')}
              className="hover:text-slate-900 transition-colors"
            >
              Blueprint Docs
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className="hover:text-slate-900 transition-colors"
            >
              Customer View
            </button>
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('vendor')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Vendor Central
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Admin Tower
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('schema')}
              className="hover:text-slate-900 transition-colors"
            >
              Schema DDL
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

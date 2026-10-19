import React, { useState } from 'react';
import { useCart, OrderStatus } from '../context/CartContext';
import { ProductData, ProductVariantData } from './nextjs14/ProductCard';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Check, 
  Eye, 
  Layers, 
  DollarSign, 
  Package, 
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Store,
  RefreshCw,
  Truck,
  CheckCircle2,
  Printer,
  ChevronDown,
  Filter
} from 'lucide-react';

export const VendorPortal: React.FC = () => {
  const { 
    products, 
    addProduct, 
    orders, 
    updateOrderStatus, 
    setCurrentView, 
    setSelectedProductId, 
    onNavigateToTab 
  } = useCart();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'add-product' | 'inventory'>('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<string>('Lumina Audio Labs');
  const [statusToast, setStatusToast] = useState<{ message: string; id: string } | null>(null);
  const [ordersFilter, setOrdersFilter] = useState<'all' | 'active' | 'delivered'>('all');

  // Form State for "Add New Product"
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Audio Hardware');
  const [brand, setBrand] = useState('Lumina Audio Labs');
  const [basePrice, setBasePrice] = useState('289.00');
  const [compareAtPrice, setCompareAtPrice] = useState('329.00');
  const [deliveryDays, setDeliveryDays] = useState('Tomorrow, Free Express');
  
  // Image previews
  const [imageUrls, setImageUrls] = useState<string[]>([
    '/src/assets/images/product_headphones_studio_1792380849129.jpg',
    '/src/assets/images/hero_marketplace_showcase_1792380848955.jpg',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Dynamic Variants state
  const [variants, setVariants] = useState<ProductVariantData[]>([
    {
      id: 'var-new-1',
      sku: 'LUM-PRO-GRY',
      title: 'Space Gray Edition',
      colorName: 'Space Gray',
      colorHex: '#475569',
      price: 289.00,
      inventoryQty: 35,
      imageUrl: '/src/assets/images/product_headphones_studio_1792380849129.jpg',
    },
    {
      id: 'var-new-2',
      sku: 'LUM-PRO-BLK',
      title: 'Obsidian Black Edition',
      colorName: 'Obsidian',
      colorHex: '#0f172a',
      price: 309.00,
      inventoryQty: 4, // low stock alert trigger!
      imageUrl: '/src/assets/images/product_headphones_studio_1792380849129.jpg',
    },
  ]);

  const [newVariantTitle, setNewVariantTitle] = useState('');
  const [newVariantColorName, setNewVariantColorName] = useState('Titanium Gold');
  const [newVariantHex, setNewVariantHex] = useState('#d97706');
  const [newVariantPrice, setNewVariantPrice] = useState('299.00');
  const [newVariantQty, setNewVariantQty] = useState('20');

  // Success Notification
  const [createdProduct, setCreatedProduct] = useState<ProductData | null>(null);

  // Filter vendor's products
  const vendorProducts = products.filter(
    (p) => selectedVendor === 'ALL' || p.storeName.toLowerCase() === selectedVendor.toLowerCase()
  );

  // Filter vendor's orders: only orders containing packages for this vendor!
  const vendorOrders = orders.filter((ord) =>
    selectedVendor === 'ALL'
      ? true
      : ord.vendorPackages.some(
          (pkg) => pkg.vendorName.toLowerCase() === selectedVendor.toLowerCase()
        )
  );

  // Active orders (not delivered yet)
  const activeVendorOrders = vendorOrders.filter((ord) => {
    const pkg = ord.vendorPackages.find(
      (p) => selectedVendor === 'ALL' || p.vendorName.toLowerCase() === selectedVendor.toLowerCase()
    );
    return pkg ? pkg.status !== 'Delivered' : ord.overallStatus !== 'Delivered';
  });

  // Calculate dynamic total revenue from vendor's orders + base store volume
  const liveOrderRevenue = vendorOrders.reduce((sum, ord) => {
    const pkgs = ord.vendorPackages.filter(
      (p) => selectedVendor === 'ALL' || p.vendorName.toLowerCase() === selectedVendor.toLowerCase()
    );
    return sum + pkgs.reduce((acc, p) => acc + p.subtotal, 0);
  }, 0);

  const baseVolume = selectedVendor === 'Lumina Audio Labs' ? 48920.00 : selectedVendor === 'Vanguard Horology' ? 76400.00 : 29150.00;
  const totalRevenue = baseVolume + liveOrderRevenue;
  const netEscrowPayout = totalRevenue * 0.90; // 10% platform fee

  // Find all low-stock variants across this vendor's products (inventoryQty <= 5)
  const lowStockAlerts = vendorProducts.flatMap((p) =>
    p.variants
      .filter((v) => v.inventoryQty <= 5)
      .map((v) => ({ product: p, variant: v }))
  );

  // Quick preset sample fillers
  const handleLoadSample = (sampleType: 'keyboard' | 'monitor' | 'earbuds') => {
    if (sampleType === 'keyboard') {
      setTitle('Aether Carbon HHKB Mechanical Keyboard');
      setDescription('Gasket-mounted aerospace carbon fiber chassis with hot-swappable lubed linear switches and south-facing RGB illumination.');
      setCategory('Mechanical Keyboards');
      setBasePrice('220.00');
      setCompareAtPrice('260.00');
      setImageUrls(['/src/assets/images/product_mechanical_watch_1792380849996.jpg']);
      setVariants([
        {
          id: `var-${Date.now()}-1`,
          sku: 'AETH-KBD-BLK',
          title: 'Stealth Carbon / Linear',
          colorName: 'Stealth Carbon',
          colorHex: '#1e293b',
          price: 220.00,
          inventoryQty: 18,
          imageUrl: '/src/assets/images/product_mechanical_watch_1792380849996.jpg',
        },
        {
          id: `var-${Date.now()}-2`,
          sku: 'AETH-KBD-WHT',
          title: 'Ethereal White / Tactile',
          colorName: 'Ethereal White',
          colorHex: '#e2e8f0',
          price: 235.00,
          inventoryQty: 3, // low stock!
          imageUrl: '/src/assets/images/product_mechanical_watch_1792380849996.jpg',
        },
      ]);
    }
  };

  const handleAddVariant = () => {
    if (!newVariantTitle.trim()) return;

    const newVar: ProductVariantData = {
      id: `var-${Date.now()}`,
      sku: `LUM-${Date.now().toString().slice(-4)}`,
      title: newVariantTitle,
      colorName: newVariantColorName,
      colorHex: newVariantHex,
      price: parseFloat(newVariantPrice) || parseFloat(basePrice) || 100,
      inventoryQty: parseInt(newVariantQty) || 15,
      imageUrl: imageUrls[0],
    };

    setVariants((prev) => [...prev, newVar]);
    setNewVariantTitle('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl)) {
      setImageUrls((prev) => [...prev, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProdId = `prod-${Date.now()}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProductData: ProductData = {
      id: newProdId,
      title,
      slug,
      brand: selectedVendor === 'ALL' ? brand : selectedVendor,
      storeName: selectedVendor === 'ALL' ? brand : selectedVendor,
      storeSlug: (selectedVendor === 'ALL' ? brand : selectedVendor).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      basePrice: parseFloat(basePrice) || 199.00,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      ratingAverage: 5.0,
      ratingCount: 1,
      primaryImage: imageUrls[0] || '/src/assets/images/product_headphones_studio_1792380849129.jpg',
      deliveryDays,
      category,
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      approvalStatus: 'pending',
      variants: variants.length > 0 ? variants : [
        {
          id: `var-${Date.now()}`,
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          title: 'Standard Edition',
          colorName: 'Standard',
          colorHex: '#334155',
          price: parseFloat(basePrice) || 199.00,
          inventoryQty: 25,
          imageUrl: imageUrls[0],
        }
      ],
    };

    // 1. Add to global CartContext (which feeds Admin moderation & Customer store!)
    addProduct(newProductData);
    setCreatedProduct(newProductData);

    // Reset form
    setTitle('');
    setDescription('');
  };

  const handleViewInStorefront = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    if (onNavigateToTab) {
      onNavigateToTab('customer');
    }
  };

  const handleToggleStatus = (orderId: string, vendorName: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, vendorName, newStatus);
    setStatusToast({
      id: orderId,
      message: `Order ${orderId} status updated to "${newStatus}". Synced with Customer Tracking!`,
    });
    setTimeout(() => setStatusToast(null), 3000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* Vendor Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 pt-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Merchant Center</span>
            <span aria-hidden="true">·</span>
            
            {/* Active Store Selector */}
            <div className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md cursor-pointer transition-colors">
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="Lumina Audio Labs">Lumina Audio Labs</option>
                <option value="Vanguard Horology">Vanguard Horology</option>
                <option value="Nordic Craft Collective">Nordic Craft Collective</option>
                <option value="ALL">All Stores (Super Operator)</option>
              </select>
            </div>

            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KYB Verified Merchant</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-1">
            Vendor &amp; Seller Central
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard Analytics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders ({vendorOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'add-product'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stock Matrix ({vendorProducts.length})
          </button>
        </div>
      </div>

      {/* Real-Time Status Toast */}
      {statusToast && (
        <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs shadow-md animate-fade-in border border-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusToast.message}</span>
          </div>
          <button
            onClick={() => {
              setCurrentView('orders');
              if (onNavigateToTab) onNavigateToTab('customer');
            }}
            className="text-amber-400 hover:underline font-bold text-[11px]"
          >
            View Customer Tracking →
          </button>
        </div>
      )}

      {/* Published Notification Banner */}
      {createdProduct && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-950 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-slate-900">
                  Product Submitted: "{createdProduct.title}"
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  Pending Admin Approval
                </span>
              </div>
              <p className="text-slate-600 mt-0.5">
                Saved with {createdProduct.variants.length} variant SKUs to PostgreSQL. It is queued in the <strong>Admin Tower</strong> for catalog verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('admin');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Review in Admin Tower</span>
            </button>
            <button
              onClick={() => handleViewInStorefront(createdProduct.id)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setCreatedProduct(null)}
              className="px-2 py-2 text-slate-500 hover:text-slate-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Dashboard Analytics KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Revenue ({selectedVendor})</span>
              <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>+24.8% vs last month</span>
              </div>
            </div>

            {/* Net Escrow Payout */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Net Escrow Payout (90%)</span>
              <div className="text-2xl font-bold font-display text-emerald-700 tabular-nums">
                ${netEscrowPayout.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500">10% Platform commission deducted</div>
            </div>

            {/* Active Orders Count */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Active Orders ({selectedVendor})</span>
              <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">
                {activeVendorOrders.length} Orders
              </div>
              <div className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Requires packaging / dispatch</span>
              </div>
            </div>

            {/* Product Count */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Catalog Products</span>
              <div className="text-2xl font-bold font-display text-slate-900 tabular-nums">
                {vendorProducts.length} Listings
              </div>
              <div className="text-[11px] text-slate-500">
                {vendorProducts.reduce((sum, p) => sum + p.variants.length, 0)} variant SKUs active
              </div>
            </div>

          </div>

          {/* Low-Stock Alert Callout Banner */}
          {lowStockAlerts.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Immediate Attention: {lowStockAlerts.length} variants are critically low in warehouse stock</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lowStockAlerts.map(({ product, variant }) => (
                  <div key={variant.id} className="p-3 bg-white rounded-lg border border-rose-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{product.title}</div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        SKU: {variant.sku} · Variant: {variant.title}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-rose-700 font-mono block tabular-nums">
                        {variant.inventoryQty} units left
                      </span>
                      <button
                        onClick={() => {
                          variant.inventoryQty += 20;
                          setStatusToast({
                            id: variant.id,
                            message: `Restocked ${variant.sku} with +20 units!`,
                          });
                        }}
                        className="mt-1 px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-slate-800"
                      >
                        +20 Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Orders Preview with Status Actions */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Orders for {selectedVendor}</h3>
                <p className="text-xs text-slate-500">Live multi-vendor orders partitioned to your fulfillment hub</p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <span>View All ({vendorOrders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Customer / Location</th>
                    <th className="py-3 px-4 font-semibold">Package Items</th>
                    <th className="py-3 px-4 font-semibold">Subtotal</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendorOrders.slice(0, 3).map((ord) => {
                    const pkg = ord.vendorPackages.find(
                      (p) => selectedVendor === 'ALL' || p.vendorName.toLowerCase() === selectedVendor.toLowerCase()
                    ) || ord.vendorPackages[0];

                    return (
                      <tr key={ord.id}>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.id}</td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="font-semibold">{ord.customerName}</div>
                          <div className="text-[11px] text-slate-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {pkg.items.map((i) => `${i.product.title} (${i.variant.colorName}) x${i.quantity}`).join(', ')}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                          ${pkg.subtotal.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            pkg.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : pkg.status === 'Shipped'
                              ? 'bg-amber-50 text-amber-800'
                              : pkg.status === 'Packed'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {pkg.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setActiveTab('orders');
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px]"
                          >
                            Manage Status
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MY ORDERS & DISPATCH LOGISTICS (VENDORS ONLY SEE THEIR ORDERS!) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Package className="w-4 h-4 text-amber-500" />
                <span>Vendor Orders &amp; Fulfillment Queue</span>
              </div>
              <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
                Fulfillment for: {selectedVendor}
              </h2>
              <p className="text-xs text-slate-500">
                You only see split packages containing items assigned to your store catalog.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setOrdersFilter('all')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                  ordersFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({vendorOrders.length})
              </button>
              <button
                onClick={() => setOrdersFilter('active')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                  ordersFilter === 'active' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending/In-Transit ({activeVendorOrders.length})
              </button>
              <button
                onClick={() => setOrdersFilter('delivered')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                  ordersFilter === 'delivered' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Delivered ({vendorOrders.filter((o) => {
                  const pkg = o.vendorPackages.find(p => selectedVendor === 'ALL' || p.vendorName.toLowerCase() === selectedVendor.toLowerCase());
                  return pkg?.status === 'Delivered';
                }).length})
              </button>
            </div>
          </div>

          {/* Orders Cards List */}
          {vendorOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No orders for {selectedVendor}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No customer purchases currently contain products from this store. Place an order on the storefront to test live order splitting!
              </p>
            </div>
          ) : (
            vendorOrders
              .filter((ord) => {
                const pkg = ord.vendorPackages.find(
                  (p) => selectedVendor === 'ALL' || p.vendorName.toLowerCase() === selectedVendor.toLowerCase()
                );
                if (ordersFilter === 'active' && pkg?.status === 'Delivered') return false;
                if (ordersFilter === 'delivered' && pkg?.status !== 'Delivered') return false;
                return true;
              })
              .map((ord) => {
                const pkg = ord.vendorPackages.find(
                  (p) => selectedVendor === 'ALL' || p.vendorName.toLowerCase() === selectedVendor.toLowerCase()
                ) || ord.vendorPackages[0];

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5 sm:p-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">{ord.id}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{ord.createdAt}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-semibold text-slate-700">Customer: {ord.customerName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Shipping Address: {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postalCode} ({ord.shippingAddress.phone})
                        </div>
                      </div>

                      {/* Package Total & Courier */}
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-slate-500">Your Package Subtotal</div>
                        <div className="text-lg font-bold font-mono text-slate-900">${pkg.subtotal.toFixed(2)}</div>
                        <div className="text-[11px] text-slate-500">Carrier: {pkg.courier} · <span className="font-mono font-semibold">{pkg.trackingNumber}</span></div>
                      </div>
                    </div>

                    {/* Status Toggles: Pending -> Packed -> Shipped -> Delivered */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Update Package Dispatch Status:
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Current: <strong className="text-slate-900">{pkg.status}</strong> ({pkg.statusUpdatedAt})
                        </span>
                      </div>

                      {/* Interactive 4-Way Toggle Buttons */}
                      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                        {(['Ordered', 'Packed', 'Shipped', 'Delivered'] as OrderStatus[]).map((st) => {
                          const isActive = pkg.status === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleToggleStatus(ord.id, pkg.vendorName, st)}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                                isActive
                                  ? st === 'Delivered'
                                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                    : st === 'Shipped'
                                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                                    : st === 'Packed'
                                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-900 text-white font-bold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                            >
                              {isActive && <Check className="w-3 h-3 stroke-[2.5]" />}
                              <span>{st === 'Ordered' ? 'Pending' : st}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items belonging to this vendor */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Assigned Package Items ({pkg.items.length})
                      </span>
                      {pkg.items.map((item) => (
                        <div
                          key={item.variant.id}
                          className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 bg-white"
                        >
                          <img
                            src={item.variant.imageUrl || item.product.primaryImage}
                            alt={item.product.title}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">
                              {item.product.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              SKU: <span className="font-mono text-slate-700">{item.variant.sku}</span> · Edition: {item.variant.title} · Color: {item.variant.colorName}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs text-slate-500">Qty: <strong>{item.quantity}</strong></span>
                            <span className="font-mono font-bold text-slate-900 block text-xs">
                              ${(item.variant.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Fulfillment SLA: Dispatched within 24h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Packing slip for ${ord.id} sent to warehouse thermal printer.`)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
          )}

        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT FORM */}
      {activeTab === 'add-product' && (
        <form onSubmit={handleSubmitProduct} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                <Store className="w-3.5 h-3.5" />
                <span>Prisma Product Creator</span>
              </div>
              <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">
                Create &amp; Publish New Marketplace Listing
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sample Autofill:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('keyboard')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Carbon Keyboard Demo
              </button>
            </div>
          </div>

          {/* Section 1: Core Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900">
              1. Product Identification &amp; Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Aether Carbon HHKB Mechanical Keyboard"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category Department *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                >
                  <option value="Audio Hardware">Audio Hardware</option>
                  <option value="Watches & Precision">Watches & Precision</option>
                  <option value="Interior & Lighting">Interior & Lighting</option>
                  <option value="Mechanical Keyboards">Mechanical Keyboards</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Marketing Description &amp; Specifications</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed material specifications, acoustics, or horological details..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Shipping */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold font-display text-slate-900">
              2. Baseline Pricing &amp; Logistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Base Selling Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Compare-At Strike Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Promised Dispatch SLA</label>
                <input
                  type="text"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media & Images */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold font-display text-slate-900">
              3. Commercial Photography &amp; Image Preview
            </h3>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste high-res image URL (e.g. /src/assets/images/...)"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Add Image
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 group">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      Primary
                    </span>
                  )}
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Dynamic Variants Matrix */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900">
                  4. Variant SKUs Generation (Color / Size / Price)
                </h3>
                <p className="text-xs text-slate-500">Each variant gets independent stock tracking and SKU</p>
              </div>
            </div>

            {/* Existing Variants Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">SKU</th>
                    <th className="py-2.5 px-3 font-semibold">Color / Edition</th>
                    <th className="py-2.5 px-3 font-semibold">Hex</th>
                    <th className="py-2.5 px-3 font-semibold">Price</th>
                    <th className="py-2.5 px-3 font-semibold">Stock Qty</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((v) => (
                    <tr key={v.id}>
                      <td className="py-2.5 px-3 font-mono font-bold">{v.sku}</td>
                      <td className="py-2.5 px-3">{v.title} ({v.colorName})</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: v.colorHex }} />
                          <span className="font-mono text-slate-500 text-[11px]">{v.colorHex}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">${v.price.toFixed(2)}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${v.inventoryQty <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100'}`}>
                          {v.inventoryQty}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(v.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Add Variant Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Add Another Variant SKU</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <input
                  type="text"
                  placeholder="Edition (e.g. Titanium)"
                  value={newVariantTitle}
                  onChange={(e) => setNewVariantTitle(e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Color Name"
                  value={newVariantColorName}
                  onChange={(e) => setNewVariantColorName(e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2">
                  <input
                    type="color"
                    value={newVariantHex}
                    onChange={(e) => setNewVariantHex(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                  <span className="font-mono text-xs text-slate-500">{newVariantHex}</span>
                </div>
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={newVariantPrice}
                  onChange={(e) => setNewVariantPrice(e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Stock Qty"
                    value={newVariantQty}
                    onChange={(e) => setNewVariantQty(e.target.value)}
                    className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Saving triggers PostgreSQL transaction &amp; syncs to instant search catalog.
            </span>
            <button
              type="submit"
              className="py-3 px-6 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Listing to Marketplace</span>
            </button>
          </div>

        </form>
      )}

      {/* TAB 4: STOCK & INVENTORY MATRIX */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Master Warehouse Stock Matrix ({selectedVendor})
              </h3>
              <p className="text-xs text-slate-500">
                Real-time variant inventory counts synced with customer storefront add-to-cart controls
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono">
                {vendorProducts.length} Products Active
              </span>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Variant Title</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Unit Price</th>
                  <th className="py-3 px-4 font-semibold">Warehouse Stock</th>
                  <th className="py-3 px-4 font-semibold text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendorProducts.flatMap((prod) =>
                  prod.variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={variant.imageUrl || prod.primaryImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-xs">{prod.title}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{prod.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: variant.colorHex }} />
                          <span className="font-medium text-slate-700">{variant.title}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{variant.sku}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">${variant.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                          variant.inventoryQty <= 5
                            ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          {variant.inventoryQty} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              variant.inventoryQty += 10;
                              setStatusToast({
                                id: variant.id,
                                message: `Restocked ${variant.sku} with +10 units!`,
                              });
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px]"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => {
                              variant.inventoryQty += 50;
                              setStatusToast({
                                id: variant.id,
                                message: `Restocked ${variant.sku} with +50 units!`,
                              });
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-[11px]"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

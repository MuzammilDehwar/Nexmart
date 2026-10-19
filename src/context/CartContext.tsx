import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductData, ProductVariantData } from '../components/nextjs14/ProductCard';
import { SAMPLE_NEXTJS_PRODUCTS } from '../components/nextjs14/CustomerHomepage';

export type OrderStatus = 'Ordered' | 'Packed' | 'Shipped' | 'Delivered';

export interface CartItem {
  product: ProductData;
  variant: ProductVariantData;
  quantity: number;
}

export interface VendorPackage {
  vendorName: string;
  vendorSlug: string;
  items: CartItem[];
  subtotal: number;
  trackingNumber: string;
  courier: string;
  estimatedDelivery: string;
  status: OrderStatus;
  statusUpdatedAt: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'stripe' | 'cod' | 'bnpl';
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  overallStatus: OrderStatus;
  vendorPackages: VendorPackage[];
}

interface CartContextType {
  products: ProductData[];
  addProduct: (newProduct: ProductData) => void;
  cart: CartItem[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string, delta: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;
  // Navigation helper for interactive demo
  currentView: 'home' | 'product-detail' | 'checkout' | 'order-success' | 'orders' | 'wishlist';
  setCurrentView: (view: 'home' | 'product-detail' | 'checkout' | 'order-success' | 'orders' | 'wishlist') => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  lastCompletedOrderNumber: string | null;
  setLastCompletedOrderNumber: (num: string | null) => void;
  // Global tab navigation helper for vendor -> storefront jump
  onNavigateToTab?: (tab: 'mvp' | 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema') => void;
  setOnNavigateToTab: (fn: (tab: 'mvp' | 'blueprint' | 'customer' | 'vendor' | 'admin' | 'schema') => void) => void;
  // Product Moderation & Governance
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string, reason?: string) => void;
  // Marketplace Commission & Platform GMV
  marketplaceCommissionRate: number;
  setMarketplaceCommissionRate: (rate: number) => void;
  platformGmv: number;
  platformCommissionEarned: number;
  vendorPayoutsTotal: number;
  // Order Management
  orders: Order[];
  placeOrder: (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: 'stripe' | 'cod' | 'bnpl'
  ) => Order;
  updateOrderStatus: (orderId: string, vendorName: string, newStatus: OrderStatus) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Demo-only, browser-local persistence. This is not a secure database or a cross-device sync layer.
const STORAGE_KEYS = {
  cart: 'nexmart.demo.cart.v1',
  products: 'nexmart.demo.products.v1',
  orders: 'nexmart.demo.orders.v1',
  lastOrder: 'nexmart.demo.lastOrder.v1',
} as const;

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[Nexmart] Could not read local demo data for ${key}. Using defaults.`, error);
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage may be disabled or full; the in-memory app should still work.
    console.warn(`[Nexmart] Could not save local demo data for ${key}.`, error);
  }
}

// Initial Seed Orders so "My Orders" has rich data out of the box
const INITIAL_ORDERS: Order[] = [
  {
    id: 'NXM-2026-9104',
    createdAt: 'Oct 17, 2026 · 14:22 PM',
    customerName: 'Julian Vance',
    customerEmail: 'julian.vance@example.com',
    shippingAddress: {
      fullName: 'Julian Vance',
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States',
      phone: '+1 (415) 890-2194',
    },
    paymentMethod: 'stripe',
    items: [
      {
        product: SAMPLE_NEXTJS_PRODUCTS[0], // Lumina headphones
        variant: SAMPLE_NEXTJS_PRODUCTS[0].variants[0],
        quantity: 1,
      },
      {
        product: SAMPLE_NEXTJS_PRODUCTS[2], // Nordic lamp
        variant: SAMPLE_NEXTJS_PRODUCTS[2].variants[0],
        quantity: 1,
      },
    ],
    subtotal: 559.00,
    tax: 44.72,
    shipping: 0,
    total: 603.72,
    overallStatus: 'Shipped',
    vendorPackages: [
      {
        vendorName: 'Lumina Audio Labs',
        vendorSlug: 'lumina-audio',
        items: [
          {
            product: SAMPLE_NEXTJS_PRODUCTS[0],
            variant: SAMPLE_NEXTJS_PRODUCTS[0].variants[0],
            quantity: 1,
          },
        ],
        subtotal: 349.00,
        trackingNumber: 'FDX-882194-EX',
        courier: 'FedEx Priority',
        estimatedDelivery: 'Tomorrow, Oct 19 by 8:00 PM',
        status: 'Shipped',
        statusUpdatedAt: 'Today at 09:14 AM',
      },
      {
        vendorName: 'Nordic Craft Collective',
        vendorSlug: 'nordic-craft',
        items: [
          {
            product: SAMPLE_NEXTJS_PRODUCTS[2],
            variant: SAMPLE_NEXTJS_PRODUCTS[2].variants[0],
            quantity: 1,
          },
        ],
        subtotal: 210.00,
        trackingNumber: 'DHL-710492-US',
        courier: 'DHL Express',
        estimatedDelivery: 'Delivered Oct 18',
        status: 'Delivered',
        statusUpdatedAt: 'Yesterday at 16:45 PM',
      },
    ],
  },
  {
    id: 'NXM-2026-8319',
    createdAt: 'Oct 14, 2026 · 10:15 AM',
    customerName: 'Julian Vance',
    customerEmail: 'julian.vance@example.com',
    shippingAddress: {
      fullName: 'Julian Vance',
      street: '742 Montgomery Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States',
      phone: '+1 (415) 890-2194',
    },
    paymentMethod: 'stripe',
    items: [
      {
        product: SAMPLE_NEXTJS_PRODUCTS[1], // Vanguard watch
        variant: SAMPLE_NEXTJS_PRODUCTS[1].variants[0],
        quantity: 1,
      },
    ],
    subtotal: 880.00,
    tax: 70.40,
    shipping: 0,
    total: 950.40,
    overallStatus: 'Delivered',
    vendorPackages: [
      {
        vendorName: 'Vanguard Horology',
        vendorSlug: 'vanguard-horology',
        items: [
          {
            product: SAMPLE_NEXTJS_PRODUCTS[1],
            variant: SAMPLE_NEXTJS_PRODUCTS[1].variants[0],
            quantity: 1,
          },
        ],
        subtotal: 880.00,
        trackingNumber: 'UPS-193481-INS',
        courier: 'UPS Insured Direct',
        estimatedDelivery: 'Delivered Oct 16',
        status: 'Delivered',
        statusUpdatedAt: 'Oct 16 at 11:20 AM',
      },
    ],
  },
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductData[]>(() => readStoredValue(STORAGE_KEYS.products, SAMPLE_NEXTJS_PRODUCTS));
  const [navigateTabFn, setNavigateTabFn] = useState<((tab: any) => void) | undefined>(undefined);

  // Restore demo cart if available; otherwise retain the original sample cart for first-time visitors.
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = readStoredValue<CartItem[] | null>(STORAGE_KEYS.cart, null);
    if (Array.isArray(storedCart)) return storedCart.filter((item) => item && item.product && item.variant && Number.isFinite(item.quantity) && item.quantity > 0);
    const p1 = SAMPLE_NEXTJS_PRODUCTS[0];
    const v1 = p1.variants[0];
    return [{ product: p1, variant: v1, quantity: 1 }];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = readStoredValue<Order[] | null>(STORAGE_KEYS.orders, null);
    return Array.isArray(storedOrders) ? storedOrders : INITIAL_ORDERS;
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product-detail' | 'checkout' | 'order-success' | 'orders' | 'wishlist'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-001');
  const [lastCompletedOrderNumber, setLastCompletedOrderNumber] = useState<string | null>(() => readStoredValue<string | null>(STORAGE_KEYS.lastOrder, null));
  const [marketplaceCommissionRate, setMarketplaceCommissionRate] = useState<number>(0.05); // 5% marketplace commission

  // Persist only demo storefront state on this browser/device. Never store credentials or payment details here.
  useEffect(() => writeStoredValue(STORAGE_KEYS.cart, cart), [cart]);
  useEffect(() => writeStoredValue(STORAGE_KEYS.products, products), [products]);
  useEffect(() => writeStoredValue(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(() => writeStoredValue(STORAGE_KEYS.lastOrder, lastCompletedOrderNumber), [lastCompletedOrderNumber]);

  const addProduct = (newProduct: ProductData) => {
    // New products default to pending review unless pre-approved
    const productWithStatus: ProductData = {
      ...newProduct,
      approvalStatus: newProduct.approvalStatus || 'pending',
    };
    setProducts((prev) => [productWithStatus, ...prev]);
  };

  const approveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'approved', rejectionReason: undefined } : p))
    );
  };

  const rejectProduct = (productId: string, reason: string = 'Violates platform catalog guidelines') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'rejected', rejectionReason: reason } : p))
    );
  };

  // Dynamic GMV calculations across all platform orders + base volume
  const ordersTotalGross = orders.reduce((sum, ord) => sum + ord.total, 0);
  const baseHistoricalGmv = 148920.00;
  const platformGmv = Math.round((baseHistoricalGmv + ordersTotalGross) * 100) / 100;
  const platformCommissionEarned = Math.round((platformGmv * marketplaceCommissionRate) * 100) / 100;
  const vendorPayoutsTotal = Math.round((platformGmv - platformCommissionEarned) * 100) / 100;

  const addToCart = (productId: string, variantId: string, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === productId && item.variant.id === variant.id
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, variant, quantity }];
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, variantId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.variant.id === variantId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant.id === variantId))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.08 * 100) / 100; // 8% estimated tax
  const cartShipping = cartSubtotal > 150 || cartSubtotal === 0 ? 0 : 15.0; // Free shipping over $150
  const cartTotal = cartSubtotal + cartTax + cartShipping;

  // Place order from checkout
  const placeOrder = (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: 'stripe' | 'cod' | 'bnpl'
  ): Order => {
    const newOrderId = `NXM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Group items by vendor to create independent vendor packages
    const vendorMap: { [storeName: string]: CartItem[] } = {};
    cart.forEach((item) => {
      const vName = item.product.storeName;
      if (!vendorMap[vName]) vendorMap[vName] = [];
      vendorMap[vName].push(item);
    });

    const vendorPackages: VendorPackage[] = Object.entries(vendorMap).map(([vName, items], index) => {
      const pkgSubtotal = items.reduce((acc, i) => acc + i.variant.price * i.quantity, 0);
      const trackingSuffix = Math.floor(100000 + Math.random() * 900000);
      const courier = index % 2 === 0 ? 'FedEx Priority Express' : 'DHL Express Carrier';
      const estDays = index === 0 ? 'Tomorrow by 7:00 PM' : '2-3 Business Days';

      return {
        vendorName: vName,
        vendorSlug: items[0]?.product.storeSlug || vName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        items,
        subtotal: pkgSubtotal,
        trackingNumber: `${index % 2 === 0 ? 'FDX' : 'DHL'}-${trackingSuffix}`,
        courier,
        estimatedDelivery: estDays,
        status: 'Ordered',
        statusUpdatedAt: 'Just now',
      };
    });

    const newOrder: Order = {
      id: newOrderId,
      createdAt: dateFormatted,
      customerName: shippingAddress.fullName || 'Julian Vance',
      customerEmail: 'julian.vance@example.com',
      shippingAddress,
      paymentMethod,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      shipping: cartShipping,
      total: cartTotal,
      overallStatus: 'Ordered',
      vendorPackages,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrderNumber(newOrderId);
    clearCart();

    return newOrder;
  };

  // Vendor or platform status update
  const updateOrderStatus = (orderId: string, vendorName: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedPackages = ord.vendorPackages.map((pkg) => {
          if (vendorName === 'ALL' || pkg.vendorName.toLowerCase() === vendorName.toLowerCase()) {
            return {
              ...pkg,
              status: newStatus,
              statusUpdatedAt: 'Updated just now',
            };
          }
          return pkg;
        });

        // Determine overall order status based on packages
        const allDelivered = updatedPackages.every((p) => p.status === 'Delivered');
        const anyShipped = updatedPackages.some((p) => p.status === 'Shipped');
        const anyPacked = updatedPackages.some((p) => p.status === 'Packed');

        let nextOverall: OrderStatus = 'Ordered';
        if (allDelivered) nextOverall = 'Delivered';
        else if (anyShipped) nextOverall = 'Shipped';
        else if (anyPacked) nextOverall = 'Packed';

        return {
          ...ord,
          overallStatus: nextOverall,
          vendorPackages: updatedPackages,
        };
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProduct,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartTotal,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        lastCompletedOrderNumber,
        setLastCompletedOrderNumber,
        onNavigateToTab: navigateTabFn,
        setOnNavigateToTab: setNavigateTabFn,
        orders,
        placeOrder,
        updateOrderStatus,
        approveProduct,
        rejectProduct,
        marketplaceCommissionRate,
        setMarketplaceCommissionRate,
        platformGmv,
        platformCommissionEarned,
        vendorPayoutsTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

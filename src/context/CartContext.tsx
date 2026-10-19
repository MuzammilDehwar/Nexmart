import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductData, ProductVariantData } from '../components/nextjs14/ProductCard';
import { SAMPLE_NEXTJS_PRODUCTS } from '../components/nextjs14/CustomerHomepage';

export interface CartItem {
  product: ProductData;
  variant: ProductVariantData;
  quantity: number;
}

interface CartContextType {
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
  currentView: 'home' | 'product-detail' | 'checkout' | 'order-success';
  setCurrentView: (view: 'home' | 'product-detail' | 'checkout' | 'order-success') => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  lastCompletedOrderNumber: string | null;
  setLastCompletedOrderNumber: (num: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with 1 item for immediate interactive delight
  const [cart, setCart] = useState<CartItem[]>(() => {
    const p1 = SAMPLE_NEXTJS_PRODUCTS[0];
    const v1 = p1.variants[0];
    return [{ product: p1, variant: v1, quantity: 1 }];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product-detail' | 'checkout' | 'order-success'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-001');
  const [lastCompletedOrderNumber, setLastCompletedOrderNumber] = useState<string | null>(null);

  const addToCart = (productId: string, variantId: string, quantity: number = 1) => {
    const product = SAMPLE_NEXTJS_PRODUCTS.find((p) => p.id === productId);
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

  return (
    <CartContext.Provider
      value={{
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

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ProductData } from './ProductCard';

const STORAGE_KEY = 'nexmart_wishlist_v1';
const UPDATED_EVENT = 'nexmart:wishlist-updated';

function readIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}
function writeIds(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
    window.dispatchEvent(new Event(UPDATED_EVENT));
  } catch {
    // Keep the current page usable when browser storage is unavailable.
  }
}

const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const WishlistPage: React.FC = () => {
  const { products, addToCart, setCurrentView } = useCart();
  const [ids, setIds] = useState<string[]>(readIds);

  useEffect(() => {
    const sync = () => setIds(readIds());
    window.addEventListener(UPDATED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(UPDATED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const savedProducts = useMemo(() => {
    const lookup = new Map<string, ProductData>(products.map((product) => [product.id, product]));
    return ids.map((id) => lookup.get(id)).filter((product): product is ProductData => Boolean(product));
  }, [ids, products]);

  const remove = (id: string) => {
    const next = ids.filter((savedId) => savedId !== id);
    writeIds(next);
    setIds(next);
  };

  return (
    <section className="min-h-[560px] bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => setCurrentView('home')} className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </button>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-rose-600"><Heart className="h-4 w-4 fill-rose-500" /> Your collection</div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Wishlist</h1>
            <p className="mt-2 text-sm text-slate-500">Your saved finds, ready whenever you are.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">{savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'}</span>
        </div>

        {savedProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><Heart className="h-8 w-8" /></div>
            <h2 className="text-lg font-bold text-slate-900">Your wishlist is waiting</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Tap the heart on any product to save it here. Your list is stored in this browser on this device.</p>
            <button onClick={() => setCurrentView('home')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"><ShoppingBag className="h-4 w-4" /> Explore products</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map((product) => {
              const variant = product.variants[0];
              const image = variant?.imageUrl || product.primaryImage;
              const price = variant?.price ?? product.basePrice;
              return (
                <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <img src={image} alt={product.title} loading="lazy" className="h-full w-full object-cover" />
                    <button onClick={() => remove(product.id)} aria-label={`Remove ${product.title} from wishlist`} title="Remove from wishlist" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-rose-600 shadow-sm hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.brand}</p>
                    <h2 className="mt-1 line-clamp-2 min-h-12 text-sm font-bold leading-6 text-slate-900">{product.title}</h2>
                    <div className="mt-3 flex items-center justify-between gap-3"><span className="text-lg font-extrabold text-slate-950">{money(price)}</span><span className="text-xs text-slate-500">★ {product.ratingAverage.toFixed(1)} ({product.ratingCount})</span></div>
                    <button disabled={!variant || variant.inventoryQty < 1} onClick={() => variant && addToCart(product.id, variant.id)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200"><ShoppingCart className="h-4 w-4" /> {variant && variant.inventoryQty > 0 ? 'Add to cart' : 'Out of stock'}</button>
                    <button onClick={() => remove(product.id)} className="mt-2 w-full rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-rose-600">Remove from wishlist</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <p className="mt-6 text-xs text-slate-400">Demo mode: wishlist is saved locally in this browser and does not sync across devices.</p>
      </div>
    </section>
  );
};

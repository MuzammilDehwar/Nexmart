import { ProductData } from '../components/nextjs14/ProductCard';

export const SAMPLE_NEXTJS_PRODUCTS: ProductData[] = [
  {
    id: 'prod-001',
    title: 'Aura Sound Pro Wireless Over-Ear Active Noise Cancelling Headphones',
    slug: 'aura-sound-pro-wireless-headphones',
    brand: 'Lumina Audio Labs',
    storeName: 'Lumina Audio Labs',
    storeSlug: 'lumina-audio',
    basePrice: 349.00,
    compareAtPrice: 399.00,
    ratingAverage: 4.9,
    ratingCount: 312,
    primaryImage: '/src/assets/images/product_headphones_studio_1792380849129.jpg',
    deliveryDays: 'Tomorrow, Free Express',
    category: 'Audio Hardware',
    categorySlug: 'audio-hardware',
    approvalStatus: 'approved',
    variants: [
      {
        id: 'var-001',
        sku: 'AUR-GRY-01',
        title: 'Space Gray',
        colorName: 'Space Gray',
        colorHex: '#475569',
        price: 349.00,
        inventoryQty: 42,
        imageUrl: '/src/assets/images/product_headphones_studio_1792380849129.jpg'
      },
      {
        id: 'var-002',
        sku: 'AUR-BLK-02',
        title: 'Midnight Obsidian',
        colorName: 'Midnight',
        colorHex: '#0f172a',
        price: 369.00,
        inventoryQty: 3,
        imageUrl: '/src/assets/images/product_headphones_studio_1792380849129.jpg'
      }
    ]
  },
  {
    id: 'prod-002',
    title: 'Chronos Horizon Titanium Automatic Chronograph Wristwatch',
    slug: 'chronos-horizon-titanium-watch',
    brand: 'Vanguard Horology',
    storeName: 'Vanguard Horology',
    storeSlug: 'vanguard-horology',
    basePrice: 880.00,
    compareAtPrice: 950.00,
    ratingAverage: 5.0,
    ratingCount: 88,
    primaryImage: '/src/assets/images/product_mechanical_watch_1792380849996.jpg',
    deliveryDays: '2-Day Priority Insured',
    category: 'Watches & Precision',
    categorySlug: 'watches-precision',
    approvalStatus: 'approved',
    variants: [
      {
        id: 'var-003',
        sku: 'CHR-TIT-01',
        title: 'Brushed Titanium',
        colorName: 'Brushed Titanium',
        colorHex: '#94a3b8',
        price: 880.00,
        inventoryQty: 14,
        imageUrl: '/src/assets/images/product_mechanical_watch_1792380849996.jpg'
      },
      {
        id: 'var-004',
        sku: 'CHR-DLC-02',
        title: 'Diamond-Like Carbon (DLC)',
        colorName: 'Matte DLC',
        colorHex: '#1e293b',
        price: 920.00,
        inventoryQty: 2,
        imageUrl: '/src/assets/images/product_mechanical_watch_1792380849996.jpg'
      }
    ]
  },
  {
    id: 'prod-003',
    title: 'Hygge Arch Smart Ambient Desk Luminaire with Circadian Sync',
    slug: 'hygge-arch-smart-desk-lamp',
    brand: 'Nordic Craft Collective',
    storeName: 'Nordic Craft Collective',
    storeSlug: 'nordic-craft',
    basePrice: 210.00,
    compareAtPrice: 240.00,
    ratingAverage: 4.8,
    ratingCount: 154,
    primaryImage: '/src/assets/images/product_smart_lamp_1792380850295.jpg',
    deliveryDays: 'Standard 2-3 Days',
    category: 'Interior & Lighting',
    categorySlug: 'interior-lighting',
    approvalStatus: 'approved',
    variants: [
      {
        id: 'var-005',
        sku: 'HYG-BRS-01',
        title: 'Satin Brass',
        colorName: 'Satin Brass',
        colorHex: '#d97706',
        price: 210.00,
        inventoryQty: 63,
        imageUrl: '/src/assets/images/product_smart_lamp_1792380850295.jpg'
      },
      {
        id: 'var-006',
        sku: 'HYG-BLK-02',
        title: 'Matte Charcoal',
        colorName: 'Matte Charcoal',
        colorHex: '#334155',
        price: 195.00,
        inventoryQty: 19,
        imageUrl: '/src/assets/images/product_smart_lamp_1792380850295.jpg'
      }
    ]
  },
  {
    id: 'prod-004',
    title: 'Aether Carbon 75% Custom Mechanical Keyboard with Lubed Gateron Oil Kings',
    slug: 'aether-carbon-75-mechanical-keyboard',
    brand: 'Aether Keyboards',
    storeName: 'Aether Keyboards',
    storeSlug: 'aether-keyboards',
    basePrice: 220.00,
    compareAtPrice: 260.00,
    ratingAverage: 5.0,
    ratingCount: 1,
    primaryImage: '/src/assets/images/product_headphones_studio_1792380849129.jpg',
    deliveryDays: 'Tomorrow, Free Express',
    category: 'Electronics & Audio',
    categorySlug: 'electronics',
    approvalStatus: 'pending',
    variants: [
      {
        id: 'var-007',
        sku: 'AET-CRB-01',
        title: 'Forged Carbon / Dark Slate',
        colorName: 'Forged Carbon',
        colorHex: '#1e293b',
        price: 220.00,
        inventoryQty: 15,
        imageUrl: '/src/assets/images/product_headphones_studio_1792380849129.jpg'
      }
    ]
  }
];

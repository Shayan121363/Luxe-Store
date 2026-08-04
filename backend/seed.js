const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for travel, work, and daily use.',
    price: 249.99,
    originalPrice: 349.99,
    category: 'Electronics',
    brand: 'SoundElite',
    stock: 45,
    featured: true,
    rating: 4.7,
    numReviews: 128,
    tags: ['bestseller', 'wireless', 'audio'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Swiss-movement timepiece with genuine leather strap and sapphire crystal glass. Water-resistant up to 50 meters. A timeless piece for every occasion.',
    price: 189.00,
    originalPrice: 250.00,
    category: 'Clothing',
    brand: 'Chrono Luxe',
    stock: 22,
    featured: true,
    rating: 4.9,
    numReviews: 64,
    tags: ['luxury', 'watch', 'leather'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Smart Fitness Tracker Pro',
    description: 'Advanced health monitoring with heart rate, SpO2, GPS, sleep tracking and 14-day battery. Waterproof with 50+ workout modes.',
    price: 129.99,
    category: 'Electronics',
    brand: 'FitTech',
    stock: 67,
    featured: true,
    rating: 4.5,
    numReviews: 203,
    tags: ['fitness', 'health', 'wearable'],
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Tenkeyless mechanical keyboard with Cherry MX switches, per-key RGB lighting, aluminum frame, and PBT double-shot keycaps.',
    price: 159.00,
    originalPrice: 199.00,
    category: 'Electronics',
    brand: 'KeyForge',
    stock: 30,
    featured: false,
    rating: 4.8,
    numReviews: 87,
    tags: ['gaming', 'mechanical', 'rgb'],
    images: [
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Luxury Scented Candle Set',
    description: 'Set of 3 hand-poured soy wax candles with natural cotton wicks. Available in Sandalwood, Bergamot & Jasmine fragrances. Burns for 50+ hours each.',
    price: 68.00,
    category: 'Home & Garden',
    brand: 'Lumière',
    stock: 150,
    featured: false,
    rating: 4.6,
    numReviews: 45,
    tags: ['home', 'candles', 'gift'],
    images: [
      'https://images.unsplash.com/photo-1602607144303-da5f3e5d4a24?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Premium Yoga Mat',
    description: 'Extra-thick 6mm eco-friendly TPE yoga mat with alignment lines, non-slip surface, and included carry strap. Perfect for all yoga styles.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Sports',
    brand: 'ZenFlow',
    stock: 80,
    featured: false,
    rating: 4.4,
    numReviews: 112,
    tags: ['yoga', 'fitness', 'eco'],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Smart Indoor Herb Garden',
    description: 'Grow fresh herbs indoors year-round with this smart hydroponic system. Includes energy-efficient LED grow lights and automatic watering.',
    price: 129.99,
    category: 'Home & Garden',
    brand: 'EcoGrow',
    stock: 25,
    featured: true,
    rating: 4.8,
    numReviews: 92,
    tags: ['home', 'garden', 'smart'],
    images: [
      'https://images.unsplash.com/photo-1581084324492-c8076f130f86?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Educational Building Blocks Set',
    description: '500-piece colorful wooden building blocks set for children. Helps develop motor skills, creativity, and spatial awareness. Made from sustainable wood.',
    price: 45.00,
    category: 'Toys',
    brand: 'PlaySmart',
    stock: 120,
    featured: false,
    rating: 4.9,
    numReviews: 215,
    tags: ['toys', 'kids', 'educational'],
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Merino Wool Sweater',
    description: 'Premium 100% merino wool crewneck sweater. Naturally temperature-regulating, soft against skin, and odor-resistant. Available in 8 colors.',
    price: 145.00,
    originalPrice: 180.00,
    category: 'Clothing',
    brand: 'WoolCo',
    stock: 55,
    featured: true,
    rating: 4.8,
    numReviews: 76,
    tags: ['wool', 'sustainable', 'fashion'],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound with 24-hour playtime, IPX7 waterproofing, and built-in powerbank. The perfect outdoor companion.',
    price: 99.00,
    originalPrice: 129.00,
    category: 'Electronics',
    brand: 'SoundElite',
    stock: 90,
    featured: false,
    rating: 4.3,
    numReviews: 167,
    tags: ['speaker', 'outdoor', 'wireless'],
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'The Art of Design - Coffee Table Book',
    description: 'A stunning 400-page visual journey through modern design history. Features 600+ full-color photographs and interviews with leading designers worldwide.',
    price: 58.00,
    category: 'Books',
    brand: 'Phaidon Press',
    stock: 200,
    featured: false,
    rating: 4.9,
    numReviews: 29,
    tags: ['design', 'art', 'gift'],
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Natural Face Serum Vitamin C',
    description: '20% Vitamin C serum with hyaluronic acid and niacinamide. Brightens skin, reduces dark spots, and boosts collagen. Dermatologist tested.',
    price: 48.00,
    category: 'Beauty',
    brand: 'GlowLab',
    stock: 120,
    featured: false,
    rating: 4.6,
    numReviews: 234,
    tags: ['skincare', 'vitamin-c', 'natural'],
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated 32oz bottle keeps drinks cold for 24h or hot for 12h. Leak-proof lid, BPA-free, and eco-friendly.',
    price: 34.99,
    category: 'Sports',
    brand: 'HydroMax',
    stock: 300,
    featured: false,
    rating: 4.5,
    numReviews: 445,
    tags: ['eco', 'hydration', 'fitness'],
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Abstract Canvas Art',
    description: 'Beautiful hand-painted abstract canvas to elevate your living space.',
    price: 199.00,
    category: 'Other',
    brand: 'Artisanal',
    stock: 10,
    featured: false,
    rating: 4.8,
    numReviews: 12,
    tags: ['art', 'decor'],
    images: [
      'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&h=600&fit=crop',
    ],
  },
  {
    name: 'Mystery Gift Box',
    description: 'A curated box of assorted luxury items. Perfect for surprises!',
    price: 99.00,
    category: 'Other',
    brand: 'LuxeStore',
    stock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 89,
    tags: ['gift', 'mystery'],
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop',
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Product.deleteMany({});
    console.log('Cleared products');

    // Insert products
    const created = await Product.insertMany(products);
    console.log(`✅ Seeded ${created.length} products`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@luxestore.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@luxestore.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@luxestore.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create test user if not exists
    const testExists = await User.findOne({ email: 'test@example.com' });
    if (!testExists) {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'user',
      });
      console.log('✅ Test user created: test@example.com / test123');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
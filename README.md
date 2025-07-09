# ��️ One-Shot Review - Professional Product Review Platform

A modern, high-performance product review platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Features professional review scoring, modern UI design, and optimized performance for millions of users.

## ✨ Features

- 🚀 **Next.js 14** with App Router for optimal performance
- 💎 **TypeScript** for type safety and better developer experience
- 🎨 **Modern UI Design** with glass morphism effects and smooth animations
- 📊 **Professional Review System** with detailed scoring breakdown
- 🔍 **Advanced Search** with real-time results and debounced queries
- 📱 **Fully Responsive** design optimized for all devices
- ⚡ **Performance Optimized** - 95+ Lighthouse scores across all metrics
- 🛒 **Affiliate Integration** with smart price comparison cards
- ⏰ **Flash Sale Countdown** with real-time updates
- 🌙 **Dark Mode Support** with system preference detection
- 📈 **Analytics Ready** with built-in tracking hooks
- ♿ **Accessibility First** with WCAG 2.1 AA compliance

## 🏗️ Project Structure

```
one-shot-review/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with custom CSS variables
│   ├── layout.tsx         # Root layout with Inter font
│   ├── page.tsx          # Modern homepage with hero section
│   └── products/
│       └── [slug]/
│           └── page.tsx   # Enhanced product detail pages
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   │   └── header.tsx    # Modern header with search modal
│   ├── product/          # Product-specific components
│   │   ├── product-gallery.tsx      # Optimized image gallery
│   │   ├── product-review.tsx       # Professional review display
│   │   ├── review-score.tsx         # Detailed scoring system
│   │   ├── affiliate-links-table.tsx # Modern price comparison cards
│   │   └── flash-sale-countdown.tsx  # Real-time countdown
│   └── ui/               # shadcn/ui base components
│       ├── badge.tsx
│       ├── button.tsx
│       └── card.tsx
├── hooks/                # Custom React hooks
│   └── use-products.ts   # Data fetching with caching & analytics
├── lib/                  # Utilities and data layer
│   ├── data/
│   │   └── products.ts   # Product data with comprehensive types
│   └── utils.ts         # Utility functions
└── styles/              # Additional styles
    └── components.scss  # Component-specific SCSS
```

## 🎯 Key Features & Components

### 🏠 Modern Homepage
- **Hero section** with featured product spotlight
- **Statistics section** showcasing platform credibility
- **Product grid** with hover animations and lazy loading
- **Category browsing** with emoji icons and smooth transitions
- **Newsletter signup** with modern form design

### 🔍 Advanced Header & Search
- **Glass morphism** header design with backdrop blur
- **Real-time search modal** with instant results
- **Dark mode toggle** with smooth transitions
- **Mobile-responsive** hamburger menu
- **Breadcrumb navigation** for better UX

### 📊 Professional Review System
- **Comprehensive scoring** with 6 detailed categories:
  - Design & Build Quality
  - Performance & Speed
  - Camera & Photography
  - Battery Life & Charging
  - Software & Features
  - Value for Money
- **Visual progress bars** with color-coded ratings
- **Professional layout** with author credentials
- **Trust signals** and affiliate disclosures
- **"The Good/The Bad"** structured feedback sections

### 🛒 Smart Affiliate Integration
- **Card-based design** replacing traditional tables
- **Best deal highlighting** with visual indicators
- **Price comparison** with savings calculations
- **Retailer trust badges** and availability status
- **Modern CTAs** with hover effects

### 📱 Mobile-First Design
- **Touch-friendly** interactions with proper spacing
- **Swipe gestures** for image galleries
- **Optimized layouts** for all screen sizes
- **Fast loading** with progressive image loading

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd one-shot-review
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (optimized bundle)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Data Layer & Types

### Enhanced Product Data Structure
```typescript
interface Product {
  id: string
  slug: string
  title: string
  description: string
  images: ProductImage[]
  review: ProductReview
  reviewScore: ReviewScore  // New detailed scoring system
  affiliateLinks: AffiliateLink[]
  category: string
  tags: string[]
  seo: ProductSEO
  flashSale?: FlashSale
  createdAt: Date
  updatedAt: Date
}

interface ReviewScore {
  overall: number
  categories: {
    design: number
    performance: number
    camera: number
    battery: number
    software: number
    value: number
  }
}
```

### Data Functions with Performance Optimization
- `getProducts()` - Fetch all products with caching
- `getProductBySlug(slug)` - Fetch product by slug with SEO data
- `searchProducts(query)` - Debounced search with analytics
- `getProductsByCategory(category)` - Filtered results with pagination
- `getFeaturedProducts()` - Homepage featured products

## 🎨 Modern Design System

### Custom CSS Variables
```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Typography
- **Inter font** for modern, readable text
- **Responsive typography** with fluid scaling
- **Proper contrast ratios** for accessibility

### Color Palette
- **Professional grays** for content hierarchy
- **Accent colors** for CTAs and highlights
- **Semantic colors** for ratings and status indicators

## 📈 Performance Metrics

### Build Output (Optimized)
```
Route (app)                Size     First Load JS
┌ ○ /                     6.91 kB        95.9 kB
└ λ /products/[slug]      5.59 kB         114 kB
```

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## 🔍 SEO & Analytics

### Enhanced SEO Features
- **Dynamic meta tags** with product-specific data
- **JSON-LD structured data** for rich snippets
- **Open Graph** optimization for social sharing
- **Canonical URLs** and proper redirects

### Built-in Analytics
```typescript
// Product view tracking
useProductAnalytics(product.id)

// Search analytics with debouncing
const { results } = useProductSearch(query)

// Conversion tracking
const handleAffiliateClick = (link) => {
  analytics.track('affiliate_click', {
    product_id: product.id,
    retailer: link.shopName,
    price: link.price
  })
}
```

## 🛒 E-commerce Features

### Modern Affiliate System
- **Smart price comparison** with real-time updates
- **Best deal algorithms** with savings calculations
- **Voucher code integration** with expiry tracking
- **Retailer reputation** scoring and trust indicators

### Flash Sale System
- **Real-time countdown** with WebSocket support
- **Dynamic pricing** with discount calculations
- **Urgency indicators** for conversion optimization
- **Automatic expiration** handling

## 🚀 Deployment & Scaling

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Performance Optimizations
- **Static generation** for product pages
- **Image optimization** with Next.js Image
- **Code splitting** with dynamic imports
- **CDN-ready** with proper cache headers

### Scaling Considerations
- **Database integration** ready (replace mock data)
- **Redis caching** support for high traffic
- **CDN optimization** for global distribution
- **Monitoring hooks** for performance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
- [Inter Font](https://rsms.me/inter/) - A typeface for user interfaces

---

**Built with ❤️ for professional product reviewers and affiliate marketers** 
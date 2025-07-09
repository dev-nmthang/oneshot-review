import { Header } from '@/components/layout/header'
import { AffiliateLinksTable } from '@/components/product/affiliate-links-table'
import { FlashSaleCountdown } from '@/components/product/flash-sale-countdown'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductReview } from '@/components/product/product-review'
import { UniversalReviewScore } from '@/components/product/review-score'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { getProduct, getProducts } from '@/lib/data/products'
import { Award, Battery, Camera, DollarSign, Palette, Shield, Smartphone, TrendingUp, Zap } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// Aggressive ISR: Revalidate every 60 seconds for better performance
export const revalidate = 60

// Generate static params for popular products only (not all millions)
export async function generateStaticParams() {
  try {
    // Only pre-generate if there are products in the database
    const { products } = await getProducts(1, 10) // Reduced to 10 for faster builds
    
    if (products.length === 0) {
      // Return empty array if no products in database
      return []
    }
    
    return products.map((product) => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Return empty array on error to prevent build failures
    return []
  }
}

// Enable dynamic rendering for products not in generateStaticParams
export const dynamicParams = true

interface ProductPageProps {
  params: {
    slug: string
  }
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.slug)
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      }
    }

    return {
      title: product.seo?.meta_title || `${product.title} Review - Complete Analysis & Best Deals`,
      description: product.seo?.meta_description || product.description,
      keywords: product.seo?.keywords?.join(', '),
      alternates: {
        canonical: product.seo?.canonical_url,
      },
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images.map(img => ({ url: img.url })),
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.description,
        images: product.images.map(img => img.url),
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product Review',
      description: 'Product review and analysis'
    }
  }
}

/**
 * Generate structured data for rich snippets
 */
function generateStructuredData(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image_urls,
    category: product.category,
    brand: product.tags?.[0] || 'Unknown',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.review_rating,
      reviewCount: product.review_total_reviews,
      bestRating: 5,
      worstRating: 1
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: product.review_rating,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        '@type': 'Organization',
        name: 'TechReview Pro'
      },
      reviewBody: product.review_content
    },
    offers: product.affiliate_links?.map((link: any) => ({
      '@type': 'Offer',
      price: (link.price / 100).toString(),
      priceCurrency: 'USD',
      availability: link.availability === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: link.shop_name
      },
      url: link.affiliate_url
    })) || []
  }
}

// Loading fallback components
function ProductGalleryFallback() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AffiliateTableFallback() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Product detail page component with optimized loading
 */
export default async function ProductPage({ params }: ProductPageProps) {
  let product
  
  try {
    product = await getProduct(params.slug)
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }

  if (!product) {
    notFound()
  }

  const isFlashSaleActive = product.flash_sale_end && new Date(product.flash_sale_end) > new Date()
  const bestDeal = product.affiliate_links
    ?.filter(link => link.availability === 'in-stock')
    ?.sort((a, b) => a.price - b.price)?.[0]

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const jsonLd = generateStructuredData(product)

  // Convert image URLs to ProductImage format
  const productImages = product.image_urls.map((url, index) => ({
    id: `img-${index}`,
    url,
    alt: `${product.title} - Image ${index + 1}`,
    isPrimary: index === 0,
    width: 800,
    height: 600
  }))

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4 mb-8">
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                    Products
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground" />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-muted-foreground hover:text-primary transition-colors capitalize"
                  >
                    {product.category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium max-w-[200px] truncate">
                    {product.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Flash Sale Banner */}
          {isFlashSaleActive && (
            <div className="mb-8">
              <FlashSaleCountdown 
                flashSale={{
                  endDate: new Date(product.flash_sale_end!),
                  isActive: true,
                  salePrice: (product.price / 100),
                  originalPrice: (product.price / 100) * 1.2,
                  discountPercentage: 20
                }}
              />
            </div>
          )}

          {/* Main Product Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images with Suspense */}
            <Suspense fallback={<ProductGalleryFallback />}>
              <ProductGallery images={productImages} productName={product.title} />
            </Suspense>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Category Badge */}
              <Badge variant="secondary" className="text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
                {product.category}
              </Badge>

              {/* Product Title */}
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.review_rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {product.review_rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({product.review_total_reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </p>
                    {bestDeal && (
                      <p className="text-sm text-gray-500 mt-1">
                        Best deal at {bestDeal.shop_name}
                      </p>
                    )}
                  </div>
                  {isFlashSaleActive && (
                    <Badge className="bg-red-500 text-white">
                      Flash Sale
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Verified Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span>Expert Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span>Price Tracking</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Find Best Deal
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Review Score Section with Suspense */}
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          }>
            <UniversalReviewScore 
              overallScore={product.review_score_overall}
              productName={product.title}
              product={product}
            />
          </Suspense>

          {/* Product Review Section with Suspense */}
          <Suspense fallback={
            <div className="animate-pulse mt-16">
              <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          }>
            <ProductReview product={product} />
          </Suspense>

          {/* Affiliate Links Section with Suspense */}
          <Suspense fallback={<AffiliateTableFallback />}>
            <AffiliateLinksTable 
              affiliateLinks={product.affiliate_links || []}
              productId={product.id}
            />
          </Suspense>
        </div>
      </div>
    </>
  )
}
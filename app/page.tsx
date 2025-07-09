import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ArrowRight, Zap, TrendingUp, Users, Award } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingCard } from '@/components/ui/loading'
import { getProducts, getCategories } from '@/lib/data/products'

// ISR for homepage - cache for 2 minutes for better performance
export const revalidate = 120

function ProductCardSkeleton() {
  return (
    <Card className="group">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  )
}

async function FeaturedProduct() {
  try {
    const { products } = await getProducts(1, 1)
    const featuredProduct = products[0]

    if (!featuredProduct) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No featured product available</p>
        </div>
      )
    }

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="p-0">
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <Image
              src={featuredProduct.image_urls[0] || '/placeholder.jpg'}
              alt={featuredProduct.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <Badge className="absolute top-3 left-3 bg-primary">
              <Award className="w-3 h-3 mr-1" />
              Editor's Choice
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-xs">
              {featuredProduct.category}
            </Badge>
            <h3 className="text-xl font-bold line-clamp-2">
              {featuredProduct.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2">
              {featuredProduct.description}
            </p>
            
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(featuredProduct.review_rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {featuredProduct.review_rating}
              </span>
              <span className="text-sm text-muted-foreground">
                ({featuredProduct.review_total_reviews} reviews)
              </span>
            </div>

            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href={`/products/${featuredProduct.slug}`}>
                Read Full Review
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error('Error loading featured product:', error)
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load featured product</p>
      </div>
    )
  }
}

async function RecentProducts() {
  try {
    const { products } = await getProducts(1, 6)
    
    if (products.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No products available</p>
        </div>
      )
    }

    const formatPrice = (price: number) => (price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    const isFlashSaleActive = (endDate: string | null) => endDate && new Date(endDate) > new Date()

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const hasFlashSale = isFlashSaleActive(product.flash_sale_end)
          
          return (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image_urls[0] || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {hasFlashSale && (
                    <Badge className="absolute top-3 left-3 bg-red-500">
                      <Zap className="w-3 h-3 mr-1" />
                      Flash Sale
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.review_rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {product.review_rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({product.review_total_reviews})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      Starting from
                    </Badge>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/products/${product.slug}`}>
                      Read Review
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  } catch (error) {
    console.error('Error loading recent products:', error)
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load products</p>
      </div>
    )
  }
}

// Dynamic Categories Component
async function CategoriesSection() {
  try {
    const categories = await getCategories()
    
    if (categories.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No categories available</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.slice(0, 8).map((category) => (
          <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
            <Link href={`/category/${category.slug}`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">
                  {category.icon || '📦'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.product_count || 0} products
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading categories:', error)
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load categories</p>
      </div>
    )
  }
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Expert Reviews for
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                    {" "}Smart Decisions
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Unbiased product reviews, detailed comparisons, and exclusive deals 
                  to help you find the perfect tech products.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/products">
                    Browse Reviews
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/deals">
                    Best Deals
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Products Reviewed</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">1M+</div>
                  <div className="text-sm text-muted-foreground">Monthly Readers</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Price Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Product */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Editor's Choice</h2>
              <p className="text-muted-foreground text-lg">
                Our top pick this month
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<ProductCardSkeleton />}>
                <FeaturedProduct />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Latest Reviews */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Latest Reviews</h2>
                <p className="text-muted-foreground">
                  Fresh insights on the newest tech products
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products">
                  View All Reviews
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <Suspense fallback={
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }>
              <RecentProducts />
            </Suspense>
          </div>
        </section>

        {/* Categories - Static for performance */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">
                Find the perfect product for your needs
              </p>
            </div>

            <Suspense fallback={
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            }>
              <CategoriesSection />
            </Suspense>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Stay Updated</h2>
              <p className="text-lg text-muted-foreground">
                Get the latest reviews and deals delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 
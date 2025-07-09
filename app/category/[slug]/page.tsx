import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts, getCategories, getCategoryBySlug, Category } from '@/lib/data/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import { Star, ShoppingBag } from 'lucide-react'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function CategoryContent({ categorySlug }: { categorySlug: string }) {
  try {
    // Get category by slug and products in parallel
    const [category, { products }, allCategories] = await Promise.all([
      getCategoryBySlug(categorySlug),
      getProducts(1, 50, categorySlug), // Use slug for filtering
      getCategories()
    ])

    if (!category) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/categories" className="hover:text-blue-600">Categories</Link></li>
            <li>/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            {category.icon && <span className="text-4xl">{category.icon}</span>}
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name} Reviews
            </h1>
          </div>
          <p className="text-gray-600">
            {category.description || `Discover the best ${category.name} with expert reviews and detailed comparisons.`}
            {products.length > 0 && ` Found ${products.length} products.`}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={product.images[0]?.url || '/placeholder.jpg'}
                    alt={product.images[0]?.alt_text || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.flash_sale_end && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      Flash Sale
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.review?.rating || 'N/A'}</span>
                      <span className="text-gray-500 text-sm">
                        ({product.review?.total_reviews || 0})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${(product.price / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/products/${product.slug}`}>
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Read Review
                      </Link>
                    </Button>
                    {product.affiliate_links.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {product.affiliate_links.length} deals
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              We don't have any {category.name} reviews yet. Check back soon!
            </p>
            <Button asChild>
              <Link href="/categories">Browse All Categories</Link>
            </Button>
          </div>
        )}

        {/* Related Categories */}
        {allCategories.length > 1 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Other Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {allCategories
                .filter(cat => cat.id !== category.id)
                .map((relatedCategory) => (
                  <Button
                    key={relatedCategory.id}
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link href={`/category/${relatedCategory.slug}`}>
                      {relatedCategory.icon && <span className="mr-1">{relatedCategory.icon}</span>}
                      {relatedCategory.name}
                    </Link>
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading category:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-500">Unable to load this category. Please try again later.</p>
        </div>
      </div>
    )
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoryContent categorySlug={params.slug} />
    </Suspense>
  )
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories()
    
    if (categories.length === 0) {
      // Return empty array if no categories in database
      return []
    }
    
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    // Return empty array on error to prevent build failures
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const category = await getCategoryBySlug(params.slug)
    
    if (!category) {
      return {
        title: 'Category Not Found | OneShot',
        description: 'The requested category could not be found.',
      }
    }

    return {
      title: `${category.name} Reviews | OneShot`,
      description: category.description || `Find the best ${category.name} with expert reviews, detailed comparisons, and the latest deals.`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Category | OneShot',
      description: 'Product category reviews and comparisons.',
    }
  }
}

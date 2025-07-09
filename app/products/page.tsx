import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts, getCategories, getCategoryBySlug, type ProductListItem, type Category } from '@/lib/data/products'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Star } from 'lucide-react'

// ISR: Revalidate every 5 minutes
export const revalidate = 300

interface ProductsPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1')
  const categorySlug = searchParams.category
  const search = searchParams.search
  
  // Fetch products with pagination (20 per page for performance)
  const [{ products, total, hasMore }, categories, selectedCategory] = await Promise.all([
    getProducts(page, 20, categorySlug),
    getCategories(),
    categorySlug ? getCategoryBySlug(categorySlug) : null
  ])
  
  const formatPrice = (price: number) => (price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  
  const totalPages = Math.ceil(total / 20)
  const currentPage = page

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center space-x-3">
              {selectedCategory?.icon && <span>{selectedCategory.icon}</span>}
              <span>
                {selectedCategory ? `${selectedCategory.name} Products` : 'All Products'}
              </span>
            </h1>
            <p className="text-muted-foreground">
              {search ? `Search results for "${search}"` : `Showing ${products.length} of ${total} products`}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Link href="/products">
              <Badge variant={!categorySlug ? "default" : "outline"} className="cursor-pointer">
                All
              </Badge>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Badge 
                  variant={categorySlug === category.slug ? "default" : "outline"} 
                  className="cursor-pointer flex items-center space-x-1"
                >
                  {category.icon && <span>{category.icon}</span>}
                  <span>{category.name}</span>
                </Badge>
              </Link>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image_urls[0] || '/placeholder.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold line-clamp-2 text-sm">
                      {product.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.review_rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.review_rating} ({product.review_total_reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="text-sm font-bold text-primary">
                      {formatPrice(product.price)}
                    </div>

                    <Button asChild className="w-full" variant="outline" size="sm">
                      <Link href={`/products/${product.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              {/* Previous */}
              {currentPage > 1 && (
                <Link href={`/products?page=${currentPage - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i
                if (pageNum > totalPages) return null
                
                return (
                  <Link 
                    key={pageNum} 
                    href={`/products?page=${pageNum}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  >
                    <Button 
                      variant={pageNum === currentPage ? "default" : "outline"} 
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  </Link>
                )
              })}

              {/* Next */}
              {hasMore && (
                <Link href={`/products?page=${currentPage + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* No Results */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Link href="/products">
                <Button variant="outline">
                  View All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
} 
import { Suspense } from 'react'
import Link from 'next/link'
import { getCategories, Category } from '@/lib/data/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'

async function CategoriesContent() {
  try {
    const categories = await getCategories()

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-gray-600">Explore our product categories to find the perfect item for your needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="group"
            >
              <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors flex items-center space-x-2">
                    {category.icon && <span className="text-2xl">{category.icon}</span>}
                    <span>{category.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {category.description || `Discover the best ${category.name} with expert reviews`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        View Products
                      </Badge>
                    </div>
                    <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading categories:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-gray-500">Unable to load categories at the moment. Please try again later.</p>
        </div>
      </div>
    )
  }
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoriesContent />
    </Suspense>
  )
}

export const metadata = {
  title: 'Product Categories | OneShot Reviews',
  description: 'Browse all product categories and find the best deals with expert reviews.',
} 
import { Header } from '@/components/layout/header'
import { LoadingSpinner, LoadingCard } from '@/components/ui/loading'

export default function ProductLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Loading */}
          <div className="mb-8">
            <div className="animate-pulse flex space-x-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images Loading */}
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

            {/* Product Info Loading */}
            <div className="space-y-6">
              <div className="animate-pulse space-y-4">
                {/* Category */}
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                
                {/* Title */}
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>

                {/* Price */}
                <div className="h-10 bg-gray-200 rounded w-32"></div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                {/* Trust Signals */}
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Score Loading */}
          <div className="mt-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Affiliate Links Loading */}
          <div className="mt-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-40 mb-8"></div>
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-6">
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
          </div>
        </div>
      </main>
    </>
  )
} 
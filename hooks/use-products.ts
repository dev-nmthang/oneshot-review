'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  getProducts, 
  searchProducts as searchProductsAPI, 
  getProduct, 
  getCategories,
  trackProductView,
  trackAffiliateClick,
  type Product,
  type ProductListItem,
  type AffiliateLink,
  type Category
} from '@/lib/data/products'

// Hook for managing product listings with performance optimizations
export function useProducts(
  page: number = 1, 
  category?: string, 
  limit: number = 12
) {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await getProducts(page, limit, category)
      
      setProducts(result.products)
      setTotal(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [page, category, limit])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Optimized refresh function
  const refresh = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    total,
    hasMore,
    refresh
  }
}

// Hook for single product with caching
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const productData = await getProduct(slug)
        setProduct(productData)
        
        // Track product view for analytics
        if (productData) {
          await trackProductView(productData.id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}

// Optimized search hook with debouncing
export function useSearchProducts(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [results, setResults] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query for mobile performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query])

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    const performSearch = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const searchResults = await searchProductsAPI(debouncedQuery, 10)
        setResults(searchResults)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // Memoized clear function
  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
  }, [])

  // Memoized update query function
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  return {
    query,
    results,
    loading,
    error,
    updateQuery,
    clearSearch
  }
}

// Hook for categories with caching
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const categoryData = await getCategories()
        setCategories(categoryData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook for featured products - simplified to use regular getProducts with sorting
export function useFeaturedProducts(limit: number = 1) {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get products and sort by rating to get featured ones
        const result = await getProducts(1, limit)
        const sortedProducts = result.products
          .filter(p => p.review?.rating)
          .sort((a, b) => (b.review?.rating || 0) - (a.review?.rating || 0))
          .slice(0, limit)
        
        setProducts(sortedProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured products')
        console.error('Error fetching featured products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [limit])

  return { products, loading, error }
}

// Hook for affiliate click tracking
export function useAffiliateTracking() {
  const trackClick = useCallback(async (affiliateLink: AffiliateLink, productId: string) => {
    try {
      // Track the click for analytics
      await trackAffiliateClick(affiliateLink.id, productId)
      
      // Open affiliate link in new tab
      window.open(affiliateLink.affiliate_url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking affiliate click:', error)
      // Still open the link even if tracking fails
      window.open(affiliateLink.affiliate_url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  return { trackClick }
}

// Hook for product statistics and analytics
export function useProductStats(product: Product | null) {
  return useMemo(() => {
    if (!product) return null

    const stats = {
      hasFlashSale: !!(product.flash_sale_end && new Date(product.flash_sale_end) > new Date()),
      reviewCount: product.review?.total_reviews || 0,
      averageRating: product.review?.rating || 0,
      affiliateLinksCount: product.affiliate_links?.length || 0,
      bestPrice: product.affiliate_links?.length > 0 
        ? Math.min(...product.affiliate_links.map(link => link.price))
        : product.price,
      maxDiscount: product.affiliate_links?.length > 0
        ? Math.max(...product.affiliate_links.map(link => {
            if (!link.original_price) return 0
            return Math.round(((link.original_price - link.price) / link.original_price) * 100)
          }))
        : 0
    }

    return stats
  }, [product])
}

// Hook for infinite scroll pagination (mobile optimized)
export function useInfiniteProducts(category?: string) {
  const [allProducts, setAllProducts] = useState<ProductListItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    try {
      setLoading(true)
      setError(null)
      
      const result = await getProducts(page, 12, category)
      
      if (page === 1) {
        setAllProducts(result.products)
      } else {
        setAllProducts(prev => [...prev, ...result.products])
      }
      
      setHasMore(result.hasMore)
      setPage(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more products')
      console.error('Error loading more products:', err)
    } finally {
      setLoading(false)
    }
  }, [page, category, loading, hasMore])

  // Reset when category changes
  useEffect(() => {
    setAllProducts([])
    setPage(1)
    setHasMore(true)
    setError(null)
  }, [category])

  // Load initial data
  useEffect(() => {
    if (page === 1) {
      loadMore()
    }
  }, [page])

  return {
    products: allProducts,
    loading,
    hasMore,
    error,
    loadMore
  }
} 
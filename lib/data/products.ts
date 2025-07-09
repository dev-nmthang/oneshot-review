/**
 * Product Data Layer - Production Ready
 * Real Supabase integration with proper error handling and performance optimization
 */

import { createClient } from '@supabase/supabase-js'
import { cache, cacheTTL } from '../cache'

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqpztzmxoeghuuggxytb.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcHp0em14b2VnaHV1Z2d4eXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjIzMzgsImV4cCI6MjA2NjIzODMzOH0.MxAgMwtccHgM3A5P4k_K5a-t7z7Okat4zZotb6eCctQ'

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Supabase configuration is required')
}

// Optimized Supabase client for mobile performance
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false, // Reduce memory usage
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2 // Reduce realtime overhead
    }
  }
})

// Updated interfaces for normalized structure
export interface ProductImage {
  id: string
  url: string
  alt_text: string | null
  width: number | null
  height: number | null
  is_primary: boolean
  display_order: number
}

export interface ProductTag {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductReview {
  rating: number
  total_reviews: number
  content?: string | null
  pros?: string[]
  cons?: string[]
  verdict?: string | null
  overall_score?: number | null
}

export interface ProductScore {
  score_price: number
  score_quality: number
  score_brand: number
  score_warranty: number
}

export interface ProductSEO {
  meta_title: string | null
  meta_description: string | null
  keywords: string[]
  canonical_url: string | null
}

export interface AffiliateLink {
  id: string
  shop_name: string
  shop_logo_url: string | null
  price: number
  original_price: number | null
  voucher: string | null
  affiliate_url: string
  flash_sale_end: string | null
  availability: 'in-stock' | 'limited' | 'out-of-stock'
  is_best_deal: boolean
}

// Simplified product interface
export interface Product {
  id: string
  slug: string
  title: string
  description: string
  category_id: string | null
  price: number
  flash_sale_end: string | null
  created_at: string
  updated_at: string | null
  
  // Relations
  category: Category | null
  images: ProductImage[]
  tags: ProductTag[]
  review: ProductReview | null
  scores: ProductScore | null
  seo: ProductSEO | null
  affiliate_links: AffiliateLink[]
}

export interface ProductListItem {
  id: string
  slug: string
  title: string
  description: string
  category_id: string | null
  price: number
  flash_sale_end: string | null
  
  // Relations for list view
  category: Category | null
  images: ProductImage[]
  review: Pick<ProductReview, 'rating' | 'total_reviews'> | null
  affiliate_links: Pick<AffiliateLink, 'price' | 'is_best_deal'>[]
}

/**
 * Get products with pagination - Updated for normalized structure
 */
export async function getProducts(
  page: number = 1, 
  limit: number = 12,
  category?: string
): Promise<{ products: ProductListItem[]; total: number; hasMore: boolean }> {
  const cacheKey = `products_${page}_${limit}_${category || 'all'}`
  const cached = cache.get<{ products: ProductListItem[]; total: number; hasMore: boolean }>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const offset = (page - 1) * limit
    
    // Use the products_full view for simplified querying
    let query = supabase
      .from('products_full')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    // Add category filter if specified
    if (category) {
      query = query.eq('category_slug', category)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], total: 0, hasMore: false }
    }

    // Transform data from view to interface
    const products: ProductListItem[] = (data || []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      category_id: item.category_id,
      price: item.price,
      flash_sale_end: item.flash_sale_end,
      category: item.category_name ? {
        id: item.category_id,
        name: item.category_name,
        slug: item.category_slug,
        description: null,
        icon: item.category_icon,
        display_order: 0,
        is_active: true,
        created_at: '',
        updated_at: ''
      } : null,
      images: item.images || [],
      review: item.review_rating ? {
        rating: item.review_rating,
        total_reviews: item.review_total_reviews || 0
      } : null,
      affiliate_links: item.affiliate_links?.map((link: any) => ({
        price: link.price,
        is_best_deal: link.is_best_deal
      })) || []
    }))

    const result = {
      products,
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    }

    cache.set(cacheKey, result, cacheTTL.products)
    return result

  } catch (error) {
    console.error('Error in getProducts:', error)
    return { products: [], total: 0, hasMore: false }
  }
}

/**
 * Get single product by slug - Updated for normalized structure
 */
export async function getProduct(slug: string): Promise<Product | null> {
  const cacheKey = `product_${slug}`
  const cached = cache.get<Product>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    // Use the products_full view for complete product data
    const { data, error } = await supabase
      .from('products_full')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.error('Error fetching product:', error)
      return null
    }

    // Transform data from view to interface
    const product: Product = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      price: data.price,
      flash_sale_end: data.flash_sale_end,
      created_at: data.created_at,
      updated_at: data.updated_at,
      category: data.category_name ? {
        id: data.category_id,
        name: data.category_name,
        slug: data.category_slug,
        description: null,
        icon: data.category_icon,
        display_order: 0,
        is_active: true,
        created_at: '',
        updated_at: ''
      } : null,
      images: data.images || [],
      tags: data.tags || [],
      review: data.review_rating ? {
        rating: data.review_rating,
        total_reviews: data.review_total_reviews || 0,
        content: data.review_content,
        pros: data.review_pros || [],
        cons: data.review_cons || [],
        verdict: data.review_verdict,
        overall_score: data.review_overall_score
      } : null,
      scores: data.score_price !== null ? {
        score_price: data.score_price,
        score_quality: data.score_quality,
        score_brand: data.score_brand,
        score_warranty: data.score_warranty
      } : null,
      seo: data.seo_meta_title ? {
        meta_title: data.seo_meta_title,
        meta_description: data.seo_meta_description,
        keywords: data.seo_keywords || [],
        canonical_url: data.seo_canonical_url
      } : null,
      affiliate_links: data.affiliate_links || []
    }

    cache.set(cacheKey, product, cacheTTL.product)
    return product

  } catch (error) {
    console.error('Error in getProduct:', error)
    return null
  }
}

/**
 * Get categories - Updated for normalized structure
 */
export async function getCategories(): Promise<Category[]> {
  const cacheKey = 'categories'
  const cached = cache.get<Category[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    const categories = data || []
    cache.set(cacheKey, categories, cacheTTL.categories)
    return categories

  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}

/**
 * Search products - Updated for normalized structure
 */
export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<ProductListItem[]> {
  const cacheKey = `search_${query}_${limit}`
  const cached = cache.get<ProductListItem[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    // Use full-text search on the products table
    const { data, error } = await supabase
      .from('products_full')
      .select('*')
      .textSearch('fts', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(limit)

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    // Transform data (same as getProducts)
    const products: ProductListItem[] = (data || []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      category_id: item.category_id,
      price: item.price,
      flash_sale_end: item.flash_sale_end,
      category: item.category_name ? {
        id: item.category_id,
        name: item.category_name,
        slug: item.category_slug,
        description: null,
        icon: item.category_icon,
        display_order: 0,
        is_active: true,
        created_at: '',
        updated_at: ''
      } : null,
      images: item.images || [],
      review: item.review_rating ? {
        rating: item.review_rating,
        total_reviews: item.review_total_reviews || 0
      } : null,
      affiliate_links: item.affiliate_links?.map((link: any) => ({
        price: link.price,
        is_best_deal: link.is_best_deal
      })) || []
    }))

    cache.set(cacheKey, products, cacheTTL.search)
    return products

  } catch (error) {
    console.error('Error in searchProducts:', error)
    return []
  }
}

/**
 * Track analytics - Updated to use real database tracking
 */
export async function trackProductView(productId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('product_analytics')
      .insert({
        product_id: productId,
        event_type: 'view',
        session_id: typeof window !== 'undefined' ? 
          (window.sessionStorage.getItem('session_id') || 
           crypto.randomUUID()) : null,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
        referrer: typeof window !== 'undefined' ? document.referrer : null,
        metadata: {
          timestamp: new Date().toISOString(),
          page_url: typeof window !== 'undefined' ? window.location.href : null
        }
      })

    if (error) {
      console.error('Error tracking product view:', error)
    }

    // Store session ID for future tracking
    if (typeof window !== 'undefined' && !window.sessionStorage.getItem('session_id')) {
      window.sessionStorage.setItem('session_id', crypto.randomUUID())
    }
  } catch (error) {
    console.error('Error in trackProductView:', error)
  }
}

export async function trackAffiliateClick(productId: string, affiliateUrl: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('product_analytics')
      .insert({
        product_id: productId,
        event_type: 'affiliate_click',
        session_id: typeof window !== 'undefined' ? 
          window.sessionStorage.getItem('session_id') : null,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
        referrer: typeof window !== 'undefined' ? document.referrer : null,
        metadata: {
          affiliate_url: affiliateUrl,
          timestamp: new Date().toISOString()
        }
      })

    if (error) {
      console.error('Error tracking affiliate click:', error)
    }
  } catch (error) {
    console.error('Error in trackAffiliateClick:', error)
  }
}

export async function trackSearch(query: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('product_analytics')
      .insert({
        product_id: null,
        event_type: 'search',
        session_id: typeof window !== 'undefined' ? 
          window.sessionStorage.getItem('session_id') : null,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
        referrer: typeof window !== 'undefined' ? document.referrer : null,
        metadata: {
          search_query: query,
          timestamp: new Date().toISOString()
        }
      })

    if (error) {
      console.error('Error tracking search:', error)
    }
  } catch (error) {
    console.error('Error in trackSearch:', error)
  }
}

// Utility functions
export function getBestDeal(product: Product): AffiliateLink | null {
  const inStockLinks = product.affiliate_links.filter(link => link.availability === 'in-stock')
  if (inStockLinks.length === 0) return null
  return inStockLinks.sort((a, b) => a.price - b.price)[0]
}

export function getDiscountPercentage(product: Product): number {
  const bestDeal = getBestDeal(product)
  if (!bestDeal?.original_price || bestDeal.original_price <= bestDeal.price) {
    return 0
  }
  return Math.round(((bestDeal.original_price - bestDeal.price) / bestDeal.original_price) * 100)
}

export function isFlashSaleActive(endDate: string | null): boolean {
  if (!endDate) return false
  return new Date(endDate) > new Date()
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cacheKey = `category_${slug}`
  const cached = cache.get<Category>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.error('Error fetching category:', error)
      return null
    }

    cache.set(cacheKey, data, cacheTTL.categories)
    return data

  } catch (error) {
    console.error('Error in getCategoryBySlug:', error)
    return null
  }
} 
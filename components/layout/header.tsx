'use client'

import React, { useState, useCallback, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Search, Menu, X, ShoppingBag, Star } from 'lucide-react'
import { useSearchProducts } from '@/hooks/use-products'
import { getCategories, Category } from '@/lib/data/products'

interface HeaderProps {
  className?: string
}

// Memoized search results component
const SearchResults = memo(function SearchResults({ 
  results, 
  loading, 
  onClose 
}: { 
  results: any[], 
  loading: boolean, 
  onClose: () => void 
}) {
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No products found
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {results.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          onClick={onClose}
          className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors"
        >
          <Image
            src={product.image_urls[0]}
            alt={product.title}
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{product.title}</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{product.review_rating}</span>
              <span>•</span>
              <span>${(product.price / 100).toFixed(2)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
})

// Memoized mobile menu component
const MobileMenu = memo(function MobileMenu({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const dbCategories = await getCategories()
          setCategories(dbCategories.slice(0, 6)) // Show first 6 categories in mobile
        } catch (error) {
          console.error('Error loading categories:', error)
          setCategories([])
        }
      }
      loadCategories()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Menu</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <Link href="/" onClick={onClose} className="block text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/products" onClick={onClose} className="block text-gray-700 hover:text-blue-600">
            Products
          </Link>
          <Link href="/categories" onClick={onClose} className="block text-gray-700 hover:text-blue-600">
            Categories
          </Link>
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/category/${category.slug}`}
              onClick={onClose} 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 pl-4"
            >
              {category.icon && <span>{category.icon}</span>}
              <span>{category.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
})

// Dynamic navigation component
const NavigationMenu = React.memo(() => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const dbCategories = await getCategories()
        setCategories(dbCategories.slice(0, 4)) // Show first 4 categories
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (loading) {
    return (
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
          Products
        </Link>
        <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
          Categories
        </Link>
        <span className="text-muted-foreground">Loading...</span>
      </nav>
    )
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
        Products
      </Link>
      <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
        Categories
      </Link>
      {categories.map((category) => (
        <Link 
          key={category.id}
          href={`/category/${category.slug}`} 
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
        >
          {category.icon && <span>{category.icon}</span>}
          <span>{category.name}</span>
        </Link>
      ))}
    </nav>
  )
})

NavigationMenu.displayName = 'NavigationMenu'

export const Header = memo(function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const { query, results, loading, updateQuery, clearSearch } = useSearchProducts()

  // Memoized handlers
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen(prev => !prev)
    if (isSearchOpen) {
      clearSearch()
    }
  }, [isSearchOpen, clearSearch])

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false)
    clearSearch()
  }, [clearSearch])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">OneShot</span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu />

            {/* Search & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={handleSearchToggle}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuToggle}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {(query || loading) && (
                <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <SearchResults 
                    results={results} 
                    loading={loading} 
                    onClose={handleSearchClose} 
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

    </>
  )
}) 
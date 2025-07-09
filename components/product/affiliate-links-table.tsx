'use client'

import React from 'react'
import Image from 'next/image'
import { ExternalLink, ShoppingCart, Tag, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { trackAffiliateClick } from '@/lib/data/products'
import type { AffiliateLink } from '@/lib/data/products'

interface AffiliateLinksTableProps {
  affiliateLinks: AffiliateLink[]
  productId: string
}

/**
 * Modern affiliate links display with enhanced visual hierarchy
 * Features card-based layout and professional styling
 */
export function AffiliateLinksTable({ affiliateLinks, productId }: AffiliateLinksTableProps) {
  const handleAffiliateClick = async (link: AffiliateLink) => {
    await trackAffiliateClick(link.id, productId)
    window.open(link.affiliate_url, '_blank', 'noopener,noreferrer')
  }

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const getDiscountPercentage = (originalPrice: number | null, currentPrice: number) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'In Stock'
      case 'limited':
        return 'Limited Stock'
      case 'out-of-stock':
        return 'Out of Stock'
      default:
        return 'Unknown'
    }
  }

  const sortedLinks = [...affiliateLinks].sort((a, b) => {
    // Best deals first
    if (a.is_best_deal && !b.is_best_deal) return -1
    if (!a.is_best_deal && b.is_best_deal) return 1
    
    // In stock items first
    if (a.availability === 'in-stock' && b.availability !== 'in-stock') return -1
    if (a.availability !== 'in-stock' && b.availability === 'in-stock') return 1
    
    // Then by price
    return a.price - b.price
  })

  if (affiliateLinks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No retailers available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Where to Buy ({affiliateLinks.length} retailers)
        </h3>
        <div className="text-sm text-gray-500">
          Prices updated recently
        </div>
      </div>

      <div className="grid gap-4">
        {sortedLinks.map((link) => {
          const discountPercentage = getDiscountPercentage(link.original_price, link.price)
          const isFlashSale = link.flash_sale_end && new Date(link.flash_sale_end) > new Date()

          return (
            <Card 
              key={link.id} 
              className={`p-6 hover:shadow-lg transition-all duration-200 border-2 ${
                link.is_best_deal 
                  ? 'border-blue-200 bg-blue-50/50 ring-2 ring-blue-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Retailer Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {link.shop_logo_url ? (
                      <Image
                        src={link.shop_logo_url}
                        alt={`${link.shop_name} logo`}
                        width={48}
                        height={48}
                        className="rounded-lg object-contain bg-white p-1 border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {link.shop_name}
                      </h4>
                      {link.is_best_deal && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                          Best Deal
                        </Badge>
                      )}
                      {isFlashSale && (
                        <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Flash Sale
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getAvailabilityColor(link.availability)}`}
                      >
                        {getAvailabilityText(link.availability)}
                      </Badge>
                      {link.voucher && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <Tag className="h-3 w-3 mr-1" />
                          {link.voucher}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(link.price)}
                      </span>
                      {discountPercentage > 0 && (
                        <Badge className="bg-red-100 text-red-800 text-sm">
                          -{discountPercentage}%
                        </Badge>
                      )}
                    </div>
                    {link.original_price && link.original_price > link.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(link.original_price)}
                      </div>
                    )}
                    {isFlashSale && link.flash_sale_end && (
                      <div className="text-xs text-red-600 mt-1">
                        Sale ends: {new Date(link.flash_sale_end).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleAffiliateClick(link)}
                    disabled={link.availability === 'out-of-stock'}
                    className={`min-w-[120px] ${
                      link.is_best_deal
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {link.availability === 'out-of-stock' ? 'Sold Out' : 'Buy Now'}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="text-xs text-gray-500 mt-6 p-4 bg-gray-50 rounded-lg">
        <p>
          <strong>Disclosure:</strong> We may earn a commission when you purchase through our affiliate links. 
          This helps support our reviews and doesn't affect the price you pay. 
          Prices and availability are subject to change.
        </p>
      </div>
    </div>
  )
} 
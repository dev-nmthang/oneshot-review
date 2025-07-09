'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/lib/data/products'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

/**
 * Product image gallery with main image and thumbnail navigation
 * Responsive design with proper alt text for accessibility
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  
  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center bg-muted rounded-lg">
        <span className="text-muted-foreground">No image available</span>
      </div>
    )
  }

  const activeImage = images[activeImageIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || `${productName} image`}
          fill
          className="object-cover transition-all duration-300"
          priority={activeImageIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveImageIndex(index)}
              className={cn(
                "relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                index === activeImageIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-muted hover:border-primary/50"
              )}
              aria-label={`View ${image.alt || `${productName} image ${index + 1}`}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 
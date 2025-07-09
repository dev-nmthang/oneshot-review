'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Flame } from 'lucide-react'

interface FlashSale {
  endDate: Date
  isActive: boolean
  salePrice?: number
  originalPrice?: number
  discountPercentage?: number
}

interface FlashSaleCountdownProps {
  flashSale: FlashSale
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Flash sale countdown timer with price display
 * Updates every second and handles sale expiration
 */
export function FlashSaleCountdown({ flashSale }: FlashSaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = flashSale.endDate.getTime()
      const difference = endTime - now

      if (difference <= 0) {
        setIsExpired(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [flashSale.endDate])

  if (!flashSale.isActive || isExpired) {
    return null
  }

  return (
    <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-red-600 dark:text-red-400">
              Flash Sale
            </span>
            <Badge variant="destructive" className="animate-pulse">
              Limited Time
            </Badge>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-1 text-sm font-mono">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              {timeLeft.days > 0 && `${timeLeft.days}d `}
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Price Information */}
        {flashSale.salePrice && flashSale.originalPrice && (
          <div className="mt-3 flex items-center gap-3">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${flashSale.salePrice}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg text-muted-foreground line-through">
                ${flashSale.originalPrice}
              </span>
              {flashSale.discountPercentage && (
                <Badge variant="destructive" className="text-sm">
                  Save {flashSale.discountPercentage}%
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
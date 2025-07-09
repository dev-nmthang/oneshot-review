'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Award, 
  Star,
  Palette,
  Zap,
  DollarSign,
  Heart,
  Shield,
  Truck,
  Users,
  CheckCircle
} from 'lucide-react'

interface ScoreCategory {
  name: string
  score: number
  icon: React.ReactNode
  description: string
}

interface ReviewScoreProps {
  overallScore: number
  categories: ScoreCategory[]
  productName: string
}

// Universal scoring categories that work for ANY product
const getUniversalCategories = (product?: any): ScoreCategory[] => {
  // Use the normalized scores structure
  const scores = product?.scores || {}
  
  const categories: ScoreCategory[] = [
    {
      name: "Quality",
      score: scores.score_quality || 0,
      icon: <CheckCircle className="w-4 h-4 text-muted-foreground" />,
      description: "Build quality, materials, and craftsmanship"
    },
    {
      name: "Price Value",
      score: scores.score_price || 0,
      icon: <DollarSign className="w-4 h-4 text-muted-foreground" />,
      description: "Price vs. quality and features"
    },
    {
      name: "Brand",
      score: scores.score_brand || 0,
      icon: <Award className="w-4 h-4 text-muted-foreground" />,
      description: "Brand reputation, trust, and support"
    },
    {
      name: "Warranty",
      score: scores.score_warranty || 0,
      icon: <Shield className="w-4 h-4 text-muted-foreground" />,
      description: "Warranty coverage, terms, and support"
    }
  ]

  return categories
}

export function ReviewScore({ overallScore, categories, productName }: ReviewScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400"
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreText = (score: number) => {
    if (score >= 9) return "Outstanding"
    if (score >= 8) return "Excellent" 
    if (score >= 7) return "Very Good"
    if (score >= 6) return "Good"
    if (score >= 5) return "Average"
    return "Below Average"
  }

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500"
    if (score >= 6) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
              Review Score
            </span>
          </div>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {productName}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <div className={`text-7xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="text-xl font-medium text-muted-foreground">
              {getScoreText(overallScore)}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(overallScore)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Score Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            How we rate each aspect of this product
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {category.icon}
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {category.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                    {category.score}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getScoreColor(category.score)} border-current`}
                  >
                    {getScoreText(category.score)}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(category.score)}`}
                      style={{ width: `${(category.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* How We Score */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            How We Score
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs">
            <div className="space-y-1">
              <div className="w-8 h-2 bg-red-500 rounded mx-auto"></div>
              <div className="font-medium">0-4</div>
              <div className="text-muted-foreground">Poor</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-2 bg-orange-500 rounded mx-auto"></div>
              <div className="font-medium">5-5.9</div>
              <div className="text-muted-foreground">Below Average</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-2 bg-yellow-500 rounded mx-auto"></div>
              <div className="font-medium">6-6.9</div>
              <div className="text-muted-foreground">Good</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-2 bg-lime-500 rounded mx-auto"></div>
              <div className="font-medium">7-7.9</div>
              <div className="text-muted-foreground">Very Good</div>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-2 bg-green-500 rounded mx-auto"></div>
              <div className="font-medium">8-10</div>
              <div className="text-muted-foreground">Excellent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Universal review score that adapts to any product category
export function UniversalReviewScore({ 
  overallScore, 
  productName,
  product
}: { 
  overallScore: number
  productName: string 
  product?: any // Product object with all review scores
}) {
  const universalCategories = getUniversalCategories(product)

  return (
    <ReviewScore 
      overallScore={overallScore}
      categories={universalCategories}
      productName={productName}
    />
  )
}

// Legacy component for backward compatibility
export function DefaultReviewScore({ 
  overallScore, 
  productName,
  product
}: { 
  overallScore: number
  productName: string 
  product?: any
}) {
  return (
    <UniversalReviewScore 
      overallScore={overallScore}
      productName={productName}
      product={product}
    />
  )
} 
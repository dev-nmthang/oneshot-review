import React from 'react'
import { Product } from '@/lib/data/products'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UniversalReviewScore } from './review-score'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  AlertCircle,
  Award,
  Share2,
  BookOpen,
  Clock,
  User,
  Calendar,
  ExternalLink
} from 'lucide-react'

interface ProductReviewProps {
  product: Product
}

/**
 * Professional product review component with comprehensive layout
 * Features detailed scoring, author info, and structured content
 */
export function ProductReview({ product }: ProductReviewProps) {
  // Early return if no review data
  if (!product.review) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No review available for this product yet.</p>
      </div>
    )
  }

  const { review } = product

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-5 w-5 text-gray-300" />
          <Star className="absolute top-0 left-0 h-5 w-5 fill-yellow-400 text-yellow-400 clip-half" />
        </div>
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      )
    }

    return stars
  }

  const getRatingText = (rating: number) => {
    if (rating >= 9) return "Outstanding"
    if (rating >= 8) return "Excellent" 
    if (rating >= 7) return "Very Good"
    if (rating >= 6) return "Good"
    if (rating >= 5) return "Average"
    return "Below Average"
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400"
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-8">
      {/* Review Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Expert Review</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our comprehensive analysis based on extensive testing and real-world usage
        </p>
      </div>

      {/* Review Score with Detailed Breakdown */}
      <UniversalReviewScore 
        overallScore={review.rating} 
        productName={product.title}
        product={product}
      />

      {/* Review Metadata */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <User className="w-5 h-5 mx-auto text-muted-foreground" />
              <div className="text-sm font-medium">Reviewed by</div>
              <div className="text-xs text-muted-foreground">Tech Expert</div>
            </div>
            <div className="space-y-2">
              <Calendar className="w-5 h-5 mx-auto text-muted-foreground" />
              <div className="text-sm font-medium">Published</div>
              <div className="text-xs text-muted-foreground">Dec 2024</div>
            </div>
            <div className="space-y-2">
              <Clock className="w-5 h-5 mx-auto text-muted-foreground" />
              <div className="text-sm font-medium">Testing Time</div>
              <div className="text-xs text-muted-foreground">2 Weeks</div>
            </div>
            <div className="space-y-2">
              <BookOpen className="w-5 h-5 mx-auto text-muted-foreground" />
              <div className="text-sm font-medium">Read Time</div>
              <div className="text-xs text-muted-foreground">5 min</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary */}
      {review.content && (
        <Card className="bg-gradient-to-r from-muted/50 to-background">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Review Summary</h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{review.content}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* The Good & The Bad */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* The Good */}
        {review.pros && review.pros.length > 0 && (
          <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4" />
                </div>
                The Good
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {review.pros.map((pro: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{pro}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* The Bad */}
        {review.cons && review.cons.length > 0 && (
          <Card className="border-red-200 bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-400">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <ThumbsDown className="h-4 w-4" />
                </div>
                The Bad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {review.cons.map((con: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{con}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Line */}
      {review.verdict && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              The Bottom Line
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none text-center">
              <p className="text-lg leading-relaxed font-medium">{review.verdict}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary">
                <ExternalLink className="w-4 h-4 mr-2" />
                Find Best Deals
              </Button>
              <Button variant="outline" className="hover-lift">
                <Share2 className="w-4 h-4 mr-2" />
                Share Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How We Test */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            How We Rate and Review Products
          </h3>
          <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Our reviews are based on extensive hands-on testing, real-world usage scenarios, 
              and comparison with competing products. We evaluate design, performance, features, 
              value for money, and overall user experience to provide you with honest, 
              unbiased recommendations.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Disclosure:</strong> We may earn commission from affiliate links. 
              This doesn't affect our editorial independence or review scores.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
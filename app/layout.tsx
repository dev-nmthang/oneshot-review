import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavigationProgress } from '@/components/ui/navigation-progress'
import { LoadingPage } from '@/components/ui/loading'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Affiliate Product Reviews - Best Deals & Expert Reviews',
    template: '%s | Affiliate Product Reviews'
  },
  description: 'Find the best product deals with expert reviews, price comparisons, and exclusive vouchers from top retailers.',
  keywords: ['product reviews', 'affiliate deals', 'price comparison', 'best deals', 'product comparison'],
  authors: [{ name: 'Affiliate Review Team' }],
  creator: 'Affiliate Product Reviews',
  publisher: 'Affiliate Product Reviews',
  metadataBase: new URL('https://yoursite.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    siteName: 'Affiliate Product Reviews',
    title: 'Affiliate Product Reviews - Best Deals & Expert Reviews',
    description: 'Find the best product deals with expert reviews, price comparisons, and exclusive vouchers from top retailers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affiliate Product Reviews',
    description: 'Find the best product deals with expert reviews and price comparisons.',
    creator: '@yourhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NavigationProgress />
        <div className="relative flex min-h-screen flex-col">
          {/* Main Content - Header is included in individual pages */}
          <main className="flex-1">
            <Suspense fallback={<LoadingPage />}>
              {children}
            </Suspense>
          </main>

          {/* Modern Footer */}
          <footer className="bg-muted/30 border-t">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">OR</span>
                    </div>
                    <span className="font-bold">One-Shot Review</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Expert reviews and unbiased comparisons to help you make the best purchasing decisions.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Categories</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/categories/smartphones" className="hover:text-foreground transition-colors">Smartphones</a></li>
                    <li><a href="/categories/laptops" className="hover:text-foreground transition-colors">Laptops</a></li>
                    <li><a href="/categories/headphones" className="hover:text-foreground transition-colors">Headphones</a></li>
                    <li><a href="/categories/cameras" className="hover:text-foreground transition-colors">Cameras</a></li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Resources</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/deals" className="hover:text-foreground transition-colors">Best Deals</a></li>
                    <li><a href="/reviews" className="hover:text-foreground transition-colors">Latest Reviews</a></li>
                    <li><a href="/guides" className="hover:text-foreground transition-colors">Buying Guides</a></li>
                    <li><a href="/compare" className="hover:text-foreground transition-colors">Compare Products</a></li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Company</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/about" className="hover:text-foreground transition-colors">About Us</a></li>
                    <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
                    <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                    <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p>&copy; 2024 One-Shot Review. All rights reserved.</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                      </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      <span className="sr-only">Instagram</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                      </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      <span className="sr-only">YouTube</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.23 3.037C15.278 2.731 9.682 2.731 9.682 2.731s-5.596 0-6.548.306C2.126 3.347 1.817 4.604 1.817 4.604S1.5 6.139 1.5 7.674v2.652c0 1.535.317 3.07.317 3.07s.309 1.257 1.317 1.567c.952.306 6.548.306 6.548.306s5.596 0 6.548-.306c1.008-.31 1.317-1.567 1.317-1.567s.317-1.535.317-3.07V7.674c0-1.535-.317-3.07-.317-3.07s-.309-1.257-1.317-1.567zM8.5 11.5V6.5l4.5 2.5-4.5 2.5z" clipRule="evenodd"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">
                    <strong>Affiliate Disclosure:</strong> We may earn commission from affiliate links at no extra cost to you. 
                    This helps us maintain our independent reviews and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 
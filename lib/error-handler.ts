/**
 * Production Error Handling
 * Centralized error handling with logging and user-friendly messages
 */

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: any
}

export class ProductionError extends Error implements AppError {
  code?: string
  statusCode?: number
  details?: any

  constructor(message: string, code?: string, statusCode?: number, details?: any) {
    super(message)
    this.name = 'ProductionError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

// Error logging for production
export function logError(error: Error | AppError, context?: string): void {
  if (process.env.NODE_ENV === 'production') {
    // In production, log to external service (Sentry, LogRocket, etc.)
    console.error(`[${context || 'APP'}] Error:`, {
      message: error.message,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server'
    })
    
    // Send to monitoring service
    // Example: Sentry.captureException(error)
  } else {
    // Development logging
    console.error(`[${context || 'APP'}] Error:`, error)
  }
}

// Database error handler
export function handleDatabaseError(error: any, operation: string): AppError {
  logError(error, `DATABASE_${operation.toUpperCase()}`)
  
  // Don't expose internal database errors to users
  if (process.env.NODE_ENV === 'production') {
    return {
      message: 'Service temporarily unavailable. Please try again later.',
      code: 'SERVICE_UNAVAILABLE',
      statusCode: 503
    }
  }
  
  return {
    message: error.message || 'Database operation failed',
    code: error.code || 'DATABASE_ERROR',
    statusCode: 500,
    details: error
  }
}

// API error handler
export function handleApiError(error: any, endpoint: string): AppError {
  logError(error, `API_${endpoint.toUpperCase()}`)
  
  if (error.status === 404) {
    return {
      message: 'Resource not found',
      code: 'NOT_FOUND',
      statusCode: 404
    }
  }
  
  if (error.status === 429) {
    return {
      message: 'Too many requests. Please try again later.',
      code: 'RATE_LIMITED',
      statusCode: 429
    }
  }
  
  return {
    message: 'Service error. Please try again.',
    code: 'API_ERROR',
    statusCode: error.status || 500
  }
}

// Client-side error boundary
export function handleClientError(error: Error, errorInfo: any): void {
  logError(error, 'CLIENT_ERROR')
  
  // Track user actions that led to error
  if (typeof window !== 'undefined') {
    const errorData = {
      error: error.message,
      stack: error.stack,
      errorInfo,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }
    
    // Send to analytics/monitoring
    console.error('Client Error:', errorData)
  }
}

// Retry mechanism for failed requests
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        logError(lastError, `RETRY_FAILED_${maxRetries}`)
        throw lastError
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw lastError!
}

// Environment validation
export function validateEnvironment(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    throw new ProductionError(
      `Missing required environment variables: ${missing.join(', ')}`,
      'MISSING_ENV_VARS',
      500
    )
  }
}

// Graceful degradation helpers
export function withFallback<T>(
  primaryOperation: () => Promise<T>,
  fallbackValue: T,
  context?: string
): Promise<T> {
  return primaryOperation().catch(error => {
    logError(error, `FALLBACK_${context}`)
    return fallbackValue
  })
} 
// Production-safe logging utility
type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
  context?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && level === 'debug') {
      return false
    }
    
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug']
    return levels.indexOf(level) <= levels.indexOf(this.logLevel)
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, context, timestamp } = entry
    const contextStr = context ? `[${context}]` : ''
    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`
  }

  private log(level: LogLevel, message: string, data?: any, context?: string) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context
    }

    const formattedMessage = this.formatMessage(entry)

    switch (level) {
      case 'error':
        console.error(formattedMessage, data || '')
        break
      case 'warn':
        console.warn(formattedMessage, data || '')
        break
      case 'info':
        console.info(formattedMessage, data || '')
        break
      case 'debug':
        console.debug(formattedMessage, data || '')
        break
    }
  }

  error(message: string, data?: any, context?: string) {
    this.log('error', message, data, context)
  }

  warn(message: string, data?: any, context?: string) {
    this.log('warn', message, data, context)
  }

  info(message: string, data?: any, context?: string) {
    this.log('info', message, data, context)
  }

  debug(message: string, data?: any, context?: string) {
    this.log('debug', message, data, context)
  }
}

// Export singleton instance
export const logger = new Logger()

// Convenience functions for common use cases
export const logError = (message: string, error?: any, context?: string) => {
  logger.error(message, error, context)
}

export const logInfo = (message: string, data?: any, context?: string) => {
  logger.info(message, data, context)
}

export const logWarn = (message: string, data?: any, context?: string) => {
  logger.warn(message, data, context)
}

export const logDebug = (message: string, data?: any, context?: string) => {
  logger.debug(message, data, context)
}

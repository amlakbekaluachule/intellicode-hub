import Redis from 'ioredis'
import { logger } from '../utils/logger'

let redis: Redis

export const connectRedis = async (): Promise<void> => {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    redis.on('connect', () => {
      logger.info('✅ Redis connected successfully')
    })

    redis.on('error', (error) => {
      logger.error('❌ Redis connection error:', error)
    })

    await redis.connect()
  } catch (error) {
    logger.error('❌ Redis connection failed:', error)
    throw error
  }
}

export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redis) {
      await redis.disconnect()
      logger.info('✅ Redis disconnected successfully')
    }
  } catch (error) {
    logger.error('❌ Redis disconnection failed:', error)
    throw error
  }
}

export { redis }

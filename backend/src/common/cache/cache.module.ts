import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          // Try to connect to Redis
          const redisConfig = configService.get('redis');
          console.log('Attempting to connect to Redis...');
          
          return {
            store: await redisStore({
              host: redisConfig.host,
              port: redisConfig.port,
              password: redisConfig.password,
              db: redisConfig.db,
              ttl: configService.get('cache.ttl') * 1000, // Convert to milliseconds
            }),
            ttl: configService.get('cache.ttl') * 1000,
            max: configService.get('cache.max'),
          };
        } catch (error) {
          // Fallback to in-memory cache if Redis is not available
          console.warn('Redis not available, falling back to in-memory cache:', error.message);
          return {
            ttl: configService.get('cache.ttl') * 1000,
            max: configService.get('cache.max'),
          };
        }
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}

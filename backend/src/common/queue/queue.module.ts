import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          redis: {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            // Graceful fallback - if Redis is not available, jobs won't be queued
            // but the application will still work
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            enableOfflineQueue: false,
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = parseInt(
      this.configService.get<string>('REDIS_PORT', '6379'),
      10,
    );
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const db = parseInt(this.configService.get<string>('REDIS_DB', '0'), 10);

    this.redisClient = new Redis({
      host,
      port,
      password: password || undefined,
      db,
    });

    this.redisClient.on('connect', () => {
      this.logger.log('⚡ Redis Cache Connected Successfully');
    });

    this.redisClient.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }

  getClient(): Redis {
    return this.redisClient;
  }
}

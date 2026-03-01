import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { RedisModule } from './core/database/redis/redis.module';
import { Neo4jModule } from './core/database/neo4j/neo4j.module';
import { AppElasticsearchModule } from './core/database/elasticsearch/elasticsearch.module';
import { AppLoggerModule } from './core/logger/logger.module';
import { EmailModule } from './core/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    Neo4jModule,
    AppElasticsearchModule,
    AppLoggerModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

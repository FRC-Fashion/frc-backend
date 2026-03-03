import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppElasticsearchService } from './elasticsearch.service';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const node = configService.get<string>(
          'ELASTICSEARCH_NODE',
          'http://localhost:9200',
        );
        const username = configService.get<string>('ELASTICSEARCH_USER');
        const password = configService.get<string>('ELASTICSEARCH_PASSWORD');
        const apiKey = configService.get<string>('ELASTICSEARCH_API_KEY');
        const isServerless =
          configService.get<string>('ELASTICSEARCH_SERVERLESS') === 'true';

        let auth: any = undefined;
        if (apiKey) {
          auth = { apiKey };
        } else if (username && password) {
          auth = { username, password };
        }

        return {
          node,
          auth,
          ...(isServerless && { serverMode: 'serverless' }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AppElasticsearchService],
  exports: [AppElasticsearchService, ElasticsearchModule],
})
export class AppElasticsearchModule {}

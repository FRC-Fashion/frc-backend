import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class AppElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(AppElasticsearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    try {
      const isConnected = await this.elasticsearchService.ping();
      if (isConnected) {
        this.logger.log(
          '🔍 Elasticsearch Search Engine Connected Successfully',
        );
      } else {
        this.logger.warn('Elasticsearch ping failed: Not connected.');
      }
    } catch (error) {
      this.logger.error(
        'Elasticsearch connection error:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  /**
   * Returns the connected Elasticsearch Client for standard proxy requests
   */
  getClient(): ElasticsearchService {
    return this.elasticsearchService;
  }
}

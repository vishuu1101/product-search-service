import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class ProductService {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async listIndices(): Promise<any> {
    return await this.elasticSearchService.listIndices();
  }

  async deleteIndex(indexName: string) {
    return await this.elasticSearchService.deleteIndex(indexName);
  }

  async createIndex(indexName: string) {
    const indexSettings = {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
      },
      mappings: {
        properties: {
          title: {
            type: 'text',
          },
          content: {
            type: 'text',
          },
          embedding: {
            type: 'dense_vector',
            dims: 384, // all-MiniLM-L6-v2
          },
        },
      },
    };
    return await this.elasticSearchService.createIndex(
      indexName,
      indexSettings,
    );
  }
}

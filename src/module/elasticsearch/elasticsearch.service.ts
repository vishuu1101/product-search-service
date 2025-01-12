import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(
    @Inject('ELASTICSEARCH_CLIENT') private readonly esClient: Client,
  ) {}

  async listIndices() {
    const response = await this.esClient.cat.indices({
      format: 'json',
    });
    return response;
  }

  async deleteIndex(indexName: string) {
    const response = await this.esClient.indices.delete({
      index: indexName,
    });
    return response;
  }

  async createIndex(indexName: string, settings: any) {
    await this.esClient.indices.create({
      index: indexName,
      body: {
        settings,
      },
    });
  }

  async addDocument(indexName: string, document: any) {
    const customHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await this.esClient.transport.request(
      {
        method: 'POST',
        path: `/${indexName}/_doc/`,
        body: document,
      },
      { headers: customHeaders },
    );

    return response;
  }

  async search(index: string, query_vector: number[]) {
    const response = await this.esClient.search({
      index: index,
      body: {
        query: {
          knn: {
            field: 'embedding',
            query_vector: query_vector,
            k: 5,
          },
        },
      },
    });
    return response.hits.hits;
  }
}

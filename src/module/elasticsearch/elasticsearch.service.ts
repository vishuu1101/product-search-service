import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ElasticsearchService as ESService } from '@nestjs/elasticsearch';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ElasticsearchService {
  private readonly ELASTIC_SARCH_HOST: string = this.configService.get(
    'ELASTIC_SEARCH_HOST',
  );
  constructor(
    private readonly esService: ESService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async listIndices() {
    const response = await this.esService.cat.indices({
      format: 'json', // Ensures the response is in JSON format
    });
    return response;
  }

  async deleteIndex(indexName: string) {
    const response = await this.esService.indices.delete({
      index: indexName,
    });
    return response;
  }

  async createIndex(indexName: string, settings: any) {
    console.log(`Connecting to Elasticsearch at: ${this.ELASTIC_SARCH_HOST}`);
    await this.esService.indices.create({
      index: indexName,
      body: {
        settings,
      },
    });
  }

  async addDocument(indexName: string, document: any) {
    const url = `${this.ELASTIC_SARCH_HOST}/${indexName}/_doc`;
    const response = await firstValueFrom(
      this.httpService.post(url, document, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    console.log('Document indexed successfully:', response.data._index);
    return response.data._index;
  }

  async search(index: string, query_vector: number[]) {
    const result = await this.esService.search({
      index,
      body: {
        size: 5,
        query: {
          script_score: {
            query: { match_all: {} },
            script: {
              source:
                "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
              params: { query_vector },
            },
          },
        },
      },
    });
    return result.hits.hits;
  }
}

import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private readonly GET_VECTOR_URL: string =
    this.configService.get('GET_VECTOR_URL');

  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async listIndices(): Promise<any> {
    return await this.elasticSearchService.listIndices();
  }

  async deleteIndex(indexName: string) {
    return await this.elasticSearchService.deleteIndex(indexName);
  }

  async createIndex(indexName: string) {
    const indexSettings = {
      number_of_shards: 3,
      number_of_replicas: 2,
      analysis: {
        analyzer: {
          default: {
            type: 'standard',
            stopwords: '_english_',
          },
        },
      },
    };
    return await this.elasticSearchService.createIndex(
      indexName,
      indexSettings,
    );
  }

  async addProduct(indexName: string, document: string) {
    try {
      const result = await this.elasticSearchService.addDocument(
        indexName,
        document,
      );
      console.log(result);
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  }

  async search(indexName: string, searchtext: string) {
    const response = await this.getProductVector(searchtext);
    return await this.elasticSearchService.search(
      indexName,
      response.embedding,
    );
  }

  async getProductVector(searchtext: string): Promise<any> {
    const headers = {
      accept: 'application/json',
    };
    const data = {
      search_text: searchtext,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(this.GET_VECTOR_URL, data, { headers }),
      );
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error in HTTP request', error);
      throw new Error('Error in calling product API');
    }
  }
}

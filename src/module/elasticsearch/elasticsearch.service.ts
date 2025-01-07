import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ElasticsearchService {
  private readonly ELASTIC_SARCH_HOST: string = this.configService.get(
    'ELASTIC_SEARCH_HOST',
  );
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async listIndices(): Promise<any> {
    const url = `${this.ELASTIC_SARCH_HOST}/_cat/indices?v&format=json`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async createIndex(indexName: string, indexSettings: object) {
    const url = `${this.ELASTIC_SARCH_HOST}/${indexName}`;

    try {
      const isIndexExist = await this.isIndexExist(indexName);
      if (isIndexExist) {
        return { message: 'Index already exists', status: 'exists' };
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 404) {
          // Index does not exist, create it
          const createResponse = await firstValueFrom(
            this.httpService.put(url, indexSettings),
          );
          return createResponse.data;
        }
      } else {
        console.error('unexpected error:', error.message);
        throw error;
      }
    }
  }

  async deleteIndex(indexName: string) {
    const url = `${this.ELASTIC_SARCH_HOST}/${indexName}`;
    try {
      const isIndexExist = await this.isIndexExist(indexName);
      if (isIndexExist) {
        const response = await firstValueFrom(this.httpService.delete(url));
        if (response.status === 200) {
          return { message: 'Index deleted successfully', status: 'Success' };
        }
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 404) {
          return { message: 'Index not available', status: 'not-exist' };
        }
      } else {
        console.error('unexpected error:', error.message);
        throw error;
      }
    }
  }

  async isIndexExist(indexName: string) {
    const url = `${this.ELASTIC_SARCH_HOST}/${indexName}`;
    try {
      const existsResponse = await firstValueFrom(this.httpService.head(url));
      return existsResponse.status === 200;
    } catch (error) {
      console.error('unexpected error:', error.message);
      throw error;
    }
  }
}

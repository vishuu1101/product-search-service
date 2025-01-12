import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  providers: [
    {
      provide: 'ELASTICSEARCH_CLIENT',
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        const isLocal = nodeEnv === 'local';

        if (isLocal) {
          // Local Elasticsearch Configuration
          const localUrl = configService.get<string>('ELASTIC_SEARCH_HOST');
          return new Client({ node: localUrl });
        } else {
          // Elastic Cloud Configuration
          const cloudId = configService.get<string>('CLOUD_ELASTIC_ID');
          const apiKey = configService.get<string>('CLOUD_ELASTIC_API_KEY');
          return new Client({
            cloud: {
              id: cloudId, // Cloud ID from Elastic Cloud console
            },
            auth: {
              apiKey,
            },
          });
        }
      },
      inject: [ConfigService],
    },
    ElasticsearchService,
  ],
  exports: ['ELASTICSEARCH_CLIENT', ElasticsearchService],
})
export class ElasticsearchClientModule {}

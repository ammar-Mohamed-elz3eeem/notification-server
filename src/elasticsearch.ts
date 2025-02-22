import { winstonLogger } from "@ammar-Mohamed-elz3eeem/protal-lab";
import { Client } from "@elastic/elasticsearch";
import { config } from "@notifications/config";

const log = winstonLogger(
  config.ELASTIC_SEARCH_URL || "",
  'notification-elastic-search',
  'debug'
);

const elasticSearchClient = new Client({
  node: config.ELASTIC_SEARCH_URL
});

export const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health = await elasticSearchClient.cluster.health({});
      log.info(`health status -- ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to elastic search failed. Retrying...');
      log.log('error', '[NotificationService::ElasticSearch] checkConnection():', error);
    }
  }
};

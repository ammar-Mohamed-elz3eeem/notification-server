import 'express-async-errors';
import http from 'http';
import { Application } from 'express';
import { winstonLogger } from '@ammar-Mohamed-elz3eeem/protal-lab';

import { config } from '@notifications/config';
import { healthRoute } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { consumeAuthEmailMessage, consumeOrderEmailMessage } from '@notifications/queues/email-consumer';

const SERVER_PORT = 4001;
const log = winstonLogger(
  config.ELASTIC_SEARCH_URL || "",
  'notification-server',
  'debug'
);

export const startQueues = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    try {
      const emailChannel = await createConnection();
      await consumeAuthEmailMessage(emailChannel);
      await consumeOrderEmailMessage(emailChannel);
      isConnected = true;
    } catch (error) {
      continue;
    }
  }
};

export const startElasticSearch = async (): Promise<void> => {
  checkConnection();
};

export const startServer = (app: Application): void => {
  try {
    const httpServer = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    })
  } catch (error: any) {
    log.log('error', '[NotificationService::Server] startServer():', error);
  }
};

export const start = (app: Application): void => {
  startServer(app);
  app.use('', healthRoute());
  startQueues();
  startElasticSearch();
};

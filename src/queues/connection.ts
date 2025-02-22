import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@ammar-Mohamed-elz3eeem/protal-lab';

import { config } from '@notifications/config';

const log = winstonLogger(
  config.ELASTIC_SEARCH_URL || "",
  'notification-queue-connection',
  'debug'
);

const closeConnection = (connection: Connection, channel: Channel): void => {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
};

export const createConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection = await client.connect(config.RABBITMQ_ENDPOINT || '');
    const channel = await connection.createChannel();
    log.info('Notification Queue connected sucessfully...');
    closeConnection(connection, channel);
    return channel;
  } catch (error) {
    log.log('error', '[NotificationQueue] createConnection():', error);
    return undefined;
  }
};

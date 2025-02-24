// import amqplib from 'amqplib';
import * as connection from '@notifications/queues/connection';
import { consumeAuthEmailMessage } from '@notifications/queues/email-consumer';


jest.mock('amqplib');
jest.mock('@notifications/queues/connection');
jest.mock('@ammar-Mohamed-elz3eeem/protal-lab');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessage()', () => {
    it('should create channel and call assertQueue, bindQueue, assertExchange functions from channel ', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'protal-auth-queue',
        messageCount: 0,
        consumerCount: 0,
      });

      jest.spyOn(connection, 'createConnection').mockReturnValue(Promise.resolve(channel as any));

      const connectionChannel = await connection.createConnection();
      await consumeAuthEmailMessage(connectionChannel);
      expect(connectionChannel!.assertExchange)
        .toHaveBeenCalledWith('protal-auth-notification', 'direct');
      expect(connectionChannel?.assertQueue)
        .toHaveBeenCalledTimes(1);
      expect(connectionChannel?.bindQueue)
        .toHaveBeenCalledWith('protal-auth-queue', 'protal-auth-notification', 'auth-email');
      // jest.spyOn(channel, 'bindQueue');
      // jest.spyOn(channel, 'consume');
      // jest.spyOn(channel, 'publish');
    });
  });
});

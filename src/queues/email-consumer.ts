import { TEmailLocals, winstonLogger } from "@ammar-Mohamed-elz3eeem/protal-lab";
import { config } from "@notifications/config";
import { Channel, ConsumeMessage } from "amqplib";
import { createConnection } from "./connection";
import { sendEmail } from "./mail.transport";

const log = winstonLogger(
  config.ELASTIC_SEARCH_URL || "",
  'email-consumer',
  'debug'
);

export const consumeAuthEmailMessage = async (channel: Channel | undefined): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'protal-auth-notification';
    const routingKey = 'auth-email';
    const queueName = 'protal-auth-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const protalQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(protalQueue.queue, exchangeName, routingKey);
    channel.consume(protalQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        verifyLink,
        resetLink,
        template
      } = JSON.parse(msg?.content.toString() || '{}');

      console.log(
        "JSON.parse(msg?.content.toString() || '{}')",
        JSON.parse(msg?.content.toString() || '{}')
      );

      const locals: TEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/1fk8CZ8k/logo-color.png',
        username,
        verifyLink,
        resetLink
      };

      // 1. Send emails
      await sendEmail(template, receiverEmail, locals);

      // 2. Acknowledge message
      channel?.ack(msg!);
    });

    // log.info('AuthEmailConsumer initialized successfully.');
  } catch (error) {
    log.log('error', '[NotificationService::AuthEmailConsumer] consumeAuthEmailMessage():', error);
  }
};

export const consumeOrderEmailMessage = async (channel: Channel | undefined): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'protal-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const protalQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(protalQueue.queue, exchangeName, routingKey);
    channel.consume(protalQueue.queue, async (msg: ConsumeMessage | null) => {
      // 1. Send emails
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      } = JSON.parse(msg?.content.toString() || '{}');

      const locals: TEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/1fk8CZ8k/logo-color.png',
        username,
        sender,
        subject,
        buyerUsername,
        title,
        sellerUsername,
        orderUrl,
        originalDate,
        newDate,
        reason,
        header,
        type,
        message,
        orderId,
        orderDue,
        description,
        amount,
        requirements,
        serviceFee,
        total,
        deliveryDays,
        offerLink
      };

      // 1. Send emails
      await sendEmail(template, receiverEmail, locals);
      if (template === 'orderPlace') {
        await sendEmail('orderReceipt', receiverEmail, locals);
      }

      // 2. Acknowledge message
      channel?.ack(msg!);
    });
    log.info('OrderEmailConsumer initialized successfully.');
  } catch (error) {
    log.log('error', '[NotificationService::OrderEmailConsumer] consumeOrderEmailMessage():', error);
  }
};

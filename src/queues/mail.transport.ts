import { TEmailLocals, winstonLogger } from "@ammar-Mohamed-elz3eeem/protal-lab";
import { config } from "@notifications/config";
import { emailTemplates } from "@notifications/helpers";

const log = winstonLogger(
  config.ELASTIC_SEARCH_URL || "",
  'email-transport',
  'debug'
);

export const sendEmail = async (
  template: string,
  receiverEmail: string,
  locals: TEmailLocals
): Promise<void> => {
  try {
    await emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', '[NotificationService::EmailTransport] sendEmail():', error);
  }
}

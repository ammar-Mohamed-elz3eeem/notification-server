import { TEmailLocals, winstonLogger } from "@ammar-Mohamed-elz3eeem/protal-lab";
import { config } from "@notifications/config";
import nodemailer from 'nodemailer';
import Email from "email-templates";
import path from 'path';

const log = winstonLogger(
  config.ELASTIC_SEARCH_URL || "",
  'email-transport-helpers',
  'debug'
);

export const emailTemplates = async (
  template: string,
  receiver: string,
  locals: TEmailLocals
): Promise<void> => {
  try {
    const smptTansport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });
    const email: Email = new Email({
      message: {
        from: `Protal App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smptTansport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        webResources: {
          relativeTo: path.resolve(__dirname, "../build"),
        },
        preserveImportant: true,
      }
    });
    await email.send({
      template: path.join(__dirname, "..", "src/emails", template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    log.log(
      'error',
      '[NotificationService::EmailTransportHelpers] emailTemplates',
      error
    );
  }
}

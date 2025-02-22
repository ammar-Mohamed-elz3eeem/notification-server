import { winstonLogger } from "@ammar-Mohamed-elz3eeem/protal-lab";
import express from 'express';

import { config } from "@notifications/config";
import { start } from "@notifications/server";

const log = winstonLogger(
  config.ELASTIC_SEARCH_URL || "",
  'notification-app',
  'debug'
);

function initialize () {
  const app = express();
  start(app);
  log.info('Notification app started');
}

initialize();

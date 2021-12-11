import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_SUBDOMAIN = 'jupiterone-dev';
const ZENDESK_ACCESS_TOKEN = 'dummy-zendesk-access-token';

export const integrationConfig: IntegrationConfig = {
  zendeskSubdomain: process.env.ZENDESK_SUBDOMAIN || DEFAULT_SUBDOMAIN,
  zendeskAccessToken: process.env.ZENDESK_ACCESS_TOKEN || ZENDESK_ACCESS_TOKEN,
};

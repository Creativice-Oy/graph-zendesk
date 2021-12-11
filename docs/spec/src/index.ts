import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { groupSpec } from './groups';
import { organizationSpec } from './organizations';
import { ticketSpec } from './tickets';
import { userSpec } from './users';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...userSpec,
    ...organizationSpec,
    ...groupSpec,
    ...ticketSpec,
    ...accountSpec,
  ],
};

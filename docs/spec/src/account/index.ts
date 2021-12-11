import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://subdomain.zendesk.com/api/v2/users/me.json
     * PATTERN: Fetch Entity
     */
    id: 'fetch-account',
    name: 'Fetch Account',
    entities: [
      {
        resourceName: 'Account',
        _type: 'zendesk_account',
        _class: ['User'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];

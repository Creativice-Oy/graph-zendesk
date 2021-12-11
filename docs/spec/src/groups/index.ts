import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const groupSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://subdomain.zendesk.com/api/v2/groups.json
     * PATTERN: Fetch Entities
     */
    id: 'fetch-groups',
    name: 'Fetch Groups',
    entities: [
      {
        resourceName: 'Group',
        _type: 'zendesk_group',
        _class: ['Group'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];

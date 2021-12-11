import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';
import {
  IntegrationSteps,
  Relationships,
} from '../../../../src/steps/constants';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://subdomain.zendesk.com/api/v2/users.json
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'zendesk_user',
        _class: ['User'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    /**
     * PATTERN: Build Relationships
     */
    id: 'build-user-group-relationships',
    name: 'Build User Group Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [IntegrationSteps.GROUPS, IntegrationSteps.USERS],
    implemented: true,
  },
];

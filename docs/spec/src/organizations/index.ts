import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';
import {
  Relationships,
  IntegrationSteps,
} from '../../../../src/steps/constants';

export const organizationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://subdomain.zendesk.com/api/v2/organizations.json
     * PATTERN: Fetch Entities
     */
    id: 'fetch-organizations',
    name: 'Fetch Organizations',
    entities: [
      {
        resourceName: 'Organization',
        _type: 'zendesk_organization',
        _class: ['Organization'],
      },
    ],
    relationships: [Relationships.ACCOUNT_HAS_ORGANIZATION],
    dependsOn: [IntegrationSteps.ACCOUNT],
    implemented: true,
  },
  {
    id: 'build-organization-group-relationships',
    name: 'Build Organization Group Relationships',
    entities: [],
    relationships: [Relationships.ORGANIZATION_HAS_GROUP],
    dependsOn: [IntegrationSteps.ORGANIZATIONS, IntegrationSteps.GROUPS],
    implemented: true,
  },
];

import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';
import {
  Relationships,
  IntegrationSteps,
} from '../../../../src/steps/constants';

export const ticketSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://subdomain.zendesk.com/api/v2/tickets.json
     * PATTERN: Fetch Entities
     */
    id: 'fetch-tickets',
    name: 'Fetch Tickets',
    entities: [
      {
        resourceName: 'Ticket',
        _type: 'zendesk_ticket',
        _class: ['Record'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    id: 'build-ticket-requester-relationships',
    name: 'Build Ticket Requester Relationships',
    entities: [],
    relationships: [Relationships.USER_OPENED_TICKET],
    dependsOn: [IntegrationSteps.TICKETS, IntegrationSteps.USERS],
    implemented: true,
  },
  {
    id: 'build-ticket-assignee-relationships',
    name: 'Build Ticket Assignee Relationships',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_TICKET],
    dependsOn: [IntegrationSteps.TICKETS, IntegrationSteps.USERS],
    implemented: true,
  },
  {
    id: 'build-ticket-group-relationships',
    name: 'Build Ticket Group Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_TICKET],
    dependsOn: [IntegrationSteps.TICKETS, IntegrationSteps.GROUPS],
    implemented: true,
  },
];

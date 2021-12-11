import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { createTicketEntity } from './converters';
import { Entities, Relationships, IntegrationSteps } from '../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import { getUserKey } from '../users/converters';
import { getGroupKey } from '../groups/converters';

// Oauth scope: 'read'
export async function fetchTickets({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateTickets(async (ticket) => {
    const ticketEntity = createTicketEntity(ticket);
    await jobState.addEntity(ticketEntity);
  });
}

export async function buildTicketRequesterRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    {
      _type: Entities.TICKET._type,
    },
    async (ticketEntity) => {
      const requesterId = (ticketEntity as any).requesterId.toString();

      const requesterEntity = await jobState.findEntity(
        getUserKey(requesterId),
      );

      if (requesterEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: requesterEntity,
            to: ticketEntity,
            _class: RelationshipClass.OPENED,
          }),
        );
      }
    },
  );
}

export async function buildTicketAssigneeRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    {
      _type: Entities.TICKET._type,
    },
    async (ticketEntity) => {
      const assigneeId = (ticketEntity as any).assigneeId?.toString();

      const assigneeEntity = await jobState.findEntity(getUserKey(assigneeId));

      if (assigneeEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: assigneeEntity,
            to: ticketEntity,
            _class: RelationshipClass.ASSIGNED,
          }),
        );
      }
    },
  );
}

export async function buildTicketGroupRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    {
      _type: Entities.TICKET._type,
    },
    async (ticketEntity) => {
      const groupId = (ticketEntity as any).groupId?.toString();
      const groupEntity = await jobState.findEntity(getGroupKey(groupId));

      if (groupEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: groupEntity,
            to: ticketEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      }
    },
  );
}

export const ticketSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.TICKETS,
    name: 'Fetch Tickets',
    entities: [Entities.TICKET],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchTickets,
  },
  {
    id: IntegrationSteps.BUILD_TICKET_REQUESTER_RELATIONSHIPS,
    name: 'Build Ticket Requester Relationships',
    entities: [],
    relationships: [Relationships.USER_OPENED_TICKET],
    dependsOn: [IntegrationSteps.TICKETS, IntegrationSteps.USERS],
    executionHandler: buildTicketRequesterRelationships,
  },
  {
    id: IntegrationSteps.BUILD_TICKET_ASSIGNEE_RELATIONSHIPS,
    name: 'Build Ticket Assignee Relationships',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_TICKET],
    dependsOn: [IntegrationSteps.TICKETS, IntegrationSteps.USERS],
    executionHandler: buildTicketAssigneeRelationships,
  },
  {
    id: IntegrationSteps.BUILD_TICKET_GROUP_RELATIONSHIPS,
    name: 'Build Ticket Group Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_TICKET],
    dependsOn: [IntegrationSteps.TICKETS, IntegrationSteps.GROUPS],
    executionHandler: buildTicketGroupRelationships,
  },
];

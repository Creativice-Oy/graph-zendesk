import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Ticket } from '../../types';
import { Entities } from '../constants';

function getTicketKey(id: string): string {
  return `zendesk_ticket:${id}`;
}

export function mapTypeToClass(
  ticketType?: string,
): 'Task' | 'Question' | undefined {
  if (!ticketType || ['incident', 'problem'].includes(ticketType)) {
    return undefined;
  }

  // A simple uppercased chart at position 0 would have worked
  // This just makes it easier to modify (if necessary) in the future
  switch (ticketType) {
    case 'question':
      return 'Question';
    case 'task':
      return 'Task';
  }
}

export function createTicketEntity(ticket: Ticket): Entity {
  const classes = [Entities.TICKET._class[0]];

  const additionalClass = mapTypeToClass(ticket.type);
  if (additionalClass) {
    classes.push(additionalClass);
  }

  return createIntegrationEntity({
    entityData: {
      source: ticket,
      assign: {
        _type: Entities.TICKET._type,
        _class: classes,
        _key: getTicketKey(ticket.id?.toString() as string),
        assigneeEmail: ticket.assignee_email,
        assigneeId: ticket.assignee_id,
        brandId: ticket.brand_id,
        collaboratorIds: ticket.collaborator_ids,
        createdAt: ticket.created_at,
        description: ticket.description,
        dueAt: ticket.due_at || undefined,
        emailCcIds: ticket.email_cc_ids,
        followerIds: ticket.follower_ids,
        forumTopicId: ticket.forum_topic_id || undefined,
        groupId: ticket.group_id,
        hasIncidents: ticket.has_incidents,
        id: ticket.id?.toString(),
        name: ticket.subject,
        organizationId: ticket.organization_id || undefined,
        priority: ticket.priority,
        problemId: ticket.problem_id || undefined,
        recipient: ticket.recipient || undefined,
        requestedId: ticket.requested_id,
        status: ticket.status,
        submitterId: ticket.submitter_id,
        requesterId: ticket.requester_id,
        type: ticket.type,
        url: ticket.url,
        queries: [ticket.description as string],
      },
    },
  });
}

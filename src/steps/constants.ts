import {
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { RelationshipClass } from '@jupiterone/data-model';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export const IntegrationSteps = {
  USERS: 'fetch-users',
  BUILD_USER_GROUP_RELATIONSHIPS: 'build-user-group-relationships',
  GROUPS: 'fetch-groups',
  ORGANIZATIONS: 'fetch-organizations',
  BUILD_ORGANIZATION_GROUP_RELATIONSHIPS:
    'build-organization-group-relationships',
  TICKETS: 'fetch-tickets',
  BUILD_TICKET_REQUESTER_RELATIONSHIPS: 'build-ticket-requester-relationships',
  BUILD_TICKET_ASSIGNEE_RELATIONSHIPS: 'build-ticket-assignee-relationships',
  BUILD_TICKET_GROUP_RELATIONSHIPS: 'build-ticket-group-relationships',
  ACCOUNT: 'fetch-account',
};

export const Entities: Record<
  'USER' | 'GROUP' | 'ORGANIZATION' | 'TICKET' | 'ACCOUNT',
  StepEntityMetadata
> = {
  USER: {
    resourceName: 'User',
    _type: 'zendesk_user',
    _class: ['User'],
  },
  GROUP: {
    resourceName: 'Group',
    _type: 'zendesk_group',
    _class: ['Group'],
  },
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'zendesk_organization',
    _class: ['Organization'],
  },
  TICKET: {
    resourceName: 'Ticket',
    _type: 'zendesk_ticket',
    _class: ['Record'],
  },
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'zendesk_account',
    _class: ['User'],
  },
};

export const Relationships: Record<
  | 'ORGANIZATION_HAS_GROUP'
  | 'GROUP_HAS_TICKET'
  | 'GROUP_HAS_USER'
  | 'ACCOUNT_HAS_GROUP'
  | 'ACCOUNT_HAS_ORGANIZATION'
  | 'USER_OPENED_TICKET'
  | 'USER_ASSIGNED_TICKET',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_GROUP: {
    _type: 'zendesk_organization_has_group',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ORGANIZATION._type,
    targetType: Entities.GROUP._type,
  },
  GROUP_HAS_TICKET: {
    _type: 'zendesk_group_has_ticket',
    _class: RelationshipClass.HAS,
    sourceType: Entities.GROUP._type,
    targetType: Entities.TICKET._type,
  },
  GROUP_HAS_USER: {
    _type: 'zendesk_group_has_user',
    _class: RelationshipClass.HAS,
    sourceType: Entities.GROUP._type,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'zendesk_account_has_group',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.GROUP._type,
  },
  ACCOUNT_HAS_ORGANIZATION: {
    _type: 'zendesk_account_has_organization',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.ORGANIZATION._type,
  },
  USER_OPENED_TICKET: {
    _type: 'zendesk_user_opened_ticket',
    _class: RelationshipClass.OPENED,
    sourceType: Entities.USER._type,
    targetType: Entities.TICKET._type,
  },
  USER_ASSIGNED_TICKET: {
    _type: 'zendesk_user_assigned_ticket',
    _class: RelationshipClass.ASSIGNED,
    sourceType: Entities.USER._type,
    targetType: Entities.TICKET._type,
  },
};

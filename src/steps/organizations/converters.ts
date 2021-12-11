import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Organization } from '../../types';
import { Entities } from '../constants';

function getOrganizationKey(id: string): string {
  return `zendesk_organization:${id}`;
}

export function createOrganizationEntity(organization: Organization): Entity {
  return createIntegrationEntity({
    entityData: {
      source: organization,
      assign: {
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        _key: getOrganizationKey(organization.id?.toString() as string),
        createdAt: organization.created_at,
        details: organization.details || [],
        domainNames: organization.domain_names || [],
        groupId: organization.group_id?.toString(),
        id: organization.id?.toString(),
        name: organization.name,
        notes: organization.notes || [],
        sharedComments: organization.shared_comments,
        sharedTickets: organization.shared_tickets,
        updatedAt: organization.updated_at,
        url: organization.url,
      },
    },
  });
}
